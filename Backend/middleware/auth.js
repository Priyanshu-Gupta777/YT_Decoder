const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authenticateToken = (req, res, next) => {

    const token  = req.headers['authorization']?.replace('Bearer ', '');

    if(!token) return res.status(401).json({ message : "No toekn found!!"});

    try{
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch(err){
        return res.status(401).json({message: "OOPs!! Something went wrong (T_T) OR Invalid or expired token "})

    }
}

module.exports = {authenticateToken};