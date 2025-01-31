'use client'

import Link from 'next/link'
import { useState, useEffect } from "react"
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const StatisticsPage = () => {
    const [amountsByCategory, setAmountsByCategory] = useState([])
    const [totalRevenue, setTotalRevenue] = useState(0)
    const [totalCosts, setTotalCosts] = useState(0)
    const email = sessionStorage.getItem('email')
    const category_list = ['Maintenance', 'Clothes', 'Education', 'Hobby', 'Cosmetics', 'Children', 'Pets', 'Home', 'Insurance', 'Transport', 'Health', 'Vacation']
    
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
    }, [email])

    useEffect(() => {
        const fetchAllCosts = async () => {
            try {
                const apiURL = `http://localhost:8000/api/user/${email}/transaction/category`
                const response = await fetch(apiURL)

                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`)
                }

                const data = await response.json()
                setTotalCosts(data.totalAmount || 0)
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }

        fetchAllCosts()
    }, [email])

    useEffect(() => {
        const fetchRevenue = async () => {
            try {
                const apiURL = `http://localhost:8000/api/user/${email}/transaction/category/Revenue`
                const response = await fetch(apiURL)

                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`)
                }

                const data = await response.json()
                setTotalRevenue(data.totalAmount || 0)
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }

        fetchRevenue()
    }, [email])

    const data = {
        labels: amountsByCategory.map(item => item.category), 
        datasets: [
            {
                label: 'Expenses',
                data: amountsByCategory.map(item => item.totalAmount), 
                backgroundColor: amountsByCategory.map(item => item.category === 'Revenue' ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)'),
                borderColor: amountsByCategory.map(item => item.category === 'Revenue' ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'),
                borderWidth: 1,
            },
        ],
    }

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Expenses and Income',
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        return `${tooltipItem.dataset.label}: ${tooltipItem.raw} PLN`
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Categories'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Amount (PLN)'
                }
            }
        }
    }

    return (
        <div className="statistics_page">
            <div className="header">
                <h1>Statistics</h1>
            </div>

            <div className="stats">
                <h2>Incom: {totalRevenue}</h2>
                <h2>Expences: {totalCosts}</h2>
                <h2>Balance: {totalRevenue - totalCosts}</h2>
            </div>

            <div className="stats_diagram">
                <table border="1" className="table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Total Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {amountsByCategory.map(({ category, totalAmount }) => (
                            <tr key={category}>
                                <td className="td_category">{category}</td>
                                <td>{totalAmount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="wykres">
                    <h3>Expenses Chart</h3>
                    <Bar data={data} options={options} />
                </div>
            </div>
            <div className="raport_button_set">
                <Link href='/generate_raport'>
                    <button className="raport_button">Generate Raport</button>
                </Link>
            </div>
        </div>
    )
}

export default StatisticsPage
