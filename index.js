import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import AuthRoute from './routers/AuthRoute.js';
import UserRoute from './routers/UserRoute.js'
import PostRoute from './routers/PostRoute.js'
import morgan from 'morgan';



const app = express();


dotenv.config()
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(morgan('dev'));



//Route
app.use('/auth', AuthRoute);
app.use('/user', UserRoute);
app.use('/post', PostRoute);



const port = process.env.PORT;
mongoose.connect(process.env.Connection_DB)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    })
  })
  .catch((err) => {
    console.log(err);
  })

