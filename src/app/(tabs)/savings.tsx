import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GoalTrackerComponent from "@/src/component/goalTrackerComponent";
import TotalSavingsComponent from "@/src/component/totalSavingsComponent";
import SavingsList from "@/src/component/savingsComponent";
import { LinearGradient } from "expo-linear-gradient";
import AddSavingsModal from "@/src/component/addSavingModal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/redux/store';
import { getUserData } from '@/src/Utils/asyncStorageLoginDetails';
import axios from 'axios';
import { setGoal, } from '@/src/redux/slices/goalSlices';
import SuccessModal from "@/src/component/successModal";
import { setGoalTracker } from "@/src/redux/slices/dashboardSlice";



export default function Savings() {
  const [modalVisible, setModalVisible] = useState(false);
  const data = useSelector((state: RootState) => state.goal.goals);
  const dataGoalTracker = useSelector((state: RootState) => state.goal_tracker.goalTracker);
  const dispatch = useDispatch();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const successModalOpen = () => {
    setShowSuccessModal(true);
  };
  const onContinue = () => {
    setShowSuccessModal(false);
  }
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
        const response = await axios.get(`${apiUrl}/trans/api/v1/set/goals`, config);
        const response_goal_tracker = await axios.get(`${apiUrl}/trans/api/v1/dashboard/goal`, config);
        dispatch(setGoal(response.data.goals));
        dispatch(setGoalTracker(response_goal_tracker.data.data));
      } catch (error) {
        console.error('Failed to fetch goals:', error);
      }
    };

    fetchExpenses();
  }, [dispatch]);
  return (
    <LinearGradient
      colors={['#1A73E8', '#4285F4']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}>
      <View className="py-2">
        <View className="items-center">
          <TotalSavingsComponent />
        </View>
        <View className="mx-4">
          <GoalTrackerComponent data={dataGoalTracker} />
        </View>
        <View style={{ padding: 20 }}>
        </View>
      </View>
      <View className="py-4" style={styles.topContainer}>
        <View>
          <View className="mb-0 ml-3 mr-3 flex-row justify-between">
            <Text className="text-black-800 text-lg font-medium">Expenses</Text>
            <TouchableOpacity className="bg-blue-500 rounded-xl px-4 py-2" onPress={() => setModalVisible(true)}>
              <Text className="text-white font-semibold">+ Savings</Text>
            </TouchableOpacity>
          </View>
          <SavingsList data={data} />
        </View>
      </View>
      <AddSavingsModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        successModalOpen={successModalOpen}
      />
      <SuccessModal
        visible={showSuccessModal}
        message="successfully added saving"
        onContinue={onContinue}
      />
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d8d8d8"
  },
  topContainer: {
    flex: 1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: "white"
  }
})