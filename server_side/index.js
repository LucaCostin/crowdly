import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import userRouter from './routes/user.js';
import postRouter from './routes/post.js';
import dotenv from 'dotenv';

const application = express();
dotenv.config();

// use morgan logger as middleware for the application
application.use(morgan('dev'));
// parser for post/put requests
application.use(express.json({ limit: '30mb', extended: true }));
// parser for html requests
application.use(express.urlencoded({ limit: '30mb', extended: true }));
application.use(cors());

application.use('/users', userRouter);
application.use('/posts', postRouter);
application.get('/', (req, res) => {
    res.send('Welcome to Crowdly Api!')
});

const port = process.env.PORT || 3001;           

/* Connecting to the database and then starting the server. */
mongoose.connect(process.env.MONGODB_CONNECTION_STRING).then( () =>{
    console.log('Data Base connected!');
    return application.listen(port);
}).then( () => {
    console.log(`Server running at ${port}`);
}).catch( err => console.log(`${err}`))