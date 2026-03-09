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
// БЕЗОПАСНАЯ КОНФИГУРАЦИЯ (Исправление путей и билда)
// ==========================================
const getSafeEnv = () => {
  const g = typeof globalThis !== 'undefined' ? globalThis : window;
  let fbCfg = g.__firebase_config || null;
  if (typeof fbCfg === 'string') {
    try { fbCfg = JSON.parse(fbCfg); } catch (e) { fbCfg = null; }
  }
  
  // Очищаем appId от слешей и точек, чтобы Firestore путь (artifacts/ID/...) был валидным
  const rawId = g.__app_id || 'aegis_prod_env';
  const cleanId = String(rawId).replace(/[^a-zA-Z0-9]/g, '_');
  
  return {
    firebaseConfig: fbCfg,
    appId: cleanId,
    token: g.__initial_auth_token || null
  };
};

const env = getSafeEnv();
const app = env.firebaseConfig ? initializeApp(env.firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;

// Хелпер для безопасного рендеринга данных из БД (предотвращает краш React)
const safe = (val) => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
};

// ==========================================
// КОМПОНЕНТЫ ИНТЕРФЕЙСА
// ==========================================
const AegisLogo = ({ size = 'large' }) => {
  const [imgError, setImgError] = useState(false);
  if (!imgError) {
    return (
      <img 
        src="logo-a-1.png" 
        alt="ИДЖИС" 
        className={`${size === 'large' ? 'h-20 mb-4' : 'h-10'} mx-auto object-contain`}
        onError={() => setImgError(true)} 
      />
    );
  }
  return (
    <div className={`flex items-center justify-center gap-3 ${size === 'large' ? 'mb-2 mt-4' : ''}`}>
      <Shield className="text-[#1a2b4c]" size={size === 'large' ? 40 : 28} fill="#eab308" />
      <div className="flex flex-col items-start leading-none text-left">
        <span className={`${size === 'large' ? 'text-3xl' : 'text-xl'} font-black text-[#1a2b4c] tracking-widest uppercase`}>ИДЖИС</span>
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Правовая защита</span>
      </div>
    </div>
  );
};

// ==========================================
// ГЛАВНОЕ ПРИЛОЖЕНИЕ
// ==========================================
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState('admin');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!auth) return;
    const login = async () => {
      if (env.token) await signInWithCustomToken(auth, env.token).catch(() => signInAnonymously(auth));
      else await signInAnonymously(auth);
    };
    login();
    return onAuthStateChanged(auth, setUser);
  }, []);

  // Данные (Договоры, Оплаты, АУ)
  const [contracts, setContracts] = useState([
    { id: '1411-ФЛ', date: '2024-11-01', clientName: 'Иванов Иван Иванович', phone: '+7 (999) 111-22-33', status: 'Активен', nextPaymentDate: '2025-03-05', totalAmount: 200000, paidAmount: 80000, monthlyPayment: 20000, currentMonthPaid: 0 },
    { id: '1414-ФЛ', date: '2024-12-10', clientName: 'Петров Петр Петрович', phone: '+7 (905) 123-45-67', status: 'Активен', nextPaymentDate: '2025-03-28', totalAmount: 245000, paidAmount: 50000, monthlyPayment: 25000, currentMonthPaid: 10000 }, 
  ]);
  const [payments, setPayments] = useState([
    { id: 1, contractId: '1411-ФЛ', clientName: 'Иванов Иван Иванович', amount: 20000, date: '2025-03-02', operator: 'Старокоров А.Б.' },
  ]);
  const [auCases, setAuCases] = useState([
    { id: 'А40-12345/2023', debtor: 'Петров В.В.', court: 'АС г. Москвы', status: 'pending', amount: 25000, lastAction: 'Ходатайство подано', nextActionDate: '2025-03-15', stage: 'Ждем определение' },
  ]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-10 text-center">
          <AegisLogo size="large" />
          <div className="space-y-4 mt-8">
            <input type="text" defaultValue="admin@aegis.ru" className="w-full p-4 bg-slate-50 border rounded-xl outline-none" placeholder="Логин" />
            <input type="password" defaultValue="********" className="w-full p-4 bg-slate-50 border rounded-xl outline-none" placeholder="Пароль" />
            <button onClick={() => setIsAuthenticated(true)} className="w-full bg-[#1a2b4c] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg">
              Войти в систему <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      <aside className="w-64 bg-[#1a2b4c] text-slate-300 flex flex-col shadow-xl shrink-0">
        <div className="h-16 flex items-center justify-center bg-white border-b border-slate-200"><AegisLogo size="small" /></div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavItem icon={<LayoutDashboard size={18}/>} label="Рабочий стол" active={activeTab==='dashboard'} onClick={()=>setActiveTab('dashboard')} />
          <NavItem icon={<MessageSquare size={18}/>} label="Чаты ИИ (Лиды)" active={activeTab==='chats'} onClick={()=>setActiveTab('chats')} />
          <NavItem icon={<FileText size={18}/>} label="Договоры" active={activeTab==='contracts'} onClick={()=>setActiveTab('contracts')} />
          <NavItem icon={<CreditCard size={18}/>} label="Оплаты (БФЛ)" active={activeTab==='payments'} onClick={()=>setActiveTab('payments')} />
          <div className="pt-6 pb-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-left">Арбитраж</div>
          <NavItem icon={<Scale size={18}/>} label="Вознаграждения АУ" active={activeTab==='au'} onClick={()=>setActiveTab('au')} />
        </nav>
        <div className="p-4 border-t border-slate-700/50 bg-[#111e36] text-left">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-[#1a2b4c] font-black text-xs">АБ</div>
             <div><div className="font-bold text-white text-xs">Старокоров А.Б.</div><div className="text-slate-400 text-[9px] uppercase">Руководитель</div></div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-lg font-bold text-slate-800 uppercase tracking-tight">
            {activeTab === 'dashboard' ? 'Аналитика' : activeTab === 'chats' ? 'Telegram Лиды' : activeTab === 'contracts' ? 'Реестр договоров' : 'Управление'}
          </h1>
          <div className="flex items-center gap-4"><Bell className="text-slate-400" size={20}/></div>
        </header>

        <div className="flex-1 overflow-y-auto relative bg-slate-50">
          {activeTab === 'dashboard' && <DashboardModule contracts={contracts} payments={payments} auCases={auCases} />}
          {activeTab === 'chats' && <ChatModule db={db} appId={env.appId} user={user} />}
          {activeTab === 'contracts' && <ContractsModule contracts={contracts} setContracts={setContracts} />}
          {activeTab === 'payments' && <PaymentsModule contracts={contracts} history={payments} />}
          {activeTab === 'au' && <AuModule cases={auCases} />}
        </div>
      </main>
    </div>
  );
}

