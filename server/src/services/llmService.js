const { GoogleGenerativeAI } = require("@google/generative-ai");
const Document = require('../models/Document');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getRelevantContext = async (query) => {
    // Simple keyword search for now. 
    const keywords = query.split(' ').filter(w => w.length > 3);
    if (keywords.length === 0) return "";

    const regex = new RegExp(keywords.join('|'), 'i');
    const docs = await Document.find({
        $or: [
            { title: { $regex: regex } },
            { content: { $regex: regex } }
        ]
    }).limit(5);

    return docs.map(d => `Title: ${d.title}\nContent: ${d.content}`).join('\n\n');
};

const generateResponse = async (history, query) => {
    try {
        const context = await getRelevantContext(query);

        const systemPrompt = `You are a helpful customer support AI. 
    Use the following context to answer the user's question. 
    If the answer is not in the context, answer generally but mention that it's general knowledge.
    
    Context:
    ${context}
    `;

        // Use gemini-flash-latest as it is available in the user's list
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // Filter out empty messages
        const validHistory = history.filter(msg => msg.content && msg.content.trim() !== '');

        // Map to Gemini format
        let geminiHistory = validHistory.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));

        // Gemini requires the first message in history to be from 'user'.
        // Remove ANY leading messages that are not from 'user'.
        while (geminiHistory.length > 0 && geminiHistory[0].role !== 'user') {
            geminiHistory.shift();
        }

        const chat = model.startChat({
            history: geminiHistory,
        });

        // Prepend system prompt to the user's query for gemini-pro
        const finalPrompt = `${systemPrompt}\n\nUser Question: ${query}`;

        const result = await chat.sendMessage(finalPrompt);
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error('LLM Error Details:', JSON.stringify(error, null, 2));
        console.error('LLM Error Message:', error.message);
        return `I'm sorry, I encountered an error processing your request with Gemini. Error: ${error.message}`;
    }
};

module.exports = { generateResponse };
