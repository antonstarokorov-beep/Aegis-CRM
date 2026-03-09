/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, addDoc, updateDoc } from 'firebase/firestore';
import { 
  LayoutDashboard, FileText, CreditCard, Scale, Bell, Search, Plus, 
  TrendingUp, AlertCircle, ShieldCheck, UserCircle, BarChart3, 
  CalendarClock, Users, MessageSquare, Phone, Send, Bot, 
  Printer, UploadCloud, FileSpreadsheet, PhoneCall, ArrowRight
} from 'lucide-react';

// ==========================================
// ТЕХНИЧЕСКИЙ БЛОК: СОВМЕСТИМОСТЬ С VERCEL
// ==========================================
const getSafeGlobal = (key, fallback = null) => {
  try {
    if (typeof window !== 'undefined' && window[key]) return window[key];
    if (typeof globalThis !== 'undefined' && globalThis[key]) return globalThis[key];
  } catch (e) { /* ignore */ }
  return fallback;
};

const rawConfig = getSafeGlobal('__firebase_config');
let firebaseConfig = null;
if (rawConfig) {
  try {
    firebaseConfig = typeof rawConfig === 'string' ? JSON.parse(rawConfig) : rawConfig;
  } catch (e) { /* silent */ }
}

// Очистка ID для Firestore (ровно 5 сегментов в итоге: artifacts/ID/public/data/leads)
const rawAppId = getSafeGlobal('__app_id', 'aegis-crm-prod');
const appId = String(rawAppId).replace(/[^a-zA-Z0-9]/g, '_');

const app = firebaseConfig ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;

// Безопасный вывод данных из БД (защита от "Objects are not valid as a React child")
const safe = (val) => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
};

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
        className={`${size === 'large' ? 'h-20 mb-4' : 'h-10'} mx-auto object-contain`}
        onError={() => setImgError(true)} 
      />
    );
  }
  return (
    <div className={`flex items-center justify-center gap-3 ${size === 'large' ? 'mb-2 mt-4' : ''}`}>
      <ShieldCheck className="text-[#1a2b4c]" size={size === 'large' ? 40 : 28} fill="#eab308" />
      <div className="flex flex-col items-start leading-none text-left">
        <span className={`${size === 'large' ? 'text-3xl' : 'text-xl'} font-black text-[#1a2b4c] tracking-widest uppercase`}>ИДЖИС</span>
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Правовая защита</span>
      </div>
    </div>
  );
};

