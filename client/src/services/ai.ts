import axios from 'axios';

export const analyzeExpenses = async (expenses: any[]) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL || ''}/ai/analyze`,
    { expenses }
  );
  return response.data.report;
};
