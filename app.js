import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import MongoDB from './Model/MongoDB.js';
import userRouter from './routes/route.js'
const app = express();

app.use(cors())
app.use(express.json());

MongoDB()

app.use('/',userRouter);


app.listen(process.env.PORT,()=>{
    console.log('server is running on port 4000');
})

export default app