// ==========================================
// МОДУЛЬ: ЧАТЫ ИИ (СИНХРОНИЗАЦИЯ С ТГ-БОТОМ)
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
    } catch (err) { console.error(err); }
  };

  const activeLead = leads.find(l => String(l.id) === String(selectedId));

  return (
    <div className="absolute inset-0 p-6 flex gap-6">
      <div className="w-80 bg-white border rounded-2xl overflow-hidden flex flex-col shadow-sm">
        <div className="p-4 bg-[#1a2b4c] text-white font-bold text-[10px] uppercase tracking-widest flex items-center justify-between">
          <span>Диалоги Telegram</span>
          <span className="bg-blue-500 px-2 rounded-full">{leads.length}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {leads.map(l => (
            <div key={l.id} onClick={() => setSelectedId(l.id)} className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedId === l.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-slate-50 border-transparent'}`}>
              <div className="font-bold text-sm text-slate-800 text-left">{safe(l.name || 'Клиент')}</div>
              <div className="flex justify-between items-center mt-2">
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">@{safe(l.username || 'user')}</div>
                <div className={`w-2 h-2 rounded-full ${l.status === 'operator_active' ? 'bg-green-500' : 'bg-amber-400 animate-pulse'}`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex-1 bg-white border rounded-2xl flex flex-col shadow-sm overflow-hidden">
        {selectedId ? (
          <>
            <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
               <div className="font-bold text-slate-800 text-left">{safe(activeLead?.name)} <span className="text-slate-400 font-normal ml-2">ID: {safe(selectedId)}</span></div>
               {activeLead?.phone && <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 flex items-center gap-2"><Phone size={14}/> {safe(activeLead.phone)}</div>}
            </div>
            
            {activeLead?.summary && (
              <div className="mx-6 mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed text-left">
                <div className="font-black mb-1 flex items-center gap-2 uppercase tracking-tighter"><Bot size={14}/> Резюме диалога от ИИ:</div>
                {safe(activeLead.summary)}
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {activeMessages.map(m => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[75%] p-3 rounded-2xl text-[13px] shadow-sm text-left ${m.sender === 'user' ? 'bg-white border text-slate-800 rounded-bl-none' : 'bg-[#1a2b4c] text-white rounded-br-none'}`}>
                    <div className="text-[9px] opacity-50 mb-1 font-black uppercase tracking-tighter">{m.sender === 'user' ? 'КЛИЕНТ' : m.sender === 'operator' ? 'ВЫ' : 'AI'}</div>
                    <div className="whitespace-pre-wrap">{safe(m.text)}</div>
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            
            <form onSubmit={sendMessage} className="p-4 border-t bg-slate-50 flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} className="flex-1 p-3 bg-white border rounded-xl outline-none text-sm" placeholder="Введите ответ..." />
              <button className="bg-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"><Send size={20}/></button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 italic">Выберите диалог из списка</div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// МОДУЛЬ: РАБОЧИЙ СТОЛ
// ==========================================
function DashboardModule({ contracts, payments, auCases }) {
  const format = (v) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(v);
  return (
    <div className="p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Stat icon={<TrendingUp className="text-green-500"/>} label="Собрано факт" value={format(payments.reduce((s, p) => s + p.amount, 0))} trend="Март" />
        <Stat icon={<AlertCircle className="text-red-500"/>} label="Дебиторка" value={format(contracts.reduce((s, c) => s + (c.totalAmount - c.paidAmount), 0))} trend="БФЛ" />
        <Stat icon={<Scale className="text-blue-500"/>} label="Дела АУ" value={auCases.length} trend="В работе" />
        <Stat icon={<Users className="text-amber-500"/>} label="Лиды TG" value="24" trend="+5 сегодня" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[300px] flex flex-col">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><BarChart3 size={18} className="text-blue-600"/> Динамика оплат</h3>
          <div className="flex-1 flex items-end justify-between gap-4 px-4 pb-4">
             {[38, 45, 28, 35, 12, 50, 60].map((h, i) => (
               <div key={i} className="flex-1 bg-blue-100 rounded-t-lg hover:bg-blue-600 transition-all cursor-pointer" style={{ height: (h*3) + 'px' }}></div>
             ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><CalendarClock size={18} className="text-amber-600"/> График на сегодня</h3>
           <div className="space-y-3">
              {contracts.slice(0, 3).map(c => (
                <div key={c.id} className="p-3 bg-slate-50 rounded-xl border flex justify-between items-center">
                  <div className="text-left"><div className="text-xs font-bold">{safe(c.clientName)}</div><div className="text-[10px] text-slate-400">Срок: {safe(c.nextPaymentDate)}</div></div>
                  <div className="text-xs font-bold text-blue-600">{format(c.monthlyPayment)}</div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// МОДУЛЬ: ДОГОВОРЫ
// ==========================================
function ContractsModule({ contracts, setContracts }) {
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);
  const format = (v) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(v);

  return (
    <div className="p-8 h-full max-w-7xl mx-auto flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Реестр договоров</h2>
        <button onClick={() => setView('create')} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-colors"><Plus size={18} /> Создать</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col min-h-0">
        {view === 'list' && (
          <div className="overflow-x-auto flex-1 custom-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-slate-50 sticky top-0">
                <tr className="border-b text-[10px] text-slate-500 uppercase font-bold tracking-widest"><th className="p-4">№ / Дата</th><th className="p-4">Заказчик</th><th className="p-4">Сумма</th><th className="p-4">Прогресс</th><th className="p-4">Статус</th><th className="p-4 text-right">Действие</th></tr>
              </thead>
              <tbody className="divide-y text-sm">
                {contracts.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-800">№ {safe(c.id)}<br/><span className="text-[10px] font-normal">{safe(c.date)}</span></td>
                    <td className="p-4 font-bold text-[#1a2b4c] text-left">{safe(c.clientName)}<div className="text-[10px] font-normal text-slate-400">{safe(c.phone)}</div></td>
                    <td className="p-4 font-bold">{format(c.totalAmount)}</td>
                    <td className="p-4 w-40"><div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{width: `${(c.paidAmount/c.totalAmount)*100}%`}}></div></div></td>
                    <td className="p-4"><span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold border border-blue-200 uppercase">{safe(c.status)}</span></td>
                    <td className="p-4 text-right"><button onClick={() => { setSelected(c); setView('view'); }} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Eye size={18}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === 'view' && selected && (
          <div className="p-8 overflow-y-auto flex-1 bg-slate-200 custom-scrollbar">
            <div className="max-w-[210mm] mx-auto bg-white p-20 shadow-2xl text-left text-black font-serif text-[11pt] leading-relaxed relative">
               <button onClick={() => setView('list')} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 no-print">×</button>
               <div className="flex justify-between mb-8 font-bold"><div>г. Кемерово</div><div>{safe(selected.date)} г.</div></div>
               <h3 className="text-center font-bold text-[14pt] mb-8 uppercase">Договор №{safe(selected.id)}<br/>на оказание юридических услуг</h3>
               <p className="mb-4 text-justify">ИП Бондарь И.И., именуемый в дальнейшем "Исполнитель", с одной стороны, и <strong>{safe(selected.clientName)}</strong>, именуемый(ая) в дальнейшем "Заказчик", заключили настоящий договор о нижеследующем...</p>
               <h4 className="font-bold mt-6 mb-2 uppercase text-[10pt]">1. ПРЕДМЕТ ДОГОВОРА</h4>
               <p className="text-justify mb-4">1.1. Исполнитель обязуется оказать Заказчику юридические услуги по банкротству физического лица в соответствии с ФЗ №127 "О несостоятельности"...</p>
               <h4 className="font-bold mt-6 mb-2 uppercase text-[10pt]">3. ЦЕНА И ПОРЯДОК РАСЧЕТОВ</h4>
               <p className="text-justify mb-4">3.1. Стоимость услуг составляет <strong>{format(selected.totalAmount)}</strong>. Оплата производится согласно графику (Приложение №1).</p>
               <div className="mt-20 pt-8 border-t border-black flex justify-between italic">
                  <div>Исполнитель: _________ / Бондарь И.И. /</div>
                  <div>Заказчик: _________ / {safe(selected.clientName)} /</div>
               </div>
               <button onClick={() => setView('list')} className="mt-12 bg-[#1a2b4c] text-white px-6 py-2 rounded-lg text-xs font-bold no-print shadow-lg">Закрыть просмотр</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// МОДУЛИ: ОПЛАТЫ И АУ
// ==========================================
function PaymentsModule({ contracts, history }) {
  const format = (v) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(v);
  return (
    <div className="p-8 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 text-left">Контроль платежей БФЛ</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-md"><Plus size={18}/> Внести оплату</button>
      </div>
      <div className="bg-white rounded-2xl border overflow-hidden flex-1 shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest"><th className="p-4">Клиент</th><th className="p-4">Срок</th><th className="p-4 text-right">Сумма к оплате</th><th className="p-4">Статус</th></tr>
          </thead>
          <tbody className="divide-y text-sm">
            {contracts.filter(c => c.status === 'Активен').map(c => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="p-4 font-bold text-left">{safe(c.clientName)}</td>
                <td className="p-4 font-bold text-red-600">{safe(c.nextPaymentDate)}</td>
                <td className="p-4 text-right font-bold text-[#1a2b4c]">{format(c.monthlyPayment)}</td>
                <td className="p-4"><span className="px-2 py-0.5 bg-red-50 text-red-700 rounded-full text-[10px] font-bold border border-red-100">ПРОСРОЧЕНО</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AuModule({ cases }) {
  const format = (v) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(v);
  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 text-left">Вознаграждения АУ</h2>
        <button className="bg-[#1a2b4c] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2"><Plus size={18}/> Новое дело</button>
      </div>
      <div className="bg-white rounded-2xl border overflow-hidden flex-1 shadow-sm flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b sticky top-0">
              <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest"><th className="p-4">Дело / Должник</th><th className="p-4">Суд</th><th className="p-4">Этап</th><th className="p-4 text-right">Сумма</th></tr>
            </thead>
            <tbody className="divide-y text-sm">
               {cases.map(c => (
                 <tr key={c.id} className="hover:bg-slate-50">
                   <td className="p-4 font-bold text-left">{safe(c.id)}<br/><span className="text-[10px] font-normal text-slate-400">{safe(c.debtor)}</span></td>
                   <td className="p-4 text-slate-500">{safe(c.court)}</td>
                   <td className="p-4"><span className="px-2 py-0.5 bg-amber-50 text-amber-700 border rounded text-[10px] font-bold uppercase">{safe(c.stage)}</span></td>
                   <td className="p-4 text-right font-bold text-green-600">{format(c.amount)}</td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-slate-50 border-t flex flex-col items-center">
           <h4 className="font-bold text-slate-700 mb-2">Сверка выписок (Alpha)</h4>
           <div className="border-2 border-dashed border-blue-200 bg-white w-full max-w-md p-6 rounded-xl text-center flex flex-col items-center opacity-60">
              <UploadCloud size={32} className="text-blue-500 mb-2"/>
              <p className="text-[10px] text-slate-500 font-bold">ПЕРЕТАЩИТЕ ВЫПИСКУ ДЛЯ АВТОПОИСКА ДЕЛ</p>
           </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// UI ХЕЛПЕРЫ
// ==========================================
function Stat({ icon, label, value, trend }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left">
      <div className="flex justify-between items-start mb-3">
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{safe(trend)}</div>
      </div>
      <div className="text-slate-500 text-[10px] font-bold uppercase mb-1">{safe(label)}</div>
      <div className="text-xl font-black text-slate-800">{safe(value)}</div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
      <div className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`}>{icon}</div>
      <span className="text-xs font-bold text-left">{safe(label)}</span>
    </button>
  );
}