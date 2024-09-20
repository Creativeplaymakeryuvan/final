const router = require('express').Router()
const { getName } = require('../Controllers/Name')
const { addExpense, getExpenses, deleteExpense, updateExpense, processBillImage, processInvoice } = require('../Controllers/expense')
const { addIncome, getIncomes, deleteIncomes, updateIncome } = require('../Controllers/income')
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.get('/getName', getName)
    .post('/add-income', addIncome)
    .get('/get-incomes/:userId', getIncomes)
    .delete('/delete-income/:userId/:incomeId', deleteIncomes)
    .put('/update-income/:userId/:incomeId', updateIncome)
    .post('/add-expense', addExpense)
    .get('/get-expenses/:userId', getExpenses)
    .delete('/delete-expense/:userId/:expenseId', deleteExpense)
    .put('/update-expense/:userId/:expenseId', updateExpense)
    .post('/process-bill-image', upload.single('image'), processBillImage)
    .post('/process-invoice', upload.single('file'), processInvoice)

module.exports = router