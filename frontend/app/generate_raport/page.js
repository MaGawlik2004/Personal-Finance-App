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
        <div className="generateRaportPage">
            <h1 className="Welcom_generate">Generate Raport Page</h1>
            {reportLink && (
                <div className="Link">
                    <p>Twój raport został wygenerowany:</p>
                    <a href={reportLink} target="_blank" rel="noopener noreferrer">Pobierz raport</a>
                </div>
            )}
            <div className="generate_raport_button_layout">
                <button onClick={handleGenerateRaport} className="generate_raport_button">Generate Raport</button>
                <Link href='/statistics'>
                    <button className="go_back_button">Cancel</button> 
                </Link>
            </div>
        </div>
    )
}

export default GenerateRaportPage