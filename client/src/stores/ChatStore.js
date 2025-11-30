import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";

class ChatStore {
    messages = [];
    isLoading = false;
    sessionId = null;

    constructor() {
        makeAutoObservable(this);
        this.sessionId = localStorage.getItem('chatSessionId') || `sess_${Date.now()}`;
        localStorage.setItem('chatSessionId', this.sessionId);
        this.loadHistory();
    }

    async loadHistory() {
        try {
            const res = await axios.get(`http://localhost:5001/api/chat/${this.sessionId}`);
            runInAction(() => {
                this.messages = res.data.messages || [];
            });
        } catch (error) {
            console.error("Failed to load history", error);
        }
    }

    async sendMessage(content) {
        this.messages.push({ role: 'user', content });
        this.isLoading = true;

        try {
            const res = await axios.post('http://localhost:5001/api/chat', {
                sessionId: this.sessionId,
                message: content
            });

            runInAction(() => {
                this.messages.push({ role: 'assistant', content: res.data.content });
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.messages.push({ role: 'assistant', content: "Error: Could not reach the server." });
                this.isLoading = false;
            });
        }
    }
}

export const chatStore = new ChatStore();
