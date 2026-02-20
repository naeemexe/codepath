import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LogOut, Flame } from 'lucide-react';

interface Post {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
}

export function Feed({ user, onLogout, refreshKey }: { user: any; onLogout: () => void; refreshKey?: number }) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, [refreshKey]);

    useEffect(() => {
        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                },
                (payload) => {
                    console.log(payload);
                    fetchPosts(); // For simplicity, re-fetch on any change
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchPosts = async () => {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="feed-container">
            <header className="header glass-panel">
                <div className="logo">
                    <Flame size={28} className="text-secondary" />
                    <h1>Hot Takes</h1>
                </div>
                <div className="user-controls">
                    <span className="user-email">{user.email}</span>
                    <button onClick={onLogout} className="btn-icon" aria-label="Log out">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <main className="content">
                {loading ? (
                    <div className="flex-center p-8">
                        <span className="spinner lg"></span>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="empty-state">
                        <p>No hot takes yet. Be the first to start the fire!</p>
                    </div>
                ) : (
                    <div className="post-list">
                        {posts.map((post) => (
                            <div key={post.id} className="post-card fade-in">
                                <div className="post-meta">
                                    {/* In a real app we'd fetch profiles, but we use ID here for simplicity */}
                                    <span className="author-id">User {post.user_id.substring(0, 8)}</span>
                                    <span className="post-time">
                                        {new Date(post.created_at).toLocaleDateString()}{' '}
                                        {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="post-content">{post.content}</p>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
