const axios = require("axios");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function extractVideoId(url) {
  if (!url || typeof url !== "string") return null;
  const regex = /(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

async function fetchComments(videoId, maxCount = 150) {
  let allComments = [];
  let pageToken = null;

  while (allComments.length < maxCount) {
    const res = await axios.get(
      "https://www.googleapis.com/youtube/v3/commentThreads",
      {
        params: {
          part: "snippet",
          videoId,
          key: YOUTUBE_API_KEY,
          maxResults: 100,
          pageToken,
        },
      }
    );

    const items = res.data.items || [];
    const currentBatch = items.map(
      (item) => item.snippet.topLevelComment.snippet
    );
    allComments = [...allComments, ...currentBatch];

    if (!res.data.nextPageToken || allComments.length >= maxCount) break;
    pageToken = res.data.nextPageToken;
  }

  return allComments.slice(0, maxCount);
}

const analyzeWithGemini = async (req, res) => {
  const { videoUrl } = req.body;
  const videoId = extractVideoId(videoUrl);
  if (!videoId) return res.status(400).json({ message: "Invalid YouTube URL" });

  try {
    const videoRes = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "snippet,statistics",
          id: videoId,
          key: YOUTUBE_API_KEY,
        },
      }
    );
    //console.log(videoRes.data.items[0].statistics.commentCount);
    if (!videoRes.data.items.length) {
      return res.status(404).json({ message: "Video not found" });
    }

    const video = videoRes.data.items[0];
    const stats = video.statistics;
    const snippet = video.snippet;

    const cmt = videoRes.data.items[0].statistics.commentCount;

    const rawComments = await fetchComments(videoId, Math.min(cmt, 1000));
    const comments = rawComments.map((c) => c.textDisplay);
    const authors = rawComments.map((c) => c.authorDisplayName);
    const analyzedCount = comments.length;


    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


    const prompt = `
You are an expert YouTube content analyst AI. Analyze the following video using metadata and top viewer comments. Your analysis will power a frontend dashboard, so keep output clean and structured for direct display.

Video Details:
- Video URL: https://www.youtube.com/watch?v=${videoId}
- Video ID: ${videoId}
- Title: ${snippet.title}
- Description: ${snippet.description}
- Published At: ${snippet.publishedAt}
- Channel Name: ${snippet.channelTitle}

Engagement Stats:
- Views: ${stats.viewCount}
- Likes: ${stats.likeCount}
- Total Comments: ${stats.commentCount}
- Like-to-View Ratio: ${(
      (Number(stats.likeCount) / Number(stats.viewCount)) *
      100
    ).toFixed(2)}%
- Comment-to-View Ratio: ${(
      (Number(stats.commentCount) / Number(stats.viewCount)) *
      100
    ).toFixed(2)}%

Top Viewer Comments (exactly ${analyzedCount} comments listed below; base ALL comment-related analysis only on these ${analyzedCount} comments):
${comments.map((c, i) => `${i + 1}. ${c} (by ${authors[i]})`).join("\n")}

Return a JSON response with these keys, structured exactly as shown:

{
  "videoId": "string",
  "videoUrl": "string",
  "title": "string",
  "channelName": "string",
  "publishedAt": "string",
  "views": number,
  "likes": number,
  "totalComments": number,
  "likeToViewRatio": "string (in %)",
  "commentToViewRatio": "string (in %)",

  "sentimentBreakdown": {
    "positive": number,
    "neutral": number,
    "negative": number
  },

  "topPositiveComments": [
    { "user": "string", "comment": "string" }
  ],

  "topNegativeComments": [
    { "user": "string", "comment": "string" }
  ],

  "keyThemes": [
    "string"
  ],

  "suggestionsAndPraise": [
    "string"
  ],

  "userQuestions": [
    "string"
  ],

  "videoSuggestionsByViewers": [
    "string"
  ],

  "aiRecommendation": [
    "string"
  ],

  "summary": "string"
}`;

    const result = await model.generateContent(prompt);
    const aiText = await result.response.text();

    let cleanText = aiText.trim();
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText
        .replace(/^```json\s*/, "")
        .replace(/```$/, "")
        .trim();
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText
        .replace(/^```\s*/, "")
        .replace(/```$/, "")
        .trim();
    }
    let aiData;
    try {
      aiData = JSON.parse(cleanText);
    } catch (parseErr) {
      console.error("❌ Failed to parse AI JSON:", parseErr.message);
      return res
        .status(500)
        .json({ message: "AI response is not valid JSON", raw: aiText });
    }

    const finalResponse = {
      videoUrl: aiData.videoUrl,
      videoId: aiData.videoId,
      channelName: aiData.channelName,
      title: aiData.title,
      publishedAt: aiData.publishedAt,
      views: aiData.views,
      likes: aiData.likes,
      totalComments: aiData.totalComments,
      likeToViewRatio: aiData.likeToViewRatio,
      commentToViewRatio: aiData.commentToViewRatio,

      sentimentBreakdown: aiData.sentimentBreakdown,
      topPositiveComments: aiData.topPositiveComments,
      topNegativeComments: aiData.topNegativeComments,
      keyThemes: aiData.keyThemes,
      suggestionsAndPraise: aiData.suggestionsAndPraise,
      userQuestions: aiData.userQuestions,
      videoSuggestionsByViewers: aiData.videoSuggestionsByViewers,
      aiRecommendation: aiData.aiRecommendation,
      summary: aiData.summary,
      analyzedCommentsCount: comments.length,
    };

    if (comments.length < 1000) {
      finalResponse.commentsAnalyzed = rawComments; // send full raw comment data
    }

    res.json(finalResponse);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Analysis failed", error: err.message });
  }
};

module.exports = {
  analyzeWithGemini,
};
