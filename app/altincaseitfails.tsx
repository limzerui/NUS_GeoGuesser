import React from 'react';

const DummyPage = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Welcome to the Dummy Page</h1>
        <p>Your Next.js app is up and running!</p>
      </header>

      <main>
        <section style={{ marginBottom: '20px' }}>
          <h2>About This Page</h2>
          <p>
            This is a placeholder page to help you get started with your Next.js
            application. Customize it by editing the code or adding new components.
          </p>
        </section>

        <section style={{ marginBottom: '20px' }}>
          <h2>Features</h2>
          <ul>
            <li>Fast rendering with server-side rendering (SSR)</li>
            <li>Static site generation (SSG) for better performance</li>
            <li>Seamless API integration</li>
            <li>Developer-friendly with React</li>
          </ul>
        </section>

        <section>
          <h2>Next Steps</h2>
          <p>
            To get started, edit this file or create new pages in the <code>pages</code>
            directory. Check out the <a href="https://nextjs.org/docs">Next.js documentation</a> for more details.
          </p>
        </section>
      </main>

      <footer style={{ textAlign: 'center', marginTop: '40px', fontSize: '14px' }}>
        <p>&copy; 2025 Your App Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DummyPage;
