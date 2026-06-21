import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, User, Bot, HelpCircle } from 'lucide-react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export const AIAdvisor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Hello! I am your Eco-Advisor AI. I can guide you to reduce your carbon footprint across transport, home energy, food diet, and waste. What area would you like to focus on today?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getAIResponse = (input: string): string => {
    const text = input.toLowerCase();

    if ((text.includes('car') && !text.includes('carbon')) || text.includes('drive') || text.includes('vehicle') || text.includes('ev') || text.includes('gas') || text.includes('mileage')) {
      return '🚙 **Transportation Tips:**\n1. **Electrify:** Switching to an electric vehicle (EV) reduces driving emissions by up to 80% (depending on clean power grids).\n2. **Public Transit:** Taking a bus or train emits ~80% less CO₂ per km than solo driving a gasoline car.\n3. **Active Transit:** Walk or bike for trips under 3 km. These account for 60% of emissions on short vehicle runs due to cold engines.\n4. **Eco-Driving:** Avoid rapid acceleration and braking to boost gas mileage by 15-30% on highways.';
    }

    if (text.includes('electricity') || text.includes('solar') || text.includes('energy') || text.includes('heat') || text.includes('power') || text.includes('light')) {
      return '⚡ **Home Energy Tips:**\n1. **Thermostat settings:** Lowering heating by 2°C in winter or raising AC by 2°C in summer saves ~300 kg CO₂ annually.\n2. **Clean Tariff:** Contact your utility provider to switch to a 100% renewable electricity tariff. It is often a tiny premium ($5-10/mo) but drops your grid footprint to zero.\n3. **Phantom Power:** Unplug idle electronics (TVs, chargers, stereos). Standby power accounts for 5-10% of household electricity use.\n4. **Heat Pumps:** Upgrading to air-source heat pumps is 3-4x more efficient than gas or oil furnaces.';
    }

    if (text.includes('meat') || text.includes('food') || text.includes('diet') || text.includes('vegan') || text.includes('vegetarian') || text.includes('beef') || text.includes('dairy')) {
      return '🥗 **Dietary Guidelines:**\n1. **Reduce Red Meat:** Producing 1 kg of beef generates ~27 kg CO₂ equivalent, compared to only 0.9 kg for lentils/beans.\n2. **Plant-Based Days:** Swapping beef/pork for plant proteins just 3 days a week cuts your personal food carbon footprint by ~40%.\n3. **Minimize Waste:** Food waste in landfills decays into methane. Plan meals, freeze leftovers, and compost organic scraps.\n4. **Local / Seasonal:** Eating local reduces heavy transport emissions, especially avoiding foods air-freighted from other countries.';
    }

    if (text.includes('recycle') || text.includes('trash') || text.includes('waste') || text.includes('compost') || text.includes('plastic') || text.includes('landfill')) {
      return '♻️ **Circular Waste Guidelines:**\n1. **Composting:** Organic food scraps in landfills release methane. Home or municipal composting breaks it down aerobically, cutting footprint by 90%.\n2. **Zero Single-Use:** Carry reusable bags, travel cups, and water bottles. Plastic production is energy-intensive and petrochemical-based.\n3. **Segregate Scrap:** Properly separate paper, aluminum cans, and plastics. Aluminum recycling uses 95% less energy than raw production.\n4. **Buy Used:** Extend product life cycles by purchasing refurbished electronics and second-hand clothes.';
    }

    if (text.includes('flight') || text.includes('plane') || text.includes('travel') || text.includes('fly') || text.includes('vacation')) {
      return '✈️ **Aviation Guidelines:**\n1. **Avoid Short Flights:** Flights under 500 km have massive emissions relative to distance due to takeoff fuel burn. Choose high-speed rail where possible.\n2. **Economy Seating:** Business/First class seats occupy up to 3x more physical space on a plane, increasing your share of flight footprint.\n3. **Direct Routes:** Layovers increase takeoff and landing cycles, which burn the most fuel. Direct flights are cleaner.\n4. **Carbon Offsetting:** If flying is unavoidable, purchase certified high-quality offsets (Gold Standard or VCS) equivalent to your flight hours.';
    }

    if (text.includes('gcp') || text.includes('deploy') || text.includes('cloud') || text.includes('server')) {
      return '☁️ **GCP Green Hosting Tips:**\n1. **Cloud Run:** Our app uses Cloud Run, which is fully serverless. It scales to zero instances when idle, consuming ZERO compute electricity and preventing wastage.\n2. **Green Regions:** Deploy your GCP resources in carbon-free energy grid regions. For example, GCP regions like `europe-west1` (Belgium), `us-central1` (Iowa), or `europe-west6` (Zurich) have grid carbon-neutral energy commitments of 90%+.';
    }

    return '🌱 **EcoSphere Advisor:**\nI can help you reduce carbon footprints. Ask me specific questions, such as:\n- *"How can I save carbon on driving?"*\n- *"What diet changes help the planet?"*\n- *"Tips for reducing home electricity bills?"*\n- *"Tell me about landfill waste and composting."*\n- *"How do I offset my flight emissions?"*';
  };

  const handleSendMessage = (textToSend = inputText) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate thinking delay
    setTimeout(() => {
      const responseText = getAIResponse(textToSend);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: responseText,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 800);
  };

  const presetQueries = [
    { label: 'Car Emissions Reduction', query: 'How to reduce driving emissions?' },
    { label: 'Eco Energy Tips', query: 'Tips for reducing home electricity carbon' },
    { label: 'Plant-Based Diet Benefit', query: 'How does vegetarian diet save CO2?' },
    { label: 'Composting & Landfills', query: 'Tell me about landfill waste and composting' },
    { label: 'GCP Green Regions', query: 'How can I deploy green on GCP?' },
  ];

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '2rem', height: '620px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '1rem', flexShrink: 0 }}>
        <h2 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <MessageSquare color="var(--primary)" /> AI Eco-Advisor Chatbot
        </h2>
        <p style={{ marginTop: '0.2rem' }}>
          Ask our virtual carbon consultant for tailored advice to lower your daily carbon footprint.
        </p>
      </div>

      <div style={chatInterfaceStyle}>
        {/* Messages Stream */}
        <div style={messageStreamStyle}>
          {messages.map((msg, idx) => (
            <div key={idx} style={messageContainerStyle(msg.sender)}>
              <div style={avatarStyle(msg.sender)}>
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div style={bubbleStyle(msg.sender)}>
                {/* Parse simple markdown lines */}
                {msg.text.split('\n').map((line, lIdx) => {
                  let formattedLine = line;
                  // Handle ** bold matching
                  if (line.startsWith('**') && line.endsWith('**')) {
                    formattedLine = line.replace(/\*\*/g, '');
                    return <strong key={lIdx} style={{ display: 'block', marginBottom: '0.4rem', color: 'white' }}>{formattedLine}</strong>;
                  }
                  
                  // Match bold elements in normal lines
                  const parts = line.split(/(\*\*.*?\*\*)/g);
                  const renderedLine = parts.map((part, pIdx) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={pIdx} style={{ color: 'white' }}>{part.replace(/\*\*/g, '')}</strong>;
                    }
                    return part;
                  });

                  return (
                    <p key={lIdx} style={{ margin: '0.2rem 0', fontSize: '0.9rem', color: msg.sender === 'bot' ? 'rgba(255,255,255,0.9)' : 'white' }}>
                      {renderedLine}
                    </p>
                  );
                })}
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={messageContainerStyle('bot')}>
              <div style={avatarStyle('bot')}>
                <Bot size={16} />
              </div>
              <div style={bubbleStyle('bot')}>
                <div className="typing-dots">
                  <span>.</span><span>.</span><span>.</span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Preset Prompt Buttons */}
        <div style={presetAreaStyle} className="no-print">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <HelpCircle size={12} aria-hidden="true" /> SUGGESTED TOPICS:
          </div>
          <div style={presetButtonsGridStyle} role="group" aria-label="Suggested chat topics">
            {presetQueries.map((p, idx) => (
              <button 
                key={idx} 
                onClick={() => handleSendMessage(p.query)}
                style={presetButtonStyle}
                className="preset-button-item"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div style={inputContainerStyle} className="no-print">
          <input 
            type="text" 
            className="form-input" 
            placeholder="Type a message (e.g. 'How can I save carbon on food?')..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            style={{ borderRadius: '8px 0 0 8px', flex: 1 }}
            aria-label="Ask our virtual carbon consultant"
          />
          <button 
            onClick={() => handleSendMessage()}
            className="btn btn-primary"
            style={{ borderRadius: '0 8px 8px 0', padding: '0 1.25rem' }}
            aria-label="Send message"
          >
            <Send size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Inline Styles
const chatInterfaceStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0, // critical for nested flex overflow scroll
  background: 'rgba(5, 7, 15, 0.4)',
  border: '1px solid var(--border-color)',
  borderRadius: '12px',
  padding: '1rem',
};

const messageStreamStyle: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  paddingRight: '0.5rem',
  marginBottom: '1rem',
};

const messageContainerStyle = (sender: 'user' | 'bot'): React.CSSProperties => ({
  display: 'flex',
  flexDirection: sender === 'user' ? 'row-reverse' : 'row',
  alignItems: 'flex-start',
  gap: '0.75rem',
  maxWidth: '85%',
  alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
});

const avatarStyle = (sender: 'user' | 'bot'): React.CSSProperties => ({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: sender === 'user' ? 'var(--secondary)' : 'var(--primary)',
  color: 'white',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexShrink: 0,
});

const bubbleStyle = (sender: 'user' | 'bot'): React.CSSProperties => ({
  background: sender === 'user' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
  border: `1px solid ${sender === 'user' ? 'rgba(99, 102, 241, 0.4)' : 'var(--border-color)'}`,
  borderRadius: '12px',
  padding: '0.75rem 1rem',
  wordBreak: 'break-word',
});

const presetAreaStyle: React.CSSProperties = {
  borderTop: '1px solid var(--border-color)',
  paddingTop: '0.8rem',
  marginBottom: '0.8rem',
};

const presetButtonsGridStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  flexWrap: 'wrap',
};

const presetButtonStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid var(--border-color)',
  borderRadius: '4px',
  padding: '0.3rem 0.6rem',
  fontSize: '0.75rem',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  outline: 'none',
};

const inputContainerStyle: React.CSSProperties = {
  display: 'flex',
};

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    .typing-dots span {
      animation: blink 1.4s infinite both;
      font-weight: bold;
      font-size: 1.25rem;
    }
    .typing-dots span:nth-child(2) { animation-delay: .2s; }
    .typing-dots span:nth-child(3) { animation-delay: .4s; }
    @keyframes blink {
      0% { opacity: .2; }
      20% { opacity: 1; }
      100% { opacity: .2; }
    }
    .preset-button-item:hover {
      background-color: rgba(16, 185, 129, 0.1) !important;
      border-color: rgba(16, 185, 129, 0.3) !important;
      color: white !important;
    }
  `;
  document.head.appendChild(style);
}
