import { useEffect, useMemo, useState } from 'react';
import '../assets/CSS/Chatbot.css';

const FAQS = [
  {
    question: 'How do I report an incident?',
    answer: 'Go to Incidents and fill the report form. Add location and submit to generate a PDF.'
  },
  {
    question: 'How can I request help?',
    answer: 'Use the Need Help button on Home or Volunteer page, add location and phone, then submit.'
  },
  {
    question: 'How do I join as a volunteer?',
    answer: 'Open Volunteer page, fill name, phone, skills, and GPS location, then submit.'
  },
  {
    question: 'Where are emergency contacts?',
    answer: 'On the Home page under Emergency Contacts.'
  }
];

const formatDateTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
};

const Chatbot = () => {
  const apiBase = process.env.REACT_APP_API_URL || (
    typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:5000'
      : 'https://helpconnect-dms.onrender.com'
  );
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I can help with incidents, contacts, and help requests. Ask me anything.' }
  ]);
  const [contacts, setContacts] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [helpRequests, setHelpRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const quickQuestions = useMemo(() => FAQS.map((item) => item.question), []);

  useEffect(() => {
    if (!open) return;
    let isActive = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [contactsRes, incidentsRes, helpRes] = await Promise.all([
          fetch(`${apiBase}/contacts`),
          fetch(`${apiBase}/incident`),
          fetch(`${apiBase}/api/help-requests`)
        ]);
        const contactsData = await contactsRes.json();
        const incidentsData = await incidentsRes.json();
        const helpData = await helpRes.json();
        if (!isActive) return;
        setContacts(Array.isArray(contactsData?.contacts) ? contactsData.contacts : []);
        setIncidents(Array.isArray(incidentsData?.incidents) ? incidentsData.incidents : []);
        setHelpRequests(Array.isArray(helpData?.requests) ? helpData.requests : []);
      } catch (error) {
        if (isActive) {
          setMessages((prev) => [...prev, { role: 'bot', text: 'I could not load live data right now.' }]);
        }
      } finally {
        if (isActive) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isActive = false;
    };
  }, [open]);

  const getContactReply = () => {
    if (!contacts.length) return 'No emergency contacts found yet.';
    const top = contacts.slice(0, 3).map((c) => `${c.name} (${c.designation}) - ${c.phone}`).join('\n');
    return `Here are emergency contacts:\n${top}`;
  };

  const getIncidentReply = () => {
    if (!incidents.length) return 'No incidents are available right now.';
    const top = incidents.slice(0, 3).map((item) => {
      const date = item.DateReported ? String(item.DateReported).split('T')[0] : 'N/A';
      return `${item.IncidentType || 'Incident'} at ${item.IncidentLocation || 'Unknown'} (${date})`;
    }).join('\n');
    return `Recent incidents:\n${top}`;
  };

  const getHelpReply = () => {
    if (!helpRequests.length) return 'No active help requests right now.';
    const top = helpRequests.slice(0, 3).map((item) => {
      const when = formatDateTime(item.createdAt);
      return `${item.type} request - ${item.status} (${when})`;
    }).join('\n');
    return `Active help requests:\n${top}`;
  };

  const matchFaq = (text) => {
    const faq = FAQS.find((item) => text.includes(item.question.toLowerCase()));
    return faq ? faq.answer : '';
  };

  const buildReply = (text) => {
    const normalized = text.toLowerCase();
    if (normalized.includes('contact')) return getContactReply();
    if (normalized.includes('incident')) return getIncidentReply();
    if (normalized.includes('help request') || normalized.includes('help')) return getHelpReply();
    if (normalized.includes('volunteer')) return 'You can join via the Volunteer page and add your GPS location.';
    const faqAnswer = matchFaq(normalized);
    if (faqAnswer) return faqAnswer;
    return 'I can help with incidents, contacts, volunteers, and help requests. Try: contacts, incidents, or help requests.';
  };

  const sendMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    const reply = buildReply(trimmed);
    setMessages((prev) => [...prev, { role: 'bot', text: reply }]);
    setInput('');
  };

  return (
    <div className="chatbot">
      <button type="button" className="chatbot-launcher" onClick={() => setOpen((prev) => !prev)}>
        {open ? '×' : '💬'}
      </button>
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div>
              <h4>Disaster Help Bot</h4>
              <p>Ask about incidents, contacts, or help.</p>
            </div>
            <button type="button" className="ghost" onClick={() => setOpen(false)}>Close</button>
          </div>
          <div className="chatbot-body">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`chatbot-bubble ${message.role}`}>
                {message.text.split('\n').map((line, i) => (
                  <div key={`${index}-${i}`}>{line}</div>
                ))}
              </div>
            ))}
            {loading && <div className="chatbot-bubble bot">Loading latest info...</div>}
          </div>
          <div className="chatbot-quick">
            {quickQuestions.map((question) => (
              <button key={question} type="button" className="chip" onClick={() => sendMessage(question)}>
                {question}
              </button>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type your question..."
              onKeyDown={(event) => {
                if (event.key === 'Enter') sendMessage(input);
              }}
            />
            <button type="button" className="primary" onClick={() => sendMessage(input)}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
