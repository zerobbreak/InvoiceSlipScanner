import { View, Text, Animated, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { RecentSlip } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

const RecentSlipCard = ({ item }: { item: RecentSlip }) => {
    const scaleValue = new Animated.Value(1);
    const opacityValue = new Animated.Value(1);

    const onPressIn = () => {
      Animated.parallel([
        Animated.spring(scaleValue, { toValue: 0.98, friction: 8, useNativeDriver: true }),
        Animated.timing(opacityValue, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      ]).start();
    };

    const onPressOut = () => {
      Animated.parallel([
        Animated.spring(scaleValue, { toValue: 1, friction: 8, useNativeDriver: true }),
        Animated.timing(opacityValue, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
    };

    return (
      <Link
        href="/document.$id"
        style={styles.recentCard}
        asChild
        accessible
        accessibilityLabel={`View slip ${item.title}`}
        accessibilityRole="button"
      >
        <TouchableOpacity onPressIn={onPressIn} onPressOut={onPressOut}>
          <Animated.View
            style={[
              styles.recentCardInner,
              {
                transform: [{ scale: scaleValue }],
                opacity: opacityValue,
              },
            ]}
          >
            <Ionicons name="document-text-outline" size={24} color="#2563EB" style={styles.recentIcon} />
            <View style={styles.recentTextContainer}>
              <Text style={styles.recentTitle}>{item.title}</Text>
              <Text style={styles.recentSubtitle}>{item.date}</Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Link>
    );
  };


export default RecentSlipCard;

const styles = StyleSheet.create({
    recentCard: { marginBottom: 12 },
    recentCardInner: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      padding: 12,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    recentIcon: { marginRight: 12 },
    recentTextContainer: { flex: 1 },
    recentTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
    recentSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 2 },
})