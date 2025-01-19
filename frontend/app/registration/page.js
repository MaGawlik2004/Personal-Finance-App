'use client'
import Link from 'next/link'
import React from "react"
import { useEffect } from 'react';
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import io from 'socket.io-client';

const schema = yup.object().shape({
    name: yup.string().required("Nazwa użytkownika jest wymagana"),
    email: yup.string().email("Nieprawidłowy adres email").required("Email jest wymagany"),
    password: yup.string().min(6, "Hasło musi mieć co najmniej 6 znaków").required("Hasło jest wymagane"),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Hasła muszą się zgadzać').required('Powtórzenie hasła jest wymagane.'),
})

const socket = io('http://localhost:8000');

const RegistrationPage = () => {
    const router = useRouter()

    const{
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    })

    useEffect(() => {
        console.log('Sprawdzanie połączenia z WebSocket...');
    
        socket.on('connect', () => {
            console.log('Połączono z WebSocket!');
        });

        socket.on('test_event', (data) => {
            console.log('Otrzymano testowe zdarzenie:', data);
        });
        
        
        socket.on('registration_status', (data) => {
            console.log('Otrzymano dane:', data);
            if (data.status === 'success') {
              alert(data.message);
              router.push('/login');
            } else {
              alert(data.message);
            }
        });
    }, [])

    const onSubmit = (data) => {
        const {confirmPassword, ...filteredData} = data
        SendJsonToApi(filteredData)
        router.push('/login')
        
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
        <div className="Register-Page">
            <h1 className='rgister_page_welcome'>Sing Up</h1>
            <form onSubmit={handleSubmit(onSubmit)} className='register_page_form'>
                <div className='name_form_register_page'>
                    <label className='name_register'>Name</label>
                    <input className='input_name_register' type="text" {...register("name")} />
                    <p style={{ color: "red"}}>{errors.name?.message}</p>
                </div>

                <div className='email_form_register_page'>
                    <label className='email_register'>Email</label>
                    <input className='input_email_register' type="email" {...register("email")} />
                    <p style={{ color: "red" }}>{errors.email?.message}</p>
                </div>

                <div className='password_form_register_page'>
                    <label className='password_register'>Password</label>
                    <input className='input_password_register' type="password" {...register("password")} />
                    <p style={{ color: "red" }}>{errors.password?.message}</p>
                </div>

                <div className='repet_password_form_register_page'>
                    <label className='repet_password_register'>Repet Password</label>
                    <input className='input_repet_password_register' type="password" {...register("confirmPassword")} />
                    <p style={{ color: "red" }}>{errors.confirmPassword?.message}</p>
                </div>

                <div className='register_form_buttons'>
                        <button type="submit" className='register_button'>Sing Up</button>
                    <Link href='/'>
                        <button className='go_back_button'> Go Back</button>
                    </Link>
                </div>
            </form>
        </div>
    )
}

export default RegistrationPage
