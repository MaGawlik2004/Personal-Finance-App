'use client'

import Link from "next/link"
import { useState } from "react"

const GenerateRaportPage = () => {
    const email = sessionStorage.getItem('email')
    const [reportLink, setReportLink] = useState(null)

    const handleGenerateRaport = async () => {
        try{
            const response = await fetch(`http://localhost:8000/api/raport/${email}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()
            if (result.file_url) {
                setReportLink(result.file_url)
            } else {
                alert('Nie udało się wygenerować raportu.')
            }
        } catch (error) {
            console.error('Błąd podczas generowania raportu:', error)
        }
    }

    return (
        <div>
            <h1>Generate Raport Page</h1>
            <button onClick={handleGenerateRaport}>Generate Raport</button>
            {reportLink && (
                <div>
                    <p>Twój raport został wygenerowany:</p>
                    <a href={reportLink} target="_blank" rel="noopener noreferrer">Pobierz raport</a>
                </div>
            )}
            <Link href='/statistics'>
                <button>Cancel</button> 
            </Link>
        </div>
    )
}

export default GenerateRaportPage