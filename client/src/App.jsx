import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ChatInterface from './components/ChatInterface';
import AdminPanel from './components/AdminPanel';

function App() {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<ChatInterface />} />
                    <Route path="admin" element={<AdminPanel />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