// ==========================================
// ОСНОВНОЕ ПРИЛОЖЕНИЕ (App)
// ==========================================
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [fbUser, setFbUser] = useState(null);

  useEffect(() => {
    if (!auth) return;
    const login = async () => {
      const token = getSafeGlobal('__initial_auth_token');
      try {
        if (token) await signInWithCustomToken(auth, token);
        else await signInAnonymously(auth);
      } catch (e) { /* silent */ }
    };
    login();
    return onAuthStateChanged(auth, setFbUser);
  }, []);

  const [contracts] = useState([
    { id: '1411-ФЛ', date: '2024-11-01', clientName: 'Иванов Иван Иванович', phone: '+7 (999) 111-22-33', totalAmount: 200000, paidAmount: 80000, status: 'Активен', nextPaymentDate: '2025-03-05', monthlyPayment: 20000, currentMonthPaid: 0 },
    { id: '1414-ФЛ', date: '2024-12-10', clientName: 'Петров Петр Петрович', phone: '+7 (905) 123-45-67', totalAmount: 245000, paidAmount: 50000, status: 'Активен', nextPaymentDate: '2025-03-28', monthlyPayment: 25000, currentMonthPaid: 10000 }, 
  ]);

  const [paymentsHistory] = useState([
    { id: 1, contractId: '1411-ФЛ', clientName: 'Иванов Иван Иванович', amount: 20000, date: '2025-03-02', operator: 'Старокоров А.Б.' },
  ]);

  const [auCases] = useState([
    { id: 'А40-12345/2023', debtor: 'Петров В.В.', court: 'АС г. Москвы', status: 'pending', amount: 25000, stage: 'Ждем определение', nextActionDate: '2025-03-15' },
  ]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-center">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 overflow-hidden">
          <AegisLogo size="large" />
          <div className="space-y-4 mt-8">
            <input type="text" defaultValue="admin@aegis.ru" className="w-full p-4 bg-slate-50 border rounded-xl outline-none" placeholder="Логин" />
            <input type="password" defaultValue="********" className="w-full p-4 bg-slate-50 border rounded-xl outline-none" placeholder="Пароль" />
            <button onClick={() => setIsAuthenticated(true)} className="w-full bg-[#1a2b4c] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02]">
              Войти в систему <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <aside className="w-64 bg-[#1a2b4c] text-slate-300 flex flex-col shadow-xl shrink-0">
        <div className="h-16 flex items-center justify-center bg-white border-b border-slate-200"><AegisLogo size="small" /></div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          <NavItem icon={<LayoutDashboard size={18}/>} label="Рабочий стол" active={activeTab==='dashboard'} onClick={()=>setActiveTab('dashboard')} />
          <NavItem icon={<MessageSquare size={18}/>} label="Чаты ИИ (Лиды)" active={activeTab==='chats'} onClick={()=>setActiveTab('chats')} />
          <NavItem icon={<FileText size={18}/>} label="Договоры" active={activeTab==='contracts'} onClick={()=>setActiveTab('contracts')} />
          <NavItem icon={<CreditCard size={18}/>} label="Оплаты (БФЛ)" active={activeTab==='payments'} onClick={()=>setActiveTab('payments')} />
          <div className="pt-6 pb-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-left font-sans">Арбитраж</div>
          <NavItem icon={<Scale size={18}/>} label="Вознаграждения АУ" active={activeTab==='au'} onClick={()=>setActiveTab('au')} />
        </nav>
        <div className="p-4 border-t border-slate-700/50 bg-[#111e36]">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-[#1a2b4c] font-black text-xs">АБ</div>
             <div className="text-left text-xs"><div className="font-bold text-white">Старокоров А.Б.</div><div className="text-slate-400 uppercase text-[9px]">Администратор</div></div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm shrink-0">
          <h1 className="text-lg font-bold text-slate-800 uppercase tracking-tight">
            {activeTab === 'dashboard' ? 'Сводка показателей' : activeTab === 'chats' ? 'Telegram Лиды' : activeTab === 'contracts' ? 'Реестр договоров' : activeTab === 'payments' ? 'Контроль платежей' : 'Арбитраж'}
          </h1>
          <div className="flex items-center gap-4"><Bell className="text-slate-400" size={20}/></div>
        </header>

        <div className="flex-1 overflow-y-auto relative bg-slate-50">
          {activeTab === 'dashboard' && <DashboardModule contracts={contracts} payments={paymentsHistory} auCases={auCases} />}
          {activeTab === 'chats' && <ChatModule db={db} appId={appId} user={fbUser} />}
          {activeTab === 'contracts' && <ContractsModule contracts={contracts} />}
          {activeTab === 'payments' && <PaymentsModule contracts={contracts} />}
          {activeTab === 'au' && <AuModule cases={auCases} />}
        </div>
      </main>
    </div>
  );
}

