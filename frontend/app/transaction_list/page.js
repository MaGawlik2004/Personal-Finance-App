'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link'
import io from 'socket.io-client';

const socket = io('http://localhost:8000');

const TransactionListPage = () => {
    const [allTransactions, setAllTransactions] = useState([])
    const email = sessionStorage.getItem('email')

    useEffect(() => {
        socket.on('delete_transaction_status', (data) => {
            if (data.status === 'success') {
                alert(data.message)
            } else {
                alert(data.message)
            }
        })
    })

    useEffect(() => {
        const fetchTransactions = async () => {

            try {
                const apiURL = `http://localhost:8000/api/user/${email}/transaction`
                const response = await fetch(apiURL)

                if (!response.ok) {
                    throw new Error(`Błąd HTTP: ${response.status}`)
                }
                const data = await response.json()

                console.log("Odpowiedź z API:", data)
                setAllTransactions(data)
            } catch (error) {
                console.error("Błąd podczas pobierania danych:", error);
            }
        }

        fetchTransactions()
    }, [email])

    const handleDelete = async (transaction_id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/user/${email}/transaction/${transaction_id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log(result);

            setAllTransactions((prevTransactions) =>
                prevTransactions.filter((transaction) => transaction.id !== transaction_id)
            );

        } catch (error) {
            console.error('Błąd podczas usuwania transakcji:', error);
        }
    };
    return(
        <div className='Transaction_List_Page'>
            <h1 className='Transaction_List_Welcom'>TransactionList</h1>

            <div className='transaction_list'>
            <ul className="transaction-table">
                <li className="table-header">
                    <p>Store Name</p>
                    <p>Category</p>
                    <p>Amount</p>
                    <p>Transaction Date</p>
                    <p>Actions</p>
                </li>
                {allTransactions.map((transaction) => (
                    <li key={transaction.id} class="table-row">
                        <p>{transaction.description}</p>
                        <p>{transaction.category}</p>
                        <p>{transaction.amount}</p>
                        <p>{transaction.date}</p>
                        <div className="actions">
                            <button onClick={() => handleDelete(transaction.id)}>Delete</button>
                            <Link href={`/transaction_list/${transaction.id}`}>
                                <button>Edit</button>
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
            <div className='button_div'>
                <Link href='/add_transaction'>
                    <button className='add_button'>+</button>
                </Link>
            </div>
        </div>
    </div>
    )
}

export default TransactionListPage