import React, { useState } from 'react';
import './transaction.css';
import Button from '../Button/Button';
import { useGlobalContext } from '../../Context/globalContext';
import { FaTrashCan } from "react-icons/fa6";
import { FaPen } from "react-icons/fa";
import { dateFormet } from '../../Utils/dateFormet';
import UpdateModal from '../Models/Modal';

function Transaction() {
    const { transactionHistory, deleteIncome, deleteExpense, updateIncome, updateExpense } = useGlobalContext();
    const userId = localStorage.getItem('userId');

    const [showModal, setShowModal] = useState(false);
    const [currentData, setCurrentData] = useState(null);

    const handleClose = () => setShowModal(false);

    const handleShow = (data) => {
        setCurrentData(data); 
        setShowModal(true);
    };

    const handleSubmit = (updatedData) => {
        console.log("type-"+currentData.type)
        if (currentData.type === 'income') {
            updateIncome(userId, currentData._id, updatedData);
        } else {
            updateExpense(userId, currentData._id, updatedData);
        }
        handleClose();
    };

    return (
        <div className='InnerLayout'>
            <h2>All Transactions</h2>
            <div className='Table-head'>
                <h2>Title</h2>
                <h2>Amount</h2>
                <h2>Type</h2>
                <h2>Category</h2>
                <h2>Date</h2>
                <h2>Action</h2>
            </div>
            {transactionHistory().map((data) => (
                <div className='Table-body' key={data._id}>
                    <h2>{data.title}</h2>
                    <h2>{data.amount}</h2>
                    <h2>{data.type}</h2>
                    <h2>{data.category.split(" - ")[1] ? data.category.split(" - ")[1] : data.category.split(" - ")[0]}</h2>
                    <h2>{dateFormet(data.date)}</h2>
                    <h2 className='action-con'>
                        <Button
                            className=''
                            icon={<FaPen />}
                            bg={"transparent"}
                            onClick={() => handleShow(data)}
                        />
                        <Button
                            className=''
                            icon={<FaTrashCan className='Table-logo' />}
                            bg={"transparent"}
                            onClick={() => data.type === 'income' ? deleteIncome(userId, data._id) : deleteExpense(userId, data._id)}
                        />
                    </h2>
                </div>
            ))}

            {showModal && currentData && (
                <UpdateModal
                    show={showModal}
                    handleClose={handleClose}
                    currentData={currentData}
                    onSubmit={handleSubmit}
                />
            )}
        </div>
    );
}

export default Transaction;
