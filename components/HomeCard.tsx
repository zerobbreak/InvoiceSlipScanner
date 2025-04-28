import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 2;

interface HomeCardProps {
  key: number
  href: any;
  icon: any;
  title: string;
  subtitle: string;
  accessibilityLabel: string;
}
const HomeCard = ({
  href,
  icon,
  title,
  subtitle,
  accessibilityLabel} : HomeCardProps
) => {
  const scaleValue = new Animated.Value(1);
  const opacityValue = new Animated.Value(1);

  const onPressIn = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 0.98,
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
      href={href}
      style={styles.card}
      asChild
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
    >
      <TouchableOpacity onPressIn={onPressIn} onPressOut={onPressOut}>
        <Animated.View
          style={[
            styles.cardInner,
            {
              transform: [{ scale: scaleValue }],
              opacity: opacityValue,
              backgroundColor: opacityValue.interpolate({
                inputRange: [0.9, 1],
                outputRange: ["#E0E7FF", "#FFFFFF"],
              }),
            },
          ]}
        >
          <Ionicons
            name={icon}
            size={36}
            color="#2563EB"
            style={styles.cardIcon}
          />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardSubtitle}>{subtitle}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );
};

export default HomeCard;

const styles = StyleSheet.create({
  card: { width: CARD_WIDTH, marginBottom: 16 },
  cardInner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIcon: { marginRight: 12 },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#111827" },
  cardSubtitle: { fontSize: 12, color: "#6B7280", marginTop: 4 },
});
