import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

interface PickerItem {
  label: string;
  value: string;
}

const ReviewPicker = (
  label: string,
  selectedValue: string,
  onValueChange: (itemValue: string) => void,
  items: PickerItem[]
) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
        accessible
        accessibilityLabel={`${label} selector`}
        accessibilityHint={`Select a ${label.toLowerCase()} for the slip`}
      >
        {items.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
      <Ionicons
        name="chevron-down"
        size={20}
        color="#4B5563"
        style={styles.pickerIcon}
      />
    </View>
  </View>
);

export default ReviewPicker;

const styles = StyleSheet.create({
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    color: "#4B5563",
    marginBottom: 8,
    fontWeight: "600",
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },
  picker: {
    flex: 1,
    color: "#111827",
  },
  pickerIcon: {
    marginHorizontal: 12,
  },
});
