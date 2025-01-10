import Link from 'next/link'
export default function HomePage(){
    return(
        <div className='Home-Page'>
            <h1>Welcome</h1>
            <Link href='/login'>
                <button>Login</button>
            </Link>
            <Link href='/registration'>
                <button>Sing Up</button>
            </Link>
        </div>
    )
}