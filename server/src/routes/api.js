const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const Chat = require('../models/Chat');
const { generateResponse } = require('../services/llmService');
const multer = require('multer');
const upload = multer(); // Memory storage

// --- Document Routes (Admin) ---

// Upload Document
router.post('/documents', upload.single('file'), async (req, res) => {
    try {
        // If file upload (simple text file handling)
        let content = req.body.content;
        let title = req.body.title;

        if (req.file) {
            // Assuming text file for simplicity. 
            // For PDF/Docx, we'd need parsing logic here (e.g. pdf-parse).
            content = req.file.buffer.toString('utf-8');
            if (!title) title = req.file.originalname;
        }

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        const doc = new Document({ title, content });
        await doc.save();
        res.status(201).json(doc);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Documents
router.get('/documents', async (req, res) => {
    try {
        const docs = await Document.find().sort({ createdAt: -1 });
        res.json(docs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Document
router.delete('/documents/:id', async (req, res) => {
    try {
        await Document.findByIdAndDelete(req.params.id);
        res.json({ message: 'Document deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Chat Routes ---

// Start or Get Chat Session
router.get('/chat/:sessionId', async (req, res) => {
    try {
        let chat = await Chat.findOne({ sessionId: req.params.sessionId });
        if (!chat) {
            chat = new Chat({ sessionId: req.params.sessionId, messages: [] });
            await chat.save();
        }
        res.json(chat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Send Message
router.post('/chat', async (req, res) => {
    try {
        const { sessionId, message } = req.body;
        let chat = await Chat.findOne({ sessionId });

        if (!chat) {
            chat = new Chat({ sessionId, messages: [] });
        }

        // Add user message
        chat.messages.push({ role: 'user', content: message });

        // Generate AI response
        // We pass the last 10 messages for context window management
        const history = chat.messages.slice(-10);
        const aiResponseContent = await generateResponse(history, message);

        // Add AI message
        chat.messages.push({ role: 'assistant', content: aiResponseContent });
        chat.updatedAt = Date.now();
        await chat.save();

        res.json({
            role: 'assistant',
            content: aiResponseContent,
            chatId: chat._id
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
