import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Generate Script using OpenAI
export const generateScript = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required for script generation.' });
  }

  // Making a request to OpenAI API (ChatGPT)
  const options = {
    method: 'POST',
    url: 'https://open-ai21.p.rapidapi.com/chatgpt',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'open-ai21.p.rapidapi.com',
      'Content-Type': 'application/json',
    },
    data: {
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      web_access: false,  // Adjust based on your API needs
    },
  };

  try {
    const response = await axios.request(options);

    // Assuming response.result contains the generated script text
    if (response.data?.status === true) {
      let generatedScript = response.data.result?.trim();

      if (generatedScript) {
        // Trim until the script ends at a complete sentence or logical break
        generatedScript = trimToMeaningfulContent(generatedScript);

        // Send the shortened script back to the frontend for editing
        res.json({ script: generatedScript });
      } else {
        return res.status(500).json({ error: 'Generated script is empty.' });
      }
    } else {
      return res.status(500).json({ error: 'Failed to generate a valid script.' });
    }
  } catch (error) {
    console.error('Error generating script:', error);
    res.status(500).json({ error: 'Error generating script using OpenAI.' });
  }
};

// Helper function to trim the script intelligently
function trimToMeaningfulContent(text) {
  // Regular expression to capture sentences and end at a complete sentence
  const sentenceEndRegex = /([.!?])\s+/;
  let sentences = text.split(sentenceEndRegex).filter(Boolean);
  
  // Join sentences back until meaningful content is reached
  let trimmedScript = sentences.slice(0, 3).join(' '); // Keep the first 3 full sentences
  if (trimmedScript.length < text.length) {
    trimmedScript += '...'; // Add ellipsis if truncated
  }

  return trimmedScript;
}


// Video Generation
export const generateVideo = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required for video generation.' });
  }

  const options = {
    method: 'POST',
    url: 'https://runwayml.p.rapidapi.com/generate/text',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'runwayml.p.rapidapi.com',
      'Content-Type': 'application/json',
    },
    data: {
      text_prompt: prompt,
      model: 'gen3',
      width: 1344,
      height: 768,
      motion: 5,
      seed: 0,
      callback_url: '',
      time: 5,
    },
  };

  try {
    const response = await axios.request(options);
    console.log('RunwayML Response:', response.data);

    if (!response.data || !response.data.uuid) {
      return res.status(500).json({ error: 'Failed to queue video generation.' });
    }

    // Return UUID so the frontend can poll the status
    res.json({ uuid: response.data.uuid });
  } catch (error) {
    console.error('Error generating video:', error);
    res.status(500).json({ error: 'Error submitting video generation request.' });
  }
};

// Polling route to check the status of the video
export const checkVideoStatus = async (req, res) => {
  const { uuid } = req.query; // Extract UUID from query parameters

  if (!uuid) {
    return res.status(400).json({ error: 'UUID is required to check video status..' });
  }

  const options = {
    method: 'GET',
    url: 'https://runwayml.p.rapidapi.com/status', // Correct API endpoint
    params: { uuid }, // Pass UUID in params as per API docs
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY, // Use environment variable
      'x-rapidapi-host': 'runwayml.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.request(options);
    console.log('Video Status Response:', response.data);

    if (response.data.status === 'success' && response.data.url) {
      return res.json({
        status: 'success',
        videoUrl: response.data.url, // ✅ Send video URL
        gifUrl: response.data.gif_url, // ✅ Send GIF URL
      });
    }

    res.json({ status: response.data.status, progress: response.data.progress })
  } catch (error) {
    console.error('Error checking video status:', error);
    res.status(500).json({ error: 'Error checking video status.' });
  }
};



// import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

// // Generate Script using OpenAI
// export const generateScript = async (req, res) => {
//   const { prompt } = req.body;

//   if (!prompt) {
//     return res.status(400).json({ error: 'Prompt is required for script generation.' });
//   }

//   // Making a request to OpenAI API (ChatGPT)
//   const options = {
//     method: 'POST',
//     url: 'https://open-ai21.p.rapidapi.com/chatgpt',
//     headers: {
//       'x-rapidapi-key': process.env.RAPIDAPI_KEY,
//       'x-rapidapi-host': 'open-ai21.p.rapidapi.com',
//       'Content-Type': 'application/json',
//     },
//     data: {
//       messages: [
//         {
//           role: 'user',
//           content: prompt,
//         },
//       ],
//       web_access: false,  // Adjust based on your API needs
//     },
//   };

//   try {
//     const response = await axios.request(options);

//     // Assuming response.result contains the generated script text
//     if (response.data?.status === true) {
//       let generatedScript = response.data.result?.trim();

//       if (generatedScript) {
//         // Trim until the script ends at a complete sentence or logical break
//         generatedScript = trimToMeaningfulContent(generatedScript);

//         // Send the shortened script back to the frontend for editing
//         res.json({ script: generatedScript });
//       } else {
//         return res.status(500).json({ error: 'Generated script is empty.' });
//       }
//     } else {
//       return res.status(500).json({ error: 'Failed to generate a valid script.' });
//     }
//   } catch (error) {
//     console.error('Error generating script:', error);
//     res.status(500).json({ error: 'Error generating script using OpenAI.' });
//   }
// };

// // Helper function to trim the script intelligently
// function trimToMeaningfulContent(text) {
//   // Regular expression to capture sentences and end at a complete sentence
//   const sentenceEndRegex = /([.!?])\s+/;
//   let sentences = text.split(sentenceEndRegex).filter(Boolean);
  
