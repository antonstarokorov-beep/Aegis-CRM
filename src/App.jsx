import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, FileText, CreditCard, Scale, Settings, Bell, Search,
  Plus, FileSignature, Eye, EyeOff, ChevronLeft, Printer, TrendingUp,
  AlertCircle, CheckCircle2, Clock, Wallet, UploadCloud, FileSpreadsheet,
  MessageCircle, PhoneCall, ArrowRight, Ban, ScanFace, ShieldCheck,
  UserCircle, BarChart3, CalendarClock, Gavel, MailOpen, Lock, Server,
  Shield, PiggyBank, ArrowDownCircle, ArrowUpCircle, Filter, Trash2, Edit, 
  AlertTriangle, Upload, FileUp, Users, Briefcase, FileImage, Loader2, KeyRound
} from 'lucide-react';

// === Хук для работы с LocalStorage ===
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(error);
    }
  };
  return [storedValue, setValue];
}

// === Утилиты ===
const formatCurrency = (amount) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(amount || 0);
const getTodayString = () => new Date().toISOString().split('T')[0];

// === Пользователи (Ролевая модель) ===
const USERS = [
  { login: 'admin', password: '123', role: 'admin', name: 'Старокоров А.Б.', direction: 'all' },
  { login: 'bfl', password: '123', role: 'operator', name: 'Иванов И.И.', direction: 'БФЛ' },
  { login: 'family', password: '123', role: 'operator', name: 'Смирнова А.А.', direction: 'Семейное право' },
  { login: 'corp', password: '123', role: 'operator', name: 'Петров В.В.', direction: 'Корпоративное право' },
];

// === Моковые начальные данные ===
const initialContracts = [
  { id: '1411-ФЛ', type: 'individual', direction: 'БФЛ', executor: 'Иванов И.И.', date: '2025-01-10', clientName: 'Иванов Иван Иванович', phone: '+7 (999) 111-22-33', passport: '4210 123456 выдан УМВД по г. Кемерово', address: 'г. Кемерово, пр. Ленина, 1', totalAmount: 200000, initialPayment: 20000, installmentPeriod: 9, paidAmount: 80000, status: 'Активен', nextPaymentDate: getTodayString(), lastContact: null, monthlyPayment: 20000, currentMonthPaid: 0 },
  { id: '1412-ЮЛ', type: 'corporate', direction: 'Абонентское обслуживание', executor: 'Петров В.В.', date: '2025-02-01', clientName: 'ООО "Ромашка"', phone: '+7 (900) 000-00-00', passport: 'ИНН 4200000000', address: 'г. Кемерово, ул. Весенняя, 5', totalAmount: 0, initialPayment: 0, installmentPeriod: 12, paidAmount: 60000, status: 'Активен', nextPaymentDate: getTodayString(), lastContact: null, monthlyPayment: 30000, currentMonthPaid: 30000 },
  { id: '1413-ФЛ', type: 'individual', direction: 'Семейное право', executor: 'Смирнова А.А.', date: '2025-02-15', clientName: 'Сидорова Анна', phone: '+7 (900) 111-22-33', passport: '4212 654321 выдан ГУ МВД', address: 'г. Кемерово', totalAmount: 150000, initialPayment: 50000, installmentPeriod: 5, paidAmount: 50000, status: 'Активен', nextPaymentDate: getTodayString(), lastContact: null, monthlyPayment: 20000, currentMonthPaid: 0 },
];

const initialAuCases = [
  { id: 'А40-12345/2023', debtor: 'Петров В.В.', court: 'АС г. Москвы', status: 'pending', amount: 25000, lastAction: 'Ходатайство о перечислении', nextActionDate: getTodayString(), stage: 'Ждем определение' },
  { id: 'А27-9999/2024', debtor: 'ООО Техстрой', court: 'АС КО', status: 'pending', amount: 25000, lastAction: 'Ожидание возврата депозита', nextActionDate: '2025-12-10', stage: 'Ждем деньги' },
  { id: 'А40-55555/2022', debtor: 'Сидоров К.К.', court: 'АС г. Москвы', status: 'paid', amount: 25000, paidDate: '2025-02-15', stage: 'Завершено' }
];

const initialOperations = [
  { id: 1, type: 'income', kind: 'fact', date: getTodayString(), amount: 50000, category: 'БФЛ', direction: 'БФЛ', project: 'Иванов И.И.', customer: 'Иванов И.И.', executor: 'Иванов И.И.', comment: 'Оплата по договору 1411-ФЛ', createdBy: 'Иванов И.И.', needsCorrection: false },
  { id: 2, type: 'expense', kind: 'fact', date: getTodayString(), amount: 15000, category: 'Аренда', direction: 'Прочее', project: '', customer: '', executor: '', comment: 'Аренда офиса за текущий месяц', createdBy: 'Старокоров А.Б.', needsCorrection: false },
  { id: 3, type: 'income', kind: 'expected', date: '2026-12-31', amount: 45000, category: 'Судебные расходы', direction: 'Корпоративное право', project: 'Спор по сделке ООО Ромашка', executor: 'Петров В.В.', expectedSource: 'thirdParty', thirdPartyPayer: 'Ответчик ООО Альфа', expectationReason: 'судебные расходы', comment: 'Исполлист получен, ожидаем оплату', createdBy: 'Петров В.В.', needsCorrection: false },
  { id: 4, type: 'income', kind: 'fact', date: '2025-03-01', amount: 120000, category: 'Семейное право', direction: 'Семейное право', project: 'Раздел имущества Смирновых', customer: 'Смирнова А.', executor: 'Смирнова А.А.', comment: 'Успешное завершение', createdBy: 'Старокоров А.Б.', needsCorrection: false }
];

const DIRECTIONS = ['БФЛ', 'Семейное право', 'Корпоративное право', 'Банкротство ЮЛ', 'Лизинг', 'Абонентское обслуживание', 'АУ', 'Прочее'];
const INCOME_CATEGORIES = ['БФЛ', 'Семейное право', 'Корпоративное право', 'Банкротство ЮЛ', 'Лизинг', 'Абонентское обслуживание', 'АУ', 'Судебные расходы', 'Взыскание с ответчика', 'Прочее'];
const EXPENSE_CATEGORIES = ['Зарплата', 'Аренда', 'Реклама', 'Подрядчики', 'Госпошлины', 'Публикации', 'Почта', 'Связь', 'Сервисы', 'Налоги', 'Прочее'];

// === НАСТРОЙКИ API (ДЛЯ РЕАЛЬНОГО ПОИСКА БЕЗ ЗАГЛУШЕК) ===
// Зарегистрируйтесь бесплатно на dadata.ru, получите API-ключ и вставьте сюда:
const DADATA_API_KEY = "e69c0a7c7a75e278a4c1016e6a7e2124f5156632"; 

