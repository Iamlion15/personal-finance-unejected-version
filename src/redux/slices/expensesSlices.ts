import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface expense {
    _id: string,
    item: string,
    createdAt: string,
    amount: number,
    category: string,
    source:string
}

interface expensesState {
    expenses: expense[]
}

const initialState: expensesState = {
    expenses: []
}

export const savingsSlice = createSlice({
    name: "savingsSlice",
    initialState,
    reducers: {
        setExpense: (state, action: PayloadAction<expense[]>) => {
            state.expenses = action.payload;
        },
        addExpense: (state, action: PayloadAction<expense>) => {
            state.expenses.push(action.payload)
        },
        removeExpense: (state, action: PayloadAction<string>) => {
            state.expenses = state.expenses.filter(s => s._id !== action.payload);
        },
        clearExpense: (state) => {
            state.expenses = [];
        },
    }
})


export const { setExpense, addExpense, removeExpense, clearExpense } = savingsSlice.actions;
export default savingsSlice.reducer;