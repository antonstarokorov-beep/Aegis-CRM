/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, addDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { 
  LayoutDashboard, FileText, CreditCard, Scale, Bell, Search, Plus, 
  FileSignature, Eye, EyeOff, ChevronLeft, Printer, TrendingUp, 
  AlertCircle, CheckCircle2, Wallet, UploadCloud, FileSpreadsheet, 
  MessageCircle, PhoneCall, ArrowRight, Ban, ScanFace, ShieldCheck, 
  UserCircle, BarChart3, CalendarClock, MailOpen, Lock, Server, 
  Shield, Users, MessageSquare, Phone, Send, Bot 
} from 'lucide-react';

// ==========================================
// ГЛОБАЛЬНЫЕ НАСТРОЙКИ (Безопасное извлечение)
// ==========================================
const getGlobalConfig = () => {
  try {
    return {
      firebase: typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null,
      appId: typeof __app_id !== 'undefined' ? __app_id : 'default-app-id',
      token: typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null
    };
  } catch (e) {
    return { firebase: null, appId: 'default-app-id', token: null };
  }
};

const config = getGlobalConfig();
const app = config.firebase ? initializeApp(config.firebase) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;

// ==========================================
// ЛОГОТИП С FALLBACK
// ==========================================
const AegisLogo = ({ size = 'large' }) => {
  const [imgError, setImgError] = useState(false);
  if (!imgError) {
    return (
      <img 
        src="logo-a-1.png" 
        alt="ИДЖИС" 
        className={`${size === 'large' ? 'h-20 mb-4' : 'h-10'} mx-auto object-contain transition-all`}
        onError={() => setImgError(true)} 
      />
    );
  }
  return (
    <div className={`flex items-center justify-center gap-3 ${size === 'large' ? 'mb-2 mt-4' : ''}`}>
      <div className="relative flex items-center justify-center">
        <Shield className="text-[#1a2b4c]" size={size === 'large' ? 46 : 32} strokeWidth={2} fill="#eab308" />
        <Scale className="absolute text-[#1a2b4c]" size={size === 'large' ? 24 : 16} strokeWidth={2.5} />
      </div>
      <div className="flex flex-col items-start leading-none text-left">
        <span className={`${size === 'large' ? 'text-4xl' : 'text-2xl'} font-black text-[#1a2b4c] tracking-widest uppercase`}>ИДЖИС</span>
        <span className={`${size === 'large' ? 'text-[11px]' : 'text-[8px]'} font-bold text-slate-500 uppercase tracking-[0.25em] mt-1.5`}>Правовая защита</span>
      </div>
    </div>
  );
};

// ==========================================
// ОСНОВНОЙ КОМПОНЕНТ
// ==========================================
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState('admin');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      if (config.token) {
        await signInWithCustomToken(auth, config.token).catch(() => signInAnonymously(auth));
      } else {
        await signInAnonymously(auth);
      }
    };
    initAuth();
    return onAuthStateChanged(auth, setUser);
  }, []);

  // Мок-данные для таблиц
  const [contracts] = useState([
    { id: '1411-ФЛ', date: '2024-11-01', clientName: 'Иванов Иван Иванович', phone: '+7 (999) 111-22-33', status: 'Активен', nextPaymentDate: '2025-03-05', monthlyPayment: 20000, currentMonthPaid: 0, totalAmount: 200000, paidAmount: 80000 },
    { id: '1414-ФЛ', date: '2024-12-10', clientName: 'Петров Петр Петрович', phone: '+7 (905) 123-45-67', status: 'Активен', nextPaymentDate: '2025-02-28', monthlyPayment: 25000, currentMonthPaid: 10000, totalAmount: 245000, paidAmount: 50000 }
  ]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-8">
          <AegisLogo size="large" />
          <div className="space-y-4 mt-6">
            <input type="text" defaultValue="admin@aegis.ru" className="w-full p-3 bg-slate-50 border rounded-lg outline-none" placeholder="Логин" />
            <input type="password" defaultValue="********" className="w-full p-3 bg-slate-50 border rounded-lg outline-none" placeholder="Пароль" />
            <button onClick={() => setIsAuthenticated(true)} className="w-full bg-[#1a2b4c] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2">
              Войти в систему <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <aside className="w-64 bg-[#1a2b4c] text-slate-300 flex flex-col shadow-xl shrink-0">
        <div className="h-16 flex items-center justify-center bg-white border-b border-slate-200"><AegisLogo size="small" /></div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Рабочий стол" active={activeTab==='dashboard'} onClick={()=>setActiveTab('dashboard')} />
          <NavItem icon={<MessageSquare size={20}/>} label="Чаты ИИ (Лиды)" active={activeTab==='chats'} onClick={()=>setActiveTab('chats')} />
          <NavItem icon={<FileText size={20}/>} label="Договоры" active={activeTab==='contracts'} onClick={()=>setActiveTab('contracts')} />
        </nav>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
            {activeTab === 'dashboard' ? 'Сводка' : activeTab === 'chats' ? 'Telegram Лиды' : 'Договоры'}
          </h1>
        </header>
        <div className="flex-1 overflow-y-auto relative">
          {activeTab === 'dashboard' && <Dashboard overdue={contracts} />}
          {activeTab === 'chats' && <ChatModule db={db} appId={config.appId} user={user} />}
        </div>
      </main>
    </div>
  );
}

