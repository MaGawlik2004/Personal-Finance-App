import Link from 'next/link'

function Navigation() {
    return (
        <nav>
            <ul className='navigation'>
                <li><Link href="/transaction_list">Transactions List</Link></li>
                <li><Link href='/statistics'>Statistics</Link></li>
            </ul>
        </nav>
    )
}

export default Navigation