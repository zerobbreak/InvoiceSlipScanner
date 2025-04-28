import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import HomeCard from "@/components/HomeCard";
import StatCard from "@/components/StatCard";
import { homeCards, recentSlips, stats } from "@/constants";
import RecentSlipCard from "@/components/RecentSlipCard";

const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={{ uri: "https://via.placeholder.com/40" }}
            style={styles.avatar}
          />
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.username}>John Doe</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.notificationContainer}
          accessible
          accessibilityLabel="View notifications"
          accessibilityRole="button"
        >
          <Ionicons name="notifications-outline" size={28} color="#FFFFFF" />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.statsScroll}
          >
            {stats.map((stat, index) => (
              <View key={index} style={styles.statWrapper}>
                {StatCard(stat)}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Action Cards (Grid Layout) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <View style={styles.gridContainer}>
            {homeCards.map((item, index) =>
              <HomeCard
                key={index}
                href={item.route}
                icon={item.icon}
                title={item.title}
                subtitle={item.description}
                accessibilityLabel={`Go to ${item.title}`}
              />
            )}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <FlatList
            data={recentSlips}
            renderItem={RecentSlipCard}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>

      {/* FAB for Quick Scan */}
      <TouchableOpacity
        style={styles.fab}
        accessible
        accessibilityLabel="Quick scan a slip"
        accessibilityRole="button"
      >
        <Link href="/scan" asChild>
          <Ionicons name="camera" size={32} color="#FFFFFF" />
        </Link>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  headerText: { marginLeft: 12 },
  greeting: { color: "#E0E7FF", fontSize: 14, fontWeight: "500" },
  username: { color: "#FFFFFF", fontSize: 20, fontWeight: "700" },
  notificationContainer: { position: "relative" },
  notificationBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { color: "#FFFFFF", fontSize: 12, fontWeight: "600" },
  contentContainer: { padding: 20 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  statsScroll: { paddingBottom: 8 },
  statWrapper: { marginRight: 12 },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    // justifyContent: "space-between",
    justifyContent: "flex-start",
    gap: 12,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
});

export default HomeScreen;
