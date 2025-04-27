import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation } from 'expo-router';

const DocumentDetailsScreen = () => {
  const { id, date, budget, category } = useLocalSearchParams();
  const navigation = useNavigation();

  // Animation states for back button and thumbnail
  const backButtonScale = new Animated.Value(1);
  const backButtonOpacity = new Animated.Value(1);
  const thumbnailScale = new Animated.Value(1);
  const thumbnailOpacity = new Animated.Value(1);

  const handlePressIn = (scale, opacity) => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 0.98, friction: 8, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0.9, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handlePressOut = (scale, opacity) => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 8, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        onPressIn={() => handlePressIn(backButtonScale, backButtonOpacity)}
        onPressOut={() => handlePressOut(backButtonScale, backButtonOpacity)}
        accessible
        accessibilityLabel="Go back to slip list"
        accessibilityRole="button"
      >
        <Animated.View
          style={[
            styles.backButtonContent,
            {
              transform: [{ scale: backButtonScale }],
              opacity: backButtonOpacity,
              backgroundColor: backButtonOpacity.interpolate({
                inputRange: [0.9, 1],
                outputRange: ['#EFF6FF', '#FFFFFF'],
              }),
            },
          ]}
        >
          <Ionicons name="arrow-back" size={24} color="#2563EB" />
        </Animated.View>
      </TouchableOpacity>

      {/* Thumbnail Image */}
      <TouchableOpacity
        onPress={() => console.log('Open full-screen image viewer')} // Placeholder for image viewer
        onPressIn={() => handlePressIn(thumbnailScale, thumbnailOpacity)}
        onPressOut={() => handlePressOut(thumbnailScale, thumbnailOpacity)}
        accessible
        accessibilityLabel={`View full slip image for Slip #${id}`}
        accessibilityRole="button"
      >
        <Animated.View
          style={[
            styles.thumbnailContainer,
            {
              transform: [{ scale: thumbnailScale }],
              opacity: thumbnailOpacity,
            },
          ]}
        >
          <Image
            source={{ uri: 'https://via.placeholder.com/300' }}
            style={styles.thumbnail}
            resizeMode="contain"
            // defaultSource={<Ionicons name="document-text-outline" size={48} color="#4B5563" />}
          />
          <View style={styles.thumbnailOverlay} />
        </Animated.View>
      </TouchableOpacity>

      {/* Document Information */}
      <View style={styles.infoSection}>
        <Text style={styles.title}>Slip #{id}</Text>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={18} color="#6B7280" style={styles.infoIcon} />
          <Text style={styles.info}>Date: {date}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="folder-outline" size={18} color="#6B7280" style={styles.infoIcon} />
          <Text style={styles.info}>Budget: {budget}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="pricetag-outline" size={18} color="#6B7280" style={styles.infoIcon} />
          <Text style={styles.info}>Category: {category}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonContent: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  thumbnailContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnail: {
    width: '100%',
    height: 240,
    backgroundColor: '#E5E7EB',
  },
  thumbnailOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'linear-gradient(to top, rgba(0,0,0,0.2), rgba(0,0,0,0))', // Simulated gradient
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    // accessible: true,
    // accessibilityLabel={`Slip details: Slip #${id}, dated ${date}, budget ${budget}, category ${category}`},
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 8,
  },
  info: {
    fontSize: 15,
    color: '#4B5563',
  },
});

export default DocumentDetailsScreen;