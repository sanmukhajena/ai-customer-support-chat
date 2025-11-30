const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        // There isn't a direct "listModels" method exposed easily on the client instance in some versions,
        // but usually it's not needed if we know the model name.
        // However, let's try to just run a simple generation to see if it works with a basic prompt.
        // If that fails, we know it's the model name or key.

        console.log("Testing gemini-pro...");
        const result = await model.generateContent("Hello");
        console.log("gemini-pro worked:", result.response.text());
    } catch (error) {
        console.error("gemini-pro failed:", error.message);
    }

    try {
        console.log("Testing gemini-1.5-flash...");
        const model2 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result2 = await model2.generateContent("Hello");
        console.log("gemini-1.5-flash worked:", result2.response.text());
    } catch (error) {
        console.error("gemini-1.5-flash failed:", error.message);
    }
}

listModels();
