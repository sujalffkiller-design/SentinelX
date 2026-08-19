import "./AIAssistant.css";

function AIAssistant() {
  return (
    <div className="sx-ai-page">

      {/* SIDEBAR */}
      <aside className="sx-ai-sidebar">

        <div className="sx-ai-logo">
          <div className="sx-ai-logo-icon">🛡️</div>

          <div>
            <h2>SentinelX</h2>
            <span>AI Assistant</span>
          </div>
        </div>

        <button className="sx-ai-new-chat">
          <span>＋</span>
          New Chat
        </button>

        <div className="sx-ai-history">

          <div className="sx-ai-history-title">
            Recent Chats
          </div>

          <button className="sx-ai-history-item">
            Cybersecurity basics
          </button>

          <button className="sx-ai-history-item">
            URL security analysis
          </button>

        </div>

        <div className="sx-ai-sidebar-bottom">

          <button>
            ⚙️ Settings
          </button>

          <button>
            ← Back to SentinelX
          </button>

        </div>

      </aside>


      {/* MAIN AREA */}
      <main className="sx-ai-main">

        {/* HEADER */}
        <header className="sx-ai-header">

          <div>
            <h1>SentinelX AI</h1>

            <div className="sx-ai-status">
              <span></span>
              Online
            </div>
          </div>

        </header>


        {/* CHAT AREA */}
        <section className="sx-ai-chat-area">

          <div className="sx-ai-welcome">

            <div className="sx-ai-big-icon">
              🛡️
            </div>

            <h1>
              How can I help you today?
            </h1>

            <p>
              Your intelligent cybersecurity assistant.
            </p>

          </div>


          {/* QUICK ACTIONS */}
          <div className="sx-ai-actions">

            <button>
              <div>🔍</div>

              <span>
                Analyze a URL
              </span>

              <small>
                Check a website for threats
              </small>
            </button>


            <button>
              <div>🦠</div>

              <span>
                Explain Malware
              </span>

              <small>
                Understand malware threats
              </small>
            </button>


            <button>
              <div>🛡️</div>

              <span>
                Security Advice
              </span>

              <small>
                Improve your security
              </small>
            </button>


            <button>
              <div>💻</div>

              <span>
                Learn Cybersecurity
              </span>

              <small>
                Learn security concepts
              </small>
            </button>

          </div>

        </section>


        {/* INPUT */}
        <footer className="sx-ai-input-section">

          <div className="sx-ai-input">

            <input
              type="text"
              placeholder="Message SentinelX AI..."
            />

            <button>
              ➤
            </button>

          </div>

          <p>
            SentinelX AI can make mistakes. Verify important information.
          </p>

        </footer>

      </main>

    </div>
  );
}

export default AIAssistant;