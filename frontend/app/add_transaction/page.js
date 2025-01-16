'use client'

import React from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from 'yup'

const noteSchema = Yup.object().shape({
    
})
const AddTransactionPage = () => {
    return(
        <div>
            <h1>Add Transaction</h1>
        </div>
    )
}

export default AddTransactionPage