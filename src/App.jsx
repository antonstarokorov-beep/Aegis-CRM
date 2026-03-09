import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  Scale, 
  Settings, 
  Bell, 
  Search,
  Plus,
  FileSignature,
  Eye,
  EyeOff,
  ChevronLeft,
  Printer,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Wallet,
  UploadCloud,
  FileSpreadsheet,
  MessageCircle,
  PhoneCall,
  ArrowRight,
  Ban,
  ScanFace,
  ShieldCheck,
  UserCircle,
  BarChart3,
  CalendarClock,
  Gavel,
  MailOpen,
  Lock,
  Server,
  Shield
} from 'lucide-react';

// Умный компонент логотипа
const AegisLogo = ({ size = 'large' }) => {
  const [imgError, setImgError] = useState(false);

  // Пытаемся загрузить пользовательский файл logo-a-1.png
  if (!imgError) {
    return (
      <img 
        src="logo-a-1.png" 
        alt="ИДЖИС" 
        className={`${size === 'large' ? 'h-20 mb-4' : 'h-10'} mx-auto object-contain transition-all`}
        onError={() => setImgError(true)} // Если файла нет, переключаемся на заглушку
      />
    );
  }

  // Временная векторная заглушка (если картинки нет в папке)
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState('admin');

  // Глобальное состояние
  const [contracts, setContracts] = useState([
    { id: '1411-ФЛ', date: '2024-11-01', clientName: 'Иванов Иван Иванович', phone: '+7 (999) 111-22-33', passport: '4210 123456 выдан УМВД по г. Кемерово', totalAmount: 200000, paidAmount: 80000, status: 'Активен', nextPaymentDate: '2025-03-05', lastContact: null, monthlyPayment: 20000, currentMonthPaid: 0 },
    { id: '1412-ФЛ', date: '2025-01-15', clientName: 'Смирнов Алексей Викторович', phone: '+7 (900) 000-00-00', passport: '4212 654321 выдан ГУ МВД по КО', totalAmount: 150000, paidAmount: 150000, status: 'Исполнен', nextPaymentDate: null, lastContact: null, monthlyPayment: 20000, currentMonthPaid: 20000 },
    { id: '1413-ФЛ', date: '2025-02-20', clientName: 'Королева Елена Андреевна', phone: '+7 (923) 456-78-90', passport: '4208 987654 выдан ОВД Центрального р-на', totalAmount: 220000, paidAmount: 20000, status: 'Активен', nextPaymentDate: '2025-03-20', lastContact: null, monthlyPayment: 20000, currentMonthPaid: 0 },
    { id: '1414-ФЛ', date: '2024-12-10', clientName: 'Петров Петр Петрович', phone: '+7 (905) 123-45-67', passport: '4215 112233 выдан ОУФМС РФ', totalAmount: 245000, paidAmount: 50000, status: 'Активен', nextPaymentDate: '2025-02-28', lastContact: '2025-03-01', monthlyPayment: 25000, currentMonthPaid: 10000 }, 
  ]);

  const [paymentsHistory, setPaymentsHistory] = useState([
    { id: 1, contractId: '1411-ФЛ', clientName: 'Иванов Иван Иванович', amount: 20000, date: '2025-03-02', operator: 'Старокоров А.Б.' },
    { id: 2, contractId: '1414-ФЛ', clientName: 'Петров Петр Петрович', amount: 10000, date: '2025-03-05', operator: 'Сидорова М.' },
  ]);

  const [auCases, setAuCases] = useState([
    { id: 'А40-12345/2023', debtor: 'Петров В.В.', court: 'АС г. Москвы', completionDate: '2024-12-10', status: 'pending', amount: 25000, lastAction: 'Ходатайство о перечислении', nextActionDate: '2025-03-05', stage: 'Ждем определение' },
    { id: 'А56-7890/2023', debtor: 'Сидорова А.А.', court: 'АС СПб и ЛО', completionDate: '2025-01-20', status: 'pending', amount: 25000, lastAction: 'Вынесено определение', nextActionDate: '2025-03-25', stage: 'Ждем деньги (Бухгалтерия)' },
    { id: 'А41-5555/2023', debtor: 'Кузнецов М.И.', court: 'АС МО', completionDate: '2025-02-25', status: 'pending', amount: 25000, lastAction: 'Созвон с пом. судьи', nextActionDate: '2025-03-08', stage: 'Ждем определение' },
    { id: 'А45-999/2023', debtor: 'Николаев С.С.', court: 'АС Новосибирской обл.', completionDate: '2024-11-05', status: 'paid', amount: 25000, paidDate: '2025-01-15', stage: 'Завершено' },
  ]);

  const today = new Date('2025-03-08').toISOString().split('T')[0];
  const pendingAuCasesCount = auCases.filter(c => c.status === 'pending' && c.nextActionDate <= today).length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-white p-8 text-center relative border-b border-slate-100">
            <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] uppercase font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-1 rounded">
              <ShieldCheck size={12} /> TLS 1.3 Secure
            </div>
            {/* Здесь загрузится логотип */}
            <AegisLogo size="large" />
            <p className="text-slate-500 text-sm mt-2 font-medium">Корпоративный защищенный портал</p>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Логин сотрудника</label>
                <input type="text" defaultValue="admin@aegis.ru" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1a2b4c] outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Пароль</label>
                <input type="password" defaultValue="********" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1a2b4c] outline-none" />
              </div>
            </div>
            <button 
              onClick={() => setIsAuthenticated(true)}
              className="w-full bg-[#1a2b4c] hover:bg-[#111e36] text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Войти в систему <ArrowRight size={18} />
            </button>
            <div className="text-center text-xs text-slate-400 flex flex-col gap-1">
              <span className="flex items-center justify-center gap-1"><Server size={12}/> База данных зашифрована (AES-256)</span>
              <span>DDoS Protection by Cloudflare</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <aside className="w-64 bg-[#1a2b4c] text-slate-300 flex flex-col shadow-xl z-20 shrink-0">
        <div className="h-16 flex items-center justify-center border-b border-slate-700/50 bg-white shadow-sm shrink-0">
          <AegisLogo size="small" />
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          <NavItem icon={<LayoutDashboard size={20} />} label="Рабочий стол" isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<FileText size={20} />} label="Договоры" isActive={activeTab === 'contracts'} onClick={() => setActiveTab('contracts')} />
          <NavItem icon={<CreditCard size={20} />} label="Оплаты (БФЛ)" isActive={activeTab === 'payments'} onClick={() => setActiveTab('payments')} />
          <div className="pt-4 pb-2"><p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3">Арбитражный управляющий</p></div>
          <NavItem icon={<Scale size={20} />} label="Вознаграждения АУ" isActive={activeTab === 'au'} onClick={() => setActiveTab('au')} badge={pendingAuCasesCount} />
        </nav>

        <div className="px-4 py-3 mx-4 my-2 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-2">
          <ShieldCheck className="text-green-400 shrink-0 mt-0.5" size={16} />
          <div>
            <p className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Защита активна</p>
            <p className="text-[10px] text-slate-400 leading-tight mt-0.5">WAF Cloudflare включен.<br/>Бэкап создан в 03:00.</p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-700/50 bg-[#111e36]">
          <div className="flex items-center gap-3 px-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold border-2 ${userRole === 'admin' ? 'bg-amber-600 border-amber-500' : 'bg-slate-600 border-slate-500'}`}>
              {userRole === 'admin' ? <ShieldCheck size={20} /> : <UserCircle size={20} />}
            </div>
            <div className="flex-1">
              <select value={userRole} onChange={(e) => setUserRole(e.target.value)} className="w-full bg-transparent text-sm font-medium text-white outline-none cursor-pointer appearance-none">
                <option value="admin" className="text-black">Старокоров А.Б. (Руководитель)</option>
                <option value="operator" className="text-black">Секретарь (Оператор)</option>
              </select>
              <p className="text-xs text-slate-400 mt-0.5">Уровень доступа</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10 shrink-0">
          <h1 className="text-2xl font-semibold text-slate-800">
            {activeTab === 'dashboard' && 'Сводка показателей'}
            {activeTab === 'contracts' && 'Управление договорами'}
            {activeTab === 'payments' && 'Контроль платежей по БФЛ'}
            {activeTab === 'au' && 'Контроль вознаграждений АУ'}
          </h1>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Глобальный поиск..." className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#1a2b4c] outline-none w-64 transition-all" />
            </div>
            <button className="relative text-slate-500 hover:text-slate-700 transition-colors">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-slate-50 custom-scrollbar">
          {activeTab === 'dashboard' && <DashboardModule contracts={contracts} paymentsHistory={paymentsHistory} auCases={auCases} onNavigate={setActiveTab} userRole={userRole} />}
          {activeTab === 'contracts' && <ContractsModule contracts={contracts} setContracts={setContracts} userRole={userRole} />}
          {activeTab === 'payments' && <PaymentsModule contracts={contracts} setContracts={setContracts} paymentsHistory={paymentsHistory} setPaymentsHistory={setPaymentsHistory} userRole={userRole} />}
          {activeTab === 'au' && <AuModule cases={auCases} setCases={setAuCases} userRole={userRole} />}
        </div>
      </main>
    </div>
  );
}

