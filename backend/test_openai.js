require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function test() {
  console.log("Testing OpenAI connection...");
  console.log("API Key:", process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 10) + "..." : "Missing");
  
  if (!process.env.OPENAI_API_KEY) {
    console.error("Error: OPENAI_API_KEY is missing in .env");
    return;
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: "Hello" }],
      model: "gpt-3.5-turbo",
    });
    console.log("Response:", completion.choices[0].message.content);
  } catch (error) {
    console.error("FULL ERROR:", error);
  }
}

test();
