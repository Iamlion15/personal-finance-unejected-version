import { createSlice, PayloadAction } from '@reduxjs/toolkit'

//overview

export interface overview {
  _id: string;
  icon: string;
  name: string;
  category: string
  date: string;
}


interface overviewState {
  overviews: overview[]
}

const initialState: overviewState = {
  overviews: []
}

export const overviewSlice = createSlice({
  name: "overviewSlice",
  initialState,
  reducers: {
    setOverview: (state, action: PayloadAction<overview[]>) => {
      state.overviews = action.payload;
    },
    clearGoal: (state) => {
      state.overviews = [];
    },
  }
})

//monthly statistics
export interface MonthlyStat {
  month: string;
  income: number;
  expense: number;
}

interface MonthlyState {
  monthlyData: MonthlyStat[];
}

const initialMonthlyState: MonthlyState = {
  monthlyData: [],
};

export const monthlySlice = createSlice({
  name: 'monthlySlice',
  initialState: initialMonthlyState,
  reducers: {
    setMonthlyData: (state, action: PayloadAction<MonthlyStat[]>) => {
      state.monthlyData = action.payload;
    },
    clearMonthlyData: (state) => {
      state.monthlyData = [];
    },
  },
});

//monthly salary 

export interface MonthlySalary {
  month: string;
  salary: number;
}

interface MonthlySalaryState {
  salaries: MonthlySalary[];
}

const initialSalaryState: MonthlySalaryState = {
  salaries: [],
};

export const monthlySalarySlice = createSlice({
  name: 'monthlySalarySlice',
  initialState: initialSalaryState,
  reducers: {
    setMonthlySalary: (state, action: PayloadAction<MonthlySalary[]>) => {
      state.salaries = action.payload;
    },
    clearMonthlySalary: (state) => {
      state.salaries = [];
    },
  },
});


//Goal Tracker salary 

export interface GoalTracker {
  month: number,
  percentage: number,
  target: number,
  saved: number
}

interface MonthlyGoalTrackerState {
  goalTracker: GoalTracker[];
}

const initialGoalTrackerState: MonthlyGoalTrackerState = {
  goalTracker: [],
};

export const GoalTrackerSlice = createSlice({
  name: 'GoalTrackerSlice',
  initialState: initialGoalTrackerState,
  reducers: {
    setGoalTracker: (state, action: PayloadAction<GoalTracker[]>) => {
      state.goalTracker = action.payload;
    },
    clearMonthlyGoalTrackerState: (state) => {
      state.goalTracker = [];
    },
  },
});


//overview exports
export const { setOverview, clearGoal } = overviewSlice.actions;
const overViewReducer = overviewSlice.reducer;
export { overViewReducer }

//monhtly statistics exports
export const { setMonthlyData, clearMonthlyData } = monthlySlice.actions;
const monthlyReducer = monthlySlice.reducer;
export { monthlyReducer };

//monthly salary exports


export const { setMonthlySalary, clearMonthlySalary } = monthlySalarySlice.actions;
const monthlySalaryReducer = monthlySalarySlice.reducer;
export { monthlySalaryReducer };


//monthly Goal tracker exports


export const { setGoalTracker,clearMonthlyGoalTrackerState } = GoalTrackerSlice.actions;
const goalTrackerReducer = GoalTrackerSlice.reducer;
export { goalTrackerReducer };
