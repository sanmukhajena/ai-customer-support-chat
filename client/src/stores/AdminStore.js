import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";

class AdminStore {
    documents = [];
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
        this.fetchDocuments();
    }

    async fetchDocuments() {
        this.isLoading = true;
        try {
            const res = await axios.get('http://localhost:5001/api/documents');
            runInAction(() => {
                this.documents = res.data;
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                console.error("Failed to fetch documents", error);
                this.isLoading = false;
            });
        }
    }

    async uploadDocument(title, content) {
        this.isLoading = true;
        try {
            // For simplicity sending JSON, but could be FormData for files
            await axios.post('http://localhost:5001/api/documents', { title, content });
            await this.fetchDocuments();
            runInAction(() => {
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                console.error("Failed to upload document", error);
                this.isLoading = false;
            });
        }
    }

    async deleteDocument(id) {
        try {
            await axios.delete(`http://localhost:5001/api/documents/${id}`);
            runInAction(() => {
                this.documents = this.documents.filter(d => d._id !== id);
            });
        } catch (error) {
            console.error("Failed to delete document", error);
        }
    }
}

export const adminStore = new AdminStore();
