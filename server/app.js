import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';
import './dbconnect.js'
import userRoutes from './controllers/users/index.js';
const app = express();
const port = 5003;

const MongoStore = connectMongo(session);

app.use(express.json());
app.use(cookieParser());



app.use(
    session({
      secret: 'codeforindiacupping',
      resave: false,
      saveUninitialized: true,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  );

app.get('/',(req,res)=>{
    res.send(`Express server is up and running`)
})

app.use('/api/user',userRoutes);

app.listen(port,()=>{
    console.info(`server is running on port :`, port)
})