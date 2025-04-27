import { View, Text, Animated, Pressable, StyleSheet } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface itemProps {
  id: number;
  title: string;
  date: string;
  budget: string;
  category: string;
}

const DocumentCard = ({ item }: { item: itemProps }) => {
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
    <Link
      href={{
        pathname: "/document.$id",
        params: {
          id: item.id,
          date: item.date,
          budget: item.budget,
          category: item.category,
        },
      }}
      asChild
    >
      <Pressable
        style={styles.documentCard}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessible
        accessibilityLabel={`View slip ${item.title}, dated ${item.date}, budget ${item.budget}, category ${item.category}`}
        accessibilityRole="button"
      >
        <Animated.View
          style={[
            styles.cardContent,
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
          <View style={styles.thumbnail}>
            <Ionicons name="document-text-outline" size={36} color="#4B5563" />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.documentTitle}>{item.title}</Text>
            <View style={styles.infoRow}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color="#6B7280"
                style={styles.infoIcon}
              />
              <Text style={styles.documentInfo}>{item.date}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons
                name="folder-outline"
                size={16}
                color="#6B7280"
                style={styles.infoIcon}
              />
              <Text style={styles.documentInfo}>{item.budget}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons
                name="pricetag-outline"
                size={16}
                color="#6B7280"
                style={styles.infoIcon}
              />
              <Text style={styles.documentInfo}>{item.category}</Text>
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Link>
  );
};
export default DocumentCard;

const styles = StyleSheet.create({
  documentCard: {
    marginHorizontal: 16,
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: "#FFFFFF", // Overridden by animation for press effect
  },
  thumbnail: {
    width: 72,
    height: 72,
    backgroundColor: "linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 100%)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardText: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  infoIcon: {
    marginRight: 6,
  },
  documentInfo: {
    fontSize: 13,
    color: "#6B7280",
  },
});
