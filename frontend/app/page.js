import Link from 'next/link'
export default function HomePage(){
    return(
        <div className='Home-Page'>
            <h1 className='home_page_welcome'>Welcome</h1>
            <Link href='/login' className='home_page_link'>
                <button className='home_page_login_button'>Login</button>
            </Link>
            <Link href='/registration' className='home_page_link'>
                <button className='home_page_registration_button'>Sing Up</button>
            </Link>
        </div>
    )
}