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
                sessionStorage.setItem('email', data.email)
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
        <div className='Login-Page'>
            <h1 className='login_page_welcome'>Login</h1>
            <form onSubmit={handleSubmit(onSubmit)} className='login_page_form'>
                <div className='email_form_login_page'>
                    <label className='email_login'>Email</label>
                    <input className='input_email_login' type="email" {...register("email")} />
                    <p className='p_login' style={{ color: "red" }}>{errors.email?.message}</p>
                </div>

                <div className='password_form_login_page'>
                    <label className='password_login'>Password</label>
                    <input className='input_password_login' type="password" {...register("password")} />
                    <p style={{ color: "red" }}>{errors.password?.message}</p>
                </div>

                <div className='login_form_buttons'>
                    <button type="submit" className='login_button'>Login</button>
                    <Link href='/'>
                        <button className='go_back_button'>Go Back</button>
                    </Link>
                </div>
            </form>
        </div>
    )
}

export default LoginPage