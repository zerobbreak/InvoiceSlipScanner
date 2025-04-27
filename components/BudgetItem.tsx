import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

interface BudgetItemProps {
  item: {
    name: string;
  };
}

const BudgetItem = ({ item }: BudgetItemProps) => {
  const scaleValue = new Animated.Value(1);
  const opacityValue = new Animated.Value(1);

  const onPressIn = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 0.95,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const onPressOut = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <TouchableOpacity
      onPress={() => console.log(`Selected budget: ${item.name}`)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessible
      accessibilityLabel={`Select budget ${item.name}`}
      accessibilityRole="button"
    >
      <Animated.View
        style={[
          styles.budgetItem,
          {
            transform: [{ scale: scaleValue }],
            opacity: opacityValue,
            backgroundColor: opacityValue.interpolate({
              inputRange: [0.9, 1],
              outputRange: ["#EFF6FF", "#FFFFFF"],
            }),
          },
        ]}
      >
        <View style={styles.budgetIcon}>
          <Ionicons name="wallet-outline" size={24} color="#2563EB" />
        </View>
        <View style={styles.budgetText}>
          <Text style={styles.budgetTitle}>{item.name}</Text>
          <Text style={styles.budgetSubtitle}>Linked to Google Sheet</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default BudgetItem;

const styles = StyleSheet.create({
  budgetItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  budgetIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  budgetText: {
    flex: 1,
  },
  budgetTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  budgetSubtitle: {
    fontSize: 13,
    color: "#6B7280",
  },
});
