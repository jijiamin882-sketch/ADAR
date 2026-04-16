import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FiZap, FiSend, FiX } from 'react-icons/fi';
import './AiChat.css';

// ==========================================
// ضعي مفتاح OpenRouter الذي نسخته هنا
// ==========================================
const API_KEY = "AIzaSyAyWkc9yam33lPS5bnL7o_tbkUFKvjj-Gw"; 

export default function AiChat({ onClose }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const userMsg = { text: input, sender: 'user' };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      // الاتصال بخوادم OpenRouter (التي تعمل في الجزائر وتستخدم Gemini)
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}` // المفتاح يوضع هنا في الهيدر
        },
        body: JSON.stringify({
          model: "google/gemini-flash-1.5", // نحن نستخدم ذكاء جوجل لكن عبر OpenRouter
          messages: [
            { role: "system", content: "أنت مساعد عقاري ذكي لموقع عقارات. تجيب بأسلوب احترافي ومختصر باللغة العربية فقط." },
            { role: "user", content: input }
          ]
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "خطأ في الاتصال");
      }

      // استخراج الرد
      const aiText = data.choices[0].message.content;
      setMessages([...updatedMessages, { text: aiText, sender: 'ai' }]);

    } catch (error) {
      alert("خطأ: " + error.message);
      setMessages([...updatedMessages, { text: "عذراً، حدث خطأ.", sender: 'ai' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return createPortal(
    <div className="ai-overlay">
      <div className="ai-chat-box">

        <div className="ai-header">
          <div className="ai-header-content">
            <div className="ai-icon-wrapper">
              <FiZap color="#161c24" size={20} />
            </div>
            <div className="ai-title-group">
              <span className="ai-title">المساعد العقاري الذكي</span>
              <span className="ai-status">متصل الآن</span>
            </div>
          </div>
          <FiX className="ai-close-btn" onClick={onClose} />
        </div>

        <div className="ai-messages-container">
          {messages.length === 0 ? (
            <div className="ai-welcome-section">
              <div className="ai-welcome-icon">🏠</div>
              <p className="ai-welcome-text">مرحباً بك. يمكنني مساعدتك في البحث عن عقارات أو الاستفسارات.</p>
              <div className="ai-suggestions">
                <button className="ai-suggestion-btn" onClick={() => setInput('أبحث عن شقة في الجزائر')}>شقق في الجزائر</button>
                <button className="ai-suggestion-btn" onClick={() => setInput('ما أفضل الأحياء للاستثمار؟')}>أفضل أحياء استثمارية</button>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <div key={index} className={msg.sender === 'user' ? 'user-message' : 'ai-message'}>
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              )}
            </>
          )}
        </div>

        <form className="ai-input-area" onSubmit={handleSend}>
          <div className="ai-input-wrapper">
            <input 
              type="text" 
              className="ai-input-field"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب سؤالك هنا..." 
            />
            <button type="submit" className="ai-send-btn">
              <FiSend color="#161c24" size={18} />
            </button>
          </div>
        </form>

      </div>
    </div>,
    document.body
  );
}