import React, { useState } from "react";

const cannedReplies = [
  "I can help with enrollment status, student counts, and course availability.",
  "Try asking about pending approvals or open slots.",
  "The registrar team is reviewing the latest submissions.",
];

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "bot",
      text: "Hi! Ask me about enrollment updates or student status.",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = {
      id: Date.now(),
      role: "user",
      text: input.trim(),
    };
    const reply = {
      id: Date.now() + 1,
      role: "bot",
      text: cannedReplies[Math.floor(Math.random() * cannedReplies.length)],
    };
    setMessages((prev) => [...prev, userMessage, reply]);
    setInput("");
  };

  return (
    <section className="widget-card chatbot">
      <div className="widget-header">
        <p>Enrollment Assistant</p>
        <span>Prototype chatbot</span>
      </div>
      <div className="chat-body">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-bubble ${message.role === "user" ? "user" : "bot"}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask about enrollment..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button className="primary-btn" type="button" onClick={handleSend}>
          Send
        </button>
      </div>
    </section>
  );
}

export default Chatbot;
