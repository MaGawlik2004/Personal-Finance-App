'use client'

import { useEffect } from "react";
import React from "react"
import { Formik, Field, Form } from "formik";
import * as yup from 'yup'
import io from 'socket.io-client';

const schema = yup.object().shape({
    description: yup.string().required('The store name is required.'),
    amount: yup.number().required("The amount is required.").positive("The amount must be greater than zero."),
    category: yup.string().required('The category is required.'),
    date: yup.date().required('The date is required.')
})

const socket = io('http://localhost:8000');

const AddTransactionPage = () => {
    const category_list = ['Revenue', 'Maintenance', 'Clothes', 'Education', 'Hobby', 'Cosmetics', 'Children', 'Pets', 'Home', 'Insurance', 'Transport', 'Health', 'Vacation']
    const onSubmit = (data) => {
        SendJsonToApi(data)
        resetForm();
    }

    useEffect(() => {
        socket.on('add_transaction_status', (data) => {
            if (data.status === 'success') {
                alert(data.message)
            } else {
                alert(data.message)
            }
        })
    }, [])

    async function SendJsonToApi(data) {
        console.log("Sending data:", data)
        const email = sessionStorage.getItem('email')

        try{
            const response = await fetch(`http://localhost:8000/api/user/${email}/transaction`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            })
            if (!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const result = await response.json()
            console.log(result)
        } catch (error) {
            console.error('Error sending data to API:', error)
        }
            
    }

    return(
        <div className="Add_Transaction_Page">
            <h1 className="add_transaction_page_welcome">Add Transaction</h1>
            <Formik
            initialValues={{
                description: "",
                category: "Chose Category",
                amount: '',
                date: "",
            }}
            validationSchema={schema}
            onSubmit={onSubmit}
            >
            {({ errors, touched }) => (
                <Form className="Add_Transaction_Form">
                    <div className="div_form">
                        <label htmlFor="description" className="string_name">Store Name</label>
                        <Field id='description' name='description' className="aa_name"/>
                        {errors.description && touched.description ? (
                            <div>{errors.description}</div>
                        ) : null}
                    </div>

                    <div className="div_form">
                        <label htmlFor="category" className="string_category">Category</label>
                        <Field as='select' id='category' name='category' className="aa_category">
                        {category_list.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                        </Field>
                        {errors.category && touched.category ? (
                            <div>{errors.category}</div>
                        ) : null}
                    </div>

                    <div className="div_form">
                        <label htmlFor="amount" className="string_amount">Amount</label>
                        <Field id='amount' name='amount' className="aa_amount"/>
                        {errors.storeName && touched.storeName ? (
                            <div>{errors.storeName}</div>
                        ) : null}
                    </div>

                    <div className="date">
                        <label htmlFor="date" className="string_date">Transaction Date</label>
                        <Field id="date" name="date" type="date" className="aa_date"/>
                        {errors.date && touched.date ? (
                        <div>{errors.date}</div>
                        ) : null}
                    </div>

                    <div className="set_submit_button">
                        <button className='submit_button' type="submit">Dodaj notatkę</button>
                    </div>
                </Form>
            )}
            </Formik>
        </div>
    )
}

export default AddTransactionPage