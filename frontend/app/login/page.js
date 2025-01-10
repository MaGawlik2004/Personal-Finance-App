'use client'
import Link from 'next/link'
import React from "react"
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import* as yup from "yup"
const schema = yup.object().shape({
    email: yup.string().email("Nieprawidłowy adres email").required("Email jest wymagany"),
    password: yup.string().required("Hasło jest wymagane")
})
const LoginPage = () => {
    const{
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    })

    const router = useRouter(); 

    const onSubmit = (data) => {
        SendJsonToApi(data)
    }
    async function SendJsonToApi(data) {
        console.log("Sending data:", data)

        try{
            const response = await fetch('http://localhost:8000/api/user/login', {
                method: "POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            })

            if (!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const result = await response.json()
            console.log(result)
            if (result.message === 'Login successful'){
                router.push('/transaction_list')
            } else {
                console.log(result)
                console.log("Błąd rejestracji:", result.message)
            }

        } catch (error) {
            console.error('Error sending data to API:', error)
        }
        
    }
    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
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

                <button type="submit">Login</button>
                <Link href='/'>
                    <button>Go Back</button>
                </Link>
            </form>
        </div>
    )
}

export default LoginPage