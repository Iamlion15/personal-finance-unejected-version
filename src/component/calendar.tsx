import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"; 
import dayjs, { Dayjs } from "dayjs";

const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

interface CalendarProps {
  onDateClick?: (date: Dayjs) => void;
}

const Calendar = ({ onDateClick }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  const startOfMonth = currentDate.startOf("month");
  const endOfMonth = currentDate.endOf("month");
  const startDay = startOfMonth.day() === 0 ? 6 : startOfMonth.day() - 1;
  const totalDays = endOfMonth.date();

  const days: (Dayjs | null)[] = [];

  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= totalDays; i++) {
    days.push(dayjs(currentDate).date(i));
  }

  const handlePrev = () => {
    setCurrentDate(currentDate.subtract(1, "month"));
  };

  const handleNext = () => {
    setCurrentDate(currentDate.add(1, "month"));
  };

  const handleDateClick = (day: Dayjs | null) => {
    if (day) {
      setSelectedDate(day);
      if (onDateClick) {
        onDateClick(day);
      }
    }
  };

  return (
    <View
      className="p-4 bg-white rounded-xl w-full max-w-sm mx-auto"
      style={styles.container} // Added style prop for shadow
    >
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity onPress={handlePrev}>
          <Text className="text-lg font-bold">{'<'}</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold">
          {currentDate.format("MMMM - YYYY")}
        </Text>
        <TouchableOpacity onPress={handleNext}>
          <Text className="text-lg font-bold">{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* Weekdays */}
      <View className="flex-row justify-between mb-2">
        {weekDays.map((day) => (
          <Text key={day} className="text-center flex-1 text-xs text-gray-500">
            {day}
          </Text>
        ))}
      </View>

      {/* Dates */}
      <View className="flex-row flex-wrap">
        {days.map((day, index) => {
          const isSelected = day?.isSame(selectedDate, "day");
          return (
            <TouchableOpacity
              key={index}
              className="w-8 h-7 aspect-square items-center justify-center"
              onPress={() => handleDateClick(day)}
              disabled={!day}
            >
              <View
                className={`w-8 h-7 items-center justify-center rounded-full ${
                  isSelected ? "bg-blue-600" : ""
                }`}
              >
                <Text className={`text-sm ${isSelected ? "text-white" : "text-gray-800"}`}>
                  {day ? day.date() : ""}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowOffset: { width: 0, height: 2 }, // Define shadow properties
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
});

export default Calendar;