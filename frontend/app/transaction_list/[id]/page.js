'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from 'next/navigation';
import { Formik, Field, Form } from 'formik';
import * as yup from 'yup';
import io from 'socket.io-client';

const validationSchema = yup.object().shape({
    description: yup.string().required('Description is required.'),
    category: yup.string().required('Category is required.'),
    amount: yup.number().required('Amount is required.').positive('The amount must be greater than zero.'),
    date: yup.date().required('The date is required.'),
});

const socket = io('http://localhost:8000');

const EditTransactionPage = () => {
    const { id } = useParams()
    const router = useRouter()
    const email = sessionStorage.getItem('email')
    const [transactionData, setTransactionData] = useState({
        description: '',
        category: '',
        amount: '',
        date: '',
    })

    useEffect(() => {
        socket.on('update_transaction_status', (data) => {
            if (data.status === 'success') {
                alert(data.message)
                router.push('/transaction_list');
            } else {
                alert(data.message)
            }
        })
    })

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const apiURL = `http://localhost:8000/api/user/${email}/transaction/${id}`
                const response = await fetch(apiURL)
   
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`)
                }
   
                const data = await response.json()
                console.log("Received transaction data:", data);
   
                if (data) {
                    setTransactionData(data)
                } else {
                    alert("Transaction not found.");
                }
            } catch (error) {
                console.error('Error while fetching transaction data:', error)
            }
        }
        fetchTransaction()
    }, [id, email])

    const category_list = ['Revenue', 'Maintenance', 'Clothes', 'Education', 'Hobby', 'Cosmetics', 'Children', 'Pets', 'Home', 'Insurance', 'Transport', 'Health', 'Vacation'];


    const onSubmit = async (data) => {
        try {
            const response = await fetch(`http://localhost:8000/api/user/${email}/transaction/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const result = await response.json();
            console.log('Transaction updated:', result);
        } catch (error) {
            console.error('Error while fetching transaction data:', error);
        }
    };

    const initialValues = {
        description: transactionData.description || '',
        category: transactionData.category || '',
        amount: transactionData.amount || 0,
        date: transactionData.date || '',
    };
    
    return (
        <div className="Add_Transaction_Page">
            <h1 className="add_transaction_page_welcome">Edit Transaction</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                enableReinitialize
                onSubmit={onSubmit}
            >
                {({ errors, touched }) => (
                    <Form className="Add_Transaction_Form">
                        <div className="div_form">
                            <label htmlFor="description" className="string_name">Store Name:</label>
                            <Field 
                                type='text'
                                id='description'
                                name='description'
                                className="aa_name"
                            />
                            {errors.description && touched.description && (
                                <div>{errors.description}</div>
                            )}
                        </div>

                        <div className="div_form">
                            <label htmlFor="category" className="string_category">Category:</label>
                            <Field as="select" id="category" name="category" className="aa_category">
                                {category_list.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </Field>
                            {errors.category && touched.category && (
                                <div>{errors.category}</div>
                            )}
                        </div>

                        <div className="div_form">
                            <label htmlFor="amount" className="string_amount">Amount:</label>
                            <Field 
                                type='number'
                                id='amount'
                                name='amount'
                                className="aa_amount"
                            />
                            {errors.amount && touched.amount && (
                                <div>{errors.amount}</div>
                            )}
                        </div>

                        <div className="date">
                            <label htmlFor="date" className="string_date">Transaction Date:</label>
                            <Field 
                                type='date'
                                id='date'
                                name='date'
                                className="aa_date"
                            />
                            {errors.date && touched.date && (
                                <div>{errors.date}</div>
                            )}
                        </div>

                        <div className="set_submit_buttons">
                            <button type="submit" className='update_button'>Update</button>
                            <button
                                type="button"
                                onClick={() => router.push('/transaction_list')}
                                className='cancle_button'
                            >
                                Cancle
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default EditTransactionPage