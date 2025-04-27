import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';

const ReviewScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { imageUri, ocrData } = useLocalSearchParams();

  const handleConfirm = () => {
    Alert.alert('Success', 'Receipt scan confirmed and saved');
    navigation.navigate('Scan');
  };

  return (
    <SafeAreaView style={styles.reviewContainer}>
      <View style={styles.reviewHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessible
          accessibilityLabel="Go back to camera"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color="#2563EB" />
        </TouchableOpacity>
        <Text style={styles.reviewTitle}>Review Scanned Receipt</Text>
      </View>
      <View style={styles.reviewContent}>
        {/* <Image source={{ uri: imageUri }} style={styles.reviewImage} /> */}
        <Text style={styles.reviewSectionTitle}>Extracted Data</Text>
        <Text style={styles.reviewText}>Vendor: {ocrData.vendor || 'N/A'}</Text>
        <Text style={styles.reviewText}>Date: {ocrData.date || 'N/A'}</Text>
        <Text style={styles.reviewText}>Total: ${ocrData.amount || 'N/A'}</Text>
        <Text style={styles.reviewSectionTitle}>Items</Text>
        {ocrData.items.map((item: any, index: number) => (
          <View key={index} style={styles.reviewItem}>
            <Text style={styles.reviewItemText}>{item.name}: ${item.price.toFixed(2)}</Text>
          </View>
        ))}
        <Text style={styles.reviewSectionTitle}>Raw Text</Text>
        <Text style={styles.reviewText}>{ocrData.rawText || 'N/A'}</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleConfirm}
          accessible
          accessibilityLabel="Confirm scan"
          accessibilityRole="button"
        >
          <Text style={styles.saveButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ReviewScreen;

const styles = StyleSheet.create({
  reviewContainer: { flex: 1, backgroundColor: '#F9FAFB' },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: { padding: 8 },
  reviewTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginLeft: 16 },
  reviewContent: { flex: 1, padding: 20 },
  reviewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  reviewSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 8,
  },
  reviewItem: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
  },
  reviewItemText: {
    fontSize: 16,
    color: '#111827',
  },
  saveButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
})