const express = require('express');
const { google } = require('googleapis');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

const reportRoute = express.Router();

// Helper function to search YouTube video
async function searchYouTubeVideo(query) {
  try {
    const response = await youtube.search.list({
      part: ['id'],
      q: query,
      type: ['video'],
      maxResults: 1,
    });
    const videoId = response.data.items?.[0]?.id?.videoId;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  } catch (error) {
    console.error('Error searching YouTube:', error);
    return '';
  }
}

reportRoute.post('/generate-curriculum', async (req, res) => {
  const { prompt } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant that generates course curricula." },
        { role: "user", content: `Generate a curriculum for: ${prompt}. Provide main topics with brief descriptions and  subtopics wherever required` }
      ],
      functions: [
        {
          name: "generate_curriculum",
          description: "Generate a structured curriculum based on the given topic",
          parameters: {
            type: "object",
            properties: {
              curriculum: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    subtopics: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          title: { type: "string" },
                          description: { type: "string" },
                        },
                        required: ["title", "description"],
                      },
                    },
                  },
                  required: ["title", "description", "subtopics"],
                },
              },
            },
            required: ["curriculum"],
          },
        },
      ],
      function_call: { name: "generate_curriculum" },
    });

    const generatedCurriculum = JSON.parse(completion.choices[0].message.function_call.arguments);

    // Extract videos for each title and subtopic
    const curriculumWithVideos = await Promise.all(generatedCurriculum.curriculum.map(async (item) => {
      const videoUrl = await searchYouTubeVideo(`${item.title}`);
      const subtopicsWithVideos = await Promise.all(item.subtopics.map(async (subtopic) => {
        const subtopicVideoUrl = await searchYouTubeVideo(`${subtopic.title}`);
        return { ...subtopic, videoUrl: subtopicVideoUrl };
      }));
      return { ...item, videoUrl, subtopics: subtopicsWithVideos };
    }));

    res.status(200).json(curriculumWithVideos);
  } catch (error) {
    console.error('Error generating curriculum:', error);
    res.status(500).json({ message: 'Error generating curriculum' });
  }
});

module.exports = reportRoute;
