import Link from 'next/link'

function Navigation() {
    return (
        <nav>
            <ul className='navigation'>
                <li><Link href="/transaction_list">Transactions List</Link></li>
                <li><Link href='/add_transaction'>Add Transaction</Link></li>
                <li><Link href='/statistics'>Statistics</Link></li>
                <li>
                    <Link href='/'>
                        <button className='home_page_sing_out_button'>Sing Out</button>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navigation