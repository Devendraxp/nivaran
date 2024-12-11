import express from 'express';
import cookieParser from 'cookie-parser';

 const app = express();

app.use(express.json())
app.use(express.static("public"))
app.use(cookieParser())




// Routes import
import workerRoute from "./routes/worker.routes.js";

// Routes declaration
app.use("/api/v1/worker", workerRoute);

export {app}