// ==========================================
// MODULE: DASHBOARD 
// ==========================================
function DashboardModule({ contracts, paymentsHistory, auCases, onNavigate, userRole }) {
  const formatCurrency = (amount) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(amount);
  const today = new Date('2025-03-08');

  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const collectedThisMonth = paymentsHistory
    .filter(p => new Date(p.date).getMonth() === currentMonth && new Date(p.date).getFullYear() === currentYear)
    .reduce((sum, p) => sum + p.amount, 0);

  const expectedNextMonth = contracts
    .filter(c => c.status === 'Активен')
    .reduce((sum, c) => sum + (c.monthlyPayment || 20000), 0);

  const chartData = [
    { label: 'Ноя', amount: 380000 },
    { label: 'Дек', amount: 450000 },
    { label: 'Янв', amount: 280000 },
    { label: 'Фев', amount: 350000 },
    { label: 'Мар (Факт)', amount: collectedThisMonth, isCurrent: true },
    { label: 'Апр (Прогноз)', amount: expectedNextMonth, isForecast: true },
  ];
  const maxChartAmount = Math.max(...chartData.map(d => d.amount));

  const overdueContracts = contracts
    .filter(c => c.status === 'Активен')
    .map(c => {
      const diffDays = Math.ceil((new Date(c.nextPaymentDate) - today) / (1000 * 60 * 60 * 24));
      const debtForMonth = c.monthlyPayment - c.currentMonthPaid;
      return { ...c, diffDays, debtForMonth };
    })
    .filter(c => c.diffDays < 0 && c.debtForMonth > 0)
    .sort((a, b) => a.diffDays - b.diffDays);
    
  const totalOverdueDebt = overdueContracts.reduce((sum, c) => sum + c.debtForMonth, 0);

  const actionRequiredAuCases = auCases
    .filter(c => c.status === 'pending')
    .map(c => ({ ...c, diffDays: Math.ceil((new Date(c.nextActionDate) - today) / (1000 * 60 * 60 * 24)) }))
    .filter(c => c.diffDays <= 0)
    .sort((a, b) => a.diffDays - b.diffDays);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {userRole === 'admin' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg"><TrendingUp size={20} /></div>
                <span className="text-[10px] font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded-full uppercase">Факт Марта</span>
              </div>
              <p className="text-xs font-medium text-slate-500 mb-1">Собрано (БФЛ)</p>
              <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(collectedThisMonth)}</h3>
            </div>
            
            <div className="bg-white p-5 rounded-xl shadow-sm border border-indigo-200 bg-gradient-to-b from-white to-indigo-50/30">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-lg"><ArrowRight size={20} className="-rotate-45" /></div>
                <span className="text-[10px] font-bold px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full uppercase">План Апрель</span>
              </div>
              <p className="text-xs font-medium text-slate-500 mb-1">Прогноз поступлений (БФЛ)</p>
              <h3 className="text-2xl font-bold text-indigo-900">{formatCurrency(expectedNextMonth)}</h3>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2.5 bg-red-50 text-red-600 rounded-lg"><AlertCircle size={20} /></div>
                <span className="text-[10px] font-bold px-2 py-1 bg-red-100 text-red-700 rounded-full uppercase">{overdueContracts.length} должников</span>
              </div>
              <p className="text-xs font-medium text-slate-500 mb-1">Дебиторка (Текущая)</p>
              <h3 className="text-2xl font-bold text-red-600">{formatCurrency(totalOverdueDebt)}</h3>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg"><Scale size={20} /></div>
                <span className="text-[10px] font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-full uppercase">{auCases.filter(c=>c.status==='pending').length} дел</span>
              </div>
              <p className="text-xs font-medium text-slate-500 mb-1">В судах (АУ)</p>
              <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(auCases.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0))}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-6"><BarChart3 className="text-blue-600" size={20} /> Кассовый прогноз и факт сборов</h2>
            <div className="h-48 flex items-end justify-between gap-4 px-4">
              {chartData.map((d, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                    {formatCurrency(d.amount)}
                  </div>
                  <div className="w-full flex justify-center h-full items-end">
                    <div 
                      className={`w-3/4 rounded-t-md transition-all duration-500 
                        ${d.isCurrent ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 
                          d.isForecast ? 'bg-indigo-300 border-2 border-dashed border-indigo-400 opacity-70' : 
                          'bg-blue-200 hover:bg-blue-300'}`}
                      style={{ height: `${Math.max((d.amount / maxChartAmount) * 100, 5)}%` }}
                    ></div>
                  </div>
                  <span className={`text-xs font-medium text-center ${d.isCurrent ? 'text-blue-700 font-bold' : d.isForecast ? 'text-indigo-600' : 'text-slate-500'}`}>{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-100 shadow-sm flex items-center justify-between">
          <div><h2 className="text-2xl font-bold text-[#1a2b4c]">Доброе утро, коллега! 👋</h2><p className="text-slate-600 mt-2 max-w-lg">Система подготовила для вас список задач на сегодня. В приоритете — прозвон клиентов с просроченными платежами.</p></div>
          <div className="hidden md:flex gap-4">
             <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 text-center"><div className="text-2xl font-bold text-red-600">{overdueContracts.length}</div><div className="text-xs text-slate-500 font-medium">Звонков по долгам</div></div>
             <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 text-center"><div className="text-2xl font-bold text-amber-500">{actionRequiredAuCases.length}</div><div className="text-xs text-slate-500 font-medium">Задач по судам</div></div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="font-bold text-slate-800 flex items-center gap-2"><PhoneCall className="text-red-500" size={18} /> Красная зона: Должники БФЛ</h2>
            <button onClick={() => onNavigate('payments')} className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">К модулю <ArrowRight size={16} /></button>
          </div>
          <div className="divide-y divide-slate-100 flex-1">
            {overdueContracts.length > 0 ? overdueContracts.slice(0, 5).map(c => (
              <div key={c.id} className="p-4 hover:bg-slate-50 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{c.clientName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{c.phone}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-red-600">Долг: {formatCurrency(c.debtForMonth)}</div>
                  <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded mt-1 inline-block">Просрочка {Math.abs(c.diffDays)} дн.</span>
                </div>
              </div>
            )) : <div className="p-8 text-center text-slate-400">Идеально! Просрочек нет.</div>}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="font-bold text-slate-800 flex items-center gap-2"><CalendarClock className="text-amber-500" size={18} /> Задачи: Контроль вознаграждений АУ</h2>
            <button onClick={() => onNavigate('au')} className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">К модулю <ArrowRight size={16} /></button>
          </div>
          <div className="divide-y divide-slate-100 flex-1">
            {actionRequiredAuCases.length > 0 ? actionRequiredAuCases.slice(0, 5).map(c => (
              <div key={c.id} className="p-4 hover:bg-slate-50 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{c.id}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{c.debtor} • {c.court}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-slate-600 mb-1">{c.stage}</div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${c.diffDays < 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {c.diffDays < 0 ? `Просрочено на ${Math.abs(c.diffDays)} дн.` : 'Задача на сегодня'}
                  </span>
                </div>
              </div>
            )) : <div className="p-8 text-center text-slate-400">Все дела проконтролированы. Задач на сегодня нет.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODULE: PAYMENTS
// ==========================================
function PaymentsModule({ contracts, setContracts, paymentsHistory, setPaymentsHistory, userRole }) {
  const [view, setView] = useState('control'); 
  const [showAddModal, setShowAddModal] = useState(false);
  const [reminderData, setReminderData] = useState(null);

  const formatCurrency = (amount) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(amount);
  const today = new Date('2025-03-08');
  const todayString = today.toISOString().split('T')[0];

  const activeContracts = contracts.filter(c => c.status === 'Активен');
  
  const analyzedContracts = activeContracts.map(c => {
    const nextDate = new Date(c.nextPaymentDate);
    const diffDays = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
    
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
    const newPayment = {
      id: Date.now(),
      contractId: paymentData.contractId,
      clientName: contracts.find(c => c.id === paymentData.contractId).clientName,
      amount: amountPaid,
      date: todayString,
      operator: userRole === 'admin' ? 'Старокоров А.Б.' : 'Секретарь'
    };
    setPaymentsHistory([newPayment, ...paymentsHistory]);

    setContracts(contracts.map(c => {
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

        return { 
          ...c, 
          paidAmount: newTotalPaid, 
          status: newStatus, 
          nextPaymentDate: newNextDate, 
          currentMonthPaid: newCurrentMonthPaid,
          lastContact: null 
        };
      }
      return c;
    }));
    setShowAddModal(false);
  };

  const handleLogContact = (contractId) => {
    setContracts(contracts.map(c => c.id === contractId ? { ...c, lastContact: todayString } : c));
    setReminderData(null);
  };

  return (
    <div className="p-8 h-full max-w-7xl mx-auto flex flex-col min-h-0">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div className="flex bg-slate-200/50 p-1 rounded-lg">
          <button onClick={() => setView('control')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${view === 'control' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Контроль оплат</button>
          <button onClick={() => setView('history')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${view === 'history' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>История поступлений</button>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"><Plus size={18} />Внести оплату</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col min-h-0">
        {view === 'control' && (
          <div className="overflow-y-auto custom-scrollbar p-0">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50 z-10">
                <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                  <th className="p-4 font-medium w-12 text-center">Зона</th>
                  <th className="p-4 font-medium">Клиент / Договор</th>
                  <th className="p-4 font-medium w-64">Статус текущего платежа</th>
                  {userRole === 'admin' && <th className="p-4 font-medium">Глоб. остаток</th>}
                  <th className="p-4 font-medium text-right">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {analyzedContracts.map(contract => {
                  const isContactedToday = contract.lastContact === todayString;
                  const monthProgress = Math.min((contract.currentMonthPaid / contract.monthlyPayment) * 100, 100);
                  const debtForMonth = contract.monthlyPayment - contract.currentMonthPaid;

                  return (
                  <tr key={contract.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-center">
                      <div className={`w-3 h-3 rounded-full mx-auto shadow-sm ${contract.zone === 'red' ? 'bg-red-500 animate-pulse' : contract.zone === 'yellow' ? 'bg-amber-400' : 'bg-green-500'}`}></div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{contract.clientName}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{contract.phone} • № {contract.id}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700">Оплачено: {formatCurrency(contract.currentMonthPaid)}</span>
                        <span className="text-slate-500">из {formatCurrency(contract.monthlyPayment)}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1">
                        <div className={`h-full rounded-full ${contract.zone === 'red' ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${monthProgress}%` }}></div>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                         <span className={contract.zone === 'red' ? 'text-red-600 font-bold' : 'text-slate-500'}>Срок: {new Date(contract.nextPaymentDate).toLocaleDateString('ru-RU')}</span>
                         {debtForMonth > 0 && <span className="text-slate-400">Осталось: {formatCurrency(debtForMonth)}</span>}
                      </div>
                    </td>
                    {userRole === 'admin' && (
                       <td className="p-4 font-medium text-slate-700">{formatCurrency(contract.totalAmount - contract.paidAmount)}</td>
                    )}
                    <td className="p-4 text-right">
                       {contract.zone === 'green' ? (
                         <span className="text-xs font-medium text-green-600 flex items-center justify-end gap-1"><CheckCircle2 size={14}/> В графике</span>
                       ) : isContactedToday ? (
                         <span className="text-xs font-medium text-slate-400 flex items-center justify-end gap-1"><CheckCircle2 size={14}/> Связались</span>
                       ) : (
                         <button onClick={() => setReminderData(contract)} className="text-xs font-medium text-red-600 hover:bg-red-50 bg-white border border-red-200 px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ml-auto shadow-sm">
                           <PhoneCall size={14} /> Взыскать {formatCurrency(debtForMonth)}
                         </button>
                       )}
                    </td>
                  </tr>
                )})}
                {analyzedContracts.length === 0 && <tr><td colSpan={userRole === 'admin' ? "5" : "4"} className="p-8 text-center text-slate-400">Нет активных договоров для контроля.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {view === 'history' && (
          <div className="overflow-y-auto custom-scrollbar p-0">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50 z-10">
                <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                  <th className="p-4 font-medium">Дата поступления</th>
                  <th className="p-4 font-medium">Клиент / Договор</th>
                  <th className="p-4 font-medium text-right">Сумма (руб.)</th>
                  <th className="p-4 font-medium">Принял</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {paymentsHistory.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-700">{new Date(p.date).toLocaleDateString('ru-RU')}</td>
                    <td className="p-4"><div className="font-semibold text-[#1a2b4c]">{p.clientName}</div><div className="text-xs text-slate-500 mt-0.5">№ {p.contractId}</div></td>
                    <td className="p-4 text-right"><span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+{formatCurrency(p.amount)}</span></td>
                    <td className="p-4 text-slate-500 text-xs">{p.operator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddModal && <PaymentModal activeContracts={activeContracts} onClose={() => setShowAddModal(false)} onSubmit={handleAddPayment} />}
      {reminderData && <ReminderModal contract={reminderData} onClose={() => setReminderData(null)} onLog={() => handleLogContact(reminderData.id)} />}
    </div>
  );
}

// ==========================================
// MODULE: AU REMUNERATION 
// ==========================================
function AuModule({ cases, setCases, userRole }) {
  const [view, setView] = useState('pending');
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionModalCase, setActionModalCase] = useState(null);

  const formatCurrency = (amount) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(amount);
  const today = new Date('2025-03-08').toISOString().split('T')[0];

  const pendingCases = cases.filter(c => c.status === 'pending').map(c => {
    const diffDays = Math.ceil((new Date(c.nextActionDate) - new Date(today)) / (1000 * 60 * 60 * 24));
    return { ...c, diffActionDays: diffDays };
  }).sort((a, b) => a.diffActionDays - b.diffActionDays);
  
  const historyCases = cases.filter(c => c.status === 'paid').sort((a, b) => new Date(b.paidDate) - new Date(a.paidDate));

  const handleLogAction = (caseId, actionType, nextDate, stage) => {
    setCases(cases.map(c => c.id === caseId ? { ...c, lastAction: actionType, nextActionDate: nextDate, stage: stage } : c));
    setActionModalCase(null);
  };

  return (
    <div className="p-8 h-full max-w-7xl mx-auto flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div className="flex bg-slate-200/50 p-1 rounded-lg">
          <button onClick={() => setView('pending')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${view === 'pending' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>В работе ({pendingCases.length})</button>
          <button onClick={() => setView('reconciliation')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${view === 'reconciliation' ? 'bg-white text-[#1a2b4c] shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}><span className="flex items-center gap-2"><FileSpreadsheet size={16}/> Сверка выписок</span></button>
          <button onClick={() => setView('history')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${view === 'history' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Архив (Оплачено)</button>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-[#1a2b4c] hover:bg-[#111e36] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm"><Plus size={18} /> Добавить дело</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col min-h-0">
        {view === 'pending' && (
          <div className="overflow-y-auto custom-scrollbar p-0">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50 z-10">
                <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                  <th className="p-4 font-medium">Дело / Должник</th>
                  <th className="p-4 font-medium">Текущий этап</th>
                  <th className="p-4 font-medium">Контроль задачи</th>
                  {userRole === 'admin' && <th className="p-4 font-medium text-right">Сумма (Депозит)</th>}
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
                      <span className={`px-2 py-1 rounded text-xs font-medium ${c.stage === 'Ждем определение' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                        {c.stage}
                      </span>
                      <div className="text-[11px] text-slate-500 mt-1">Посл. шаг: {c.lastAction}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className={`text-xs font-bold px-2 py-1 rounded inline-block w-max flex items-center gap-1 ${isTaskUrgent ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-600'}`}>
                          <CalendarClock size={12} /> {isTaskUrgent ? 'Просрочено' : `До: ${new Date(c.nextActionDate).toLocaleDateString('ru-RU')}`}
                        </span>
                      </div>
                    </td>
                    {userRole === 'admin' && (
                      <td className="p-4 text-right font-semibold text-slate-800">{formatCurrency(c.amount)}</td>
                    )}
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setActionModalCase(c)}
                        className={`text-xs font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ml-auto border ${isTaskUrgent ? 'bg-amber-500 text-white hover:bg-amber-600 border-amber-600' : 'bg-white text-amber-600 border-amber-200 hover:bg-amber-50'}`}
                      >
                        Обновить статус
                      </button>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}
        {view === 'reconciliation' && <AuReconciliation pendingCases={pendingCases} onConfirmPayment={(caseId, actualAmount) => setCases(cases.map(c => c.id === caseId ? { ...c, status: 'paid', paidDate: today.toISOString().split('T')[0], amount: actualAmount || c.amount } : c))} />}
        {view === 'history' && (
           <div className="overflow-y-auto custom-scrollbar p-0">
             <table className="w-full text-left border-collapse"><thead className="sticky top-0 bg-slate-50 z-10"><tr className="border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider"><th className="p-4">Дата</th><th className="p-4">Дело / Должник</th><th className="p-4">Суд</th><th className="p-4 text-right">Зачислено</th></tr></thead><tbody className="divide-y divide-slate-100 text-sm">
                {historyCases.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors"><td className="p-4 font-medium text-slate-700">{new Date(c.paidDate).toLocaleDateString('ru-RU')}</td><td className="p-4"><div className="font-bold text-[#1a2b4c]">{c.id}</div><div className="text-xs text-slate-500 mt-0.5">{c.debtor}</div></td><td className="p-4 text-slate-600">{c.court}</td><td className="p-4 text-right"><span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+{formatCurrency(c.amount)}</span></td></tr>
                ))}
              </tbody></table>
          </div>
        )}
      </div>

      {showAddModal && <AuAddCaseModal onClose={() => setShowAddModal(false)} onSubmit={(newCase) => setCases([{ ...newCase, status: 'pending', amount: 25000, lastAction: 'Завершение процедуры', nextActionDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0], stage: 'Ждем определение' }, ...cases])} />}
      {actionModalCase && <AuActionModal caseData={actionModalCase} onClose={() => setActionModalCase(null)} onLogAction={(type, date, stage) => handleLogAction(actionModalCase.id, type, date, stage)} />}
    </div>
  );
}

// Окно фиксации действия по АУ 
function AuActionModal({ caseData, onClose, onLogAction }) {
  const [actionType, setActionType] = useState('Созвон с судом (Пом. судьи)');
  const [stage, setStage] = useState(caseData.stage || 'Ждем определение');
  
  const defaultNextDate = new Date();
  defaultNextDate.setMonth(defaultNextDate.getMonth() + 1);
  const [nextDate, setNextDate] = useState(defaultNextDate.toISOString().split('T')[0]);

  const handleSubmit = (e) => { e.preventDefault(); onLogAction(actionType, nextDate, stage); };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50"><h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><Scale className="text-amber-500" /> Контроль дела АУ</h3><button onClick={onClose} className="text-slate-400 hover:text-slate-600">×</button></div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200"><p className="font-bold text-[#1a2b4c]">{caseData.id}</p><p className="text-sm text-slate-600">{caseData.debtor} • {caseData.court}</p></div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">На каком мы этапе?</label>
            <select value={stage} onChange={(e) => setStage(e.target.value)} className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm font-medium">
              <option value="Ждем определение">Ждем Определение от судьи</option>
              <option value="Ждем деньги (Бухгалтерия)">Определение есть → Ждем деньги из фин. отдела</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Какое действие выполнено?</label>
            <div className="grid grid-cols-1 gap-3">
              <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${actionType === 'Созвон с судом (Пом. судьи)' ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:bg-slate-50'}`}><input type="radio" name="actionType" value="Созвон с судом (Пом. судьи)" checked={actionType === 'Созвон с судом (Пом. судьи)'} onChange={(e) => setActionType(e.target.value)} className="text-amber-600 focus:ring-amber-500" /><PhoneCall size={18} className="text-slate-500" /><span className="font-medium text-slate-700 text-sm">Созвон с аппаратом</span></label>
              <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${actionType === 'Повторное ходатайство' ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:bg-slate-50'}`}><input type="radio" name="actionType" value="Повторное ходатайство" checked={actionType === 'Повторное ходатайство'} onChange={(e) => setActionType(e.target.value)} className="text-amber-600 focus:ring-amber-500" /><MailOpen size={18} className="text-slate-500" /><span className="font-medium text-slate-700 text-sm">Направлено повторное ходатайство/запрос</span></label>
            </div>
          </div>
          <div><label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2"><CalendarClock size={16} className="text-blue-600" /> Дата следующего контроля</label><input required type="date" className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" value={nextDate} onChange={e => setNextDate(e.target.value)} /></div>
          <div className="pt-2 flex gap-3"><button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">Отмена</button><button type="submit" className="flex-1 px-4 py-2.5 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors shadow-sm">Зафиксировать</button></div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// CONTRACTS & MODALS 
// ==========================================

function ContractsModule({ contracts, setContracts, userRole }) {
  const [view, setView] = useState('list');
  const [selectedContract, setSelectedContract] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(null);
  const [revealPassports, setRevealPassports] = useState({});

  const formatCurrency = (amount) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(amount);

  const handleCreateContract = (newContract) => {
    setContracts([{ ...newContract, status: 'Активен', paidAmount: 0, lastContact: null, currentMonthPaid: 0 }, ...contracts]);
    setView('list');
  };

  const handleCancelContract = (id) => {
    setContracts(contracts.map(c => c.id === id ? { ...c, status: 'Расторгнут', nextPaymentDate: null } : c));
    setShowCancelConfirm(null);
  };

  const togglePassportReveal = (id) => setRevealPassports(prev => ({ ...prev, [id]: !prev[id] }));
  const getSecurePassport = (passportString, isRevealed) => {
    if (!passportString) return 'Не указан';
    if (userRole === 'admin' && isRevealed) return passportString;
    return passportString.replace(/^(\d{4})\s*(\d{2}).*/, '$1 $2**** (скрыто)');
  };

  return (
    <div className="p-8 h-full max-w-7xl mx-auto flex flex-col min-h-0">
      {view === 'list' && (
        <>
          <div className="flex justify-between items-center mb-6 shrink-0">
            <div><h2 className="text-2xl font-bold text-slate-800">Реестр договоров</h2><p className="text-sm text-slate-500 mt-1 flex items-center gap-1"><Lock size={12} className="text-green-600"/> ПДн защищены в соответствии с ФЗ-152</p></div>
            <button onClick={() => setView('create')} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"><Plus size={18} /> Новый договор</button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col min-h-0">
            <div className="overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-slate-50 z-10"><tr className="border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider"><th className="p-4 font-medium">Номер / Дата</th><th className="p-4 font-medium">Клиент / Контакты</th><th className="p-4 font-medium">Сумма договора</th><th className="p-4 font-medium w-48">Прогресс оплат</th><th className="p-4 font-medium">Статус</th><th className="p-4 font-medium text-right">Действия</th></tr></thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {contracts.map((contract) => {
                    const progress = (contract.paidAmount / contract.totalAmount) * 100;
                    return (
                      <tr key={contract.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-4"><div className="font-semibold text-slate-800 flex items-center gap-2"><FileSignature size={16} className="text-slate-400" /> № {contract.id}</div><div className="text-xs text-slate-500 mt-0.5">{contract.date}</div></td>
                        <td className="p-4 font-medium text-[#1a2b4c]">{contract.clientName}<div className="text-xs text-slate-500 font-normal mt-0.5 flex flex-col gap-0.5"><span>{contract.phone}</span><span className="flex items-center gap-1">Паспорт: {getSecurePassport(contract.passport, revealPassports[contract.id])}{userRole === 'admin' && (<button onClick={() => togglePassportReveal(contract.id)} className="text-slate-400 hover:text-blue-600 transition-colors ml-1">{revealPassports[contract.id] ? <EyeOff size={14}/> : <Eye size={14}/>}</button>)}</span></div></td>
                        <td className="p-4 text-slate-600">{formatCurrency(contract.totalAmount)}</td>
                        <td className="p-4"><div className="flex items-center gap-2 mb-1"><div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${contract.status === 'Расторгнут' ? 'bg-slate-400' : progress >= 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${progress}%` }}></div></div><span className="text-xs font-medium text-slate-500">{Math.round(progress)}%</span></div><div className="text-[10px] text-slate-400">Оплачено: {formatCurrency(contract.paidAmount)}</div></td>
                        <td className="p-4"><span className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-full tracking-wide ${contract.status === 'Активен' ? 'bg-blue-50 text-blue-700 border border-blue-200' : contract.status === 'Исполнен' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{contract.status}</span></td>
                        <td className="p-4 text-right"><div className="flex items-center justify-end gap-2"><button onClick={() => { setSelectedContract(contract); setView('view'); }} className="p-1.5 text-slate-400 hover:text-[#1a2b4c] hover:bg-slate-100 rounded transition-colors"><Eye size={18} /></button>{contract.status === 'Активен' && (<button onClick={() => setShowCancelConfirm(contract.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Ban size={18} /></button>)}</div></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {view === 'create' && <CreateContractForm onCancel={() => setView('list')} onSubmit={handleCreateContract} />}
      {view === 'view' && selectedContract && <ContractViewer contract={selectedContract} onBack={() => setView('list')} />}

      {showCancelConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full text-center"><div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Ban className="text-red-600" size={32} /></div><h3 className="text-lg font-bold text-slate-800 mb-2">Расторгнуть договор?</h3><p className="text-sm text-slate-500 mb-6">Договор №{showCancelConfirm} будет переведен в статус "Расторгнут".</p><div className="flex gap-3"><button onClick={() => setShowCancelConfirm(null)} className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium">Отмена</button><button onClick={() => handleCancelContract(showCancelConfirm)} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium">Расторгнуть</button></div></div>
        </div>
      )}
    </div>
  );
}

function ReminderModal({ contract, onClose, onLog }) {
  const [comment, setComment] = useState('');
  const firstName = contract.clientName.split(' ')[1] || 'Клиент';
  const debt = contract.monthlyPayment - contract.currentMonthPaid;
  const whatsappTemplate = `Здравствуйте, ${firstName}! Вас беспокоит юридическая компания "Иджис". У вас подошел срок регулярного платежа по договору №${contract.id}. Остаток платежа за этот месяц: ${debt} руб. Ожидаем оплату.`;
  const copyToClipboard = () => { navigator.clipboard.writeText(whatsappTemplate); alert('Текст скопирован!'); };
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50"><h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><PhoneCall className="text-blue-600" /> Связаться с клиентом</h3><button onClick={onClose} className="text-slate-400 hover:text-slate-600">×</button></div>
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center bg-red-50 p-4 rounded-lg border border-red-100">
            <div><p className="font-bold text-slate-800">{contract.clientName}</p><p className="text-xl font-mono text-red-700 font-bold mt-1">{contract.phone}</p></div>
            <div className="text-right"><p className="text-sm text-slate-600">Остаток к оплате</p><p className="text-xl font-bold text-red-600">{debt} руб.</p></div>
          </div>
          <div><label className="block text-sm font-medium text-slate-700 mb-2">Шаблон сообщения (WhatsApp)</label><div className="relative"><textarea readOnly className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 resize-none h-24 focus:outline-none" value={whatsappTemplate} /><button onClick={copyToClipboard} className="absolute right-2 bottom-2 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-colors border border-green-200"><MessageCircle size={14} /> Скопировать</button></div></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-2">Результат контакта</label><textarea className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1a2b4c] outline-none text-sm resize-none h-20" placeholder="Например: Обещал оплатить завтра..." value={comment} onChange={(e) => setComment(e.target.value)}></textarea></div>
        </div>
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex gap-3"><button onClick={onClose} className="flex-1 px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">Отмена</button><button onClick={onLog} className="flex-1 px-4 py-2 bg-[#1a2b4c] text-white font-medium rounded-lg hover:bg-[#111e36] transition-colors shadow-sm flex items-center justify-center gap-2"><CheckCircle2 size={18} /> Зафиксировать звонок</button></div>
      </div>
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

  const handleSubmit = (e) => { e.preventDefault(); if (!contractId) return alert('Выберите клиента'); onSubmit({ contractId, amount: amount || suggestedAmount }); };
  const filteredContracts = activeContracts.filter(c => c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase()));
  
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50"><h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><Wallet className="text-green-600" />Прием платежа БФЛ</h3><button onClick={onClose} className="text-slate-400 hover:text-slate-600">×</button></div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="relative"><label className="block text-sm font-medium text-slate-700 mb-1">Клиент (Поиск по ФИО)</label><input required={!contractId} type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1a2b4c] outline-none text-sm" placeholder="Начните вводить ФИО..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true); if (contractId) setContractId(''); }} onFocus={() => setShowDropdown(true)} onBlur={() => setTimeout(() => setShowDropdown(false), 200)} />{showDropdown && filteredContracts.length > 0 && (<ul className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-auto">{filteredContracts.map(c => (<li key={c.id} className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100" onMouseDown={() => { setContractId(c.id); setSearchTerm(`${c.clientName} (№${c.id})`); setAmount(c.monthlyPayment - c.currentMonthPaid); setShowDropdown(false); }}><div className="font-medium text-slate-800 text-sm">{c.clientName}</div><div className="text-xs text-slate-500">Долг за месяц: {c.monthlyPayment - c.currentMonthPaid} руб.</div></li>))}</ul>)}</div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Сумма поступления (руб.)</label><input required type="number" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1a2b4c] outline-none font-semibold text-lg" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
          <div className="pt-2 flex gap-3"><button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">Отмена</button><button type="submit" className="flex-1 px-4 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm">Провести оплату</button></div>
        </form>
      </div>
    </div>
  );
}

function CreateContractForm({ onCancel, onSubmit }) {
  const [isScanning, setIsScanning] = useState(false);
  const [formData, setFormData] = useState({ clientName: '', phone: '', passport: '', address: '', id: `14${Math.floor(Math.random() * 1000)}-ФЛ`, date: new Date().toISOString().split('T')[0], monthlyPayment: 20000 });
  const handleScanMock = () => { setIsScanning(true); setTimeout(() => { setFormData(prev => ({ ...prev, clientName: 'Новиков Сергей Владимирович', phone: '+7 (999) 555-44-33', passport: '4218 556677 выдан ГУ МВД РФ по Кемеровской обл.', address: 'г. Кемерово, пр. Ленина, д. 55, кв. 12' })); setIsScanning(false); }, 1500); };
  const handleSubmit = (e) => { e.preventDefault(); onSubmit({ ...formData, totalAmount: 245000, nextPaymentDate: new Date(new Date(formData.date).setMonth(new Date(formData.date).getMonth() + 1)).toISOString().split('T')[0] }); };
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8 w-full">
      <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4"><button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"><ChevronLeft size={24} /></button><div><h2 className="text-2xl font-bold text-slate-800">Подготовка нового договора</h2><p className="text-sm text-slate-500">Заполните данные.</p></div></div>
      <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between"><div><h4 className="font-semibold text-blue-900 flex items-center gap-2"><ScanFace size={18}/> Автозаполнение</h4><p className="text-sm text-blue-700 mt-1">Загрузите скан или фото разворота паспорта для быстрого заполнения реквизитов.</p></div><button type="button" onClick={handleScanMock} disabled={isScanning} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2">{isScanning ? <span className="animate-pulse">Распознавание...</span> : 'Распознать паспорт'}</button></div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2 col-span-2"><label className="text-sm font-medium text-slate-700">ФИО Клиента</label><input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1a2b4c] outline-none" placeholder="Иванов Иван Иванович" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} /></div>
          <div className="space-y-2"><label className="text-sm font-medium text-slate-700">Контактный телефон</label><input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1a2b4c] outline-none font-mono" placeholder="+7 (999) 000-00-00" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
          <div className="space-y-2"><label className="text-sm font-medium text-slate-700">Паспортные данные</label><input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1a2b4c] outline-none" placeholder="Серия, номер, кем и когда выдан" value={formData.passport} onChange={e => setFormData({...formData, passport: e.target.value})} /></div>
          <div className="col-span-2 h-px bg-slate-100 my-2"></div>
          <div className="space-y-2"><label className="text-sm font-medium text-slate-700">Номер договора</label><input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1a2b4c] outline-none" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} /></div>
          <div className="space-y-2 col-span-2"><label className="text-sm font-medium text-slate-700">Ежемесячный платеж (для графика)</label><div className="relative w-1/2"><input required type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1a2b4c] outline-none" value={formData.monthlyPayment} onChange={e => setFormData({...formData, monthlyPayment: Number(e.target.value)})} /><span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">руб.</span></div></div>
        </div>
        <div className="pt-6 flex justify-end gap-3 border-t border-slate-100"><button type="button" onClick={onCancel} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">Отмена</button><button type="submit" className="px-5 py-2.5 bg-[#1a2b4c] text-white font-medium rounded-lg hover:bg-[#111e36] transition-colors shadow-sm">Создать</button></div>
      </form>
    </div>
  );
}

// ИНТЕГРАЦИЯ ТЕКСТА РЕАЛЬНОГО ДОГОВОРА
function ContractViewer({ contract, onBack }) {
  const generateSchedule = () => { const schedule = []; let remaining = contract.totalAmount; const monthly = contract.monthlyPayment || 20000; let currentDate = new Date(contract.date); while (remaining > 0) { const payment = remaining >= monthly ? monthly : remaining; schedule.push({ month: currentDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }), amount: payment }); remaining -= payment; currentDate.setMonth(currentDate.getMonth() + 1); } return schedule; };
  const formatMoney = (sum) => new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 2 }).format(sum);
  
  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between bg-white p-4 rounded-t-xl border border-slate-200 border-b-0 shrink-0">
        <div className="flex items-center gap-4"><button onClick={onBack} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded transition-colors"><ChevronLeft size={20} /></button><div><h3 className="font-bold text-slate-800">Договор №{contract.id}</h3><p className="text-xs text-slate-500">Клиент: {contract.clientName}</p></div></div>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition-colors"><Printer size={16} /> Печать</button>
      </div>
      <div className="flex-1 overflow-y-auto bg-slate-200 p-8 border border-slate-200 rounded-b-xl custom-scrollbar">
        <div className="max-w-[210mm] mx-auto bg-white shadow-lg p-[20mm] text-[11pt] font-serif leading-relaxed text-black">
          <div className="flex justify-between mb-8 font-bold"><div>г. Кемерово</div><div>{new Date(contract.date).toLocaleDateString('ru-RU')} г.</div></div>
          
          <h1 className="text-center font-bold text-[14pt] mb-8">ДОГОВОР №{contract.id}<br/>оказания юридических услуг</h1>
          
          <p className="text-justify indent-8 mb-6">Индивидуальный Предприниматель Бондарь Ирина Ивановна с одной стороны, в дальнейшем именуемое «Исполнитель», и <strong>{contract.clientName}</strong> (паспорт: {contract.passport || '_________________'}, телефон: {contract.phone || '_________________'}), в дальнейшем именуемый(ая) «Заказчик», с другой стороны, в дальнейшем совместно именуемые «Стороны», заключили настоящий договор (далее Договор) о нижеследующем:</p>
          
          <h2 className="font-bold mb-2">1. ПРЕДМЕТ ДОГОВОРА.</h2>
          <p className="text-justify indent-8 mb-2">1.1. Заказчик поручает, а Исполнитель обязуется за вознаграждение оказать Заказчику следующие юридические услуги по банкротству физического лица:</p>
          <p className="text-justify indent-8 mb-4">1.1.1. Подготовка к процедуре банкротства Заказчика, в соответствии с ФЗ № 127 «О несостоятельности (банкротстве)...</p>
          
          <div className="my-8 text-center text-slate-400 italic bg-slate-50 py-4 border border-dashed border-slate-200">
            [ Текст пунктов 1.2 - 2.4 Договора пропущен для удобства предпросмотра ]
          </div>

          <h2 className="font-bold mb-2 mt-6">3. ПОРЯДОК РАСЧЕТОВ МЕЖДУ СТОРОНАМИ.</h2>
          <p className="text-justify indent-8 mb-2">3.1. За оказываемые по настоящему Договору услуги Заказчик обязуется оплатить Исполнителю вознаграждение в сумме <strong>190 000 (сто девяносто тысяч) рублей 00 копеек.</strong></p>
          
          <p className="text-justify indent-8 mb-2">3.2. Заказчик проинформирован, что все расходы, связанные с оплатой депозита на вознаграждение арбитражного (финансового) управляющего, и обязательных публикаций... оплачиваются отдельно по тарифам, установленным законодательством РФ.</p>
          
          <p className="text-justify indent-8 mb-6">3.3. Стороны договорились, что Заказчик поручает Исполнителю совершать от имени и за счет Заказчика помимо действий, указанных в п.1 настоящего Договора, производство оплаты обязательных платежей, связанных с ведением процедур, применяемых в деле о банкротстве гражданина, из расчета <strong>55 000 (пятьдесят пять тысяч) рублей</strong> за каждую введенную в отношении Заказчика процедуру.</p>

          <div className="w-full h-px bg-slate-300 my-12 border-dashed border-b-2"></div>
          
          <div className="text-right mb-8"><p>Приложение №1 к Договору</p><p>№{contract.id} от {new Date(contract.date).toLocaleDateString('ru-RU')} г.</p></div>
          <h3 className="text-center font-bold text-[12pt] mb-6">График платежей</h3>
          
          <table className="w-full border-collapse border border-black text-center mb-12">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-black py-2 px-4">Месяц оплаты</th>
                <th className="border border-black py-2 px-4">Сумма (руб.)</th>
              </tr>
            </thead>
            <tbody>
              {generateSchedule().map((row, idx) => (
                <tr key={idx}>
                  <td className="border border-black py-2 px-4 capitalize">{row.month}</td>
                  <td className="border border-black py-2 px-4">{formatMoney(row.amount)}</td>
                </tr>
              ))}
              <tr>
                <td className="border border-black py-2 px-4 font-bold text-right">Итого по графику:</td>
                <td className="border border-black py-2 px-4 font-bold">{formatMoney(contract.totalAmount)}</td>
              </tr>
            </tbody>
          </table>
          
          <p className="text-sm text-justify mb-8 italic">В случае утверждения судом дополнительной процедуры, полная стоимость увеличится на сумму судебных расходов в размере 55 000 руб., и составит 300 000 руб. Судебные расходы подлежат оплате частями в размере 20 000 руб. ежемесячно в течении двух месяцев и 15 000 руб. в течении месяца с даты последнего платежа в соответствии с настоящим графиком.</p>
          
          <div className="flex justify-between mt-12 pt-8 border-t border-black">
            <div className="text-center w-1/3">
              <p className="font-bold mb-4">Исполнитель:</p>
              <p>ИП Бондарь И.И.</p>
              <div className="border-b border-black mt-8 mb-2"></div>
              <p className="text-xs">М.П.</p>
            </div>
            <div className="text-center w-1/3">
              <p className="font-bold mb-4">Заказчик:</p>
              <p>{contract.clientName}</p>
              <div className="border-b border-black mt-8 mb-2"></div>
              <p className="text-xs">Подпись</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

function AuReconciliation({ pendingCases, onConfirmPayment }) {
  const [inputText, setInputText] = useState("ПЛАТЕЖНОЕ ПОРУЧЕНИЕ № 1425\nСумма: 25000.00\nНазначение платежа: Перечисление вознаграждения. Дело А40-12345/2023 Петров В.В.");
  const [matchedResults, setMatchedResults] = useState([]);
  const [isParsed, setIsParsed] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const handleParse = () => { const results = []; const normalizedText = inputText.toUpperCase().replace(/[Aa]/g, 'А'); const textBlocks = normalizedText.split(/\n\s*\n|ПЛАТЕЖНОЕ ПОРУЧЕНИЕ/); pendingCases.forEach(c => { const match = c.id.match(/А(\d+)-(\d+)\/(\d+)/i); if (!match) return; const [, region, num, year] = match; const caseRegex = new RegExp(`А\\s*-?\\s*${region}\\s*-?\\s*${num}\\s*\\/\\s*(?:${year}|${year.slice(-2)})`, 'i'); const matchedBlock = textBlocks.find(block => caseRegex.test(block)); if (matchedBlock) { let actualAmount = c.amount; const amountMatch = matchedBlock.match(/СУММА[\s:]*([\d\s]+[.,]?\d{0,2})/i); if (amountMatch && amountMatch[1]) { const parsedAmount = parseFloat(amountMatch[1].replace(/\s/g, '').replace(',', '.')); if (!isNaN(parsedAmount) && parsedAmount > 0) actualAmount = parsedAmount; } results.push({ ...c, actualAmount }); } }); setMatchedResults(results); setIsParsed(true); };
  const handleFileUpload = (e) => { const file = e.target.files[0]; if (!file) return; setIsProcessingFile(true); setTimeout(() => { setInputText(`--- ИЗВЛЕЧЕНО ИЗ ФАЙЛА: ${file.name} ---\n\n` + inputText); setIsProcessingFile(false); setIsParsed(false); }, 1200); };
  return (
    <div className="flex h-full divide-x divide-slate-200">
      <div className="w-1/2 p-6 flex flex-col bg-slate-50/50">
        <div className="mb-4"><h3 className="font-bold text-slate-800 flex items-center gap-2"><UploadCloud className="text-blue-500" /> Загрузка выписки</h3></div>
        <div className="mb-4 relative border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-lg p-6 text-center hover:bg-blue-50 transition-colors"><input type="file" accept=".pdf,.xls,.xlsx,.csv,.txt" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" /><div className="pointer-events-none">{isProcessingFile ? <div className="text-blue-600 animate-pulse">⏳ Извлечение текста...</div> : <div className="text-blue-700"><UploadCloud className="mx-auto mb-2 text-blue-500" size={28} /><span className="underline">Нажмите</span> или перетащите выписку сюда</div>}</div></div>
        <textarea className="flex-1 w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1a2b4c] outline-none text-sm font-mono resize-none bg-white" value={inputText} onChange={(e) => { setInputText(e.target.value); setIsParsed(false); }}></textarea>
        <button onClick={handleParse} disabled={isProcessingFile} className="mt-4 w-full bg-[#1a2b4c] text-white py-3 rounded-lg font-medium shadow-sm">Распознать платежи</button>
      </div>
      <div className="w-1/2 p-6 flex flex-col bg-white">
        <h3 className="font-bold text-slate-800 mb-4">Результаты сверки</h3>
        {!isParsed ? <div className="flex-1 flex items-center justify-center text-slate-400 flex-col text-center border-2 border-dashed border-slate-200 rounded-xl"><FileSpreadsheet size={48} className="mb-3 opacity-50" /><p>Загрузите выписку и нажмите<br/>"Распознать платежи"</p></div> : (
          <div className="flex-1 overflow-y-auto custom-scrollbar">{matchedResults.length === 0 ? <div className="bg-amber-50 text-amber-800 p-4 rounded-lg text-sm">Номеров дел из списка ожиданий не найдено.</div> : (<div className="space-y-4">{matchedResults.map(c => (<div key={c.id} className="border border-green-200 bg-green-50/30 rounded-lg p-4"><div className="flex justify-between items-start mb-3"><div><div className="font-bold text-[#1a2b4c]">{c.id}</div><p className="text-sm text-slate-700">{c.debtor}</p></div><div className="text-right text-sm font-bold text-green-700">Найдено: {new Intl.NumberFormat('ru-RU').format(c.actualAmount)} руб.</div></div><button onClick={() => { onConfirmPayment(c.id, c.actualAmount); setMatchedResults(matchedResults.filter(r => r.id !== c.id)); }} className="w-full bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex justify-center gap-2"><CheckCircle2 size={16} /> Подтвердить</button></div>))}</div>)}</div>
        )}
      </div>
    </div>
  );
}

function AuAddCaseModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({ id: '', debtor: '', court: '', completionDate: new Date().toISOString().split('T')[0] });
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden p-6">
        <h3 className="font-bold text-lg mb-4">Новое дело</h3>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
          <input required type="text" placeholder="Номер дела" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} />
          <input required type="text" placeholder="ФИО" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" value={formData.debtor} onChange={e => setFormData({...formData, debtor: e.target.value})} />
          <input required type="text" placeholder="Суд" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" value={formData.court} onChange={e => setFormData({...formData, court: e.target.value})} />
          <input required type="date" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" value={formData.completionDate} onChange={e => setFormData({...formData, completionDate: e.target.value})} />
          <div className="flex gap-3"><button type="button" onClick={onClose} className="flex-1 bg-slate-100 p-2 rounded-lg">Отмена</button><button type="submit" className="flex-1 bg-[#1a2b4c] text-white p-2 rounded-lg">Добавить</button></div>
        </form>
      </div>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick, badge }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${isActive ? 'bg-[#2a3f6c] text-white' : 'text-slate-400 hover:bg-[#203257] hover:text-slate-200'}`}>
      <div className={isActive ? 'text-amber-500' : ''}>{icon}</div><span className="font-medium text-sm flex-1 text-left">{label}</span>
      {badge > 0 && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-amber-500 text-[#1a2b4c]' : 'bg-slate-700 text-slate-300'}`}>{badge}</span>}
    </button>
  );
}