const AegisLogo = ({ size = 'large' }) => {
  const [imgError, setImgError] = useState(false);

  // Пытаемся загрузить пользовательский файл logo-a-1.png
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

  // Если файла нет, переключаемся на резервную иконку
  return (
    <div className={`flex items-center justify-center gap-3 ${size === 'large' ? 'mb-2 mt-4' : ''}`}>
      <div className="relative flex items-center justify-center">
        <Shield className="text-[#1a2b4c]" size={size === 'large' ? 46 : 32} strokeWidth={2} fill="#eab308" />
        <Scale className="absolute text-[#1a2b4c]" size={size === 'large' ? 24 : 16} strokeWidth={2.5} />
      </div>
      <div className="flex flex-col items-start leading-none">
        <span className={`${size === 'large' ? 'text-4xl' : 'text-2xl'} font-black text-[#1a2b4c] tracking-widest uppercase`}>ИДЖИС</span>
        <span className={`${size === 'large' ? 'text-[11px]' : 'text-[8px]'} font-bold text-slate-500 uppercase tracking-[0.25em] mt-1.5`}>Правовая защита</span>
      </div>
    </div>
  );
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Login states
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const [contracts, setContracts] = useLocalStorage('aegis_contracts', initialContracts);
  const [paymentsHistory, setPaymentsHistory] = useLocalStorage('aegis_payments', []);
  const [auCases, setAuCases] = useLocalStorage('aegis_au', initialAuCases);
  const [operations, setOperations] = useLocalStorage('aegis_operations', initialOperations);

  const pendingAuCasesCount = auCases.filter(c => c.status === 'pending' && c.nextActionDate <= getTodayString()).length;

  const handleLogin = (e) => {
    e.preventDefault();
    const user = USERS.find(u => u.login === loginInput && u.password === passwordInput);
    if (user) {
      setCurrentUser(user);
      setLoginError('');
      setActiveTab('dashboard');
    } else {
      setLoginError('Неверный логин или пароль');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginInput('');
    setPasswordInput('');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
        
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10">
          <div className="bg-white p-8 text-center relative border-b border-slate-100">
            <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] uppercase font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-1 rounded">
              <ShieldCheck size={12} /> TLS 1.3 Secure
            </div>
            <AegisLogo size="large" />
            <p className="text-slate-500 text-sm mt-2 font-medium">Система управленческого учета</p>
          </div>
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              {loginError && (
                <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium flex items-center gap-2">
                  <AlertCircle size={16} /> {loginError}
                </div>
              )}
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-1.5 uppercase tracking-wide">Логин</label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input required type="text" value={loginInput} onChange={e => setLoginInput(e.target.value)} placeholder="admin, bfl, family, corp" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1a2b4c] focus:bg-white outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-1.5 uppercase tracking-wide">Пароль</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input required type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1a2b4c] focus:bg-white outline-none transition-all" />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#1a2b4c] hover:bg-[#111e36] text-white font-bold py-3.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2 shadow-md">
                Войти в систему <ArrowRight size={18} />
              </button>
            </form>
            <div className="mt-6 text-center text-[11px] text-slate-400 leading-tight">
              Тестовый доступ: admin / 123. <br/>Данные сохраняются локально в вашем браузере.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Фильтрация данных по направлению юриста
  const viewableContracts = currentUser.role === 'admin' ? contracts : contracts.filter(c => c.direction === currentUser.direction);
  const viewableOperations = currentUser.role === 'admin' ? operations : operations.filter(o => o.direction === currentUser.direction);
  
  // Платежи БФЛ доступны только админу и юристам направления БФЛ
  const isBflAllowed = currentUser.role === 'admin' || currentUser.direction === 'БФЛ';

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      <aside className="w-64 bg-[#1a2b4c] text-slate-300 flex flex-col shadow-xl z-20 shrink-0">
        <div className="h-16 flex items-center justify-center border-b border-slate-700/50 bg-white shadow-sm shrink-0">
          <AegisLogo size="small" />
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          <NavItem icon={<LayoutDashboard size={20} />} label="Сводка" isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<FileText size={20} />} label="Договоры" isActive={activeTab === 'contracts'} onClick={() => setActiveTab('contracts')} />
          
          {isBflAllowed && (
            <NavItem icon={<CreditCard size={20} />} label="Оплаты (БФЛ)" isActive={activeTab === 'payments'} onClick={() => setActiveTab('payments')} />
          )}
          
          <div className="pt-4 pb-2"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3">Управленческий учет</p></div>
          <NavItem icon={<PiggyBank size={20} />} label="Финансы" isActive={activeTab === 'finance'} onClick={() => setActiveTab('finance')} />
          <div className="pt-4 pb-2"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3">Арбитраж</p></div>
          <NavItem icon={<Scale size={20} />} label="Вознаграждения АУ" isActive={activeTab === 'au'} onClick={() => setActiveTab('au')} badge={pendingAuCasesCount} />
        </nav>
        
        <div className="p-4 border-t border-slate-700/50 bg-[#111e36]">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold border-2 ${currentUser.role === 'admin' ? 'bg-amber-600 border-amber-500' : 'bg-slate-600 border-slate-500'}`}>
              {currentUser.role === 'admin' ? <ShieldCheck size={20} /> : <UserCircle size={20} />}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 truncate uppercase mt-0.5 tracking-wider">{currentUser.role === 'admin' ? 'Руководитель' : `Юрист (${currentUser.direction})`}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors flex items-center justify-center gap-2">
            Выйти из аккаунта
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10 shrink-0">
          <h1 className="text-2xl font-semibold text-slate-800">
            {activeTab === 'dashboard' && 'Рабочий стол'}
            {activeTab === 'contracts' && 'Реестр договоров и клиентов'}
            {activeTab === 'payments' && 'Контроль платежей'}
            {activeTab === 'finance' && 'Учет доходов и расходов'}
            {activeTab === 'au' && 'Вознаграждения АУ'}
          </h1>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Поиск..." className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#1a2b4c] outline-none w-48 transition-all" />
            </div>
            <button className="relative text-slate-500 hover:text-[#1a2b4c] transition-colors">
              <Bell size={22} />
              {operations.some(o => o.needsCorrection) && currentUser.role === 'admin' && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-slate-50 custom-scrollbar relative">
          {activeTab === 'dashboard' && <DashboardModule contracts={viewableContracts} operations={viewableOperations} auCases={auCases} onNavigate={setActiveTab} user={currentUser} />}
          {activeTab === 'contracts' && <ContractsModule contracts={viewableContracts} setContracts={setContracts} user={currentUser} allContracts={contracts} />}
          {activeTab === 'payments' && <PaymentsModule contracts={viewableContracts} setContracts={setContracts} paymentsHistory={paymentsHistory} setPaymentsHistory={setPaymentsHistory} user={currentUser} allContracts={contracts} />}
          {activeTab === 'finance' && <FinanceModule operations={viewableOperations} setOperations={setOperations} user={currentUser} allOperations={operations} />}
          {activeTab === 'au' && <AuModule cases={auCases} setCases={setAuCases} user={currentUser} />}
        </div>
      </main>
    </div>
  );
}

// ==========================================
// MODULE: DASHBOARD (WITH ANALYTICS)
// ==========================================
function DashboardModule({ contracts, operations, auCases, onNavigate, user }) {
  const [chartMode, setChartMode] = useState('balance');

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Базовые метрики
  const collectedThisMonth = operations.filter(o => o.type === 'income' && o.kind === 'fact' && new Date(o.date).getMonth() === currentMonth && new Date(o.date).getFullYear() === currentYear).reduce((sum, o) => sum + o.amount, 0);
  const expectedNextMonth = contracts.filter(c => c.status === 'Активен').reduce((sum, c) => sum + (c.monthlyPayment || 20000), 0);

  // Должники (только по видимым контрактам, обычно БФЛ)
  const overdueContracts = contracts.filter(c => c.status === 'Активен' && c.type === 'individual').map(c => {
      const diffDays = Math.ceil((new Date(c.nextPaymentDate).setHours(0,0,0,0) - new Date().setHours(0,0,0,0)) / (1000 * 60 * 60 * 24));
      const debtForMonth = c.monthlyPayment - c.currentMonthPaid;
      return { ...c, diffDays, debtForMonth };
    }).filter(c => c.diffDays < 0 && c.debtForMonth > 0).sort((a, b) => a.diffDays - b.diffDays);
  const totalOverdueDebt = overdueContracts.reduce((sum, c) => sum + c.debtForMonth, 0);
  
  const actionRequiredAuCases = auCases.filter(c => c.status === 'pending').map(c => ({ ...c, diffDays: Math.ceil((new Date(c.nextActionDate).setHours(0,0,0,0) - new Date().setHours(0,0,0,0)) / (1000 * 60 * 60 * 24)) })).filter(c => c.diffDays <= 0).sort((a, b) => a.diffDays - b.diffDays);

  // --- АНАЛИТИКА (Только для Admin) ---
  const lawyerStatsRaw = operations.filter(o => o.type === 'income' && o.kind === 'fact' && o.executor).reduce((acc, op) => {
    acc[op.executor] = (acc[op.executor] || 0) + op.amount; return acc;
  }, {});
  const lawyerStats = Object.entries(lawyerStatsRaw).map(([name, amount]) => ({ name, amount })).sort((a, b) => b.amount - a.amount);

  const directionStatsRaw = operations.filter(o => o.type === 'income' && o.kind === 'fact' && o.direction).reduce((acc, op) => {
    acc[op.direction] = (acc[op.direction] || 0) + op.amount; return acc;
  }, {});
  const directionStats = Object.entries(directionStatsRaw).map(([name, amount]) => ({ name, amount })).sort((a, b) => b.amount - a.amount);
  const totalDirectionRevenue = directionStats.reduce((s, d) => s + d.amount, 0);

  const chartDataBalance = [
    { label: 'Ноя', income: 380000, expense: 120000 }, { label: 'Дек', income: 450000, expense: 180000 }, 
    { label: 'Янв', income: 280000, expense: 110000 }, { label: 'Фев', income: 350000, expense: 140000 },
    { label: 'Тек. мес', income: collectedThisMonth, expense: operations.filter(o => o.type === 'expense' && o.kind === 'fact' && new Date(o.date).getMonth() === currentMonth).reduce((s,o)=>s+o.amount,0), isCurrent: true },
  ];
  const chartDataForecast = [
    { label: 'Ноя', amount: 380000 }, { label: 'Дек', amount: 450000 }, { label: 'Янв', amount: 280000 }, { label: 'Фев', amount: 350000 },
    { label: 'Тек. мес', amount: collectedThisMonth, isCurrent: true }, { label: 'След. мес', amount: expectedNextMonth, isForecast: true },
  ];
  const maxChartAmount = chartMode === 'balance' 
    ? Math.max(...chartDataBalance.map(d => Math.max(d.income, d.expense)), 1)
    : Math.max(...chartDataForecast.map(d => d.amount), 1);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {user.role === 'admin' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('finance')}>
              <div className="flex justify-between items-start mb-2"><div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg"><TrendingUp size={20} /></div><span className="text-[10px] font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded-full uppercase">Общий факт</span></div>
              <p className="text-xs font-medium text-slate-500 mb-1">Собрано в этом месяце</p>
              <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(collectedThisMonth)}</h3>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-indigo-200 bg-gradient-to-b from-white to-indigo-50/30">
              <div className="flex justify-between items-start mb-2"><div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-lg"><ArrowRight size={20} className="-rotate-45" /></div><span className="text-[10px] font-bold px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full uppercase">Прогноз</span></div>
              <p className="text-xs font-medium text-slate-500 mb-1">План сборов на след. месяц</p>
              <h3 className="text-2xl font-bold text-indigo-900">{formatCurrency(expectedNextMonth)}</h3>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('payments')}>
              <div className="flex justify-between items-start mb-2"><div className="p-2.5 bg-red-50 text-red-600 rounded-lg"><AlertCircle size={20} /></div><span className="text-[10px] font-bold px-2 py-1 bg-red-100 text-red-700 rounded-full uppercase">{overdueContracts.length} должников</span></div>
              <p className="text-xs font-medium text-slate-500 mb-1">Просрочки (Всего)</p>
              <h3 className="text-2xl font-bold text-red-600">{formatCurrency(totalOverdueDebt)}</h3>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('au')}>
              <div className="flex justify-between items-start mb-2"><div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg"><Scale size={20} /></div><span className="text-[10px] font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-full uppercase">{auCases.filter(c=>c.status==='pending').length} дел</span></div>
              <p className="text-xs font-medium text-slate-500 mb-1">Ожидаем из судов (АУ)</p>
              <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(auCases.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0))}</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-slate-800 flex items-center gap-2"><BarChart3 className="text-blue-600" size={20} /> Финансовая динамика</h2>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button onClick={() => setChartMode('balance')} className={`px-3 py-1.5 text-xs font-medium rounded ${chartMode === 'balance' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}>Доходы / Расходы</button>
                  <button onClick={() => setChartMode('forecast')} className={`px-3 py-1.5 text-xs font-medium rounded ${chartMode === 'forecast' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}>Прогноз БФЛ</button>
                </div>
              </div>
              <div className="flex-1 min-h-[200px] flex items-end justify-around gap-4 px-4 pb-2">
                {chartMode === 'balance' ? chartDataBalance.map((d, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10 text-center">Д: {formatCurrency(d.income)}<br/>Р: {formatCurrency(d.expense)}</div>
                    <div className="w-full flex justify-center items-end gap-1 h-[80%]">
                       <div className={`w-1/3 rounded-t-sm transition-all duration-500 ${d.isCurrent ? 'bg-green-500' : 'bg-green-300'}`} style={{ height: `${Math.max((d.income / maxChartAmount) * 100, 5)}%` }}></div>
                       <div className={`w-1/3 rounded-t-sm transition-all duration-500 ${d.isCurrent ? 'bg-red-500' : 'bg-red-300'}`} style={{ height: `${Math.max((d.expense / maxChartAmount) * 100, 5)}%` }}></div>
                    </div>
                    <span className={`text-xs font-medium text-center ${d.isCurrent ? 'text-blue-700 font-bold' : 'text-slate-500'}`}>{d.label}</span>
                  </div>
                )) : chartDataForecast.map((d, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">{formatCurrency(d.amount)}</div>
                    <div className="w-full flex justify-center h-[80%] items-end">
                      <div className={`w-2/3 rounded-t-md transition-all duration-500 ${d.isCurrent ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)]' : d.isForecast ? 'bg-indigo-300 border-2 border-dashed border-indigo-400 opacity-70' : 'bg-blue-200 hover:bg-blue-300'}`} style={{ height: `${Math.max((d.amount / maxChartAmount) * 100, 5)}%` }}></div>
                    </div>
                    <span className={`text-xs font-medium text-center ${d.isCurrent ? 'text-blue-700 font-bold' : d.isForecast ? 'text-indigo-600' : 'text-slate-500'}`}>{d.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
              <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><Briefcase className="text-amber-500" size={20} /> Выручка по направлениям</h2>
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                {directionStats.length > 0 ? directionStats.map((stat, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">{stat.name}</span>
                      <span className="font-bold text-[#1a2b4c]">{formatCurrency(stat.amount)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.max((stat.amount / totalDirectionRevenue) * 100, 2)}%` }}></div>
                    </div>
                  </div>
                )) : <div className="text-sm text-slate-400 text-center py-4">Нет данных о доходах</div>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-80">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50"><h2 className="font-bold text-slate-800 flex items-center gap-2"><PhoneCall className="text-red-500" size={18} /> Должники (БФЛ)</h2><button onClick={() => onNavigate('payments')} className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">К модулю <ArrowRight size={16} /></button></div>
              <div className="divide-y divide-slate-100 flex-1 overflow-y-auto">
                {overdueContracts.length > 0 ? overdueContracts.slice(0, 5).map(c => (
                  <div key={c.id} className="p-4 hover:bg-slate-50 flex items-center justify-between">
                    <div><p className="font-semibold text-slate-800">{c.clientName}</p><p className="text-xs text-slate-500 mt-0.5">{c.phone}</p></div>
                    <div className="text-right"><div className="text-sm font-bold text-red-600">Долг: {formatCurrency(c.debtForMonth)}</div><span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded mt-1 inline-block">Просрочка {Math.abs(c.diffDays)} дн.</span></div>
                  </div>
                )) : <div className="p-8 text-center text-slate-400">Идеально! Просрочек нет.</div>}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-80">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50"><h2 className="font-bold text-slate-800 flex items-center gap-2"><CalendarClock className="text-amber-500" size={18} /> Задачи АУ</h2><button onClick={() => onNavigate('au')} className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">К модулю <ArrowRight size={16} /></button></div>
              <div className="divide-y divide-slate-100 flex-1 overflow-y-auto">
                {actionRequiredAuCases.length > 0 ? actionRequiredAuCases.slice(0, 5).map(c => (
                  <div key={c.id} className="p-4 hover:bg-slate-50 flex items-center justify-between">
                    <div><p className="font-semibold text-slate-800">{c.id}</p><p className="text-xs text-slate-500 mt-0.5">{c.debtor} • {c.court}</p></div>
                    <div className="text-right"><div className="text-xs font-medium text-slate-600 mb-1">{c.stage}</div><span className={`text-[10px] font-bold px-2 py-0.5 rounded ${c.diffDays < 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{c.diffDays < 0 ? `Просрочено на ${Math.abs(c.diffDays)} дн.` : 'Задача на сегодня'}</span></div>
                  </div>
                )) : <div className="p-8 text-center text-slate-400">Все дела проконтролированы. Задач нет.</div>}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-80">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50"><h2 className="font-bold text-slate-800 flex items-center gap-2"><Users className="text-indigo-500" size={18} /> Эффективность юристов</h2></div>
              <div className="divide-y divide-slate-100 flex-1 overflow-y-auto custom-scrollbar p-2">
                {lawyerStats.length > 0 ? lawyerStats.map((lawyer, i) => (
                  <div key={i} className="p-3 flex items-center justify-between hover:bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">{i+1}</div>
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{lawyer.name}</p>
                      </div>
                    </div>
                    <span className="font-bold text-green-600">{formatCurrency(lawyer.amount)}</span>
                  </div>
                )) : <div className="p-8 text-center text-slate-400">Пока нет завершенных оплат</div>}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-100 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#1a2b4c]">Доброе утро, {user.name.split(' ')[0]}! 👋</h2>
              <p className="text-slate-600 mt-2 max-w-lg">Система подготовила вашу личную сводку задач. Ваше направление: <strong>{user.direction}</strong>.</p>
            </div>
            <div className="hidden md:flex gap-4">
              {user.direction === 'БФЛ' && (
                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 text-center cursor-pointer hover:bg-slate-50" onClick={() => onNavigate('payments')}><div className="text-2xl font-bold text-red-600">{overdueContracts.length}</div><div className="text-xs text-slate-500 font-medium">Звонков по долгам</div></div>
              )}
               <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 text-center">
                 <div className="text-2xl font-bold text-green-600">{formatCurrency(collectedThisMonth)}</div>
                 <div className="text-xs text-slate-500 font-medium">Ваш сбор (Факт мес.)</div>
               </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-80">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50"><h2 className="font-bold text-slate-800 flex items-center gap-2"><PhoneCall className="text-red-500" size={18} /> Ваши клиенты с просрочкой</h2></div>
              <div className="divide-y divide-slate-100 flex-1 overflow-y-auto">
                {overdueContracts.length > 0 ? overdueContracts.slice(0, 5).map(c => (
                  <div key={c.id} className="p-4 hover:bg-slate-50 flex items-center justify-between">
                    <div><p className="font-semibold text-slate-800">{c.clientName}</p><p className="text-xs text-slate-500 mt-0.5">{c.phone}</p></div>
                    <div className="text-right"><div className="text-sm font-bold text-red-600">Долг: {formatCurrency(c.debtForMonth)}</div><span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded mt-1 inline-block">Просрочка {Math.abs(c.diffDays)} дн.</span></div>
                  </div>
                )) : <div className="p-8 text-center text-slate-400">У ваших клиентов просрочек нет.</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// MODULE: NEW FINANCE 
// ==========================================
function FinanceModule({ operations, setOperations, user, allOperations }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedOp, setSelectedOp] = useState(null);
  const [filterDirection, setFilterDirection] = useState(user.role === 'admin' ? 'all' : user.direction);
  
  const filteredOperations = operations.filter(o => filterDirection === 'all' || o.direction === filterDirection);

  const factIncome = operations.filter(o => o.type === 'income' && o.kind === 'fact').reduce((s, o) => s + o.amount, 0);
  const factExpense = operations.filter(o => o.type === 'expense' && o.kind === 'fact').reduce((s, o) => s + o.amount, 0);
  const expectedIncome = operations.filter(o => o.type === 'income' && o.kind === 'expected').reduce((s, o) => s + o.amount, 0);
  const balance = factIncome - factExpense;

  const uniqueProjects = useMemo(() => [...new Set(allOperations.map(o => o.project).filter(Boolean))], [allOperations]);
  const uniqueExecutors = useMemo(() => [...new Set(allOperations.map(o => o.executor).filter(Boolean))], [allOperations]);

  const handleSaveOperation = (newOp) => {
    if (newOp.id) {
      setOperations(allOperations.map(o => o.id === newOp.id ? { ...newOp, needsCorrection: false } : o));
    } else {
      setOperations([{ ...newOp, id: Date.now(), needsCorrection: false }, ...allOperations]);
    }
    setShowAddModal(false); setSelectedOp(null);
  };

  const handleDelete = id => {
    if(window.confirm('Удалить?')) {
      setOperations(allOperations.filter(o=>o.id!==id));
      setSelectedOp(null);
    }
  };

  const handleRequestCorrection = id => {
    setOperations(allOperations.map(o=>o.id===id?{...o,needsCorrection:true}:o));
    setSelectedOp(null);
    alert('Запрос на исправление отправлен руководителю');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <p className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1"><ArrowDownCircle size={14} className="text-green-500"/> Доходы (Факт)</p>
          <h3 className="text-xl font-bold text-green-600">{formatCurrency(factIncome)}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <p className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1"><ArrowUpCircle size={14} className="text-red-500"/> Расходы (Факт)</p>
          <h3 className="text-xl font-bold text-red-600">{formatCurrency(factExpense)}</h3>
        </div>
        <div className="bg-[#1a2b4c] p-4 rounded-xl border border-[#111e36] shadow-sm flex flex-col justify-center relative overflow-hidden">
          <div className="absolute right-[-10px] bottom-[-10px] opacity-10"><PiggyBank size={80}/></div>
          <p className="text-xs font-medium text-slate-300 mb-1">Остаток (Прибыль)</p>
          <h3 className="text-2xl font-bold text-white relative z-10">{formatCurrency(balance)}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/30 shadow-sm flex flex-col justify-center">
          <p className="text-xs font-medium text-slate-500 mb-1">Дебиторка (Ожидаем)</p>
          <h3 className="text-xl font-bold text-amber-600">{formatCurrency(expectedIncome)}</h3>
        </div>
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3">
          <Filter size={18} className="text-slate-400" />
          {user.role === 'admin' ? (
             <select value={filterDirection} onChange={e => setFilterDirection(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg text-sm p-2 outline-none">
                <option value="all">Все направления</option>
                {DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}
             </select>
          ) : (
            <span className="text-sm font-medium bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100">Ваше направление: {user.direction}</span>
          )}
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm">
          <Plus size={18} /> Новая операция
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-xs text-slate-500 uppercase tracking-wider">
                <th className="p-4 font-medium">Дата</th>
                <th className="p-4 font-medium">Тип / Статья</th>
                <th className="p-4 font-medium">Направление</th>
                <th className="p-4 font-medium text-right">Сумма</th>
                <th className="p-4 font-medium">Проект / Исполнитель</th>
                <th className="p-4 font-medium text-center">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredOperations.sort((a,b) => new Date(b.date) - new Date(a.date)).map(op => (
                <tr key={op.id} className={`hover:bg-slate-50 transition-colors ${op.needsCorrection ? 'bg-red-50/50' : ''}`}>
                  <td className="p-4 whitespace-nowrap text-slate-600">{new Date(op.date).toLocaleDateString('ru-RU')}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {op.type === 'income' ? <ArrowDownCircle size={16} className={op.kind === 'fact' ? 'text-green-500' : 'text-amber-500'}/> : <ArrowUpCircle size={16} className={op.kind === 'fact' ? 'text-red-500' : 'text-slate-400'}/>}
                      <span className={`font-semibold ${op.type === 'income' ? 'text-green-700' : 'text-red-700'} ${op.kind === 'expected' && 'opacity-70'}`}>
                        {op.kind === 'fact' ? (op.type === 'income' ? 'Доход' : 'Расход') : 'Ожидание'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 ml-6">{op.category}</div>
                  </td>
                  <td className="p-4"><span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded text-[11px] font-medium">{op.direction}</span></td>
                  <td className={`p-4 text-right font-bold ${op.type === 'income' ? 'text-green-600' : 'text-red-600'} ${op.kind === 'expected' && 'opacity-60 border-b border-dashed'}`}>
                    {op.type === 'income' ? '+' : '-'}{formatCurrency(op.amount)}
                  </td>
                  <td className="p-4 text-xs text-slate-500 max-w-xs truncate">
                    {op.project && <div className="font-medium text-slate-700">{op.project}</div>}
                    {op.executor && <div className="text-slate-500">Юрист: {op.executor}</div>}
                    {op.needsCorrection && <div className="text-red-500 font-bold mt-1 flex items-center gap-1"><AlertTriangle size={12}/> Нужна правка</div>}
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => setSelectedOp(op)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md text-xs font-medium transition-colors">Подробнее</button>
                  </td>
                </tr>
              ))}
              {filteredOperations.length === 0 && (
                <tr><td colSpan="6" className="p-8 text-center text-slate-400">В данном направлении записей не найдено</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <datalist id="finance-projects">{uniqueProjects.map((p, i) => <option key={i} value={p}/>)}</datalist>
      <datalist id="finance-executors">{uniqueExecutors.map((e, i) => <option key={i} value={e}/>)}</datalist>

      {showAddModal && <FinanceAddModal onClose={() => setShowAddModal(false)} onSave={handleSaveOperation} user={user} />}
      {selectedOp && <FinanceViewModal op={selectedOp} onClose={() => setSelectedOp(null)} onSave={handleSaveOperation} onDelete={handleDelete} onRequestCorrection={handleRequestCorrection} user={user} />}
    </div>
  );
}

function FinanceAddModal({ onClose, onSave, user, initialData = null }) {
  const [formData, setFormData] = useState(initialData || { type: 'income', kind: 'fact', date: getTodayString(), amount: '', category: INCOME_CATEGORIES[0], direction: user.role === 'admin' ? DIRECTIONS[0] : user.direction, project: '', customer: '', executor: user.name, comment: '', expectedSource: 'customer', invoice: '', thirdPartyPayer: '', expectationReason: '', createdBy: user.name });
  const categories = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  useEffect(() => { if (!initialData) setFormData(prev => ({ ...prev, category: prev.type === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0] })); }, [formData.type]);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0"><h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><PiggyBank className="text-[#1a2b4c]" /> {initialData ? 'Редактировать запись' : 'Новая финансовая операция'}</h3><button onClick={onClose} className="text-slate-400 hover:text-slate-600"><Ban size={20}/></button></div>
        <div className="flex-1 overflow-y-auto p-6">
          <form id="finance-form" onSubmit={(e) => {e.preventDefault(); onSave({...formData, amount: Number(formData.amount)});}} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Тип операции</label>
                <div className="flex rounded-lg overflow-hidden border border-slate-200"><button type="button" onClick={() => setFormData({...formData, type: 'income'})} className={`flex-1 py-2 text-sm font-medium transition-colors ${formData.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>Доход (+)</button><button type="button" onClick={() => setFormData({...formData, type: 'expense'})} className={`flex-1 py-2 text-sm font-medium transition-colors ${formData.type === 'expense' ? 'bg-red-100 text-red-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>Расход (-)</button></div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Статус</label>
                <div className="flex rounded-lg overflow-hidden border border-slate-200"><button type="button" onClick={() => setFormData({...formData, kind: 'fact'})} className={`flex-1 py-2 text-sm font-medium transition-colors ${formData.kind === 'fact' ? 'bg-blue-100 text-blue-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>Фактически</button><button type="button" onClick={() => setFormData({...formData, kind: 'expected'})} className={`flex-1 py-2 text-sm font-medium transition-colors ${formData.kind === 'expected' ? 'bg-amber-100 text-amber-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>Ожидается</button></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Дата</label><input required type="date" className="w-full p-2.5 bg-white border border-slate-300 rounded-lg outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Сумма (руб.)</label><input required type="number" min="1" step="0.01" className="w-full p-2.5 bg-white border border-slate-300 rounded-lg outline-none font-bold text-lg" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Статья</label><select className="w-full p-2.5 bg-white border border-slate-300 rounded-lg outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Направление</label>
                {user.role === 'admin' ? <select className="w-full p-2.5 bg-white border border-slate-300 rounded-lg outline-none" value={formData.direction} onChange={e => setFormData({...formData, direction: e.target.value})}>{DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}</select> : <input type="text" disabled className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-medium" value={user.direction} />}
              </div>
            </div>

            {formData.type === 'income' && formData.kind === 'expected' && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-4">
                <p className="text-xs font-bold text-amber-800 uppercase">Специфика дебиторской задолженности</p>
                <div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-sm"><input type="radio" checked={formData.expectedSource === 'customer'} onChange={() => setFormData({...formData, expectedSource: 'customer'})} className="text-amber-600 focus:ring-amber-500"/> От Заказчика (по договору)</label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm"><input type="radio" checked={formData.expectedSource === 'thirdParty'} onChange={() => setFormData({...formData, expectedSource: 'thirdParty'})} className="text-amber-600 focus:ring-amber-500"/> От 3-го лица (Суд, АУ)</label>
                  </div>
                </div>
                {formData.expectedSource === 'customer' && <div><input type="text" placeholder="Например: Счет №12 от 10.03 (опционально)" className="w-full p-2 bg-white border border-amber-300 rounded-lg outline-none text-sm" value={formData.invoice} onChange={e => setFormData({...formData, invoice: e.target.value})} /></div>}
                {formData.expectedSource === 'thirdParty' && <div className="grid grid-cols-2 gap-4"><div><input type="text" placeholder="Кто плательщик (Ответчик)?" className="w-full p-2 bg-white border border-amber-300 rounded-lg outline-none text-sm" value={formData.thirdPartyPayer} onChange={e => setFormData({...formData, thirdPartyPayer: e.target.value})} /></div><div><input type="text" placeholder="Основание (Исполлист)" className="w-full p-2 bg-white border border-amber-300 rounded-lg outline-none text-sm" value={formData.expectationReason} onChange={e => setFormData({...formData, expectationReason: e.target.value})} /></div></div>}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
               <div><label className="block text-xs font-medium text-slate-500 mb-1">Проект / Дело</label><input type="text" list="finance-projects" placeholder="Начните вводить..." className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" value={formData.project} onChange={e => setFormData({...formData, project: e.target.value})} /></div>
               <div><label className="block text-xs font-medium text-slate-500 mb-1">Ответственный юрист</label><input type="text" list="finance-executors" placeholder="Начните вводить..." className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" value={formData.executor} onChange={e => setFormData({...formData, executor: e.target.value})} /></div>
               <div className="col-span-2"><label className="block text-xs font-medium text-slate-500 mb-1">Комментарий</label><textarea rows="2" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none resize-none" value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})}></textarea></div>
            </div>
          </form>
        </div>
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex gap-3 shrink-0"><button type="button" onClick={onClose} className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">Отмена</button><button type="submit" form="finance-form" className="flex-1 px-6 py-2.5 bg-[#1a2b4c] text-white font-medium rounded-lg hover:bg-[#111e36] flex justify-center items-center gap-2 transition-colors"><CheckCircle2 size={18} /> Сохранить запись</button></div>
      </div>
    </div>
  );
}

function FinanceViewModal({ op, onClose, onSave, onDelete, onRequestCorrection, user }) {
  const [isEditing, setIsEditing] = useState(false);
  
  if (isEditing && user.role === 'admin') {
     return <FinanceAddModal initialData={op} onClose={() => setIsEditing(false)} onSave={(updated) => { onSave(updated); setIsEditing(false); onClose(); }} user={user} />;
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        <div className={`p-5 flex justify-between items-center ${op.type === 'income' ? 'bg-green-50 border-b border-green-100' : 'bg-red-50 border-b border-red-100'}`}>
          <div><span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${op.kind === 'fact' ? 'bg-blue-600 text-white' : 'bg-amber-500 text-white'}`}>{op.kind === 'fact' ? 'Фактически' : 'Ожидание'}</span><h3 className={`font-bold text-xl mt-1 ${op.type === 'income' ? 'text-green-800' : 'text-red-800'}`}>{op.type === 'income' ? 'Доход' : 'Расход'} {formatCurrency(op.amount)}</h3></div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 self-start"><Ban size={20}/></button>
        </div>
        <div className="p-6 space-y-4 text-sm">
          {op.needsCorrection && <div className="p-3 bg-red-100 text-red-800 rounded-lg font-medium flex items-center gap-2 text-xs mb-2"><AlertTriangle size={16}/> Требуется исправление</div>}
          <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
            <div><p className="text-xs text-slate-400 mb-0.5">Дата</p><p className="font-medium text-slate-800">{new Date(op.date).toLocaleDateString('ru-RU')}</p></div>
            <div><p className="text-xs text-slate-400 mb-0.5">Направление</p><p className="font-medium text-[#1a2b4c] bg-blue-50 px-2 py-0.5 rounded inline-block">{op.direction}</p></div>
            <div className="col-span-2"><p className="text-xs text-slate-400 mb-0.5">Статья</p><p className="font-medium text-slate-800">{op.category}</p></div>
          </div>
          
          {op.kind === 'expected' && op.type === 'income' && (
             <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 space-y-2 mb-4">
               <p className="text-[10px] font-bold text-amber-800 uppercase">Детали ожидания</p>
               <p><span className="text-slate-500">Источник:</span> {op.expectedSource === 'customer' ? 'От заказчика' : 'От 3-го лица'}</p>
               {op.invoice && <p><span className="text-slate-500">Счет:</span> {op.invoice}</p>}
               {op.thirdPartyPayer && <p><span className="text-slate-500">Плательщик:</span> {op.thirdPartyPayer}</p>}
               {op.expectationReason && <p><span className="text-slate-500">Основание:</span> {op.expectationReason}</p>}
             </div>
          )}

          {(op.project || op.executor || op.comment) && (
            <div className="space-y-2">
              {op.project && <div><p className="text-xs text-slate-400">Проект</p><p>{op.project}</p></div>}
              {op.executor && <div><p className="text-xs text-slate-400">Юрист</p><p>{op.executor}</p></div>}
              {op.comment && <div><p className="text-xs text-slate-400">Комментарий</p><p className="text-slate-600 italic">"{op.comment}"</p></div>}
            </div>
          )}
          <div className="pt-2 text-xs text-slate-400 text-right">Внес: {op.createdBy}</div>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
          {user.role === 'admin' ? (
             <>
               <button onClick={() => setIsEditing(true)} className="flex-1 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium flex justify-center items-center gap-2 transition-colors"><Edit size={16}/> Изменить</button>
               <button onClick={() => onDelete(op.id)} className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium flex justify-center items-center gap-2 transition-colors"><Trash2 size={16}/> Удалить</button>
             </>
          ) : (
             <button onClick={() => onRequestCorrection(op.id)} disabled={op.needsCorrection} className="w-full py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-800 disabled:opacity-50 rounded-lg font-medium flex justify-center items-center gap-2 transition-colors">
               <AlertTriangle size={18}/> {op.needsCorrection ? 'Правка уже запрошена' : 'Запросить исправление у руководителя'}
             </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODULE: CONTRACTS
// ==========================================
const defaultContractTemplates = {
  'БФЛ': 'ДОГОВОР №{{id}}\nоказания юридических услуг\n\nг. Кемерово\n\nИндивидуальный предприниматель Бондарь И.И., именуемый в дальнейшем "Исполнитель", и {{clientName}}, именуемый(ая) в дальнейшем "Заказчик", заключили настоящий договор.\n\nПРЕДМЕТ ДОГОВОРА:\nИсполнитель обязуется оказать юридические услуги по направлению: {{direction}}. Ответственный юрист: {{executor}}.\n\nДАННЫЕ ЗАКАЗЧИКА:\nПаспорт: {{passport}}\nАдрес: {{address}}\nТелефон: {{phone}}\n\nПОРЯДОК ОПЛАТЫ:\nОбщая сумма по договору составляет {{totalAmount}}.\nЗаказчик вносит первоначальный взнос в размере {{initialPayment}}.\nОставшаяся сумма оплачивается в рассрочку на {{installmentPeriod}} мес. Ежемесячный платеж составляет: {{monthlyPayment}}.\n\nПОДПИСИ СТОРОН:\nИсполнитель ____________ / Бондарь И.И. /\nЗаказчик ____________ / {{clientName}} /',
  'Абонентское обслуживание': 'ДОГОВОР №{{id}}\nабонентского юридического обслуживания\n\nг. Кемерово\n\nИндивидуальный предприниматель Бондарь И.И., именуемый в дальнейшем "Исполнитель", и {{clientName}}, именуемый в дальнейшем "Заказчик", заключили настоящий договор.\n\nПРЕДМЕТ ДОГОВОРА:\nИсполнитель обязуется оказывать комплексное юридическое обслуживание (направление: {{direction}}). Ответственный юрист: {{executor}}.\n\nРЕКВИЗИТЫ ЗАКАЗЧИКА:\n{{passport}}\nЮридический адрес: {{address}}\nТелефон: {{phone}}\n\nПОРЯДОК ОПЛАТЫ:\nАбонентская плата составляет {{monthlyPayment}} ежемесячно.\nОплата производится не позднее 5-го числа каждого месяца.\n\nПОДПИСИ СТОРОН:\nИсполнитель ____________ / Бондарь И.И. /\nЗаказчик ____________ / {{clientName}} /',
};

function ContractsModule({ contracts, setContracts, user, allContracts }) {
  const [view, setView] = useState('list');
  const [selectedContract, setSelectedContract] = useState(null);
  const [templates, setTemplates] = useLocalStorage('aegis_contract_templates', defaultContractTemplates);
  
  const handleCreateContract = (newContract) => { 
    setContracts([{ ...newContract, status: 'Активен', paidAmount: 0, lastContact: null, currentMonthPaid: 0 }, ...allContracts]); 
    setView('list'); 
  };

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col h-full absolute inset-0">
      {view === 'list' && (
        <>
          <div className="flex justify-between items-center mb-6 shrink-0">
            <div><h2 className="text-2xl font-bold text-slate-800">Реестр договоров и клиентов</h2><p className="text-sm text-slate-500 mt-1 flex items-center gap-1"><Lock size={12} className="text-green-600"/> ПДн защищены в соответствии с ФЗ-152</p></div>
            <div className="flex gap-3">
              <button onClick={() => setView('templates')} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"><FileText size={18} /> Шаблоны</button>
              <button onClick={() => setView('create')} className="bg-[#1a2b4c] hover:bg-[#111e36] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"><Plus size={18} /> Новый договор</button>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 overflow-hidden relative">
            <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-slate-50 z-10"><tr className="border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider"><th className="p-4 font-medium">Номер / Тип</th><th className="p-4 font-medium">Клиент / Юрист</th><th className="p-4 font-medium">Сумма (Условия)</th><th className="p-4 font-medium">Статус</th><th className="p-4 font-medium text-right">Действия</th></tr></thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {contracts.map(contract => (
                      <tr key={contract.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-4">
                          <div className="font-semibold text-slate-800 flex items-center gap-2"><FileSignature size={16} className="text-slate-400" /> № {contract.id}</div>
                          <div className="text-[10px] text-white bg-slate-400 px-1.5 py-0.5 rounded inline-block mt-1">{contract.type === 'corporate' ? 'АБОНЕНТСКОЕ' : 'РАЗОВОЕ / БФЛ'}</div>
                        </td>
                        <td className="p-4 font-medium text-[#1a2b4c]">
                          {contract.clientName}
                          <div className="text-xs text-slate-500 font-normal mt-0.5">{contract.direction} • {contract.executor}</div>
                        </td>
                        <td className="p-4 text-slate-600 text-xs">
                          {contract.type === 'corporate' ? (
                            <div><span className="font-bold text-sm text-slate-800">{formatCurrency(contract.monthlyPayment)}</span> / мес</div>
                          ) : (
                            <div><span className="font-bold text-sm text-slate-800">{formatCurrency(contract.totalAmount)}</span><br/>Взнос: {formatCurrency(contract.initialPayment)}<br/>Рассрочка: {contract.installmentPeriod} мес.</div>
                          )}
                        </td>
                        <td className="p-4"><span className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-full tracking-wide ${contract.status === 'Активен' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>{contract.status}</span></td>
                        <td className="p-4 text-right"><button onClick={() => { setSelectedContract(contract); setView('view'); }} className="p-1.5 text-slate-400 hover:text-[#1a2b4c] hover:bg-slate-100 rounded transition-colors"><Eye size={18} /></button></td>
                      </tr>
                  ))}
                  {contracts.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-slate-400">Нет договоров по вашему направлению</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      {view === 'create' && <CreateContractForm onCancel={() => setView('list')} onSubmit={handleCreateContract} user={user} />}
      {view === 'view' && selectedContract && <ContractViewer contract={selectedContract} onBack={() => setView('list')} templates={templates} />}
      {view === 'templates' && <TemplatesManager templates={templates} setTemplates={setTemplates} onBack={() => setView('list')} />}
    </div>
  );
}

function CreateContractForm({ onCancel, onSubmit, user }) {
  const defaultDirection = user.role === 'admin' ? 'БФЛ' : user.direction;
  
  // ИСПРАВЛЕНИЕ: Добавлено поле monthlyPayment, чтобы избежать ошибки uncontrolled input в React
  const [formData, setFormData] = useState({ 
    type: 'individual', direction: defaultDirection, executor: user.name, 
    clientName: '', phone: '', passport: '', address: '', 
    id: `14${Math.floor(Math.random() * 1000)}-ФЛ`, date: getTodayString(), 
    totalAmount: 200000, initialPayment: 20000, installmentPeriod: 9,
    monthlyPayment: '' 
  });
  
  const [isScanning, setIsScanning] = useState(false);
  const [isSearchingInn, setIsSearchingInn] = useState(false);
  const [innSearch, setInnSearch] = useState('');

  const handleRealScan = async (e) => {
    if(!e.target.files.length) return;
    const file = e.target.files[0];
    setIsScanning(true);
    try {
      let text = '';
      if (file.type === 'application/pdf') {
        // Реальное чтение текста из PDF
        if (!window.pdfjsLib) {
          await new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
            script.onload = () => {
              window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
              resolve();
            };
            document.body.appendChild(script);
          });
        }
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          text += textContent.items.map(item => item.str).join(' ') + '\n';
        }
      } else if (file.type.startsWith('image/')) {
        // Реальное чтение текста с картинки (Tesseract OCR)
        if (!window.Tesseract) {
          await new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
            script.onload = resolve;
            document.body.appendChild(script);
          });
        }
        const worker = await window.Tesseract.createWorker('rus');
        const result = await worker.recognize(file);
        await worker.terminate();
        text = result.data.text;
      }

      // Улучшенный парсинг паспорта РФ
      const cleanText = text.replace(/\n/g, ' ').replace(/\s+/g, ' ');
      
      // 1. Серия и номер
      const passportMatch = cleanText.match(/(\d{2}\s*\d{2})\s*(\d{6})/);
      
      // 2. Кем выдан
      let issuedBy = '';
      const fmsMatch = cleanText.match(/(?:выдан\s+)?((?:ГУ МВД|УМВД|ОВД|МВД)[А-ЯЁа-яё\s.-]+?)(?:Дата выдачи|\d{2}\.\d{2}|код|$)/i);
      if (fmsMatch) issuedBy = fmsMatch[1].trim();

      // 3. ФИО (Ищем по маркерам "Фамилия" или три слова подряд ЗАГЛАВНЫМИ)
      let parsedClientName = '';
      const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
      
      const lastNameMatch = cleanText.match(/Фамилия\s*([А-ЯЁ]{3,})/i);
      const firstMidNameMatch = cleanText.match(/([А-ЯЁ]{3,})\s+([А-ЯЁ]+(ВИЧ|ВНА|ИЧ|НА))/i);
      
      if (lastNameMatch && firstMidNameMatch) {
          parsedClientName = `${capitalize(lastNameMatch[1])} ${capitalize(firstMidNameMatch[1])} ${capitalize(firstMidNameMatch[2])}`;
      } else {
          const fioMatch = cleanText.match(/([А-ЯЁ]{3,})\s+([А-ЯЁ]{3,})\s+([А-ЯЁ]+(ВИЧ|ВНА|ИЧ|НА))/i);
          if (fioMatch) parsedClientName = `${capitalize(fioMatch[1])} ${capitalize(fioMatch[2])} ${capitalize(fioMatch[3])}`;
      }

      // 4. Адрес прописки
      let parsedAddress = '';
      const addressMatch = cleanText.match(/ЗАРЕГИСТРИРОВАН\s*[\d\s]*(.*?)(?:УМВД|Отделом|ГУ МВД|Плание|Подпись|$)/i);
      if (addressMatch) {
          parsedAddress = addressMatch[1].replace(/Регком/ig, '').trim();
      }

      setFormData(prev => ({
        ...prev,
        passport: passportMatch ? `${passportMatch[1]} ${passportMatch[2]} ${issuedBy ? 'выдан ' + issuedBy : ''}`.trim() : prev.passport,
        clientName: parsedClientName || prev.clientName,
        address: parsedAddress || prev.address
      }));

    } catch (error) {
      alert('Ошибка при распознавании файла: ' + error.message);
    } finally {
      setIsScanning(false);
    }
  };

  const handleEgrulReal = async () => {
    if (!innSearch) return alert('Введите ИНН для поиска');
    setIsSearchingInn(true);
    try {
      if (!DADATA_API_KEY) {
        alert('ВНИМАНИЕ: API-ключ DaData не указан. Зарегистрируйтесь на dadata.ru (это бесплатно) и вставьте ключ в константу DADATA_API_KEY в начале кода.');
        setIsSearchingInn(false);
        return;
      }

      // Реальный запрос к ФНС/ЕГРЮЛ через DaData
      const res = await fetch("https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Token " + DADATA_API_KEY
        },
        body: JSON.stringify({ query: innSearch })
      });
      
      if (!res.ok) throw new Error('Ошибка соединения с DaData. Проверьте валидность API-ключа.');
      
      const data = await res.json();
      if (data.suggestions && data.suggestions.length > 0) {
        const company = data.suggestions[0].data;
        setFormData(prev => ({
          ...prev,
          clientName: company.name.full_with_opf || data.suggestions[0].value,
          address: company.address.value,
          passport: `ИНН ${company.inn} / ОГРН ${company.ogrn}`,
          phone: company.phones ? company.phones.join(', ') : ''
        }));
      } else {
        alert('Компания по такому ИНН не найдена в ЕГРЮЛ');
      }
    } catch (error) {
      alert('Сбой при запросе: ' + error.message);
    } finally {
      setIsSearchingInn(false);
    }
  };

  const handleCalculateAndSubmit = (e) => {
    e.preventDefault();
    const finalData = { ...formData };
    if (formData.type === 'individual') {
      finalData.monthlyPayment = (formData.totalAmount - formData.initialPayment) / formData.installmentPeriod;
      const dt = new Date(formData.date); dt.setMonth(dt.getMonth() + 1);
      finalData.nextPaymentDate = dt.toISOString().split('T')[0];
    } else {
      finalData.totalAmount = 0; 
      finalData.nextPaymentDate = getTodayString();
    }
    onSubmit(finalData);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8 w-full">
      <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
        <button onClick={onCancel} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"><ChevronLeft size={24} /></button>
        <div><h2 className="text-2xl font-bold">Оформление нового клиента</h2><p className="text-sm text-slate-500">Поддерживается автозаполнение данных (Паспорт / ЕГРЮЛ).</p></div>
      </div>
      
      <form onSubmit={handleCalculateAndSubmit} className="space-y-6">
        <div className="grid grid-cols-3 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase">Тип сотрудничества</label>
             <select className="w-full p-2.5 mt-1 bg-white border border-slate-300 rounded-lg outline-none" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value, id: `14${Math.floor(Math.random() * 1000)}-${e.target.value === 'corporate' ? 'ЮЛ' : 'ФЛ'}`})}>
               <option value="individual">Физ. лицо (Разовое / БФЛ)</option>
               <option value="corporate">Юр. лицо (Абонентка)</option>
             </select>
           </div>
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase">Направление</label>
             {user.role === 'admin' ? (
                <select className="w-full p-2.5 mt-1 bg-white border border-slate-300 rounded-lg outline-none" value={formData.direction} onChange={e => setFormData({...formData, direction: e.target.value})}>{DIRECTIONS.map(d=><option key={d}>{d}</option>)}</select>
             ) : (
                <input type="text" disabled className="w-full p-2.5 mt-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-medium" value={formData.direction} />
             )}
           </div>
           <div><label className="text-xs font-bold text-slate-500 uppercase">Ответственный юрист</label><input type="text" className="w-full p-2.5 mt-1 bg-white border border-slate-300 rounded-lg outline-none" value={formData.executor} onChange={e => setFormData({...formData, executor: e.target.value})} /></div>
        </div>

        {formData.type === 'individual' ? (
          <div className="border-2 border-dashed border-blue-200 bg-blue-50/50 p-6 rounded-xl flex items-center justify-center relative hover:bg-blue-50 transition-colors cursor-pointer">
            <input type="file" accept=".pdf, image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleRealScan} />
            <div className="text-center">
              {isScanning ? (
                 <div className="flex flex-col items-center text-blue-600"><Loader2 className="animate-spin mb-2" size={32}/><p className="font-medium">Анализ документа...</p></div>
              ) : (
                 <div className="flex flex-col items-center text-blue-600"><ScanFace size={32} className="mb-2 opacity-80"/><p className="font-medium">Загрузить скан паспорта (PDF или Фото)</p><p className="text-xs text-blue-500/80 mt-1">Реальное чтение текста</p></div>
              )}
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/50 p-6 rounded-xl flex items-center justify-center relative hover:bg-indigo-50 transition-colors">
            <div className="w-full text-center">
              {isSearchingInn ? (
                 <div className="flex flex-col items-center text-indigo-600"><Loader2 className="animate-spin mb-2" size={32}/><p className="font-medium">Реальный запрос в ЕГРЮЛ...</p></div>
              ) : (
                 <div className="flex flex-col items-center text-indigo-600">
                    <Server size={32} className="mb-2 opacity-80"/>
                    <p className="font-medium mb-3">Данные из ЕГРЮЛ (Интеграция)</p>
                    <div className="flex gap-2 max-w-sm mx-auto w-full z-10 relative">
                       <input type="text" placeholder="Введите ИНН..." className="flex-1 p-2 rounded-lg border border-indigo-200 outline-none text-sm text-slate-800" value={innSearch} onChange={e => setInnSearch(e.target.value)} />
                       <button type="button" onClick={handleEgrulReal} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">Найти</button>
                    </div>
                 </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2 col-span-2"><label className="text-sm font-medium">ФИО / Наименование компании</label><input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} /></div>
          <div className="space-y-2"><label className="text-sm font-medium">Телефон</label><input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
          <div className="space-y-2"><label className="text-sm font-medium">{formData.type === 'corporate' ? 'ИНН / ОГРН' : 'Паспортные данные'}</label><input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none" value={formData.passport} onChange={e => setFormData({...formData, passport: e.target.value})} /></div>
          <div className="space-y-2 col-span-2"><label className="text-sm font-medium">Адрес (Прописка / Юр. адрес)</label><input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} /></div>
        </div>

        <div className="border-t border-slate-200 pt-6 grid grid-cols-3 gap-6">
          {formData.type === 'individual' ? (
            <>
              <div><label className="text-sm font-medium">Общая сумма договора</label><input required type="number" className="w-full p-3 bg-amber-50 border border-amber-200 rounded-lg outline-none font-bold" value={formData.totalAmount} onChange={e => setFormData({...formData, totalAmount: Number(e.target.value)})} /></div>
              <div><label className="text-sm font-medium">Первоначальный взнос</label><input required type="number" className="w-full p-3 bg-amber-50 border border-amber-200 rounded-lg outline-none font-bold" value={formData.initialPayment} onChange={e => setFormData({...formData, initialPayment: Number(e.target.value)})} /></div>
              <div>
                <label className="text-sm font-medium">Период рассрочки (мес.)</label>
                <div className="flex items-center gap-3">
                   <input required type="number" className="w-20 p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none" value={formData.installmentPeriod} onChange={e => setFormData({...formData, installmentPeriod: Number(e.target.value)})} />
                   <div className="text-xs text-slate-500 leading-tight">Ежемесячно:<br/><strong className="text-slate-800 text-sm">{formatCurrency((formData.totalAmount - formData.initialPayment) / (formData.installmentPeriod || 1))}</strong></div>
                </div>
              </div>
            </>
          ) : (
            <div><label className="text-sm font-medium">Ежемесячная плата (Абонентка)</label><input required type="number" className="w-full p-3 bg-amber-50 border border-amber-200 rounded-lg outline-none font-bold" value={formData.monthlyPayment} onChange={e => setFormData({...formData, monthlyPayment: Number(e.target.value)})} /></div>
          )}
        </div>

        <div className="pt-6 flex justify-end gap-3"><button type="button" onClick={onCancel} className="px-5 py-2.5 bg-slate-100 rounded-lg font-medium text-slate-700 hover:bg-slate-200 transition-colors">Отмена</button><button type="submit" className="px-5 py-2.5 bg-[#1a2b4c] hover:bg-[#111e36] text-white rounded-lg font-medium transition-colors">Сохранить договор</button></div>
      </form>
    </div>
  );
}

function TemplatesManager({ templates, setTemplates, onBack }) {
  const [activeDir, setActiveDir] = useState(DIRECTIONS[0]);
  const [text, setText] = useState(templates[DIRECTIONS[0]] || '');

  useEffect(() => {
    setText(templates[activeDir] || '');
  }, [activeDir, templates]);

  const handleSave = () => {
    setTemplates(prev => ({ ...prev, [activeDir]: text }));
    alert('Шаблон успешно сохранен!');
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col h-[85vh] w-full">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4 shrink-0">
         <div className="flex items-center gap-4">
           <button onClick={onBack} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"><ChevronLeft size={24} /></button>
           <div>
             <h2 className="text-2xl font-bold text-slate-800">Шаблоны договоров</h2>
             <p className="text-xs text-slate-500 mt-1">Настройте стандартные тексты для каждого направления. <br/>Переменные для вставки: <span className="font-mono bg-slate-100 px-1 rounded text-slate-700">{`{{clientName}}, {{passport}}, {{totalAmount}}, {{monthlyPayment}}, {{direction}}, {{executor}}`}</span></p>
           </div>
         </div>
         <button onClick={handleSave} className="bg-[#1a2b4c] hover:bg-[#111e36] text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"><CheckCircle2 size={18}/> Сохранить</button>
      </div>
      <div className="flex gap-6 flex-1 min-h-0">
         <div className="w-1/4 overflow-y-auto border-r border-slate-100 pr-4 space-y-2 custom-scrollbar">
            {DIRECTIONS.map(d => (
               <button key={d} onClick={() => setActiveDir(d)} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeDir === d ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-slate-50 text-slate-600'}`}>{d}</button>
            ))}
         </div>
         <div className="flex-1 flex flex-col">
            <textarea className="flex-1 w-full p-6 border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 rounded-xl resize-none outline-none font-serif text-[11pt] leading-relaxed custom-scrollbar shadow-inner" value={text} onChange={e => setText(e.target.value)} placeholder={`Введите текст шаблона для направления "${activeDir}"...`} />
         </div>
      </div>
    </div>
  );
}

function ContractViewer({ contract, onBack, templates }) {
  const defaultDirTemplate = contract.type === 'corporate' ? templates['Абонентское обслуживание'] : templates['БФЛ'];
  const tpl = templates[contract.direction] || defaultDirTemplate || 'ДОГОВОР №{{id}}\n\nЗаказчик: {{clientName}}\nПаспорт/ИНН: {{passport}}\nАдрес: {{address}}\n\nСумма по договору: {{totalAmount}} (взнос: {{initialPayment}}, рассрочка: {{installmentPeriod}} мес.) Ежемесячный платеж: {{monthlyPayment}}';
  
  const formatCurrencyStr = (amount) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(amount || 0);

  const compiledText = tpl
    .replace(/{{id}}/g, contract.id)
    .replace(/{{clientName}}/g, contract.clientName)
    .replace(/{{direction}}/g, contract.direction)
    .replace(/{{executor}}/g, contract.executor)
    .replace(/{{passport}}/g, contract.passport)
    .replace(/{{address}}/g, contract.address)
    .replace(/{{phone}}/g, contract.phone)
    .replace(/{{totalAmount}}/g, formatCurrencyStr(contract.totalAmount))
    .replace(/{{initialPayment}}/g, formatCurrencyStr(contract.initialPayment))
    .replace(/{{installmentPeriod}}/g, contract.installmentPeriod || '0')
    .replace(/{{monthlyPayment}}/g, formatCurrencyStr(contract.monthlyPayment));

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between bg-white p-4 rounded-t-xl border border-slate-200 border-b-0 shrink-0"><div className="flex items-center gap-4"><button onClick={onBack} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded transition-colors"><ChevronLeft size={20} /></button><div><h3 className="font-bold">Предпросмотр договора №{contract.id}</h3></div></div><button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2"><Printer size={16}/> Печать</button></div>
      <div className="flex-1 overflow-y-auto bg-slate-200 p-8 border border-slate-200 rounded-b-xl custom-scrollbar">
        <div className="max-w-[210mm] mx-auto bg-white shadow-lg p-[20mm] text-[11pt] font-serif leading-relaxed text-black whitespace-pre-wrap break-words">
          {compiledText}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODULE: PAYMENTS
// ==========================================
function PaymentsModule({ contracts, setContracts, paymentsHistory, setPaymentsHistory, user, allContracts }) {
  const [view, setView] = useState('control'); 
  const [showAddModal, setShowAddModal] = useState(false);
  const [reminderData, setReminderData] = useState(null);
  const todayString = getTodayString();

  const activeContracts = contracts.filter(c => c.status === 'Активен' && c.type === 'individual');
  const analyzedContracts = activeContracts.map(c => {
    const diffDays = Math.ceil((new Date(c.nextPaymentDate).setHours(0,0,0,0) - new Date().setHours(0,0,0,0)) / (1000 * 60 * 60 * 24));
    const isMonthPaid = c.currentMonthPaid >= c.monthlyPayment;
    let zone = 'green';
    if (!isMonthPaid && diffDays < 0) zone = 'red';
    else if (!isMonthPaid && diffDays <= 5) zone = 'yellow';
    return { ...c, diffDays, zone, isMonthPaid };
  }).sort((a, b) => {
    if (a.zone === 'red' && b.zone !== 'red') return -1;
    if (a.zone !== 'red' && b.zone === 'red') return 1;
    return a.diffDays - b.diffDays;
  });

  const handleAddPayment = (paymentData) => {
    const amountPaid = Number(paymentData.amount);
    const newPayment = { id: Date.now(), contractId: paymentData.contractId, clientName: allContracts.find(c => c.id === paymentData.contractId).clientName, amount: amountPaid, date: todayString, operator: user.name };
    setPaymentsHistory([newPayment, ...paymentsHistory]);

    setContracts(allContracts.map(c => {
      if (c.id === paymentData.contractId) {
        const newTotalPaid = c.paidAmount + amountPaid;
        const newStatus = newTotalPaid >= c.totalAmount ? 'Исполнен' : 'Активен';
        let newCurrentMonthPaid = c.currentMonthPaid + amountPaid;
        let newNextDate = c.nextPaymentDate;
        if (newStatus === 'Активен' && newCurrentMonthPaid >= c.monthlyPayment) {
          const dt = new Date(c.nextPaymentDate);
          dt.setMonth(dt.getMonth() + 1);
          newNextDate = dt.toISOString().split('T')[0];
          newCurrentMonthPaid = newCurrentMonthPaid - c.monthlyPayment; 
        }
        return { ...c, paidAmount: newTotalPaid, status: newStatus, nextPaymentDate: newNextDate, currentMonthPaid: newCurrentMonthPaid, lastContact: null };
      }
      return c;
    }));
    setShowAddModal(false);
  };

  const handleLogContact = (contractId) => { setContracts(allContracts.map(c => c.id === contractId ? { ...c, lastContact: todayString } : c)); setReminderData(null); };

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col h-full absolute inset-0">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div className="flex bg-slate-200/50 p-1 rounded-lg">
          <button onClick={() => setView('control')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${view === 'control' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Контроль оплат</button>
          <button onClick={() => setView('history')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${view === 'history' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>История поступлений</button>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"><Plus size={18} />Внести оплату (БФЛ)</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-0">
        {view === 'control' && (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50 z-10"><tr className="border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider"><th className="p-4 font-medium w-12 text-center">Зона</th><th className="p-4 font-medium">Клиент / Договор</th><th className="p-4 font-medium w-64">Статус текущего платежа</th>{user.role === 'admin' && <th className="p-4 font-medium">Глоб. остаток</th>}<th className="p-4 font-medium text-right">Действие</th></tr></thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {analyzedContracts.map(contract => {
                  const isContactedToday = contract.lastContact === todayString;
                  const monthProgress = Math.min((contract.currentMonthPaid / contract.monthlyPayment) * 100, 100);
                  const debtForMonth = contract.monthlyPayment - contract.currentMonthPaid;
                  return (
                  <tr key={contract.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-center"><div className={`w-3 h-3 rounded-full mx-auto shadow-sm ${contract.zone === 'red' ? 'bg-red-500 animate-pulse' : contract.zone === 'yellow' ? 'bg-amber-400' : 'bg-green-500'}`}></div></td>
                    <td className="p-4"><div className="font-semibold text-slate-800">{contract.clientName}</div><div className="text-xs text-slate-500 mt-0.5">{contract.phone} • № {contract.id}</div></td>
                    <td className="p-4"><div className="flex justify-between text-xs mb-1"><span className="font-medium text-slate-700">Оплачено: {formatCurrency(contract.currentMonthPaid)}</span><span className="text-slate-500">из {formatCurrency(contract.monthlyPayment)}</span></div><div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1"><div className={`h-full rounded-full ${contract.zone === 'red' ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${monthProgress}%` }}></div></div><div className="flex justify-between items-center text-[11px]"><span className={contract.zone === 'red' ? 'text-red-600 font-bold' : 'text-slate-500'}>Срок: {new Date(contract.nextPaymentDate).toLocaleDateString('ru-RU')}</span>{debtForMonth > 0 && <span className="text-slate-400">Осталось: {formatCurrency(debtForMonth)}</span>}</div></td>
                    {user.role === 'admin' && <td className="p-4 font-medium text-slate-700">{formatCurrency(contract.totalAmount - contract.paidAmount)}</td>}
                    <td className="p-4 text-right">
                       {contract.zone === 'green' ? <span className="text-xs font-medium text-green-600 flex items-center justify-end gap-1"><CheckCircle2 size={14}/> В графике</span> : isContactedToday ? <span className="text-xs font-medium text-slate-400 flex items-center justify-end gap-1"><CheckCircle2 size={14}/> Связались</span> : <button onClick={() => setReminderData(contract)} className="text-xs font-medium text-red-600 hover:bg-red-50 bg-white border border-red-200 px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ml-auto shadow-sm"><PhoneCall size={14} /> Взыскать {formatCurrency(debtForMonth)}</button>}
                    </td>
                  </tr>
                )})}
                {analyzedContracts.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-slate-400">Нет договоров с активными платежами</td></tr>}
              </tbody>
            </table>
        )}
        {view === 'history' && (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50 z-10"><tr className="border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider"><th className="p-4 font-medium">Дата поступления</th><th className="p-4 font-medium">Клиент / Договор</th><th className="p-4 font-medium text-right">Сумма (руб.)</th><th className="p-4 font-medium">Принял</th></tr></thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {paymentsHistory.map(p => (<tr key={p.id} className="hover:bg-slate-50"><td className="p-4 font-medium text-slate-700">{new Date(p.date).toLocaleDateString('ru-RU')}</td><td className="p-4"><div className="font-semibold text-[#1a2b4c]">{p.clientName}</div><div className="text-xs text-slate-500 mt-0.5">№ {p.contractId}</div></td><td className="p-4 text-right"><span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+{formatCurrency(p.amount)}</span></td><td className="p-4 text-slate-500 text-xs">{p.operator}</td></tr>))}
                {paymentsHistory.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-slate-400">История платежей пуста</td></tr>}
              </tbody>
            </table>
        )}
        </div>
      </div>
      {showAddModal && <PaymentModal activeContracts={activeContracts} onClose={() => setShowAddModal(false)} onSubmit={handleAddPayment} />}
      {reminderData && <ReminderModal contract={reminderData} onClose={() => setReminderData(null)} onLog={() => handleLogContact(reminderData.id)} />}
    </div>
  );
}

function PaymentModal({ activeContracts, onClose, onSubmit }) {
  const [contractId, setContractId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [amount, setAmount] = useState('');
  const selectedContract = activeContracts.find(c => c.id === contractId);
  const suggestedAmount = selectedContract ? selectedContract.monthlyPayment - selectedContract.currentMonthPaid : '';
  const filteredContracts = activeContracts.filter(c => c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase()));
  
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"><div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"><div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50"><h3 className="font-bold text-lg flex items-center gap-2"><Wallet className="text-green-600" />Прием платежа БФЛ</h3><button onClick={onClose} className="text-slate-400 hover:text-slate-600"><Ban size={20}/></button></div><form onSubmit={(e) => { e.preventDefault(); if (!contractId) return alert('Выберите клиента'); onSubmit({ contractId, amount: amount || suggestedAmount }); }} className="p-6 space-y-5"><div className="relative"><label className="block text-sm font-medium mb-1">Клиент (Поиск по ФИО)</label><input required={!contractId} type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm" placeholder="Начните вводить ФИО..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true); if (contractId) setContractId(''); }} onFocus={() => setShowDropdown(true)} onBlur={() => setTimeout(() => setShowDropdown(false), 200)} />{showDropdown && filteredContracts.length > 0 && (<ul className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-auto">{filteredContracts.map(c => (<li key={c.id} className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100" onMouseDown={() => { setContractId(c.id); setSearchTerm(`${c.clientName} (№${c.id})`); setAmount(c.monthlyPayment - c.currentMonthPaid); setShowDropdown(false); }}><div className="font-medium text-sm">{c.clientName}</div><div className="text-xs text-slate-500">Долг за месяц: {c.monthlyPayment - c.currentMonthPaid} руб.</div></li>))}</ul>)}</div><div><label className="block text-sm font-medium mb-1">Сумма (руб.)</label><input required type="number" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold text-lg" value={amount} onChange={(e) => setAmount(e.target.value)} /></div><div className="pt-2 flex gap-3"><button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-medium">Отмена</button><button type="submit" className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium">Провести</button></div></form></div></div>
  );
}

function ReminderModal({ contract, onClose, onLog }) {
  const [comment, setComment] = useState('');
  const debt = contract.monthlyPayment - contract.currentMonthPaid;
  const tmpl = `Здравствуйте, ${contract.clientName.split(' ')[1] || 'Клиент'}! Вас беспокоит "Иджис". У вас подошел срок платежа. Остаток за месяц: ${debt} руб. Ожидаем оплату.`;
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"><div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"><div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50"><h3 className="font-bold text-lg flex items-center gap-2"><PhoneCall className="text-blue-600" /> Связаться</h3><button onClick={onClose} className="text-slate-400 hover:text-slate-600"><Ban size={20}/></button></div><div className="p-6 space-y-6"><div className="flex justify-between items-center bg-red-50 p-4 rounded-lg border border-red-100"><div><p className="font-bold">{contract.clientName}</p><p className="text-xl font-mono text-red-700 font-bold mt-1">{contract.phone}</p></div><div className="text-right"><p className="text-sm">Остаток</p><p className="text-xl font-bold text-red-600">{debt} руб.</p></div></div><div><label className="block text-sm font-medium mb-2">Шаблон (WhatsApp)</label><div className="relative"><textarea readOnly className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm resize-none h-24 outline-none" value={tmpl} /><button onClick={() => { navigator.clipboard.writeText(tmpl); alert('Скопировано'); }} className="absolute right-2 bottom-2 bg-green-100 text-green-700 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 border border-green-200 transition-colors hover:bg-green-200"><MessageCircle size={14} /> Копировать</button></div></div><div><label className="block text-sm font-medium mb-2">Результат контакта</label><textarea className="w-full p-3 border border-slate-300 rounded-lg outline-none text-sm resize-none h-20" placeholder="Обещал оплатить..." value={comment} onChange={(e) => setComment(e.target.value)}></textarea></div></div><div className="p-5 border-t border-slate-100 bg-slate-50 flex gap-3"><button onClick={onClose} className="flex-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors font-medium">Отмена</button><button onClick={onLog} className="flex-1 px-4 py-2 bg-[#1a2b4c] hover:bg-[#111e36] text-white rounded-lg flex justify-center items-center gap-2 transition-colors font-medium"><CheckCircle2 size={18} /> Зафиксировать звонок</button></div></div></div>
  );
}

// ==========================================
// MODULE: AU REMUNERATION (Интеллектуальная сверка + Контроль задач)
// ==========================================
function AuModule({ cases, setCases, user }) {
  const [view, setView] = useState('pending');
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionModalCase, setActionModalCase] = useState(null);
  
  const todayStr = getTodayString();
  
  // Вычисляем задержку для сортировки и отображения в вкладке "В работе"
  const pendingCases = cases.filter(c => c.status === 'pending').map(c => ({
    ...c,
    diffActionDays: Math.ceil((new Date(c.nextActionDate).setHours(0,0,0,0) - new Date().setHours(0,0,0,0)) / (1000 * 60 * 60 * 24))
  })).sort((a, b) => a.diffActionDays - b.diffActionDays);

  const historyCases = cases.filter(c => c.status === 'paid').sort((a, b) => new Date(b.paidDate) - new Date(a.paidDate));

  const handleLogAction = (caseId, actionType, nextDate, stage) => { 
    setCases(cases.map(c => c.id === caseId ? { ...c, lastAction: actionType, nextActionDate: nextDate, stage: stage } : c)); 
    setActionModalCase(null); 
  };

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col h-full absolute inset-0">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div className="flex bg-slate-200/50 p-1 rounded-lg">
          <button onClick={() => setView('pending')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${view === 'pending' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>В работе ({pendingCases.length})</button>
          <button onClick={() => setView('reconciliation')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${view === 'reconciliation' ? 'bg-white text-[#1a2b4c] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><span className="flex items-center gap-2"><FileSpreadsheet size={16}/> Сверка выписок (PDF)</span></button>
          <button onClick={() => setView('history')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${view === 'history' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Архив зачислений</button>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-[#1a2b4c] hover:bg-[#111e36] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"><Plus size={18} /> Добавить дело</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-0">
        {view === 'pending' && (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50 z-10">
                <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                  <th className="p-4 font-medium">Дело / Должник</th>
                  <th className="p-4 font-medium">Текущий этап</th>
                  <th className="p-4 font-medium">Контроль задачи</th>
                  {user.role === 'admin' && <th className="p-4 font-medium text-right">Сумма (Депозит)</th>}
                  <th className="p-4 font-medium text-right">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {pendingCases.map(c => {
                  const isTaskUrgent = c.diffActionDays <= 0;
                  return (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-[#1a2b4c]">{c.id}</div>
                      <div className="text-sm text-slate-600 mt-0.5">{c.debtor}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${c.stage === 'Ждем определение' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>{c.stage}</span>
                      <div className="text-[11px] text-slate-500 mt-1">Посл. шаг: {c.lastAction}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className={`text-xs font-bold px-2 py-1 rounded inline-block w-max flex items-center gap-1 ${isTaskUrgent ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-600'}`}>
                          <CalendarClock size={12} /> {isTaskUrgent ? 'Просрочено' : `До: ${new Date(c.nextActionDate).toLocaleDateString('ru-RU')}`}
                        </span>
                      </div>
                    </td>
                    {user.role === 'admin' && <td className="p-4 text-right font-semibold text-slate-800">{formatCurrency(c.amount)}</td>}
                    <td className="p-4 text-right">
                      <button onClick={() => setActionModalCase(c)} className={`text-xs font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ml-auto border ${isTaskUrgent ? 'bg-amber-500 text-white hover:bg-amber-600 border-amber-600' : 'bg-white text-amber-600 border-amber-200 hover:bg-amber-50'}`}>
                        Обновить статус
                      </button>
                    </td>
                  </tr>
                )})}
                {pendingCases.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-slate-400">Нет активных дел АУ</td></tr>}
              </tbody>
            </table>
        )}
        {view === 'reconciliation' && <AuReconciliation pendingCases={pendingCases} onConfirmPayment={(caseId, actualAmount) => setCases(cases.map(c => c.id === caseId ? { ...c, status: 'paid', paidDate: todayStr, amount: actualAmount || c.amount, stage: 'Завершено' } : c))} />}
        {view === 'history' && (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50 z-10">
                <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Дата закрытия</th>
                  <th className="p-4">Дело / Должник</th>
                  <th className="p-4">Суд</th>
                  <th className="p-4 text-right">Зачислено</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {historyCases.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-700">{new Date(c.paidDate).toLocaleDateString('ru-RU')}</td>
                    <td className="p-4"><div className="font-bold text-[#1a2b4c]">{c.id}</div><div className="text-xs text-slate-500 mt-0.5">{c.debtor}</div></td>
                    <td className="p-4 text-slate-600">{c.court}</td>
                    <td className="p-4 text-right"><span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+{formatCurrency(c.amount)}</span></td>
                  </tr>
                ))}
                {historyCases.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-slate-400">Архив пуст</td></tr>}
              </tbody>
            </table>
        )}
        </div>
      </div>
      {showAddModal && <AuAddCaseModal onClose={() => setShowAddModal(false)} onSubmit={(newCase) => setCases([{ ...newCase, status: 'pending', amount: 25000, lastAction: 'Взято в работу', nextActionDate: getTodayString(), stage: 'Ждем определение' }, ...cases])} />}
      {actionModalCase && <AuActionModal caseData={actionModalCase} onClose={() => setActionModalCase(null)} onLogAction={(type, date, stage) => handleLogAction(actionModalCase.id, type, date, stage)} />}
    </div>
  );
}

function AuReconciliation({ pendingCases, onConfirmPayment }) {
  const [inputText, setInputText] = useState("");
  const [matched, setMatched] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRealFileUpload = async (e) => {
    if(!e.target.files.length) return;
    const file = e.target.files[0];
    setIsProcessing(true);
    
    try {
      let parsedText = '';
      if (file.type === 'application/pdf') {
        // Подключаем реальный PDF.js парсер без бекенда
        if (!window.pdfjsLib) {
          await new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
            script.onload = () => {
              window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
              resolve();
            };
            document.body.appendChild(script);
          });
        }
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          parsedText += textContent.items.map(item => item.str).join(' ') + '\n';
        }
      } else {
        parsedText = await file.text();
      }

      setInputText(parsedText);
      
      const res = []; 
      pendingCases.forEach(c => { 
        // Реальный поиск номера дела в тексте документа
        // Ищем совпадения (учитывая, что дефисы или слэши могут иногда распознаваться как пробелы)
        if (parsedText.includes(c.id) || parsedText.replace(/-/g, '').includes(c.id.replace(/-/g, ''))) {
           res.push({...c, actualAmount: c.amount}); 
        }
      }); 
      setMatched(res);

    } catch (error) {
       alert('Не удалось прочитать PDF: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-full divide-x divide-slate-200">
      <div className="w-1/2 p-8 flex flex-col bg-slate-50">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><FileUp/> Загрузка выписки банка</h3>
        
        <div className="relative border-2 border-dashed border-slate-300 hover:border-blue-400 bg-white rounded-xl p-10 flex flex-col items-center justify-center transition-colors mb-4 group">
          <input type="file" accept=".pdf,.txt" onChange={handleRealFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"/>
          {isProcessing ? (
             <div className="text-center text-blue-600"><Loader2 className="animate-spin mb-4 mx-auto" size={40}/><p className="font-medium">Извлекаем текст из документа...</p></div>
          ) : (
             <div className="text-center text-slate-400 group-hover:text-blue-500 transition-colors"><UploadCloud size={48} className="mb-4 mx-auto"/><p className="font-medium text-slate-600 mb-1">Перетащите реальный PDF выписки сюда</p><p className="text-xs">или нажмите для выбора файла</p></div>
          )}
        </div>

        <textarea className="flex-1 w-full p-4 border border-slate-200 rounded-lg resize-none text-xs font-mono bg-white text-slate-600 outline-none" value={inputText} readOnly placeholder="Здесь появится реально распознанный текст банковской выписки..."></textarea>
      </div>
      <div className="w-1/2 p-8 flex flex-col bg-white overflow-auto">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><CheckCircle2 className="text-green-500"/> Найденные совпадения ({matched.length})</h3>
        {matched.length === 0 && inputText && !isProcessing && <div className="p-4 bg-amber-50 text-amber-700 rounded-lg">Совпадений по текущим делам не найдено.</div>}
        {matched.map(c => (
          <div key={c.id} className="border border-green-200 bg-green-50 p-4 rounded-xl mb-3 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div><span className="font-bold text-green-800 bg-green-200/50 px-2 py-1 rounded text-sm">{c.id}</span><p className="text-xs text-green-700 mt-1">{c.debtor}</p></div>
              <span className="text-lg font-bold text-green-700">+{formatCurrency(c.actualAmount)}</span>
            </div>
            <button onClick={() => { onConfirmPayment(c.id, c.actualAmount); setMatched(matched.filter(r => r.id !== c.id)); }} className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors">Связать и Подтвердить поступление</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuAddCaseModal({ onClose, onSubmit }) {
  const [f, setF] = useState({ id: '', debtor: '', court: '' });
  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Новое дело АУ</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><Ban size={20}/></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(f); }} className="space-y-4">
          <input required type="text" placeholder="Номер дела (напр. А40-123/24)" className="w-full p-2.5 border rounded-lg outline-none" onChange={e => setF({...f, id: e.target.value})} />
          <input required type="text" placeholder="ФИО / Наименование должника" className="w-full p-2.5 border rounded-lg outline-none" onChange={e => setF({...f, debtor: e.target.value})} />
          <input required type="text" placeholder="Суд (напр. АС г. Москвы)" className="w-full p-2.5 border rounded-lg outline-none" onChange={e => setF({...f, court: e.target.value})} />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 font-medium p-2.5 rounded-lg transition-colors">Отмена</button>
            <button type="submit" className="flex-1 bg-[#1a2b4c] hover:bg-[#111e36] text-white font-medium p-2.5 rounded-lg transition-colors">Добавить дело</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AuActionModal({ caseData, onClose, onLogAction }) {
  const [act, setAct] = useState('Ходатайство о перечислении');
  const [st, setSt] = useState(caseData.stage);
  const [dt, setDt] = useState(getTodayString());

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Контроль дела АУ</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><Ban size={20}/></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onLogAction(act, dt, st); }} className="space-y-4">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="font-bold text-[#1a2b4c]">{caseData.id}</p>
            <p className="text-sm text-slate-600">{caseData.debtor}</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Что сделали?</label>
            <input required type="text" className="w-full p-2.5 border rounded-lg outline-none" placeholder="Например: Подали ходатайство" value={act} onChange={e=>setAct(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Новый этап дела</label>
            <select className="w-full p-2.5 border rounded-lg outline-none" value={st} onChange={e=>setSt(e.target.value)}>
              <option>Ждем определение</option>
              <option>Ждем деньги</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Срок следующего контроля</label>
            <input required type="date" className="w-full p-2.5 border rounded-lg outline-none" value={dt} onChange={e=>setDt(e.target.value)} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 font-medium p-2.5 rounded-lg transition-colors">Отмена</button>
            <button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium p-2.5 rounded-lg transition-colors">Зафиксировать</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// SHARED UI COMPONENTS
// ==========================================
function NavItem({ icon, label, isActive, onClick, badge }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${isActive ? 'bg-[#2a3f6c] text-white shadow-inner' : 'text-slate-400 hover:bg-[#203257] hover:text-slate-200'}`}>
      <div className={isActive ? 'text-amber-500' : ''}>{icon}</div><span className="font-medium text-sm flex-1 text-left">{label}</span>
      {badge > 0 && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-amber-500 text-[#1a2b4c]' : 'bg-slate-700 text-slate-300'}`}>{badge}</span>}
    </button>
  );
}