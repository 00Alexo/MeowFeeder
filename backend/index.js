require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/userRoutes');
const deviceRoutes = require('./routes/deviceRoutes');

const allowedOrigin = [
    process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
    // ...(process.env.MOBILE_DEV_ORIGINS || '').split(',').filter(Boolean)
];

// const corsOptions = {
//     origin: function (origin, callback) {
//         if (!origin) return callback(null, true);
        
//         if (allowedOrigins.indexOf(origin) !== -1) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     methods: (process.env.CORS_METHODS || 'GET,POST,PUT,DELETE').split(','),
//     allowedHeaders: (process.env.CORS_HEADERS || 'Content-Type,Authorization,username').split(','),
//     credentials: true
// };

const corsOptions = {
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'username'],
   credentials: true
};
app.use(cors(corsOptions));
app.use(express.json({ limit: process.env.REQUEST_SIZE_LIMIT || '50mb' })); 
app.use(express.urlencoded({ limit: process.env.REQUEST_SIZE_LIMIT || '50mb', extended: true }));
app.use((req, res, next) =>{
    console.log(req.path, req.method)
    if (req.url === '/' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Wassup amigo');
    }
    next();
})
app.use('/api/user', userRoutes);
app.use('/api/device', deviceRoutes);

mongoose.connect(process.env.mongoDB)
.then(() => {
    console.log("MongoDB connected");
})
.catch((error) => {
    console.error("MongoDB connection failed:", error);
}); 

app.listen(process.env.PORT, () => {
    console.log('Server listening on port', process.env.PORT);
});