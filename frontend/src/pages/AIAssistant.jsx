import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AIAssistant.css";

function AIAssistant() {
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // ============================================================
  // SEND MESSAGE - STREAMING
  // ============================================================

  const sendMessage = async (text = input) => {
    const message = text.trim();

    if (!message || loading) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      role: "user",
      text: message,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setInput("");
    setLoading(true);

    // Create empty AI message
    const assistantId = Date.now() + 1;

    const assistantMessage = {
      id: assistantId,
      role: "assistant",
      text: "",
    };

    setMessages((prev) => [
      ...prev,
      assistantMessage,
    ]);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/ai-chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

         body: JSON.stringify({
          message: message,

          history: messages.map((msg) => ({
            role: msg.role,
            text: msg.text,
          })),
        }),
        }
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        throw new Error(
          errorText ||
          "Failed to connect to SentinelX AI."
        );
      }

      // --------------------------------------------------------
      // GET STREAM
      // --------------------------------------------------------

      if (!response.body) {
        throw new Error(
          "Streaming is not supported by this browser."
        );
      }

      const reader =
        response.body.getReader();

      const decoder =
        new TextDecoder();

      let fullResponse = "";

      // --------------------------------------------------------
      // READ STREAM CHUNKS
      // --------------------------------------------------------

      while (true) {

        const {
          value,
          done
        } = await reader.read();

        if (done) break;

        const chunk =
          decoder.decode(
            value,
            {
              stream: true
            }
          );

        fullResponse += chunk;

        // ------------------------------------------------------
        // UPDATE AI MESSAGE
        // ------------------------------------------------------

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? {
                  ...msg,
                  text: fullResponse,
                }
              : msg
          )
        );
      }

    } catch (error) {

      console.error(
        "SentinelX AI Error:",
        error
      );

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                text:
                  "⚠️ SentinelX AI error:\n\n" +
                  error.message,
              }
            : msg
        )
      );

    } finally {

      setLoading(false);

    }
  };


  // ============================================================
  // ENTER KEY
  // ============================================================

  const handleKeyDown = (event) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      sendMessage();
    }
  };


  // ============================================================
  // NEW CHAT
  // ============================================================

  const startNewChat = () => {

    setMessages([]);

    setInput("");

    setLoading(false);
  };


  // ============================================================
  // QUICK ACTION
  // ============================================================

  const handleQuickAction = (prompt) => {

    sendMessage(prompt);
  };


  // ============================================================
  // LOAD PREVIOUS CHAT
  // ============================================================

  const loadPreviousChat = (type) => {

    if (type === "cybersecurity") {

      setMessages([
        {
          id: 1,
          role: "user",
          text:
            "What is cybersecurity?",
        },

        {
          id: 2,
          role: "assistant",
          text:
            "Cybersecurity is the practice of protecting systems, networks, applications and data from digital threats.",
        },
      ]);
    }

    if (type === "url") {

      setMessages([
        {
          id: 3,
          role: "user",
          text:
            "How can I identify a suspicious URL?",
        },

        {
          id: 4,
          role: "assistant",
          text:
            "Look for suspicious domains, unusual subdomains, misleading characters, unexpected redirects and invalid or suspicious certificates.",
        },
      ]);
    }
  };


  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="sx-ai-page">

      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <aside className="sx-ai-sidebar">

        {/* LOGO */}

        <div className="sx-ai-logo">

          <div className="sx-ai-logo-icon">
            🛡️
          </div>

          <div>
            <h2>SentinelX</h2>
            <span>AI Assistant</span>
          </div>

        </div>


        {/* NEW CHAT */}

        <button
          className="sx-ai-new-chat"
          onClick={startNewChat}
          disabled={loading}
        >
          <span>＋</span>
          New Chat
        </button>


        {/* CHAT HISTORY */}

        <div className="sx-ai-history">

          <div className="sx-ai-history-title">
            Recent Chats
          </div>

          <button
            className="sx-ai-history-item"
            onClick={() =>
              loadPreviousChat(
                "cybersecurity"
              )
            }
          >
            Cybersecurity basics
          </button>

          <button
            className="sx-ai-history-item"
            onClick={() =>
              loadPreviousChat("url")
            }
          >
            URL security analysis
          </button>

        </div>


        {/* SIDEBAR BOTTOM */}

        <div className="sx-ai-sidebar-bottom">

          <button
            onClick={() =>
              navigate("/settings")
            }
          >
            ⚙️ Settings
          </button>

          <button
            onClick={() =>
              navigate("/")
            }
          >
            ← Back to SentinelX
          </button>

        </div>

      </aside>


      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="sx-ai-main">


        {/* HEADER */}

        <header className="sx-ai-header">

          <div>

            <h1>
              SentinelX AI
            </h1>

            <div className="sx-ai-status">

              <span></span>

              {loading
                ? "Thinking..."
                : "Online"}

            </div>

          </div>

        </header>


        {/* ====================================================
            CHAT AREA
        ==================================================== */}

        <section className="sx-ai-chat-area">


          {messages.length === 0 ? (

            <>

              {/* WELCOME */}

              <div className="sx-ai-welcome">

                <div className="sx-ai-big-icon">
                  🛡️
                </div>

                <h1>
                  How can I help you today?
                </h1>

                <p>
                  Your intelligent
                  cybersecurity assistant.
                </p>

              </div>


              {/* QUICK ACTIONS */}

              <div className="sx-ai-actions">


                {/* URL */}

                <button
                  onClick={() =>
                    handleQuickAction(
                      "Analyze this URL for security risks."
                    )
                  }
                  disabled={loading}
                >

                  <div>
                    🔍
                  </div>

                  <span>
                    Analyze a URL
                  </span>

                  <small>
                    Check a website for threats
                  </small>

                </button>


                {/* MALWARE */}

                <button
                  onClick={() =>
                    handleQuickAction(
                      "Explain what malware is and how I can protect my computer."
                    )
                  }
                  disabled={loading}
                >

                  <div>
                    🦠
                  </div>

                  <span>
                    Explain Malware
                  </span>

                  <small>
                    Understand malware threats
                  </small>

                </button>


                {/* SECURITY ADVICE */}

                <button
                  onClick={() =>
                    handleQuickAction(
                      "Give me some important cybersecurity advice."
                    )
                  }
                  disabled={loading}
                >

                  <div>
                    🛡️
                  </div>

                  <span>
                    Security Advice
                  </span>

                  <small>
                    Improve your security
                  </small>

                </button>


                {/* LEARN */}

                <button
                  onClick={() =>
                    handleQuickAction(
                      "Teach me an important cybersecurity concept."
                    )
                  }
                  disabled={loading}
                >

                  <div>
                    💻
                  </div>

                  <span>
                    Learn Cybersecurity
                  </span>

                  <small>
                    Learn security concepts
                  </small>

                </button>

              </div>

            </>

          ) : (

            /* ==================================================
               MESSAGES
            ================================================== */

            <div className="sx-ai-messages">

              {messages.map((message) => (

                <div
                  key={message.id}
                  className={`sx-ai-message ${
                    message.role === "user"
                      ? "sx-ai-user-message"
                      : "sx-ai-assistant-message"
                  }`}
                >

                  <div className="sx-ai-message-icon">

                    {message.role === "user"
                      ? "👤"
                      : "🛡️"}

                  </div>

                  <div className="sx-ai-message-text">

                    {message.text ||
                      (loading &&
                        message.role ===
                          "assistant" &&
                        "SentinelX AI is thinking...")}

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


        {/* ====================================================
            INPUT
        ==================================================== */}

        <footer className="sx-ai-input-section">

          <div className="sx-ai-input">

            <input
              type="text"
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder={
                loading
                  ? "SentinelX AI is thinking..."
                  : "Message SentinelX AI..."
              }
              disabled={loading}
            />

            <button
              onClick={() =>
                sendMessage()
              }
              disabled={
                !input.trim() ||
                loading
              }
              title="Send message"
            >
              ➤
            </button>

          </div>

          <p>
            SentinelX AI can make mistakes.
            Verify important information.
          </p>

        </footer>

      </main>

    </div>
  );
}

export default AIAssistant;