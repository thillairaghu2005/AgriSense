import { useState, useRef, useEffect } from 'react';
import { Card, PageHeader, InfoBanner } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Bot, Send, Trash2, User, Mic, MicOff, Volume2, AlertCircle } from 'lucide-react';
import { useApp } from '@/app/providers';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SIMULATED_RESPONSES: Record<string, string> = {
  default: "Thank you for asking. As a simulated farming assistant, I offer preliminary agronomic guidance aligned with ICAR and KVK standards. For farm-specific chemical or financial actions, always cross-verify with your local Block Agricultural Officer.",
  kharif: "Kharif season commences with the southwest monsoon (June–July) and is harvested around October–November. Key Kharif crops include Paddy (Rice), Cotton, Maize, Groundnut, Soyabean, and Bajra. Ensure field bunds are prepared and seed treatment with Trichoderma or Thiram is completed before sowing.",
  rabi: "Rabi season crops are sown in autumn (October–December) and harvested in spring (March–April). Major Rabi crops include Wheat, Mustard, Gram (Chickpea), Barley, and Peas. They depend heavily on soil residual moisture and winter irrigation cycles.",
  fertiliser: "Basal fertiliser application is best guided by certified Soil Health Cards. For cereals like Paddy and Wheat, apply 100% of Phosphorus (DAP) and 50% Potash (MOP) as basal. Split Nitrogen (Urea) into 2 to 3 doses to minimize leaching into groundwater.",
  disease: "For crop disease control, practice Integrated Pest Management (IPM). First scout for early symptoms (leaf lesions, wilting). For fungal diseases like Blast or Blight, apply bio-fungicides like Trichoderma or consult your local extension office for approved systemic fungicides before flowering.",
  water: "Micro-irrigation (Drip and Sprinkler) saves 40–60% water and is subsidized up to 55–80% under the PM Krishi Sinchayee Yojana (PMKSY). For paddy, adopt Alternate Wetting and Drying (AWD) using a field water tube to conserve canal water.",
  scheme: "Major farmer welfare schemes include: PM-KISAN (₹6,000/year direct income support), PM Fasal Bima Yojana (comprehensive crop insurance at 1.5–2% premium), and Kisan Credit Card (concessional crop loans up to ₹3 lakh at 4% effective interest).",
  soil: "Soil health is built on organic carbon (> 0.75%) and balanced pH (6.2–7.5). Incorporate 4–5 tonnes of compost or farmyard manure (FYM) per acre, practice green manuring with Dhaincha or Sunn hemp, and test your soil every 2 years.",
  msp: "Minimum Support Price (MSP) is guaranteed by the Government of India through CCEA for 23 mandated crops (including Paddy, Wheat, Cotton, Mustard, and Pulses). Procurement centers operate at APMC mandis during seasonal harvest windows.",
  rice: "For Paddy (Rice), maintain 2–3 cm standing water post-transplanting. Critical water stages are Tillering (20–25 DAS) and Panicle Initiation (65–70 DAS). Watch for Leaf Folder and Stem Borer; set up light traps for pest monitoring.",
  wheat: "For Wheat, timely sowing in November is essential to avoid terminal heat stress in March. The most critical irrigation is at Crown Root Initiation (CRI, 21–25 days after sowing). Apply 1st top dressing of urea immediately after 1st irrigation.",
  cotton: "For Cotton, monitor for Pink Bollworm from 45 DAS onwards using pheromone traps (5 traps/acre). Avoid excessive urea which causes lush vegetative growth attracting sucking pests like jassids and whiteflies.",
};

function createMessage(id: string, role: 'user' | 'assistant', content: string): Message {
  return { id, role, content, timestamp: new Date() };
}

