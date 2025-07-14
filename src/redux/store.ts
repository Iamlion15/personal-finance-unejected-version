import { configureStore } from "@reduxjs/toolkit";
import expenseReducer from './slices/expensesSlices'
import goalsReducer from './slices/goalSlices'
import chatReducer from './slices/chatSlice'
import { overViewReducer,monthlyReducer,monthlySalaryReducer,goalTrackerReducer } from "./slices/dashboardSlice";

export const myStore=configureStore({
    reducer:{
        expense:expenseReducer,
        goal:goalsReducer,
        overview:overViewReducer,
        salary:monthlySalaryReducer,
        income_expense:monthlyReducer,
        goal_tracker:goalTrackerReducer,
        chat:chatReducer
    }
})


export type RootState = ReturnType<typeof myStore.getState>;
export type AppDispatch = typeof myStore.dispatch;
