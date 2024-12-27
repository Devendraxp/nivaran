import {app} from './app.js';
import connectDB from './db/index.js';
import dotenv from 'dotenv';

dotenv.config({
    path: '../.env'
});
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use((err, req, res, next)=>{
  let {status, message} = err;

res.status(status).json(message);
})


connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`⚙️  Server is running at port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });