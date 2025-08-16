### YT_DECODER

---

### ABOUT THE PROJECT

YT_DECODER is an AI-powered YouTube comment analyzer that helps content creators and brands understand their audience. It uses advanced natural language models to summarize, extract topics, and analyze sentiment from YouTube video comments. The goal is to convert thousands of raw comments into visual insights and AI-powered recommendations.

---

### FEATURES

- AI-generated summary of YouTube comments
- Sentiment analysis: Positive / Neutral / Negative
- Key themes and repeated audience concerns
- Visual graphs for sentiment and keyword distribution
- Secure login/signup using JWT
- Fully responsive dashboard built in React

---

### TECH STACK

- **Frontend:** React.js, Tailwind CSS, Lucide-react
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Tokens)
- **AI Services:** Gemini API (Google Generative AI)
- **YouTube API:** YouTube Data API v3
- **Visualization:** Recharts
- **Deployment:** Vercel (frontend), Render (backend)

---

### INSTALLATION AND RUN

#### PREREQUISITES

- Node.js v18+
- Git
- MongoDB Atlas account
- Google Developer Account (for YouTube & Gemini API)
- Browser

---

#### STEP 1: CLONE THE REPO

```bash
git clone https://github.com/Priyanshu-Gupta777/YT_Decoder.git
cd YT-Decoder
```

### STEP 2: SETUP BACKEND

```bash
cd backend
npm install
```

Create a `.env` file in the /backend directory:

```bash
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
YOUTUBE_API_KEY=your_youtube_api_key
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend server:
```bash
npm run dev
```

### STEP 3: SETUP FRONTEND
```bash
cd ../frontend
npm install
npm run dev
```

### STEP 4: ACCESS THE APP

Visit `http://localhost:5173` in your browser.

Signup, paste a YouTube video link, and view the decoded results.

---

### PROJECT STRUCTURE
```bash
YT-Decoder/
├── frontend/    # React App
├── backend/     # Express API
├── README.md
```

### CONTACT
Email: priyanshugp777@gmail.com

GitHub: https://github.com/Priyanshu-Gupta777

Feel free to open an Issue or contribute to the project.
