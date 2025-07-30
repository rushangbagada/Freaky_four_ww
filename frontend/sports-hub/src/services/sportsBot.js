import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";

// Check if API key is available (Vite uses import.meta.env)
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

let llm = null;
let genAI = null;

// Only initialize if API key is available
if (API_KEY) {
  llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    temperature: 0.7,
    apiKey: API_KEY,
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
      },
    ],
  });

  genAI = new GoogleGenAI({apiKey: API_KEY});
}


const SYSTEM_PROMPT_SPORTS_WITH_MEDIA = `You are an expert sports analyst and commentator with a deep understanding of athletic performance, strategy, and technique across various sports. The user will upload a video showcasing a specific play, a workout routine, or a practice drill.

Analyze the video in detail, focusing on:

- **Highlighting Strengths:** Pinpoint and praise strong elements of the performance, such as excellent form, strategic awareness, impressive athleticism, effective teamwork, or tactical execution.

- **Constructive Feedback:** Offer clear, actionable suggestions for improvement. This could involve refining technique, improving efficiency of movement, suggesting alternative strategies, or enhancing tactical decision-making.

- **Situational Analysis:** Take into account the context of the video—like the game situation, player positioning, or the specific goals of the workout—and provide advice that is relevant to that scenario.

- **Actionable Tip:** Always end with a practical, encouraging tip that the user can directly apply in their next game or training session (e.g., “Try incorporating plyometrics to boost your explosive power,” or “Focus on keeping your eyes up to better read the field”).

Keep the tone motivating, insightful, and professional—like a dedicated coach helping an athlete unlock their full potential.`


/**
 * Normal sports chat
 */
export const chatWithSportsBot = async (messages, username=false) => {
  if (!llm || !API_KEY) {
    // Fallback response when API is not available
    const lastMessage = messages[messages.length - 1];
    return `Hello ${username ? username : 'there'}! 🏆 I'm your AI Sports Coach, but I'm currently offline. \n\nYou asked: "${lastMessage}"\n\nTo use the full chatbot functionality, please:\n1. Get a Google API key from https://makersuite.google.com/app/apikey\n2. Add it to your .env.local file as VITE_GOOGLE_API_KEY=your-key-here\n3. Restart the development server\n\nFor now, here are some general sports tips:\n🏃‍♂️ Stay hydrated during workouts\n💪 Focus on proper form over speed\n🧘‍♂️ Include stretching in your routine\n⚽ Practice consistently for improvement`;
  }

  let userInfo = '';
  if (username) {
    userInfo = ` User's name is ${username}. Give suggestions according to their athletic interests.`
  }

  const aiMsg = await llm.invoke([
    ["system", "Strictly reply as a helpful sports expert that helps user professionally. Do not entertain any talks unrelated to sports without being rude. Be professional." + userInfo],
    ...messages.map((msg) => ["human", msg]),
  ]);
  return aiMsg.content;
};

/**
 * Analyze a sports video (video URL)
 */
export const analyzeSportsVideo = async (videoUrl, username=false) => {
  if (!genAI || !API_KEY) {
    throw new Error("Video analysis is currently unavailable. Please check back later.");
  }

  const response = await axios.get(videoUrl, { responseType: 'arraybuffer' });
  const base64Video = Buffer.from(response.data).toString('base64');

  let userInfo = '';
  if (username) {
    userInfo = ` User's name is ${username}.`
  }

  const result = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        inlineData: {
          mimeType: 'video/mp4',
          data: base64Video,
        },
      },
      {
        text: SYSTEM_PROMPT_SPORTS_WITH_MEDIA + userInfo
      },
    ],
    apiKey: API_KEY,
  });

  return result.text;
};