// ==========================================
// МОДУЛЬ: ЧАТЫ (LEADS)
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
    <div className="absolute inset-0 p-6 flex gap-6 overflow-hidden">
      <div className="w-80 bg-white border rounded-2xl overflow-hidden flex flex-col shadow-sm shrink-0">
        <div className="p-4 bg-[#1a2b4c] text-white font-bold text-[10px] uppercase tracking-widest flex items-center justify-between">
          <span>Диалоги Telegram</span>
          <span className="bg-blue-500 px-2 rounded-full">{leads.length}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {leads.map(l => (
            <div key={l.id} onClick={() => setSelectedId(l.id)} className={`p-4 rounded-xl border cursor-pointer transition-all text-left ${selectedId === l.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-slate-50 border-transparent'}`}>
              <div className="font-bold text-sm text-slate-800 truncate pr-4">{safe(l.name || 'Клиент')}</div>
              <div className="flex justify-between items-center mt-2">
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">@{safe(l.username || 'user')}</div>
                <div className={`w-2 h-2 rounded-full ${l.status === 'operator_active' ? 'bg-green-500' : 'bg-amber-400 animate-pulse'}`}></div>
              </div>
            </div>
          ))}
          {leads.length === 0 && <div className="p-8 text-center text-xs text-slate-400 italic">Ожидаем новых лидов...</div>}
        </div>
      </div>
      
      <div className="flex-1 bg-white border rounded-2xl flex flex-col shadow-sm overflow-hidden">
        {selectedId ? (
          <>
            <div className="p-4 border-b bg-slate-50 flex justify-between items-center shrink-0">
               <div className="font-bold text-slate-800 text-left">{safe(activeLead?.name || 'Без имени')} <span className="text-slate-400 font-normal ml-2">ID: {safe(selectedId)}</span></div>
               {activeLead?.phone && <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 flex items-center gap-2"><Phone size={14}/> {safe(activeLead.phone)}</div>}
            </div>
            
            {activeLead?.summary && (
              <div className="mx-6 mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed text-left shrink-0">
                <div className="font-black mb-1 flex items-center gap-2 uppercase tracking-tighter"><Bot size={14}/> Резюме диалога от ИИ:</div>
                {safe(activeLead.summary)}
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {activeMessages.map(m => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[75%] p-3 rounded-2xl text-[13px] shadow-sm text-left ${m.sender === 'user' ? 'bg-white border text-slate-800 rounded-bl-none' : 'bg-[#1a2b4c] text-white rounded-br-none'}`}>
                    <div className="text-[9px] opacity-50 mb-1 font-black uppercase tracking-tighter">{m.sender === 'user' ? 'КЛИЕНТ' : m.sender === 'operator' ? 'ВЫ (ЮРИСТ)' : 'AI АССИСТЕНТ'}</div>
                    <div className="whitespace-pre-wrap">{safe(m.text)}</div>
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
            <div className="text-lg font-bold italic">Выберите диалог</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// МОДУЛИ DASHBOARD И РЕЕСТРЫ
// ==========================================
function DashboardModule({ contracts, payments, auCases }) {
  const format = (v) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(v);
  return (
    <div className="p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Stat icon={<TrendingUp className="text-green-500"/>} label="Собрано факт" value={format(payments.reduce((s, p) => s + p.amount, 0))} trend="Март 2025" />
        <Stat icon={<AlertCircle className="text-red-500"/>} label="Дебиторка БФЛ" value={format(contracts.reduce((s, c) => s + (c.totalAmount - c.paidAmount), 0))} trend="Остаток" />
        <Stat icon={<Scale className="text-blue-500"/>} label="Дела АУ" value={auCases.length} trend="В работе" />
        <Stat icon={<Users className="text-amber-500"/>} label="Лиды TG" value="24" trend="За неделю" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[300px] flex flex-col">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><BarChart3 size={18} className="text-blue-600"/> Динамика (6 мес)</h3>
          <div className="flex-1 flex items-end justify-between gap-4 px-4 pb-4">
             {[38, 45, 28, 35, 12, 55].map((h, i) => (
               <div key={i} className="flex-1 bg-blue-100 rounded-t-lg hover:bg-blue-600 transition-all cursor-pointer" style={{ height: (h*3) + 'px' }}></div>
             ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><CalendarClock size={18} className="text-amber-600"/> Ближайшие оплаты</h3>
           <div className="space-y-3">
              {contracts.filter(c => c.status === 'Активен').slice(0, 4).map(c => (
                <div key={c.id} className="p-4 bg-slate-50 rounded-xl border flex justify-between items-center">
                  <div className="text-left"><div className="text-sm font-bold text-slate-800">{safe(c.clientName)}</div><div className="text-[10px] text-slate-400">Срок: {safe(c.nextPaymentDate)}</div></div>
                  <div className="text-sm font-bold text-blue-600">{format(c.monthlyPayment)}</div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}

function ContractsModule({ contracts }) {
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);
  const format = (v) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(v);
  return (
    <div className="p-8 h-full max-w-7xl mx-auto flex flex-col">
      {view === 'list' ? (
        <>
          <div className="flex justify-between items-center mb-6 shrink-0 text-left">
            <h2 className="text-2xl font-bold text-slate-800">Реестр договоров</h2>
            <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2"><Plus size={18} /> Создать</button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col min-h-0">
            <div className="overflow-x-auto flex-1 custom-scrollbar">
              <table className="w-full text-left">
                <thead className="bg-slate-50 sticky top-0 border-b">
                  <tr className="text-[10px] text-slate-500 uppercase font-bold tracking-widest"><th className="p-4">№ / Дата</th><th className="p-4">Заказчик</th><th className="p-4">Сумма</th><th className="p-4">Прогресс</th><th className="p-4">Статус</th><th className="p-4 text-right">Действие</th></tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {contracts.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold">№ {safe(c.id)}<br/><span className="text-[10px] font-normal text-slate-500">{safe(c.date)}</span></td>
                      <td className="p-4 font-bold text-[#1a2b4c] text-left">{safe(c.clientName)}<div className="text-[10px] font-normal text-slate-400">{safe(c.phone)}</div></td>
                      <td className="p-4 font-bold">{format(c.totalAmount)}</td>
                      <td className="p-4 w-40">
                         <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{width: `${(c.paidAmount/c.totalAmount)*100}%`}}></div>
                         </div>
                      </td>
                      <td className="p-4"><span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold border border-blue-200 uppercase">{safe(c.status)}</span></td>
                      <td className="p-4 text-right"><button onClick={() => { setSelected(c); setView('view'); }} className="p-2 text-slate-400 hover:text-blue-600"><Eye size={18}/></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="p-8 overflow-y-auto flex-1 bg-slate-200 custom-scrollbar rounded-2xl">
          <div className="max-w-[210mm] mx-auto bg-white p-20 shadow-2xl text-left text-black font-serif text-[11pt] leading-relaxed relative">
             <button onClick={() => setView('list')} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 no-print">×</button>
             <div className="flex justify-between mb-10 font-bold border-b pb-4"><div>г. Кемерово</div><div>{safe(selected.date)} г.</div></div>
             <h3 className="text-center font-bold text-[14pt] mb-12 uppercase leading-tight">Договор №{safe(selected.id)}<br/>оказания юридических услуг</h3>
             <p className="mb-6 text-justify">ИП Бондарь И.И. (Исполнитель) и <strong>{safe(selected.clientName)}</strong> (Заказчик) заключили договор...</p>
             <button onClick={() => setView('list')} className="mt-12 bg-slate-800 text-white px-6 py-2 rounded-lg text-xs font-bold no-print">Назад</button>
          </div>
        </div>
      )}
    </div>
  );
}

function PaymentsModule({ contracts }) {
  const format = (v) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(v);
  return (
    <div className="p-8 h-full max-w-7xl mx-auto flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0 text-left">
        <h2 className="text-2xl font-bold text-slate-800">Контроль платежей БФЛ</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2"><Plus size={16}/> Оплата</button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b sticky top-0 font-sans">
            <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest"><th className="p-4">Заказчик</th><th className="p-4">Срок оплаты</th><th className="p-4">Сумма</th><th className="p-4">Статус</th><th className="p-4 text-right">Действие</th></tr>
          </thead>
          <tbody className="divide-y text-sm">
             {contracts.filter(c => c.status === 'Активен').map(c => (
               <tr key={c.id} className="hover:bg-slate-50 font-sans">
                 <td className="p-4 font-bold text-left">{safe(c.clientName)}</td>
                 <td className="p-4 text-red-600 font-bold">{safe(c.nextPaymentDate)}</td>
                 <td className="p-4 font-bold text-slate-700">{format(c.monthlyPayment)}</td>
                 <td className="p-4"><span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded uppercase">Просрочено</span></td>
                 <td className="p-4 text-right"><button className="text-blue-600 hover:underline font-bold text-xs">Напомнить</button></td>
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
    <div className="p-8 h-full max-w-7xl mx-auto flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0 text-left">
        <h2 className="text-2xl font-bold text-slate-800">Вознаграждения АУ</h2>
        <button className="bg-[#1a2b4c] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2"><Plus size={16}/> Дело</button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col min-h-0">
         <div className="overflow-x-auto flex-1 custom-scrollbar">
           <table className="w-full text-left">
             <thead className="bg-slate-50 border-b sticky top-0">
               <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest"><th className="p-4">Дело</th><th className="p-4">Суд</th><th className="p-4">Этап</th><th className="p-4">Контроль</th><th className="p-4 text-right">Сумма</th></tr>
             </thead>
             <tbody className="divide-y text-sm">
                {cases.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-left">{safe(c.id)}<br/><span className="text-[10px] font-normal text-slate-400">{safe(c.debtor)}</span></td>
                    <td className="p-4 text-slate-500 text-left">{safe(c.court)}</td>
                    <td className="p-4 text-left"><span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[10px] font-bold uppercase">{safe(c.stage)}</span></td>
                    <td className="p-4 font-bold text-red-600 italic text-left">{safe(c.nextActionDate)}</td>
                    <td className="p-4 text-right font-bold text-green-600">{format(c.amount)}</td>
                  </tr>
                ))}
             </tbody>
           </table>
         </div>
         <div className="p-8 bg-slate-50 border-t flex flex-col items-center shrink-0">
            <UploadCloud size={32} className="text-blue-500 mb-2 opacity-50"/>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Сверка выписок (в разработке)</p>
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
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-left">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{safe(trend)}</div>
      </div>
      <div className="text-slate-500 text-[10px] font-bold uppercase mb-1">{safe(label)}</div>
      <div className="text-2xl font-black text-slate-800">{safe(value)}</div>
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