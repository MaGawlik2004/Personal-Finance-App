'use client'

import React from "react"
import { Formik, Field, Form } from "formik";
import * as yup from 'yup'

const schema = yup.object().shape({
    storeName: yup.string().required('Nazwa sklepu jest wymagana.'),
    amount: yup.number().required("Kwota jest wymagana."),
    category: yup.string().required('Kategoria jest wymagana.'),
    date: yup.date().required('Data jest wymagana.')
})
const AddTransactionPage = () => {
    const category_list = ['Revenue', 'Maintenance', 'Clothes', 'Education', 'Hobby', 'Cosmetics', 'Children', 'Pets', 'Home', 'Insurance', 'Transport', 'Health', 'Vacation']
    const onSubmit = (data) => {
        alert(`Transakcja ${data.name} została dodana.`)
        SendJsonToApi(data)
    }

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
                storeName: "",
                category: "",
                amount: 1,
                date: "",
            }}
            validationSchema={schema}
            onSubmit={onSubmit}
            >
            {({ errors, touched }) => (
                <Form className="Add_Transaction_Form">
                    <div>
                        <label htmlFor="storeName">Store Name</label>
                        <Field id='storeName' name='storeName' />
                        {errors.storeName && touched.storeName ? (
                            <div>{errors.storeName}</div>
                        ) : null}
                    </div>

                    <div>
                        <label htmlFor="category">Category</label>
                        <Field as='select' id='category' name='category'>
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

                    <div>
                        <label htmlFor="amount">Amount</label>
                        <Field id='amount' name='amount' />
                        {errors.storeName && touched.storeName ? (
                            <div>{errors.storeName}</div>
                        ) : null}
                    </div>

                    <div className="date">
                        <label htmlFor="date">Data Treningu</label>
                        <Field id="date" name="date" type="date" />
                        {errors.date && touched.date ? (
                        <div>{errors.date}</div>
                        ) : null}
                    </div>

                    <button className='submit_button' type="submit">Dodaj notatkę</button>
                </Form>
            )}
            </Formik>
        </div>
    )
}

export default AddTransactionPage