/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, addDoc, updateDoc } from 'firebase/firestore';
import { 
  LayoutDashboard, FileText, CreditCard, Scale, Bell, Search, Plus, 
  FileSignature, Eye, EyeOff, ChevronLeft, Printer, TrendingUp, 
  AlertCircle, CheckCircle2, Wallet, UploadCloud, FileSpreadsheet, 
  PhoneCall, ArrowRight, Ban, ScanFace, ShieldCheck, 
  UserCircle, BarChart3, CalendarClock, MailOpen, Lock, Server, 
  Shield, Users, MessageSquare, Phone, Send, Bot 
} from 'lucide-react';

// ==========================================
// БЕЗОПАСНАЯ КОНФИГУРАЦИЯ (для Vercel Build)
// ==========================================
const getFirebaseConfig = () => {
  try {
    // Если мы в Canvas, берем из глобальной переменной
    if (typeof __firebase_config !== 'undefined') return JSON.parse(__firebase_config);
  } catch (e) { console.warn("Firebase config not found, using empty"); }
  return null;
};

const firebaseConfig = getFirebaseConfig();
const appId = typeof __app_id !== 'undefined' ? __app_id : 'aegis-crm-prod';
const app = firebaseConfig ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;

// ==========================================
// КОМПОНЕНТ ЛОГОТИПА
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
// ГЛАВНЫЙ ЭКРАН (App)
// ==========================================
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState('admin');
  const [fbUser, setFbUser] = useState(null);

  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (e) { /* silent fail for build */ }
    };
    initAuth();
    return onAuthStateChanged(auth, setFbUser);
  }, []);

  // Состояние данных
  const [contracts, setContracts] = useState([
    { id: '1411-ФЛ', date: '2024-11-01', clientName: 'Иванов Иван Иванович', phone: '+7 (999) 111-22-33', status: 'Активен', nextPaymentDate: '2025-03-05', totalAmount: 200000, paidAmount: 80000, monthlyPayment: 20000, currentMonthPaid: 0 },
    { id: '1414-ФЛ', date: '2024-12-10', clientName: 'Петров Петр Петрович', phone: '+7 (905) 123-45-67', status: 'Активен', nextPaymentDate: '2025-02-28', totalAmount: 245000, paidAmount: 50000, monthlyPayment: 25000, currentMonthPaid: 10000 }
  ]);
  const [paymentsHistory, setPaymentsHistory] = useState([]);
  const [auCases, setAuCases] = useState([]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-8 text-center">
          <AegisLogo size="large" />
          <div className="space-y-4 mt-8">
            <input type="text" defaultValue="admin@aegis.ru" className="w-full p-3 bg-slate-50 border rounded-lg outline-none focus:ring-2 focus:ring-[#1a2b4c]" placeholder="Логин" />
            <input type="password" defaultValue="********" className="w-full p-3 bg-slate-50 border rounded-lg outline-none focus:ring-2 focus:ring-[#1a2b4c]" placeholder="Пароль" />
            <button onClick={() => setIsAuthenticated(true)} className="w-full bg-[#1a2b4c] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#111e36] transition-colors">
              Войти в систему <ArrowRight size={18} />
            </button>
          </div>
          <div className="mt-6 text-[10px] text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <ShieldCheck size={12} /> Encrypted Database Access
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <aside className="w-64 bg-[#1a2b4c] text-slate-300 flex flex-col shadow-xl shrink-0">
        <div className="h-16 flex items-center justify-center bg-white border-b border-slate-200"><AegisLogo size="small" /></div>
        <nav className="flex-1 p-4 space-y-1">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Рабочий стол" active={activeTab==='dashboard'} onClick={()=>setActiveTab('dashboard')} />
          <NavItem icon={<MessageSquare size={20}/>} label="Чаты ИИ (Лиды)" active={activeTab==='chats'} onClick={()=>setActiveTab('chats')} />
          <NavItem icon={<FileText size={20}/>} label="Договоры" active={activeTab==='contracts'} onClick={()=>setActiveTab('contracts')} />
          <NavItem icon={<CreditCard size={20}/>} label="Оплаты" active={activeTab==='payments'} onClick={()=>setActiveTab('payments')} />
          <div className="pt-4 pb-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Арбитраж</div>
          <NavItem icon={<Scale size={20}/>} label="Вознаграждения АУ" active={activeTab==='au'} onClick={()=>setActiveTab('au')} />
        </nav>
        <div className="p-4 border-t border-slate-700/50 bg-[#111e36]">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-[#1a2b4c] font-black text-xs">АБ</div>
             <div className="text-xs">
                <div className="font-bold text-white">Старокоров А.Б.</div>
                <div className="text-slate-400 uppercase text-[9px] tracking-tighter">Администратор</div>
             </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm shrink-0">
          <h1 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
            {activeTab === 'dashboard' ? 'Аналитическая сводка' : activeTab === 'chats' ? 'Входящие Telegram Лиды' : 'Реестр документов'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="bg-slate-100 p-2 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"><Bell size={20}/></div>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <button onClick={() => setIsAuthenticated(false)} className="text-xs font-bold text-red-500 hover:text-red-700 uppercase">Выход</button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto relative bg-slate-50">
          {activeTab === 'dashboard' && <DashboardModule contracts={contracts} />}
          {activeTab === 'chats' && <ChatModule db={db} appId={appId} user={fbUser} />}
          {activeTab === 'contracts' && <ContractsModule contracts={contracts} setContracts={setContracts} />}
          {activeTab === 'payments' && <PaymentsModule contracts={contracts} setContracts={setContracts} history={paymentsHistory} setHistory={setPaymentsHistory} />}
          {activeTab === 'au' && <AuModule cases={auCases} setCases={setAuCases} />}
        </div>
      </main>
    </div>
  );
}

// ==========================================
// МОДУЛЬ ЧАТОВ (СИНХРОНИЗАЦИЯ С ТГ-БОТОМ)
// ==========================================
function ChatModule({ db, appId, user }) {
  const [leads, setLeads] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    if (!db || !user) return;
    const lRef = collection(db, 'artifacts', appId, 'public', 'data', 'leads');
    const mRef = collection(db, 'artifacts', appId, 'public', 'data', 'messages');

    const unsubL = onSnapshot(lRef, (s) => setLeads(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubM = onSnapshot(mRef, (s) => setMessages(s.docs.map(d => ({ id: d.id, ...d.data() }))));

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

  const activeLead = leads.find(l => l.id === selectedId);

  return (
    <div className="absolute inset-0 p-6 flex gap-6">
      <div className="w-80 bg-white border rounded-xl overflow-hidden flex flex-col shadow-sm">
        <div className="p-4 bg-[#1a2b4c] text-white font-bold text-[10px] uppercase tracking-widest flex items-center justify-between">
          <span>Список диалогов</span>
          <span className="bg-blue-500 px-1.5 rounded-sm">{leads.length}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {leads.map(l => (
            <div key={l.id} onClick={() => setSelectedId(l.id)} className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedId === l.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-slate-50 border-transparent'}`}>
              <div className="font-bold text-sm text-slate-800 truncate pr-4">{l.name || 'Клиент'}</div>
              <div className="flex justify-between items-center mt-1">
                <div className="text-[9px] text-slate-400 font-bold uppercase">@{l.username || 'user'}</div>
                <div className={`w-2 h-2 rounded-full ${l.status === 'operator_active' ? 'bg-green-500' : 'bg-amber-400 animate-pulse'}`}></div>
              </div>
            </div>
          ))}
          {leads.length === 0 && <div className="p-8 text-center text-xs text-slate-400 italic">Диалогов пока нет...</div>}
        </div>
      </div>
      
      <div className="flex-1 bg-white border rounded-xl flex flex-col shadow-sm overflow-hidden">
        {selectedId ? (
          <>
            <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
               <div className="font-bold text-slate-800">{activeLead?.name} <span className="text-slate-400 font-normal ml-2">ID: {selectedId}</span></div>
               {activeLead?.phone && <div className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 flex items-center gap-2"><Phone size={14}/> {activeLead.phone}</div>}
            </div>
            
            {activeLead?.summary && (
              <div className="mx-6 mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 leading-relaxed shadow-inner">
                <div className="font-black mb-1 flex items-center gap-2 uppercase tracking-tighter"><Bot size={14}/> Резюме диалога от ИИ:</div>
                {activeLead.summary}
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {activeMessages.map(m => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[75%] p-3 rounded-2xl text-[13px] leading-snug shadow-sm ${m.sender === 'user' ? 'bg-white border text-slate-800 rounded-bl-none' : 'bg-[#1a2b4c] text-white rounded-br-none'}`}>
                    <div className="text-[9px] opacity-50 mb-1 font-black uppercase tracking-tighter">{m.sender === 'user' ? 'КЛИЕНТ' : m.sender === 'operator' ? 'ВЫ (ЮРИСТ)' : 'AI АССИСТЕНТ'}</div>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            
            <form onSubmit={sendMessage} className="p-4 border-t bg-slate-50 flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} className="flex-1 p-3 bg-white border rounded-xl outline-none shadow-sm focus:border-blue-500 transition-all text-sm" placeholder="Введите ваш ответ для отправки в Telegram..." />
              <button className="bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-md"><Send size={20}/></button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
            <MessageSquare size={64} className="mb-4 opacity-10" />
            <div className="text-lg font-bold">Выберите диалог</div>
            <div className="text-sm">Контролируйте общение ИИ с лидами</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ
// ==========================================
function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
      <div className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`}>{icon}</div>
      <span className="text-sm">{label}</span>
    </button>
  );
}

function DashboardModule({ contracts }) {
  return (
    <div className="p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<TrendingUp className="text-green-500"/>} label="Собрано за месяц" value="450 000 ₽" trend="+12% к Февралю" />
        <StatCard icon={<AlertCircle className="text-red-500"/>} label="Дебиторка" value="1.2 млн ₽" trend="Требует взыскания" />
        <StatCard icon={<Users className="text-blue-500"/>} label="Лидов в воронке" value="24" trend="Из них 5 горячих" />
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-64 flex items-center justify-center text-slate-400 italic">График платежей (в разработке)</div>
    </div>
  );
}

function StatCard({ icon, label, value, trend }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{trend}</div>
      </div>
      <div className="text-slate-500 text-xs font-bold uppercase mb-1">{label}</div>
      <div className="text-2xl font-black text-slate-800">{value}</div>
    </div>
  );
}

// Заглушки для модулей (чтобы не было ошибок в билде)
function ContractsModule({ contracts, setContracts }) { return <div className="p-8 text-center text-slate-400 italic">Модуль реестра договоров</div>; }
function PaymentsModule({ contracts, setContracts, history, setHistory }) { return <div className="p-8 text-center text-slate-400 italic">Модуль контроля платежей</div>; }
function AuModule({ cases, setCases }) { return <div className="p-8 text-center text-slate-400 italic">Модуль вознаграждений АУ</div>; }