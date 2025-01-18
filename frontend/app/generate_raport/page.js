'use client'

import Link from 'next/link'

const RaportPage = () =>{
    return(
        <div>
            <h1>Generate Raport</h1>
            <div>
                <Link href='/statistics'>
                    <button>Cancle</button>
                </Link>
            </div>
        </div>
    )
}

export default RaportPage