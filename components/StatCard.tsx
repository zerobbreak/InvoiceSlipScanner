import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

const StatCard = (item: { label: string; value: string; icon: any }) => (
    <View style={styles.statCard}>
      <Ionicons name={item.icon} size={24} color="#2563EB" style={styles.statIcon} />
      <Text style={styles.statValue}>{item.value}</Text>
      <Text style={styles.statLabel}>{item.label}</Text>
    </View>
  );

export default StatCard;

const styles = StyleSheet.create({
    statCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        width: 140,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      },
      statIcon: { marginBottom: 8 },
      statValue: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 4 },
      statLabel: { fontSize: 13, color: '#6B7280', textAlign: 'center' },
})