import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface goal {
    _id:string,
    category: string;
    name: string;
    amount: number;
    month: string;
    percentage:number;
    savingsAmount:string
}


interface goalState {
    goals: goal[]
}

const initialState: goalState = {
    goals: []
}

export const goalsSlice = createSlice({
    name: "goalsSlice",
    initialState,
    reducers: {
        setGoal: (state, action: PayloadAction<goal[]>) => {
            state.goals = action.payload;
        },
        addGoal: (state, action: PayloadAction<goal>) => {
            state.goals.push(action.payload)
        },
        removeGoal: (state, action: PayloadAction<string>) => {
            state.goals = state.goals.filter(s => s._id !== action.payload);
        },
        clearGoal: (state) => {
            state.goals = [];
        },
    }
})


export const { setGoal, addGoal, removeGoal, clearGoal } = goalsSlice.actions;
export default goalsSlice.reducer;