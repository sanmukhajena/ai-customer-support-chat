import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { adminStore } from '../stores/AdminStore';
import { Upload, Trash2, FileText, Plus, Search, X, Loader2 } from 'lucide-react';

const AdminPanel = observer(() => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!title || !content) return;

        await adminStore.uploadDocument(title, content);
        setTitle('');
        setContent('');
        setIsFormOpen(false);
    };

    const filteredDocs = adminStore.documents.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
            {/* Header */}
            <header className="px-8 py-8 border-b border-slate-800 bg-[#0f172a]/50 backdrop-blur-md flex justify-between items-end z-10">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">Knowledge Base</span>
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">Manage the documents your AI uses for context.</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 flex items-center gap-2 font-bold active:scale-95 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    <span>Add Document</span>
                </button>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">

                {/* Search Bar */}
                <div className="mb-8 relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-sm font-medium text-slate-200 placeholder-slate-500"
                    />
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDocs.map((doc) => (
                        <div key={doc._id} className="group bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button
                                    onClick={() => adminStore.deleteDocument(doc._id)}
                                    className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                                    title="Delete document"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 text-orange-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 border border-orange-500/20">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-200 line-clamp-1 group-hover:text-orange-500 transition-colors">{doc.title}</h3>
                                    <span className="text-xs text-slate-500 font-medium">{new Date(doc.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                                {doc.content}
                            </p>

                            <div className="pt-4 border-t border-slate-800 mt-auto">
                                <span className="text-xs font-bold text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-md uppercase tracking-wide border border-orange-500/20">
                                    Text Document
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Empty State */}
                    {filteredDocs.length === 0 && !adminStore.isLoading && (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/50">
                            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-4">
                                <Search className="w-8 h-8 text-slate-500" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-300">No documents found</h3>
                            <p className="text-slate-500 max-w-xs mt-1">Try adjusting your search or add a new document to get started.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsFormOpen(false)} />
                    <div className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg relative z-10 animate-fade-in overflow-hidden border border-slate-800">
                        <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                            <h2 className="text-xl font-bold text-white">New Document</h2>
                            <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleUpload} className="p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">Document Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all font-medium text-white placeholder-slate-600"
                                    placeholder="e.g., Return Policy 2024"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">Content</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={6}
                                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all resize-none font-medium text-slate-300 placeholder-slate-600"
                                    placeholder="Paste the full text content here..."
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="flex-1 px-4 py-3 text-slate-400 font-bold hover:bg-slate-800 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={adminStore.isLoading}
                                    className="flex-1 px-4 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 disabled:opacity-70 transition-all shadow-lg shadow-orange-500/20 flex justify-center items-center gap-2"
                                >
                                    {adminStore.isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Upload Document'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
});

export default AdminPanel;