// ==========================================
// МОДУЛЬ ЧАТОВ
// ==========================================
function ChatModule({ db, appId, user }) {
  const [leads, setLeads] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    if (!db || !user) return;
    const qLeads = collection(db, 'artifacts', appId, 'public', 'data', 'leads');
    const qMsgs = collection(db, 'artifacts', appId, 'public', 'data', 'messages');

    const unsubL = onSnapshot(qLeads, (s) => setLeads(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubM = onSnapshot(qMsgs, (s) => setMessages(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    return () => { unsubL(); unsubM(); };
  }, [db, appId, user]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, selectedId]);

  const activeMessages = messages
    .filter(m => m.chatId === selectedId)
    .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedId) return;
    const text = input; setInput('');
    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'leads', selectedId), { status: 'operator_active' });
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'messages'), {
      chatId: selectedId, sender: 'operator', text, timestamp: Date.now()
    });
  };

  return (
    <div className="absolute inset-0 p-6 flex gap-6">
      <div className="w-80 bg-white border rounded-xl overflow-hidden flex flex-col shadow-sm">
        <div className="p-4 bg-slate-800 text-white font-bold text-xs uppercase tracking-widest">Список диалогов</div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {leads.map(l => (
            <div key={l.id} onClick={() => setSelectedId(l.id)} className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedId === l.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-slate-50'}`}>
              <div className="font-bold text-sm text-slate-800">{l.name || 'Клиент'}</div>
              <div className="text-[10px] text-slate-500 mt-1 uppercase font-bold">{l.status === 'operator_active' ? '● В работе' : '○ ИИ'}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 bg-white border rounded-xl flex flex-col shadow-sm overflow-hidden">
        {selectedId ? (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeMessages.map(m => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${m.sender === 'user' ? 'bg-slate-100 text-slate-800' : 'bg-blue-600 text-white'}`}>
                    <div className="text-[10px] opacity-60 mb-1 font-bold">{m.sender === 'user' ? 'КЛИЕНТ' : 'МЕНЕДЖЕР'}</div>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <form onSubmit={sendMessage} className="p-4 border-t flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} className="flex-1 p-3 bg-slate-50 border rounded-xl outline-none" placeholder="Введите ответ..." />
              <button className="bg-blue-600 text-white p-3 rounded-xl"><Send size={20}/></button>
            </form>
          </>
        ) : <div className="flex-1 flex items-center justify-center text-slate-400">Выберите чат для начала работы</div>}
      </div>
    </div>
  );
}

// Вспомогательные компоненты
function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800'}`}>
      {icon} <span>{label}</span>
    </button>
  );
}

function Dashboard({ overdue }) {
  return (
    <div className="p-8 space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm"><div className="text-slate-500 text-xs font-bold uppercase mb-2">Новых лидов за сегодня</div><div className="text-3xl font-black text-blue-600">12</div></div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm"><div className="text-slate-500 text-xs font-bold uppercase mb-2">Ожидают ответа</div><div className="text-3xl font-black text-amber-500">3</div></div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm"><div className="text-slate-500 text-xs font-bold uppercase mb-2">Сумма в работе</div><div className="text-3xl font-black text-slate-800">450 000 ₽</div></div>
      </div>
    </div>
  );
}