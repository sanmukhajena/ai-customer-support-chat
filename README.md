# AI Customer Support Chat Application 🤖💬

A modern, intelligent customer support chat application powered by the **Gemini API**. This project features a sleek **Orange and Black (Dark Mode)** UI, real-time messaging, and an admin panel for knowledge base management.

![Project Theme](https://via.placeholder.com/800x400/0f172a/f97316?text=AI+Support+Chat+Preview)

## ✨ Features

*   **AI-Powered Chat**: Intelligent responses using Google's Gemini Flash model.
*   **Modern UI/UX**:
    *   **Dark Mode**: sophisticated "Orange and Black" color scheme.
    *   **Glassmorphism**: Translucent elements and smooth gradients.
    *   **Animations**: Fluid transitions and micro-interactions.
*   **Admin Panel**:
    *   Manage knowledge base documents.
    *   Upload and process text files for context-aware answers.
*   **Chat History**: View and toggle past conversation history.
*   **Responsive Design**: Fully optimized for desktop and mobile devices.

## 🛠️ Tech Stack

### Frontend
*   **React**: UI library for building interactive interfaces.
*   **Vite**: Next-generation frontend tooling.
*   **Tailwind CSS**: Utility-first CSS framework for styling.
*   **MobX**: Simple, scalable state management.
*   **Lucide React**: Beautiful & consistent icons.

### Backend
*   **Node.js & Express**: Robust server-side runtime and framework.
*   **MongoDB**: NoSQL database for storing chat history and documents.
*   **Google Generative AI (Gemini)**: Advanced LLM for natural language processing.
*   **Multer**: Middleware for handling file uploads.

## 🚀 Getting Started

### Prerequisites
*   Node.js (v16+)
*   MongoDB (Local or Atlas)
*   Google Gemini API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/sanmukhajena/ai-customer-support-chat.git
    cd ai-customer-support-chat
    ```

2.  **Setup Backend**
    ```bash
    cd server
    npm install
    ```
    *   Create a `.env` file in the `server` directory:
        ```env
        PORT=5001
        MONGODB_URI=mongodb://localhost:27017/ai-support-chat
        GEMINI_API_KEY=your_gemini_api_key_here
        ```

3.  **Setup Frontend**
    ```bash
    cd ../client
    npm install
    ```

### Running the Application

1.  **Start the Backend Server**
    ```bash
    cd server
    npm start
    ```
    *   Server runs on `http://localhost:5001`

2.  **Start the Frontend Development Server**
    ```bash
    cd client
    npm run dev
    ```
    *   App runs on `http://localhost:5173`

## 🎨 Theme Customization

The application uses a custom Tailwind configuration for the "Orange and Black" theme. You can modify colors in `client/tailwind.config.js`:

```javascript
colors: {
  orange: {
    500: '#f97316',
    // ...
  },
  dark: {
    900: '#0f172a',
    // ...
  }
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.