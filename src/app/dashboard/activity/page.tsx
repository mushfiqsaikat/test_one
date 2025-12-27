export default function ActivityPage() {
    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Activity</h1>
                <p className="text-slate-600 dark:text-slate-400">View all conversations with your chatbot</p>
            </div>

            <div className="card p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">No activity yet</h3>
                <p className="text-slate-500 mb-4">Conversations will appear here once users start chatting with your bot.</p>
                <button className="btn-primary">Test in Playground</button>
            </div>
        </div>
    );
}
