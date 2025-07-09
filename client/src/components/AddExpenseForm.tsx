import React, { useState } from 'react';
import api from '../services/api';

type Props = {
  onSuccess: () => void; // to refresh data after submit
};

const AddExpenseForm: React.FC<Props> = ({ onSuccess }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !amount || !category || !date) return;

    setLoading(true);

    try {
      const response = await api.post('/expenses', {
        title,
        amount,
        category,
        date,
      });

      console.log('✅ Saved:', response.data);

      // Clear form
      setTitle('');
      setAmount(0);
      setCategory('');
      setDate('');

      onSuccess(); // notify parent to refresh list

    } catch (error) {
      console.error('❌ Failed to save expense:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
      <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} placeholder="Amount" required />
      <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" required />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Add Expense'}
      </button>
    </form>
  );
};

export default AddExpenseForm;
