const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); 
const User = require('./routes/user');
const bodyParser = require('body-parser');
const commentRoutes = require('./routes/comment');

const connectDB = require('./config/db')

dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));

app.get('/', (req, res) => {
    res.send("Hello world");
})

app.use('/user', User);
//app.use('/comment', commentRoutes); 


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
