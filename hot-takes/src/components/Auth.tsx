import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, UserPlus } from 'lucide-react';

export function Auth({ onAuthSuccess }: { onAuthSuccess: () => void }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
            }
            onAuthSuccess();
        } catch (err: any) {
            setError(err.message || 'An error occurred during authentication.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass-panel fade-in">
                <div className="auth-header">
                    <h2>{isLogin ? 'Welcome Back' : 'Join the Heat'}</h2>
                    <p>{isLogin ? 'Log in to read and post hot takes.' : 'Sign up to start posting hot takes.'}</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleAuth} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="input-field"
                            minLength={6}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? (
                            <span className="spinner"></span>
                        ) : isLogin ? (
                            <><LogIn size={18} /> Log In</>
                        ) : (
                            <><UserPlus size={18} /> Sign Up</>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            type="button"
                            className="btn-link"
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
