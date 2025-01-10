'use client'
import Link from 'next/link'
import React from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

const schema = yup.object().shape({
    name: yup.string().required("Nazwa użytkownika jest wymagana"),
    email: yup.string().email("Nieprawidłowy adres email").required("Email jest wymagany"),
    password: yup.string().min(6, "Hasło musi mieć co najmniej 6 znaków").required("Hasło jest wymagane"),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Hasła muszą się zgadzać').required('Powtórzenie hasła jest wymagane.'),
})

const RegistrationPage = () => {
    const{
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    })

    const onSubmit = (data) => {
        const {confirmPassword, ...filteredData} = data
        SendJsonToApi(filteredData)
    }

    async function SendJsonToApi(data) {
        console.log("Sending data:", data)

        try{
            const response = await fetch('http://localhost:8000/api/user/register', {
                method:  "PUT",
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
    return (
        <div className="registration-form">
            <h1>Sing Up</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Name</label>
                    <input type="text" {...register("name")} />
                    <p style={{ color: "red"}}>{errors.name?.message}</p>
                </div>

                <div>
                    <label>Email</label>
                    <input type="email" {...register("email")} />
                    <p style={{ color: "red" }}>{errors.email?.message}</p>
                </div>

                <div>
                    <label>Password</label>
                    <input type="password" {...register("password")} />
                    <p style={{ color: "red" }}>{errors.password?.message}</p>
                </div>

                <div>
                    <label>Repet Password</label>
                    <input type="password" {...register("confirmPassword")} />
                    <p style={{ color: "red" }}>{errors.confirmPassword?.message}</p>
                </div>

                <button type="submit">Sing Up</button>
                <Link href='/'>
                    <button> Go Back</button>
                </Link>
            </form>
        </div>
    )
}

export default RegistrationPage
