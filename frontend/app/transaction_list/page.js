'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link'

const TransactionListPage = () => {
    const [allTransactions, setAllTransactions] = useState([])
    const email = sessionStorage.getItem('email')

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

            alert(`Transakcja została usunięta.`);
        } catch (error) {
            console.error('Błąd podczas usuwania transakcji:', error);
        }
    };
    return(
        <div>
            <h1>TransactionList</h1>

            <ul>
                {allTransactions.map((transaction) => (
                    <li key={transaction.id}>
                        {transaction.description}: {transaction.category}: {transaction.amount}: {transaction.date}
                        <button onClick={() => handleDelete(transaction.id)}>Delete</button>
                        <Link href={`/transaction_list/${transaction.id}`}>
                            <button>Edit</button>
                        </Link>
                    </li>
                ))}
            </ul>
            <Link href='/add_transaction'>
                <button>+</button>
            </Link>
        </div>
    )
}

export default TransactionListPage