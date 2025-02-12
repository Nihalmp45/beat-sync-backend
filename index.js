import express from 'express'
import 'dotenv/config'
import logger from "./logger.js";
import morgan from "morgan";
import connectToDB from './src/config/db.js';
import cors from 'cors';
// import weatherRoutes from './src/views/weatherRoute.js'
import videoRoutes from './src/views/videoRoute.js';
import path from "path";
import { fileURLToPath } from "url";

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
connectToDB();

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

// Enable CORS
app.use(cors());

app.use('/videos', express.static('videos'));

// Serve static files from the "uploads" directory
app.use('/uploads', express.static('uploads'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, "src/controller/processed_videos");

app.use("/processed_videos", express.static(OUTPUT_DIR));




// app.use('/api',weatherRoutes)
app.use('/api/video', videoRoutes);




app.listen(port,() => {
    console.log(`Server is running on port ${port}`)
})