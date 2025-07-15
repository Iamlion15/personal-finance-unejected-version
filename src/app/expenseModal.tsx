import { StyleSheet, Text, View } from "react-native";
import Calendar from "@/src/component/calendar";
import AmountBadge from "@/src/component/AmountComponent"
import ExpenseList from "@/src/component/expenseComponent";
import { LinearGradient } from "expo-linear-gradient";
import { RootState } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from "react";
import { setExpense } from "../redux/slices/expensesSlices";
import axios from "axios";
import { getUserData } from "../Utils/asyncStorageLoginDetails";
import { Dayjs } from "dayjs";

export default function Savings() {
  const expenses = useSelector((state: RootState) => state.expense.expenses);
  const [totalAmount, setTotalAmount] = useState(0);
  const [filteredExpenses, setFilteredExpenses] = useState<any[]>(expenses);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const dispatch = useDispatch()

  const handleDateSelection = (date: Dayjs) => {
    console.log("Selected date:", date.format("YYYY-MM-DD"));
    setSelectedDate(date); 
  };

  const onShow = () => {
    if (selectedDate) {
      const selectedDateString = selectedDate.format("YYYY-MM-DD");
      const filtered = expenses.filter((expense: any) => {
        if (!expense.createdAt) return false;
        const expenseDate = expense.createdAt.split("T")[0];
        return expenseDate === selectedDateString;
      });
      const total = filtered.reduce((sum: number, expense: any) => sum + (expense.amount || 0), 0);
      setFilteredExpenses(filtered); 
      setTotalAmount(total); 
    } else {
      setFilteredExpenses(expenses);
      setTotalAmount(expenses.reduce((sum: number, expense: any) => sum + (expense.amount || 0), 0));
    }
  };

  const onReset = () => {
    setFilteredExpenses(expenses);
    setTotalAmount(expenses.reduce((sum: number, expense: any) => sum + (expense.amount || 0), 0));
    setSelectedDate(null); 
  };


  useEffect(() => {
    const fetchExpenses = async () => {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL
      try {
        const token = await getUserData();
        const config = {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        };
        const response = await axios.get(`${apiUrl}/trans/api/v1/transactions/expenses`, config);
        dispatch(setExpense(response.data.expenses));
      } catch (error) {
        console.error('Failed to fetch expenses:', error);
      }
    };

    fetchExpenses();
  }, [dispatch]);

  useEffect(() => {
    setFilteredExpenses(expenses); // Sync with all expenses
    setTotalAmount(expenses.reduce((sum: number, expense: any) => sum + (expense.amount || 0), 0));
  }, [expenses]);

  return (
    <LinearGradient
      className="flex-1"
      colors={['#1A73E8', '#4285F4']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}>
      <View className="py-2">
        <Calendar onDateClick={handleDateSelection} />
        <View style={{ padding: 20 }}>
          <AmountBadge amount={totalAmount} onReset={onReset} onShow={onShow} />
        </View>
      </View>
      <View style={styles.topContainer}>
        <View style={styles.expensesContainer}>
          <View className="mb-2 ml-3 justify-center items-center">
            <Text className="text-black-800 text-lg font-medium">Expenses</Text>
          </View>
          <View style={styles.expenseListContainer}>
            <ExpenseList expenses={filteredExpenses} />
          </View>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:50,
    backgroundColor: "#d8d8d8"
  },
  topContainer: {
    flex: 1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: "white"
  },
  expensesContainer: {
    flex: 1,
    paddingTop: 16
  },
  expenseListContainer: {
    flex: 1
  }
});