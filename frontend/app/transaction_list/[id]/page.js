'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from 'next/navigation';
import { Formik, Field, Form } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
    description: yup.string().required('Opis jest wymagany.'),
    category: yup.string().required('Kategoria jest wymagana.'),
    amount: yup.number().required('Kwota jest wymagana.').positive('Kwota musi być większa od zera.'),
    date: yup.date().required('Data jest wymagana.'),
});

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
        const fetchTransaction = async () => {
            try {
                const apiURL = `http://localhost:8000/api/user/${email}/transaction/${id}`
                const response = await fetch(apiURL)
   
                if (!response.ok) {
                    throw new Error(`Błąd HTTP: ${response.status}`)
                }
   
                const data = await response.json()
                console.log("Otrzymane dane transakcji:", data);  // Logowanie danych
   
                if (data) {
                    setTransactionData(data)
                } else {
                    alert("Transakcja nie została znaleziona.");
                }
            } catch (error) {
                console.error('Błąd podczas pobierania danych transakcji:', error)
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
                throw new Error(`Błąd HTTP: ${response.status}`);
            }

            const result = await response.json();
            console.log('Zaktualizowano transakcję:', result);

            alert('Transakcja została zaktualizowana.');
            router.push('/transaction_list');
        } catch (error) {
            console.error('Błąd podczas aktualizacji transakcji:', error);
        }
    };

    const initialValues = {
        description: transactionData.description || '',
        category: transactionData.category || '',
        amount: transactionData.amount || 0,
        date: transactionData.date || '',
    };
    
    return (
        <div>
            <h1>Edytuj Transakcję</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                enableReinitialize
                onSubmit={onSubmit}
            >
                {({ errors, touched }) => (
                    <Form>
                        <div>
                            <label htmlFor="description">Store Name:</label>
                            <Field 
                                type='text'
                                id='description'
                                name='description'
                            />
                            {errors.description && touched.description && (
                                <div>{errors.description}</div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="category">Category:</label>
                            <Field as="select" id="category" name="category">
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

                        <div>
                            <label htmlFor="amount">Amount:</label>
                            <Field 
                                type='number'
                                id='amount'
                                name='amount'
                            />
                            {errors.amount && touched.amount && (
                                <div>{errors.amount}</div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="date">Transaction Date:</label>
                            <Field 
                                type='date'
                                id='date'
                                name='date'
                            />
                            {errors.date && touched.date && (
                                <div>{errors.date}</div>
                            )}
                        </div>

                        <button type="submit">Update</button>
                        <button
                            type="button"
                            onClick={() => router.push('/transaction_list')}
                        >
                            Cancle
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default EditTransactionPage