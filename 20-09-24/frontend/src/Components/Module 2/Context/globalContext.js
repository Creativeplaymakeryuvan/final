import React, { useContext, useState } from "react"
import axios from "axios"

const URL = "http://localhost:3001/api/v1/";

const GlobalContext = React.createContext()

export const GlobalProvider = ({ children }) => {

    const [incomes, setIncomes] = useState([])
    const [expenses, setExpenses] = useState([])
    const [error, setError] = useState(null)

    // for Income

    const addIncome = async (income) => {
        const response = await axios.post(`${URL}add-income`, income)
            .then(() => {
                alert('Income added')
            })
            .catch((err) => {
                alert('Income not added')
                setError(err.response.data.message)
            })
        getIncomes()
    }

    const getIncomes = async () => {
        const userId = localStorage.getItem("userId")
        try {
            const response = await axios.get(`${URL}get-incomes/${userId}`)

            setIncomes(response.data)
            console.log("Icome data" + response.data)
        } catch (err) {
            setError(err.response.data.message)
        }
    }

    const deleteIncome = async (userId, incomeId, updatedFields) => {
        const res = await axios.delete(`${URL}delete-income/${userId}/${incomeId}`, updatedFields)
        getIncomes()
    }

    const updateIncome = async (userId, incomeId, updatedFields) => {
        try {
            const res = await axios.put(`${URL}update-income/${userId}/${incomeId}`, updatedFields)
        } catch (err) {
            setError(err.response.data.message)
        }
        getIncomes()
    }

    const totalIncome = () => {
        let totalIncome = 0;
        incomes.forEach((income) => {
            totalIncome += income.amount
        })
        return totalIncome;
    }

    // for Expense

    const addExpense = async (expense) => {
        console.log('expese:='+expense)
        const response = await axios.post(`${URL}add-expense`, expense)
            .then(() => {
                alert('Expense added')
            })
            .catch((err) => {
                alert('Expense not added')
                setError(err.response.data.message)
            })
        getExpenses()
    }

    const getExpenses = async () => {
        const userId = localStorage.getItem("userId")
        try {
            const response = await axios.get(`${URL}get-expenses/${userId}`)

            setExpenses(response.data)
            console.log("Expense data" + response.data)
        } catch (err) {
            setError(err.response.data.message)
        }
    }

    const deleteExpense = async (userId, expenseId) => {
        const res = await axios.delete(`${URL}delete-expense/${userId}/${expenseId}`)
        getExpenses()
    }

    const updateExpense = async (userId, expenseId, updatedFields) => {
        try {
            const res = await axios.put(`${URL}update-expense/${userId}/${expenseId}`, updatedFields)
        } catch (err) {
            setError(err.response.data.message)
        }
        getExpenses()
    }

    const totalIncomes = () => {
        let totalIncome = 0;
        incomes.forEach((income) => {
            totalIncome += income.amount
        })
        return totalIncome;
    }

    const totalExpenses = () => {
        let totalExpense = 0;
        expenses.forEach((expense) => {
            totalExpense += expense.amount
        })
        return totalExpense;
    }

    const totalBalance = () => {
        return totalIncome() - totalExpenses()
    }

    const processBillImage = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post(`${URL}process-bill-image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const { inference } = response.data;
            const amount = inference.prediction.totalAmount?.value || 'Amount not available';
            const date = inference.prediction.date?.value || 'Date not available';
            const totalItemsPurchased = inference.prediction.lineItems?.length || 0;
            const description = inference.prediction.lineItems?.map((item, index) => ({
                item: item.description || `Item ${index + 1}`,
                quantity: item.quantity|| 'N/A',
                price: item.totalAmount || 'N/A',
            })) || [];
            const title = inference.prediction.supplierName?.value || 'Store name not available';

            return {
                amount,
                date,
                totalItemsPurchased,
                description,
                title,
            };

            // console.log('Total Amount:', amount);
            // console.log('Purchase Date:', purchaseDate);
            // console.log('Total Items Purchased:', totalItemsPurchased);
            // console.log('Items List:', itemsList);
            // console.log('Store Name:', storeName);

        } catch (error) {
            console.error('Error processing bill image:', error);
        }
    };

    const processInvoice = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
    
        try {
            const response = await axios.post(`${URL}process-invoice`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            const { inference } = response.data;
    
            const amount = inference.prediction.totalAmount?.value || 'Amount not available';
            const date = inference.prediction.date?.value || 'Date not available';
            const totalItemsPurchased = inference.prediction.lineItems?.length || 0;
            const description = inference.prediction.lineItems?.map((item, index) => ({
                item: item.description?.value || `Item ${index + 1}`,
                quantity: item.quantity?.value || 'N/A',
                price: item.totalAmount?.value || 'N/A',
            })) || [];
            const title = inference.prediction.supplierName?.value || 'Supplier name not available';
    
            return {
                amount,
                date,
                totalItemsPurchased,
                description,
                title,
            };
    
            // Uncomment to debug
            // console.log('Total Amount:', amount);
            // console.log('Date:', date);
            // console.log('Total Items Purchased:', totalItemsPurchased);
            // console.log('Description:', description);
            // console.log('Supplier Name:', title);
    
        } catch (error) {
            console.error('Error processing invoice:', error);
        }
    };
    

    const transactionHistory = () => {
        const history = [...incomes, ...expenses]
        history.sort((a, b) => {
            return new Date(b.date) - new Date(a.date)
        })
        return history
    }


    const getMonthlyTransactions = (month, year) => {
        const filteredIncomes = incomes.filter((income) => {
            const incomeDate = new Date(income.date);
            return (
                incomeDate.getMonth() === month - 1 && incomeDate.getFullYear() === year
            );
        });

        const filteredExpenses = expenses.filter((expense) => {
            const expenseDate = new Date(expense.date);
            return (
                expenseDate.getMonth() === month - 1 && expenseDate.getFullYear() === year
            );
        });

        const totalMonthlyIncome = filteredIncomes.reduce(
            (acc, income) => acc + income.amount,
            0
        );

        const totalMonthlyExpenses = filteredExpenses.reduce(
            (acc, expense) => acc + expense.amount,
            0
        );

        const filteredtransactionHistory = () => {
            const history = [...filteredIncomes, ...filteredExpenses];
            history.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB - dateA;
            });
            return history;
        }


        const totalTransactions = filteredIncomes.length + filteredExpenses.length;

        return {
            filteredIncomes,
            filteredExpenses,
            totalMonthlyIncome,
            totalMonthlyExpenses,
            totalTransactions,
            balance: totalMonthlyIncome - totalMonthlyExpenses,
            filteredtransactionHistory: filteredtransactionHistory()
        };
    };

    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            updateIncome,
            totalIncome,
            addExpense,
            getExpenses,
            expenses,
            deleteExpense,
            updateExpense,
            totalExpenses,
            totalIncomes,
            totalBalance,
            transactionHistory,
            getMonthlyTransactions,
            processBillImage,
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(GlobalContext)
}