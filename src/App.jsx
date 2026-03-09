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
// БЕЗОПАСНАЯ КОНФИГУРАЦИЯ
// ==========================================
const getFirebaseConfig = () => {
  try {
    const rawConfig = typeof __firebase_config !== 'undefined' ? __firebase_config : null;
    if (!rawConfig) return null;
    return typeof rawConfig === 'string' ? JSON.parse(rawConfig) : rawConfig;
  } catch (e) { return null; }
};

const firebaseConfig = getFirebaseConfig();
// Очистка appId от любых спецсимволов и слешей, чтобы не ломать сегменты путей Firestore
const rawAppId = typeof __app_id !== 'undefined' ? __app_id : 'aegis-crm-prod';
const appId = rawAppId.replace(/[^a-zA-Z0-9]/g, '_'); 

const app = firebaseConfig ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;

// ==========================================
// ЛОГОТИП
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
// ГЛАВНОЕ ПРИЛОЖЕНИЕ (App)
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
        const token = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
        if (token) {
          await signInWithCustomToken(auth, token);
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
    { id: '1411-ФЛ', date: '2024-11-01', clientName: 'Иванов Иван Иванович', phone: '+7 (999) 111-22-33', passport: '4210 123456', totalAmount: 200000, paidAmount: 80000, status: 'Активен', nextPaymentDate: '2025-03-05', monthlyPayment: 20000, currentMonthPaid: 0 },
    { id: '1414-ФЛ', date: '2024-12-10', clientName: 'Петров Петр Петрович', phone: '+7 (905) 123-45-67', passport: '4215 112233', totalAmount: 245000, paidAmount: 50000, status: 'Активен', nextPaymentDate: '2025-03-28', monthlyPayment: 25000, currentMonthPaid: 10000 }, 
  ]);

  const [paymentsHistory, setPaymentsHistory] = useState([
    { id: 1, contractId: '1411-ФЛ', clientName: 'Иванов Иван Иванович', amount: 20000, date: '2025-03-02', operator: 'Старокоров А.Б.' },
  ]);

  const [auCases, setAuCases] = useState([
    { id: 'А40-12345/2023', debtor: 'Петров В.В.', court: 'АС г. Москвы', completionDate: '2024-12-10', status: 'pending', amount: 25000, lastAction: 'Ходатайство подано', nextActionDate: '2025-03-15', stage: 'Ждем определение' },
  ]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-8 text-center">
          <AegisLogo size="large" />
          <div className="space-y-4 mt-8">
            <input type="text" defaultValue="admin@aegis.ru" className="w-full p-3 bg-slate-50 border rounded-lg outline-none" placeholder="Логин" />
            <input type="password" defaultValue="********" className="w-full p-3 bg-slate-50 border rounded-lg outline-none" placeholder="Пароль" />
            <button onClick={() => setIsAuthenticated(true)} className="w-full bg-[#1a2b4c] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors hover:bg-[#111e36]">
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
        <nav className="flex-1 p-4 space-y-1">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Рабочий стол" active={activeTab==='dashboard'} onClick={()=>setActiveTab('dashboard')} />
          <NavItem icon={<MessageSquare size={20}/>} label="Чаты ИИ (Лиды)" active={activeTab==='chats'} onClick={()=>setActiveTab('chats')} />
          <NavItem icon={<FileText size={20}/>} label="Договоры" active={activeTab==='contracts'} onClick={()=>setActiveTab('contracts')} />
          <NavItem icon={<CreditCard size={20}/>} label="Оплаты (БФЛ)" active={activeTab==='payments'} onClick={()=>setActiveTab('payments')} />
          <div className="pt-4 pb-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-left">Арбитраж</div>
          <NavItem icon={<Scale size={20}/>} label="Вознаграждения АУ" active={activeTab==='au'} onClick={()=>setActiveTab('au')} />
        </nav>
        <div className="p-4 border-t border-slate-700/50 bg-[#111e36]">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-[#1a2b4c] font-black text-xs">АБ</div>
             <div className="text-xs text-left">
                <div className="font-bold text-white">Старокоров А.Б.</div>
                <div className="text-slate-400 uppercase text-[9px] tracking-tighter">Руководитель</div>
             </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm shrink-0">
          <h1 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
            {activeTab === 'dashboard' ? 'Сводка' : activeTab === 'chats' ? 'Telegram Лиды' : activeTab === 'contracts' ? 'Реестр договоров' : activeTab === 'payments' ? 'Контроль оплат' : 'Арбитраж'}
          </h1>
          <div className="flex items-center gap-4">
             <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/><input type="text" placeholder="Поиск..." className="pl-9 pr-4 py-1.5 bg-slate-100 border-none rounded-lg text-xs outline-none w-48"/></div>
             <Bell className="text-slate-400" size={20}/>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto relative bg-slate-50">
          {activeTab === 'dashboard' && <DashboardModule contracts={contracts} payments={paymentsHistory} auCases={auCases} />}
          {activeTab === 'chats' && <ChatModule db={db} appId={appId} user={fbUser} />}
          {activeTab === 'contracts' && <ContractsModule contracts={contracts} setContracts={setContracts} userRole={userRole} />}
          {activeTab === 'payments' && <PaymentsModule contracts={contracts} setContracts={setContracts} history={paymentsHistory} setHistory={setPaymentsHistory} userRole={userRole} />}
          {activeTab === 'au' && <AuModule cases={auCases} setCases={setAuCases} userRole={userRole} />}
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
    .filter(m => String(m.chatId) === String(selectedId))
    .sort((a, b) => (Number(a.timestamp) || 0) - (Number(b.timestamp) || 0));

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedId) return;
    const text = input; setInput('');
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'leads', selectedId), { status: 'operator_active' });
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'messages'), {
        chatId: String(selectedId), sender: 'operator', text, timestamp: Date.now()
      });
    } catch (err) { console.error("Error sending message:", err); }
  };

  const activeLead = leads.find(l => String(l.id) === String(selectedId));

  const safeRender = (val) => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
  };

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
              <div className="font-bold text-sm text-slate-800 truncate pr-4 text-left">{safeRender(l.name || 'Клиент')}</div>
              <div className="flex justify-between items-center mt-1">
                <div className="text-[9px] text-slate-400 font-bold uppercase">@{safeRender(l.username || 'user')}</div>
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
            <div className="p-4 border-b bg-slate-50 flex justify-between items-center shrink-0">
               <div className="font-bold text-slate-800 text-left">{safeRender(activeLead?.name || 'Без имени')} <span className="text-slate-400 font-normal ml-2">ID: {safeRender(selectedId)}</span></div>
               {activeLead?.phone && <div className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 flex items-center gap-2"><Phone size={14}/> {safeRender(activeLead.phone)}</div>}
            </div>
            
            {activeLead?.summary && (
              <div className="mx-6 mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 leading-relaxed shadow-inner text-left shrink-0">
                <div className="font-black mb-1 flex items-center gap-2 uppercase tracking-tighter"><Bot size={14}/> Резюме диалога от ИИ:</div>
                {safeRender(activeLead.summary)}
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {activeMessages.map(m => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[75%] p-3 rounded-2xl text-[13px] shadow-sm text-left ${m.sender === 'user' ? 'bg-white border text-slate-800 rounded-bl-none' : 'bg-[#1a2b4c] text-white rounded-br-none'}`}>
                    <div className="text-[9px] opacity-50 mb-1 font-black uppercase tracking-tighter">{m.sender === 'user' ? 'КЛИЕНТ' : m.sender === 'operator' ? 'ВЫ (ЮРИСТ)' : 'AI АССИСТЕНТ'}</div>
                    <div className="whitespace-pre-wrap">{safeRender(m.text || '')}</div>
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            
            <form onSubmit={sendMessage} className="p-4 border-t bg-slate-50 flex gap-2 shrink-0">
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
// МОДУЛЬ DASHBOARD
// ==========================================
function DashboardModule({ contracts, payments, auCases }) {
  const formatCurrency = (val) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(val);
  
  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalReceivable = contracts.reduce((sum, c) => sum + (c.totalAmount - c.paidAmount), 0);
  const auInWork = auCases.filter(c => c.status === 'pending').length;

  return (
    <div className="p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<TrendingUp className="text-green-500"/>} label="Собрано факт" value={formatCurrency(totalCollected)} trend="За текущий период" />
        <StatCard icon={<AlertCircle className="text-red-500"/>} label="Дебиторка БФЛ" value={formatCurrency(totalReceivable)} trend="Общий остаток" />
        <StatCard icon={<Scale className="text-blue-500"/>} label="Дела АУ" value={auInWork} trend="В ожидании выплат" />
        <StatCard icon={<Users className="text-amber-500"/>} label="Лиды Telegram" value="24" trend="За последние 7 дней" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[300px] flex flex-col">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><BarChart3 size={18} className="text-blue-600"/> Динамика поступлений</h3>
          <div className="flex-1 flex items-end justify-between gap-4 px-4 pb-4">
             {[380, 450, 280, 350, 120].map((h, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-2">
                 <div className="w-full bg-blue-100 rounded-t-lg hover:bg-blue-600 transition-all cursor-pointer" style={{ height: h + 'px' }}></div>
                 <span className="text-[10px] font-bold text-slate-400">МЕС {i+1}</span>
               </div>
             ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><CalendarClock size={18} className="text-amber-600"/> Ближайшие задачи</h3>
          <div className="space-y-3">
             {contracts.filter(c => c.status === 'Активен').slice(0, 4).map(c => (
               <div key={c.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-left">
                    <div className="text-sm font-bold text-slate-800">{String(c.clientName)}</div>
                    <div className="text-[10px] text-slate-500">Оплата до: {String(c.nextPaymentDate)}</div>
                  </div>
                  <div className="text-xs font-bold text-blue-600">{formatCurrency(c.monthlyPayment)}</div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// МОДУЛЬ CONTRACTS (РЕЕСТР)
// ==========================================
function ContractsModule({ contracts, setContracts, userRole }) {
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);
  const formatCurrency = (val) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="p-8 h-full max-w-7xl mx-auto flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Реестр договоров</h2>
        <button onClick={() => setView('create')} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm"><Plus size={18} /> Создать договор</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col min-h-0">
        {view === 'list' && (
          <div className="overflow-x-auto flex-1 custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 sticky top-0">
                <tr className="border-b border-slate-200 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                  <th className="p-4">№ / Дата</th>
                  <th className="p-4">Клиент</th>
                  <th className="p-4">Сумма договора</th>
                  <th className="p-4">Прогресс оплат</th>
                  <th className="p-4">Статус</th>
                  <th className="p-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {contracts.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-800">№ {String(c.id)}<br/><span className="text-[10px] font-normal text-slate-500">{String(c.date)}</span></td>
                    <td className="p-4 font-medium text-[#1a2b4c]">{String(c.clientName)}<br/><span className="text-[10px] font-normal text-slate-500">{String(c.phone)}</span></td>
                    <td className="p-4 text-slate-600 font-bold">{formatCurrency(c.totalAmount)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(c.paidAmount/c.totalAmount)*100}%` }}></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">{Math.round((c.paidAmount/c.totalAmount)*100)}%</span>
                      </div>
                    </td>
                    <td className="p-4"><span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold border border-blue-200 uppercase">{String(c.status)}</span></td>
                    <td className="p-4 text-right">
                       <button onClick={() => { setSelected(c); setView('view'); }} className="p-2 text-slate-400 hover:text-[#1a2b4c] transition-colors"><Eye size={18}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === 'view' && selected && (
          <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-slate-200">
            <div className="max-w-[210mm] mx-auto bg-white p-20 shadow-xl text-left text-black font-serif text-[11pt] leading-relaxed relative">
               <button onClick={() => setView('list')} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 no-print">×</button>
               <div className="flex justify-between mb-8 font-bold"><div>г. Кемерово</div><div>{String(selected.date)} г.</div></div>
               <h3 className="text-center font-bold text-[14pt] mb-8 uppercase">Договор №{String(selected.id)}<br/>на оказание юридических услуг</h3>
               <p className="mb-4 text-justify">ИП Бондарь И.И., именуемый в дальнейшем "Исполнитель", с одной стороны, и <strong>{String(selected.clientName)}</strong>, именуемый(ая) в дальнейшем "Заказчик", заключили настоящий договор о нижеследующем...</p>
               <h4 className="font-bold mt-6 mb-2">1. ПРЕДМЕТ ДОГОВОРА</h4>
               <p className="text-justify mb-4">1.1. Исполнитель обязуется оказать Заказчику юридические услуги по банкротству физического лица в соответствии с ФЗ №127...</p>
               <h4 className="font-bold mt-6 mb-2">3. ЦЕНА И ПОРЯДОК РАСЧЕТОВ</h4>
               <p className="text-justify mb-4">3.1. Полная стоимость услуг составляет <strong>{formatCurrency(selected.totalAmount)}</strong>.</p>
               <div className="mt-12 pt-8 border-t border-black flex justify-between">
                  <div>Исполнитель: _________ / Бондарь И.И. /</div>
                  <div>Заказчик: _________ / {String(selected.clientName)} /</div>
               </div>
               <button onClick={() => setView('list')} className="mt-10 bg-slate-800 text-white px-4 py-2 rounded text-xs no-print">Вернуться к списку</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// МОДУЛЬ PAYMENTS (КОНТРОЛЬ)
// ==========================================
function PaymentsModule({ contracts, setContracts, history, setHistory, userRole }) {
  const formatCurrency = (val) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(val);
  const [tab, setTab] = useState('active');

  return (
    <div className="p-8 h-full max-w-7xl mx-auto flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex bg-slate-200/50 p-1 rounded-lg">
           <button onClick={() => setTab('active')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${tab === 'active' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>Контроль графиков</button>
           <button onClick={() => setTab('history')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${tab === 'history' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>История поступлений</button>
        </div>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm text-sm"><Plus size={16}/> Принять оплату</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col min-h-0">
        {tab === 'active' && (
          <div className="overflow-x-auto flex-1 custom-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b sticky top-0">
                <tr className="text-[10px] font-bold text-slate-500 uppercase p-4"><th className="p-4">Клиент</th><th className="p-4">Срок оплаты</th><th className="p-4">Сумма за месяц</th><th className="p-4">Статус</th><th className="p-4 text-right">Действие</th></tr>
              </thead>
              <tbody className="divide-y text-sm">
                 {contracts.filter(c => c.status === 'Активен').map(c => (
                   <tr key={c.id} className="hover:bg-slate-50">
                     <td className="p-4 font-bold">{String(c.clientName)}</td>
                     <td className="p-4 text-red-600 font-bold">{String(c.nextPaymentDate)}</td>
                     <td className="p-4 font-bold text-slate-700">{formatCurrency(c.monthlyPayment)}</td>
                     <td className="p-4"><span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded">Просрочено</span></td>
                     <td className="p-4 text-right"><button className="text-blue-600 hover:underline font-bold text-xs flex items-center gap-1 justify-end"><PhoneCall size={14}/> Напомнить</button></td>
                   </tr>
                 ))}
              </tbody>
            </table>
          </div>
        )}
        {tab === 'history' && (
          <div className="p-8 text-center text-slate-400 italic">Здесь отображается история всех принятых платежей...</div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// МОДУЛЬ AU (АРБИТРАЖ)
// ==========================================
function AuModule({ cases, setCases, userRole }) {
  const formatCurrency = (val) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(val);
  const [tab, setTab] = useState('list');

  return (
    <div className="p-8 h-full max-w-7xl mx-auto flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex bg-slate-200/50 p-1 rounded-lg">
           <button onClick={() => setTab('list')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${tab === 'list' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>В работе ({cases.length})</button>
           <button onClick={() => setTab('recon')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${tab === 'recon' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>Сверка выписок</button>
        </div>
        <button className="bg-[#1a2b4c] text-white px-4 py-2 rounded-lg font-bold text-sm">Добавить дело АУ</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col min-h-0">
        {tab === 'list' && (
           <div className="overflow-x-auto flex-1 custom-scrollbar">
             <table className="w-full text-left border-collapse">
               <thead className="bg-slate-50 border-b sticky top-0">
                 <tr className="text-[10px] font-bold text-slate-500 uppercase"><th className="p-4">Дело / Должник</th><th className="p-4">Суд</th><th className="p-4">Этап</th><th className="p-4">Контроль</th><th className="p-4 text-right">Сумма</th></tr>
               </thead>
               <tbody className="divide-y text-sm">
                  {cases.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-800">{String(c.id)}<br/><span className="font-normal text-slate-500">{String(c.debtor)}</span></td>
                      <td className="p-4 text-slate-500">{String(c.court)}</td>
                      <td className="p-4"><span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[10px] font-bold">{String(c.stage)}</span></td>
                      <td className="p-4 font-bold text-red-600 italic">{String(c.nextActionDate)}</td>
                      <td className="p-4 text-right font-bold">{formatCurrency(c.amount)}</td>
                    </tr>
                  ))}
               </tbody>
             </table>
           </div>
        )}
        {tab === 'recon' && (
          <div className="flex h-full divide-x flex-1">
             <div className="w-1/2 p-6 flex flex-col gap-4">
                <h4 className="font-bold text-slate-800">Загрузка банковской выписки</h4>
                <div className="border-2 border-dashed border-blue-200 bg-blue-50/30 rounded-xl p-10 text-center flex flex-col items-center shrink-0">
                   <UploadCloud size={48} className="text-blue-500 mb-4 opacity-50"/>
                   <span className="text-sm font-bold text-blue-900">Перетащите PDF или XLS выписку</span>
                   <span className="text-[10px] text-slate-400 mt-2">CRM автоматически найдет номера дел в назначении платежа</span>
                </div>
                <textarea className="flex-1 border rounded-lg p-3 text-xs outline-none focus:ring-1" placeholder="Или вставьте текст выписки сюда..."></textarea>
                <button className="bg-blue-600 text-white py-3 rounded-lg font-bold shrink-0">Распознать платежи</button>
             </div>
             <div className="w-1/2 p-6 bg-slate-50 flex flex-col">
                <h4 className="font-bold text-slate-800 mb-4">Результаты сверки</h4>
                <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                   <FileSpreadsheet size={64} className="opacity-10 mb-4"/>
                   <p className="text-sm italic">Ожидание данных для анализа...</p>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ
// ==========================================
function StatCard({ icon, label, value, trend }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-left">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{String(trend || '')}</div>
      </div>
      <div className="text-slate-500 text-xs font-bold uppercase mb-1">{String(label || '')}</div>
      <div className="text-2xl font-black text-slate-800">{String(value || '')}</div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
      <div className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`}>{icon}</div>
      <span className="text-sm">{String(label || '')}</span>
    </button>
  );
}