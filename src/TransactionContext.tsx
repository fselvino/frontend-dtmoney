import {createContext, useEffect, useState, ReactNode} from 'react'
import { api } from './sevices/api'


interface Transaction{
    id:number
    title:string
    amount:number
    type: string
    category:string
    createdAt:string
}


type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>

interface TransactionsProviderProps {
    children :ReactNode
}

interface TransactionsContextData {
    transactions: Transaction[]
    createTransaction: (transaction: TransactionInput) => Promise<void>
}

export const TransactionContext = createContext<TransactionsContextData>(
    {} as TransactionsContextData) //força uma tipagem no typescript

export function TransactionsProvider({children}: TransactionsProviderProps){

    const[transactions, setTransactions] = useState<Transaction[]>([])

        useEffect(()=> {
         api.get('transactions')    
         .then(response => setTransactions(response.data.transactions))
        }, [])

        //crea nova transaciton
        async function createTransaction(transactionInput: TransactionInput){   
            const response = await api.post('/transactions', {
                ...transactionInput,
                createdAt: new Date()
            })
            const { transaction} = response.data

            setTransactions([
                ...transactions, transaction
            ])
        }


         return(
            <TransactionContext.Provider value={{transactions, createTransaction}}>
                 {children}
            </TransactionContext.Provider>
        )

}