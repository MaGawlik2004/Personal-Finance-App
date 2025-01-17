import Link from 'next/link'
import { useRouter } from 'next/navigation';

function Navigation() {
    const router = useRouter();

    const handleLogout = () => {
        sessionStorage.removeItem('email');
        router.push('/login');
    }

    return (
        <nav>
            <ul className='navigation'>
                <li><Link href="/transaction_list">Transactions List</Link></li>
                <li><Link href='/add_transaction'>Add Transaction</Link></li>
                <li><Link href='/statistics'>Statistics</Link></li>
                <li>
                    <button className='home_page_sing_out_button' onClick={handleLogout}>Sing Out</button>
                </li>
            </ul>
        </nav>
    )
}

export default Navigation