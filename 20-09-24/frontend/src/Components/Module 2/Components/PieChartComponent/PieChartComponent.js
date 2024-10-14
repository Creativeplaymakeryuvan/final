import React from 'react';
import { Pie } from 'react-chartjs-2';
import { useGlobalContext } from '../../Context/globalContext';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartComponent = ({ incomeData, expenseData, flag }) => {
  const { incomes, expenses } = useGlobalContext();
  
  // Calculate totals for income and expenses
  let incomeTotal = incomeData;
  let expenseTotal = expenseData;
  
  // If flag is false, calculate totals from global context
  if (!flag) {
    incomeTotal = incomes.reduce((acc, income) => acc + (income.amount || 0), 0);
    expenseTotal = expenses.reduce((acc, expense) => acc + (expense.amount || 0), 0);
  }
  
  // If no data, show a full red pie chart
  if (incomeTotal === 0 && expenseTotal === 0) {
    incomeTotal = 0;
    expenseTotal = 1; 
  }

  const data = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        data: [incomeTotal, expenseTotal],
        backgroundColor: ['#82ca9d', '#FF6384'],
        hoverBackgroundColor: ['#82ca9d', '#FF6384'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="pie-chart-container">
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChartComponent;
