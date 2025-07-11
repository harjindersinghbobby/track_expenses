import  { useEffect, useState } from 'react';
import AddExpenseForm from '../components/AddExpenseForm';
import { months, type MonthOption } from '../constants/months';
import styles from './HomePage.module.css';
import ExpenseChart from '../components/expenseChart';
import api from '../services/api';
import { analyzeExpenses } from '../services/ai';
import NavigationBar from '../components/NavigationBar';
import MonthlyComparison from '../components/MonthyComparison';
import MonthlyLineChart from '../components/MonthlyLineChart';
import { useNavigate } from 'react-router-dom';
// import DailyExpenseChart from '../components/DailyExpense';
import WeeklyExpenseChart from '../components/WeeklyExpenseChart';
type Expense = {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string; // format: YYYY-MM-DD
  isEditing?: boolean;
};

type CategoryData = {
  category: string;
  current: number;
  previous: number;
};


const HomePage = () => {
  // const [dailyData, setDailyData] = useState([]);
    const [showReportModal, setShowReportModal] = useState(false);

  const currentDate = new Date();
  const currentMonth = currentDate.toISOString().slice(0, 7);
  const [filterMonth, setFilterMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyExpensesData,setMonthlyExpensesData] = useState([]);
  const [comparisonMonthData, setComparisonMonthData] = useState([]);
  const navigate = useNavigate();

  const onReload = () => {
    fetchExpenses();
    getWeeklyExpenses().then(setWeeklyData);
    fetchMonthlySummary();
    // fetchDailyData();
  };
  const fetchExpenses = async () => {
    try {
      const response = await api.get('/expenses');
      setExpenses(response.data);
    } catch (error: { response?: { data?: { error?: string } }; message?: string } | any) {
        if (
      error?.response?.data?.error === 'Invalid token' ||
      error?.message?.includes('Invalid token')
    ) {
      localStorage.setItem('token', '');
    }
      console.error('❌ Failed to load expenses:', error);
    }
  };

 const getWeeklyExpenses = async () => {
  const res = await api.get('/expenses/weekly', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  const transformed = res.data.map((w:any) => ({
  ...w,
  label: `${w.week_start} - ${w.week_end}`,
  total: Number(w.total),
}));
  return transformed;
};

// const fetchDailyData = async () => {
//   try {
//     const response = await api.get('/expenses/daily', {
//       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//     });
//     setDailyData(response.data);
    
//   } catch (error) {
//     console.error('Failed to load daily expenses', error);
//   }
// };
  useEffect(() => {
    if(!localStorage.getItem('token')) {
      // Redirect to login or show a message
      console.error('❌ No token found, redirecting to login');
     navigate('/login')
    }else {
    fetchExpenses();
    // fetchDailyData();
    getWeeklyExpenses().then(setWeeklyData);
    fetchMonthlySummary();
    fetchComparisonCurrentPrevMonth()

    }
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (error) {
      console.error('❌ Failed to delete:', error);
    }
  };

  const handleEditToggle = (indexToEdit: number) => {
    setExpenses((prev) =>
      prev.map((expense, index) =>
        index === indexToEdit
          ? { ...expense, isEditing: !expense.isEditing }
          : { ...expense, isEditing: false }
      )
    );
  };

  const handleEditChange = (
    indexToEdit: number,
    field: keyof Expense,
    value: string | number
  ) => {
    setExpenses((prev) =>
      prev.map((expense, index) =>
        index === indexToEdit ? { ...expense, [field]: value } : expense
      )
    );
  };

const handleEditSave = async (indexToEdit: number) => {
  const expense = expenses[indexToEdit];

  try {
    await api.put(`/expenses/${expense.id}`, {
      title: expense.title,
      amount: Number(expense.amount),
      category: expense.category,
      date: expense.date,
    });

    // Optional: refresh the entire list
    fetchExpenses();

    setExpenses((prev) =>
      prev.map((exp, index) =>
        index === indexToEdit ? { ...exp, isEditing: false } : exp
      )
    );
  } catch (error) {
    console.error('❌ Failed to update expense:', error);
  }
};

    const fetchComparisonCurrentPrevMonth = async () => {
      try {
        const res = await api.get(`/expenses/compare?month=${currentMonth}`);
        const map: { [category: string]: CategoryData } = {};

        res.data.previousData.forEach((item: any) => {
          map[item.category] = {
            category: item.category,
            previous: parseFloat(item.total),
            current: 0,
          };
        });

        res.data.currentData.forEach((item: any) => {
          if (!map[item.category]) {
            map[item.category] = {
              category: item.category,
              previous: 0,
              current: parseFloat(item.total),
            };
          } else {
            map[item.category].current = parseFloat(item.total);
          }
        });

        const result:any = Object.values(map);
        setComparisonMonthData(result);

        // Generate summary
        // const summaryText = result
        //   .map((item) => {
        //     const diff = item.current - item.previous;
        //     const symbol = diff >= 0 ? '↑' : '↓';
        //     return `${item.category}: ₹${Math.abs(diff).toFixed(2)} ${symbol}`;
        //   })
        //   .join(' | ');
        // setSummary(summaryText);
      } catch (err) {
        console.error('❌ Failed to fetch comparison', err);
      }
    };
    const fetchMonthlySummary = async () => {
      try {
        const res = await api.get('/expenses/monthly-summary');
        const formatted = res.data.map((item: any) => ({
          month: item.month,
          total: item.total,
        }));
        setMonthlyExpensesData(formatted);
      } catch (err) {
        console.error('❌ Failed to fetch monthly summary:', err);
      }
    };

  const getTotalAmount = () => {
    return filteredExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  };

  const handleAnalyze = async () => {
   const res = await analyzeExpenses(filteredExpenses)
    setLoading(true);
    setTimeout(() => {
      setReport(res);
      setShowReportModal(true);
      setLoading(false);
    }, 500);
  };

  const currentYear = new Date().getFullYear();

  const filteredExpenses = filterMonth
    ? expenses.filter((expense) => expense.date.startsWith(filterMonth))
    : expenses;
// Replace your formatAnalysisText function with this:

const formatAnalysisText = (text: string) => {
  // Split by numbered headings (e.g., "1.", "2.", "3.")
  const sections = text.split(/(?:^|\n)\d\.\s*/).filter(Boolean);

  return sections.map((section, idx) => {
    // Split section into lines and remove empty lines
    const lines = section.split('\n').map(line => line.replace(/\*\*/g, '').trim()).filter(Boolean);

    // First line is the heading (may be part of the first line)
    const headingMatch = lines[0].match(/^([A-Za-z ]+)(:)?(.*)$/);
    let heading = '';
    let firstContent = '';
    if (headingMatch) {
      heading = headingMatch[1].replace(/[:.]/g, '').trim();
      firstContent = headingMatch[3]?.trim();
    } else {
      heading = lines[0];
    }

    // The rest are content
    let contentLines = lines.slice(1);
    if (firstContent) {
      contentLines = [firstContent, ...contentLines];
    }

    return (
      <div key={idx} style={{ marginBottom: '1.2rem' }}>
        <h3 style={{ marginTop: '0.3rem', marginBottom: '0.7rem', fontSize: '0.85rem' }}>
          {heading}
        </h3>
        {contentLines.map((line, i) => {
          const trimmed = line.trim();
          // Bold if ends with colon
          if (trimmed.endsWith(':')) {
            return (
              <p
                key={i}
                style={{
                  fontWeight: 'bold',
                  marginBottom: '0.1rem',
                  fontSize: '0.82rem',
                  lineHeight: '1.2',
                }}
              >
                {trimmed}
              </p>
            );
          }
          // Otherwise normal
          return (
            <p
              key={i}
              style={{
                fontWeight: 'normal',
                marginBottom: '0.3rem',
                fontSize: '0.82rem',
                lineHeight: '1.2',
              }}
            >
              {trimmed}
            </p>
          );
        })}
      </div>
    );
  });
};
  return (

    <>
      <NavigationBar 
      handleAnalyze ={handleAnalyze}
      onReload={onReload} />
    <div className={styles.container}>


      <AddExpenseForm onSuccess={fetchExpenses} />
     <div className={styles.chartContainer}>
      {weeklyData.length > 0 && <WeeklyExpenseChart data={weeklyData} />}
      {/* <DailyExpenseChart data={dailyData} /> */}
      </div> 

      <div className={styles.filter}>
        <label>
          Filter by Month:
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          >
            <option value="">All</option>
            {months.map((month: MonthOption) => (
              <option key={month.value} value={`${currentYear}-${month.value}`}>
                {month.label} {currentYear}
              </option>
            ))}
          </select>
        </label>
        <div className={styles.chartsMonthly}>
          <div className={styles.chartItem}>
            <MonthlyComparison data={comparisonMonthData} />
          </div>
          <div className={styles.chartItem}>
            <MonthlyLineChart monthlyExpensesData={monthlyExpensesData} />
          </div>
        </div>
      </div>

      <h2>Expense List</h2>
            <ul className={styles.list}>
        {filteredExpenses.map((expense, index) => (
          <li key={expense.id} className={styles.listItem}>
            <div className={styles.expenseDetails}>
              {expense.isEditing ? (
                <>
                  <input
                    type="text"
                    value={expense.title}
                    onChange={(e) => handleEditChange(index, 'title', e.target.value)}
                  />
                  <input
                    type="number"
                    value={Number(expense.amount)}
                    onChange={(e) => handleEditChange(index, 'amount', Number(e.target.value))}
                  />
                  <input
                    type="text"
                    value={expense.category}
                    onChange={(e) => handleEditChange(index, 'category', e.target.value)}
                  />
                  <input
                    type="date"
                    value={expense.date}
                    onChange={(e) => handleEditChange(index, 'date', e.target.value)}
                  />
                  <button onClick={() => handleEditSave(index)} className={styles.editButton}>
                    Save
                  </button>
                </>
              ) : (
                <>
                  <strong>{expense.title}</strong> - ₹{expense.amount} [{expense.category}] -{' '}
                  {expense.date}
                </>
              )}
            </div>

            <div className={styles.actions}>
              <button onClick={() => handleEditToggle(index)} className={styles.editButton}>
                {expense.isEditing ? 'Cancel' : 'Edit'}
              </button>
              <button onClick={() => handleDelete(expense.id)} className={styles.deleteButton}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <p className={styles.total}>Total Spent: ₹{getTotalAmount()}</p>
      <ExpenseChart data={filteredExpenses} />



      <button
        onClick={handleAnalyze}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#9ca3af' : '#10b981',
          color: 'white',
          padding: '0.6rem 1.2rem',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          fontSize: '1rem',
          transition: 'all 0.3s ease',
          marginTop: '1.5rem',
        }}
      >
        {loading ? 'Analyzing with AI…' : '💡 Analyze It'}
      </button>
      
        {showReportModal && report && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent} id="report-modal">
              <div className={styles.modalHeader}>
                <span className={styles.modalTitle}>💡 Suggestions</span>
                <button
                  className={styles.closeButton}
                  onClick={() => setShowReportModal(false)}
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>
              <div className={styles.modalBody}>
                {report && formatAnalysisText(report)}
              </div>
            </div>
          </div>
        )}
    </div>
     </>
  );
};

export default HomePage;
