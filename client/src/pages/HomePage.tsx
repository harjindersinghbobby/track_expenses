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
type Expense = {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string; // format: YYYY-MM-DD
  isEditing?: boolean;
};

const HomePage = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.toISOString().slice(0, 7);
  const [filterMonth, setFilterMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const navigate = useNavigate();
  const fetchExpenses = async () => {
    try {
      const response = await api.get('/expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error('❌ Failed to load expenses:', error);
    }
  };


  useEffect(() => {

    if(!localStorage.getItem('token')) {
      // Redirect to login or show a message
      console.error('❌ No token found, redirecting to login');
     navigate('/login')
    }else {
    fetchExpenses();

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


  const getTotalAmount = () => {
    return filteredExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  };

  const handleAnalyze = async () => {
   const res = await analyzeExpenses(filteredExpenses)
    setLoading(true);
    setTimeout(() => {
      setReport(res);
      setLoading(false);
    }, 1000);
  };

  const currentYear = new Date().getFullYear();

  const filteredExpenses = filterMonth
    ? expenses.filter((expense) => expense.date.startsWith(filterMonth))
    : expenses;

  return (

    <>
      <NavigationBar />
    <div className={styles.container}>


      <AddExpenseForm onSuccess={fetchExpenses} />

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
            <MonthlyComparison selectedMonth={currentMonth} />
          </div>
          <div className={styles.chartItem}>
            <MonthlyLineChart />
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

      {report && (
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1.5rem',
            backgroundColor: '#f3f4f6',
            borderRadius: '12px',
            border: '1px solid #d1d5db',
            fontFamily: 'monospace',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          {report}
        </div>
      )}
    </div>
     </>
  );
};

export default HomePage;
