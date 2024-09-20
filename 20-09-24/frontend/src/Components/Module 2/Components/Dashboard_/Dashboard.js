import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useGlobalContext } from '../../Context/globalContext';
import SortBy from '../SortBy/SortBy';
import Cardinfo from '../Cardinfo/Cardinfo';
import History from '../History/History';
import BarChartComponent from '../BarChartComponent/BarChartComponent';
import './dashboard.css';

const Dashboard = () => {
  const [name, setName] = useState('');
  const URL = 'http://localhost:3001/api/v1/';

  const getName = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`${URL}getName`, {
        headers: {
          'user-id': userId,
        },
      });
      setName(response.data.name);
    } catch (error) {
      console.error('Error fetching name:', error);
    }
  };

  useEffect(() => {
    getName();
  }, []);

  const { getMonthlyTransactions } = useGlobalContext();

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [sortBy, setSortBy] = useState(localStorage.getItem('sortBy') || 'custom');
  const [month, setMonth] = useState(Number(localStorage.getItem('month')) || currentMonth);
  const [year, setYear] = useState(Number(localStorage.getItem('year')) || currentYear);
  const [flag, setFlag] = useState(localStorage.getItem('sortBy') !== 'all');

  useEffect(() => {
    localStorage.setItem('sortBy', sortBy);
    localStorage.setItem('month', month);
    localStorage.setItem('year', year);
  }, [sortBy, month, year]);

  const handleSortByChange = (selectedSort) => {
    setSortBy(selectedSort);

    if (selectedSort === 'all') {
      setMonth(null);
      setYear(null);
      setFlag(false);
    } else {
      setMonth(currentMonth);
      setYear(currentYear);
      setFlag(true);
    }
  };

  const handleMonthChange = (month) => {
    setMonth(month);
  };

  const handleYearChange = (year) => {
    setYear(year);
  };

  // Sliding right to the previous month
  const handleSlideRight = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  // Sliding left to the next month
  const handleSlideLeft = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const {
    filteredIncomes,
    filteredExpenses,
    totalMonthlyIncome,
    totalMonthlyExpenses,
    balance,
    filteredtransactionHistory
  } = getMonthlyTransactions(month, year);

  console.log('Filtered Incomes:', filteredIncomes);
  console.log('Filtered Expenses:', filteredExpenses);

  return (
    <div className="InnerLayout">
      <div className="head">
        <h2 className="name">Hi, {name}✌
          <p className="d-p">
            Here's what's happening with your money, let's manage your expenses.
          </p>
        </h2>

        <SortBy
          sortBy={sortBy}
          handleSortByChange={handleSortByChange}
          handleMonthChange={handleMonthChange}
          handleYearChange={handleYearChange}
          currentMonth={currentMonth}
          currentYear={currentYear}
          month={month}
          year={year}
        />
      </div>

      <Cardinfo
        totalMonthlyIncome={totalMonthlyIncome}
        totalMonthlyExpenses={totalMonthlyExpenses}
        balance={balance}
        flag={flag}
      />

      <div className="bar-chart-navigation">
        <div className='bar-chart-btn'>
        <button className="previous-btn" onClick={handleSlideRight}>Previous Month</button>
        <button className="next-btn" onClick={handleSlideLeft}>Next Month</button>
        </div>
        <BarChartComponent
          incomeData={filteredIncomes}
          expenseData={filteredExpenses}
          flag={flag}
        />
      </div>

      <History
        filteredtransactionHistory={filteredtransactionHistory}
        flag={flag}
      />
    </div>
  );
};

export default Dashboard;