//   // Join sentences back until meaningful content is reached
//   let trimmedScript = sentences.slice(0, 3).join(' '); // Keep the first 3 full sentences
//   if (trimmedScript.length < text.length) {
//     trimmedScript += '...'; // Add ellipsis if truncated
//   }

//   return trimmedScript;
// }


// // Video Generation
// export const generateVideo = async (req, res) => {
//   const { prompt } = req.body;

//   if (!prompt) {
//     return res.status(400).json({ error: 'Prompt is required for video generation.' });
//   }

//   const options = {
//     method: 'POST',
//     url: 'https://runwayml.p.rapidapi.com/generate/text',
//     headers: {
//       'x-rapidapi-key': process.env.RAPIDAPI_KEY,
//       'x-rapidapi-host': 'runwayml.p.rapidapi.com',
//       'Content-Type': 'application/json',
//     },
//     data: {
//       text_prompt: prompt,
//       model: 'gen3',
//       width: 1344,
//       height: 768,
//       motion: 5,
//       seed: 0,
//       callback_url: '',
//       time: 5,
//     },
//   };

//   try {
//     const response = await axios.request(options);
//     console.log('RunwayML Response:', response.data);

//     if (!response.data || !response.data.uuid) {
//       return res.status(500).json({ error: 'Failed to queue video generation.' });
//     }

//     // Return UUID so the frontend can poll the status
//     res.json({ uuid: response.data.uuid });
//   } catch (error) {
//     console.error('Error generating video:', error);
//     res.status(500).json({ error: 'Error submitting video generation request.' });
//   }
// };

// // Polling route to check the status of the video
// export const checkVideoStatus = async (req, res) => {
//   const { uuid } = req.query; // Extract UUID from query parameters

//   if (!uuid) {
//     return res.status(400).json({ error: 'UUID is required to check video status.' });
//   }

//   const options = {
//     method: 'GET',
//     url: 'https://runwayml.p.rapidapi.com/status', // Correct API endpoint
//     params: { uuid }, // Pass UUID in params as per API docs
//     headers: {
//       'x-rapidapi-key': process.env.RAPIDAPI_KEY, // Use environment variable
//       'x-rapidapi-host': 'runwayml.p.rapidapi.com',
//     },
//   };

//   try {
//     const response = await axios.request(options);
//     console.log('Video Status Response:', response.data);

//     if (response.data.status === 'success' && response.data.url) {
//       return res.json({
//         status: 'success',
//         videoUrl: response.data.url, // ✅ Send video URL
//         gifUrl: response.data.gif_url, // ✅ Send GIF URL
//       });
//     }

//     res.json({ status: response.data.status, progress: response.data.progress })
//   } catch (error) {
//     console.error('Error checking video status:', error);
//     res.status(500).json({ error: 'Error checking video status.' });
//   }
// };

// import ffmpeg from 'fluent-ffmpeg';
// import path from 'path';
// import fs from 'fs';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import fetch from 'node-fetch';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// export const generateVideo = async (req, res) => {
//   const { songName, theme } = req.body; // Receive songName and theme from frontend
//   const uploadedFile = req.file; // The uploaded song file
//   const outputDir = path.join(__dirname, '../../uploads');
//   const outputVideo = path.join(outputDir, `output_${Date.now()}.mp4`);

//   // Ensure the uploads directory exists
//   if (!fs.existsSync(outputDir)) {
//     fs.mkdirSync(outputDir, { recursive: true });
//   }

//   if (!songName && !uploadedFile) {
//     return res.status(400).json({ error: 'Please enter a song name or upload a song file.' });
//   }

//   let fileURL = uploadedFile ? uploadedFile.path : null;
  
//   if (songName) {
//     // Fetch song from Jamendo API
//     const clientId = "de0debdc";
//     const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${clientId}&format=jsonpretty&name=${songName}&limit=1`;

//     try {
//       const response = await fetch(url);
//       const data = await response.json();

//       if (!response.ok || data.error || data.results.length === 0) {
//         throw new Error(data.error || "Song not found.");
//       }

//       const songPreviewUrl = data.results[0].audio;
//       fileURL = songPreviewUrl; // Assign the preview URL to fileURL for video creation
//     } catch (error) {
//       return res.status(400).json({ error: error.message || "Error fetching song." });
//     }
//   }

//   if (!fileURL) {
//     return res.status(400).json({ error: "No valid audio file found." });
//   }

//   try {
//     // Use FFmpeg to create a waveform video synced to the music
//     ffmpeg()
//       .input(fileURL) // Use the URL of the song
//       .complexFilter([
//         "[0:a]showwaves=s=1280x720:mode=line:colors=blue[v]"  // Generate waveform
//       ])
//       .outputOptions([
//         "-map [v]",
//         "-map 0:a",
//         "-c:v libx264",
//         "-pix_fmt yuv420p",
//         "-b:v 1500k"
//       ])
//       .on('start', () => console.log('FFmpeg waveform generation started...'))
//       .on('end', () => {
//         console.log('Waveform video generated!');
//         return res.status(200).json({
//           message: 'Waveform video generated successfully!',
//           videoUrl: `/uploads/${path.basename(outputVideo)}`,  // Send video URL
//         });
//       })
//       .on('error', (err) => {
//         console.error('Error during video generation:', err);
//         return res.status(500).json({ error: 'Failed to generate waveform video.' });
//       })
//       .save(outputVideo); // Save the generated video to the server
//   } catch (err) {
//     console.error('Error in video generation logic:', err);
//     return res.status(500).json({ error: 'Internal server error.' });
//   }
// };