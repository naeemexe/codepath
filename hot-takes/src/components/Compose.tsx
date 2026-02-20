import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { PenLine } from 'lucide-react';

export function Compose({ user_id, onPostSuccess }: { user_id: string; onPostSuccess?: () => void }) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
    const isOverLimit = wordCount > 100;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isOverLimit || wordCount === 0) return;

        setLoading(true);
        setError('');

        try {
            const { error } = await supabase.from('posts').insert([
                {
                    user_id,
                    content: content.trim()
                }
            ]);

            if (error) throw error;

            setContent('');
            if (onPostSuccess) onPostSuccess();
        } catch (err: any) {
            setError(err.message || 'Could not post your take.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="compose-container fade-in">
            <form onSubmit={handleSubmit} className="compose-box glass-panel">
                <div className="compose-header">
                    <PenLine size={18} className="text-secondary" />
                    <h3>What's your hot take?</h3>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type your hot take here... Keep it under 100 words."
                    className={`compose-input ${isOverLimit ? 'input-error' : ''}`}
                    rows={4}
                />

                <div className="compose-footer">
                    <span className={`word-count ${isOverLimit ? 'text-danger' : 'text-muted'}`}>
                        {wordCount} / 100 words
                    </span>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading || isOverLimit || wordCount === 0}
                    >
                        {loading ? <span className="spinner sm"></span> : 'Post'}
                    </button>
                </div>
            </form>
        </div>
    );
}
