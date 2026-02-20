import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import { Feed } from './components/Feed';
import { Compose } from './components/Compose';

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="flex-center min-h-screen">
        <span className="spinner lg"></span>
      </div>
    );
  }

  return (
    <div className="app-container">
      {!session ? (
        <Auth onAuthSuccess={() => { }} />
      ) : (
        <>
          <Feed user={session.user} onLogout={handleLogout} refreshKey={refreshKey} />
          <div className="compose-wrapper">
            <Compose user_id={session.user.id} onPostSuccess={() => setRefreshKey(k => k + 1)} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
