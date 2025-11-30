require('dotenv').config();

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("No API Key found!");
        return;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", JSON.stringify(data.error, null, 2));
        } else {
            if (data.models) {
                const fs = require('fs');
                fs.writeFileSync('models.json', JSON.stringify(data.models, null, 2));
                console.log("Models saved to models.json");
            } else {
                console.log("No models found in response:", data);
            }
        }
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

listModels();
