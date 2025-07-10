import React, { useState } from 'react';
import api from '../services/api';
import styles from './AddExpenseForm.module.css';

type Props = {
  onSuccess: () => void; // to refresh data after submit
};

// Helper to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const AddExpenseForm: React.FC<Props> = ({ onSuccess }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<string>(''); // as string for text input
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(getTodayDate());
  const [loading, setLoading] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and optional decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !amount || !category || !date) return;

    setLoading(true);

    try {
      const response = await api.post('/expenses', {
        title,
        amount: Number(amount),
        category,
        date,
      });

      console.log('✅ Saved:', response.data);

      // Clear form
      setTitle('');
      setAmount('');
      setCategory('');
      setDate(getTodayDate());

      onSuccess(); // notify parent to refresh list

    } catch (error) {
      console.error('❌ Failed to save expense:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <input
        className={styles.input}
        type="text"
        value={amount}
        onChange={handleAmountChange}
        placeholder="Amount"
        inputMode="decimal"
        pattern="^\d*\.?\d*$"
        required
      />
      <input
        className={styles.input}
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        required
      />
      <input
        className={styles.input}
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <button className={styles.button} type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Add Expense'}
      </button>
    </form>
  );
};

export default AddExpenseForm;