export default function AssistantPage() {
  const { profile, state, t } = useApp();
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello ${profile.displayName}! I am your simulated farming digital assistant. You can ask me questions about crop management, government schemes, soil health, and weather advice in ${state.toUpperCase()}. How can I assist your farm today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const msgCountRef = useRef(1);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  function getResponse(userMessage: string): string {
    const lower = userMessage.toLowerCase();
    if (lower.includes('rice') || lower.includes('paddy') || lower.includes('dhan')) return SIMULATED_RESPONSES.rice;
    if (lower.includes('wheat') || lower.includes('gehun')) return SIMULATED_RESPONSES.wheat;
    if (lower.includes('cotton') || lower.includes('kapas')) return SIMULATED_RESPONSES.cotton;
    if (lower.includes('kharif')) return SIMULATED_RESPONSES.kharif;
    if (lower.includes('rabi')) return SIMULATED_RESPONSES.rabi;
    if (lower.includes('fertiliser') || lower.includes('fertilizer') || lower.includes('urea') || lower.includes('dap')) return SIMULATED_RESPONSES.fertiliser;
    if (lower.includes('disease') || lower.includes('pest') || lower.includes('blight') || lower.includes('worm')) return SIMULATED_RESPONSES.disease;
    if (lower.includes('water') || lower.includes('drip') || lower.includes('irrigation')) return SIMULATED_RESPONSES.water;
    if (lower.includes('scheme') || lower.includes('kisan') || lower.includes('subsidy') || lower.includes('pmkisan')) return SIMULATED_RESPONSES.scheme;
    if (lower.includes('soil') || lower.includes('ph') || lower.includes('carbon') || lower.includes('compost')) return SIMULATED_RESPONSES.soil;
    if (lower.includes('msp') || lower.includes('support price') || lower.includes('mandi')) return SIMULATED_RESPONSES.msp;
    return SIMULATED_RESPONSES.default;
  }

  function sendMessage(text: string) {
    if (!text.trim()) return;
    msgCountRef.current += 1;
    const count = msgCountRef.current;
    const userMsg = createMessage(`u-${count}`, 'user', text);
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(text);
      const assistantMsg = createMessage(`a-${count}`, 'assistant', response);
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 800);
  }

  // Speech-to-Text handler
  function toggleSpeechRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = profile.preferredLanguage === 'hi' ? 'hi-IN' : profile.preferredLanguage === 'ta' ? 'ta-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        sendMessage(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  }

  // Text-to-Speech handler
  function speakMessage(id: string, text: string) {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = profile.preferredLanguage === 'hi' ? 'hi-IN' : profile.preferredLanguage === 'ta' ? 'ta-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  }

  function clearHistory() {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: 'Conversation history cleared. How can I help your farm today?',
        timestamp: new Date(),
      },
    ]);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }

  const suggestions = [
    'How much fertiliser dose for Paddy?',
    'What are the key benefits of PM-KISAN & KCC?',
    'How to save water with drip irrigation subsidies?',
    'How to control Pink Bollworm in Cotton?',
    'What is the current MSP purchase process?',
    'How to improve soil organic carbon naturally?',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[760px] animate-fade-in">
      <div className="mb-3">
        <PageHeader
          title={t('assistant.title')}
          subtitle="Voice-enabled agricultural digital assistant with simulated domain knowledge"
          actions={
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Trash2 className="w-4 h-4" />}
              onClick={clearHistory}
            >
              Clear
            </Button>
          }
        />
        <InfoBanner variant="warning">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-neutral-700 flex-shrink-0 mt-0.5" />
            <span>{t('assistant.disclaimer')}</span>
          </div>
        </InfoBanner>
      </div>

      {/* Chat Messages Container */}
      <Card className="flex-1 overflow-y-auto p-4 space-y-4 mb-3 bg-white border border-[var(--color-border)] shadow-xs">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-2xl ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {msg.role === 'user' ? (
                <div className="w-7 h-7 rounded-full bg-[var(--color-primary-100)] border border-[var(--color-primary-300)] flex items-center justify-center text-[var(--color-primary-800)] shadow-xs">
                  <User className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[var(--color-primary-600)] shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}
            </div>

            <div
              className={`p-3.5 rounded-lg text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[var(--color-primary-700)] text-white shadow-xs'
                  : 'bg-[var(--color-surface-1)] text-[var(--color-text-primary)] border border-[var(--color-border)] shadow-xs'
              }`}
            >
              <p>{msg.content}</p>
              <div
                className={`flex items-center justify-between gap-2 mt-2 pt-1 border-t ${
                  msg.role === 'user'
                    ? 'border-white/20 text-white/80'
                    : 'border-[var(--color-border)] text-[var(--color-text-muted)]'
                } text-[10px]`}
              >
                <span>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => speakMessage(msg.id, msg.content)}
                    className="inline-flex items-center gap-1 hover:text-[var(--color-primary-700)] transition-colors p-0.5 cursor-pointer"
                    aria-label="Listen to message audio"
                    title="Listen to response"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-[var(--color-primary-700)]" />
                    <span>{speakingId === msg.id ? 'Playing…' : 'Listen'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 max-w-xs">
            <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[var(--color-primary-600)] shadow-xs shrink-0 mt-0.5">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[var(--color-surface-1)] border border-[var(--color-border)] p-3 rounded-lg text-xs text-[var(--color-text-muted)] flex items-center shadow-xs">
              <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">Preparing agricultural guidance…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </Card>

      {/* Contextual Suggestion Chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none">
        {suggestions.map(s => (
          <button
            key={s}
            onClick={() => sendMessage(s)}
            className="text-[11px] px-3 py-1.5 rounded-md bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)] shadow-xs whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
          >
            <span>{s}</span>
          </button>
        ))}
      </div>

      {/* Input Bar with Voice Microphone */}
      <div className="flex items-center gap-2 bg-white p-2 border border-[var(--color-border)] rounded-lg shadow-xs focus-within:border-[var(--color-primary-600)] transition-all">
        <button
          type="button"
          onClick={toggleSpeechRecognition}
          className={`flex items-center justify-center w-9 h-9 rounded-md cursor-pointer transition-all ${
            isListening
              ? 'bg-[var(--color-primary-600)] text-white shadow-xs'
              : 'bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-3)] hover:text-[var(--color-text-primary)]'
          }`}
          aria-label={isListening ? 'Stop listening' : 'Start speaking'}
          title={isListening ? 'Listening… click to stop' : 'Speak your question'}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-neutral-700" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') sendMessage(input);
          }}
          placeholder={isListening ? 'Listening… speak now' : t('assistant.placeholder')}
          className="flex-1 text-xs sm:text-sm px-3 py-2 outline-none text-[var(--color-text-primary)] bg-transparent placeholder-[var(--color-text-muted)]"
          aria-label="Ask farming question"
        />

        <Button
          variant="primary"
          size="sm"
          onClick={() => sendMessage(input)}
          disabled={!input.trim()}
          leftIcon={<Send className="w-3.5 h-3.5" />}
        >
          {t('assistant.send')}
        </Button>
      </div>
    </div>
  );
}
