import React from 'react';
import { Platform, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

type CustomDatePickerProps = {
  value: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  open: boolean;
};

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onConfirm,
  onCancel,
  open,
}) => {
  const handleChange = (_: any, selectedDate?: Date) => {
    if (Platform.OS !== 'ios') {
      selectedDate ? onConfirm(selectedDate) : onCancel();
    }
  };

  if (!open) return null;

  return (
    <View>
      <DateTimePicker
        value={value}
        mode="date"
        display="default"
        onChange={handleChange}
      />
    </View>
  );
};

export default CustomDatePicker;
