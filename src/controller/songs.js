import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const generateVideo = async (req, res) => {
  const { songName, theme } = req.body; // Receive songName and theme from frontend
  const uploadedFile = req.file; // The uploaded song file
  const outputDir = path.join(__dirname, '../../uploads');
  const outputVideo = path.join(outputDir, `output_${Date.now()}.mp4`);

  // Ensure the uploads directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  if (!songName && !uploadedFile) {
    return res.status(400).json({ error: 'Please enter a song name or upload a song file.' });
  }

  let fileURL = uploadedFile ? uploadedFile.path : null;
  
  if (songName) {
    // Fetch song from Jamendo API
    const clientId = "de0debdc";
    const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${clientId}&format=jsonpretty&name=${songName}&limit=1`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok || data.error || data.results.length === 0) {
        throw new Error(data.error || "Song not found.");
      }

      const songPreviewUrl = data.results[0].audio;
      fileURL = songPreviewUrl; // Assign the preview URL to fileURL for video creation
    } catch (error) {
      return res.status(400).json({ error: error.message || "Error fetching song." });
    }
  }

  if (!fileURL) {
    return res.status(400).json({ error: "No valid audio file found." });
  }

  try {
    // Use FFmpeg to create a waveform video synced to the music
    ffmpeg()
      .input(fileURL) // Use the URL of the song
      .complexFilter([
        "[0:a]showwaves=s=1280x720:mode=line:colors=blue[v]"
      ])
      .outputOptions([
        "-map [v]",
        "-map 0:a",
        "-c:v libx264",
        "-pix_fmt yuv420p",
        "-b:v 1500k"
      ])
      .on('start', () => console.log('FFmpeg waveform generation started...'))
      .on('end', () => {
        console.log('Waveform video generated!');
        return res.status(200).json({
          message: 'Waveform video generated successfully!',
          videoUrl: `/uploads/${path.basename(outputVideo)}`,
        });
      })
      .on('error', (err) => {
        console.error('Error during video generation:', err);
        return res.status(500).json({ error: 'Failed to generate waveform video.' });
      })
      .save(outputVideo); // Save the generated video to the server
  } catch (err) {
    console.error('Error in video generation logic:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
