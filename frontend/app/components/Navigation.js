import Link from 'next/link'

function Navigation() {
    return (
        <nav>
            <ul className='navigation'>
                <li><Link href="/">Transactions List</Link></li>
                <li><Link href='/'>Statistics</Link></li>
            </ul>
        </nav>
    )
}

export default Navigation