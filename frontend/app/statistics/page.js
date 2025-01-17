'use client'

import { useState, useEffect } from "react"

const StatisticsPage = () => {
    const [amountsByCategory, setAmountsByCategory] = useState([])
    const email = sessionStorage.getItem('email')
    const category_list = ['Revenue', 'Maintenance', 'Clothes', 'Education', 'Hobby', 'Cosmetics', 'Children', 'Pets', 'Home', 'Insurance', 'Transport', 'Health', 'Vacation']
    
    useEffect(() => {
        const fetchAmounts = async () => {
            try {
                const results = await Promise.all(
                    category_list.map(async (category) => {
                        const apiURL = `http://localhost:8000/api/user/${email}/transaction/category/${category}`
                        const response = await fetch(apiURL)

                        if (!response.ok) {
                            throw new Error(`HTTP Error: ${response.status}`)
                        }
                        const data = await response.json()
                        return { category, totalAmount: data.totalAmount || 0 } // Zakładamy, że `totalAmount` jest w odpowiedzi
                    })
                )
                setAmountsByCategory(results)
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }

        fetchAmounts()
    }, [email]) // Dodanie `email` jako zależności, aby uniknąć błędów

    return (
        <div>
            <h1>Statistics</h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {amountsByCategory.map(({ category, totalAmount }) => (
                        <tr key={category}>
                            <td>{category}</td>
                            <td>{totalAmount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default StatisticsPage
