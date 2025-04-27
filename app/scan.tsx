import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ScanScreen: React.FC = () => {
  const navigation = useNavigation ();
  const buttonScale = new Animated.Value(1);
  const buttonOpacity = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(buttonScale, { toValue: 0.98, friction: 8, useNativeDriver: true }),
      Animated.timing(buttonOpacity, { toValue: 0.9, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(buttonScale, { toValue: 1, friction: 8, useNativeDriver: true }),
      Animated.timing(buttonOpacity, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  return (
    <SafeAreaView style={styles.entryContainer}>
      <View style={styles.entryHeader}>
        <Text style={styles.entryTitle}>Scan Invoice/Slip</Text>
      </View>
      <View style={styles.entryContent}>
        <Ionicons name="camera-outline" size={80} color="#2563EB" style={styles.entryIcon} />
        <Text style={styles.entryInstruction}>Position the receipt within the frame</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('camera')}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          accessible
          accessibilityLabel="Start scanning"
          accessibilityRole="button"
        >
          <Animated.View
            style={[
              styles.openCameraButton,
              {
                transform: [{ scale: buttonScale }],
                opacity: buttonOpacity,
              },
            ]}
          >
            <Ionicons name="camera" size={24} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.openCameraText}>Start Scan</Text>
          </Animated.View>
        </TouchableOpacity>
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Tips for Best Results:</Text>
          <Text style={styles.tipsText}>• Ensure receipt is flat and well-lit</Text>
          <Text style={styles.tipsText}>• Hold camera steady</Text>
          <Text style={styles.tipsText}>• Make sure text is clearly visible</Text>
          <Text style={styles.tipsText}>• Avoid shadows and glare</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ScanScreen;

const styles = StyleSheet.create({
  entryContainer: { flex: 1, backgroundColor: '#F9FAFB' },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  entryTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginLeft: 16 },
  entryContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  entryIcon: { marginBottom: 24 },
  entryInstruction: { fontSize: 16, color: '#4B5563', textAlign: 'center', marginBottom: 32 },
  openCameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: '100%',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonIcon: { marginRight: 8 },
  openCameraText: { fontSize: 18, fontWeight: '600', color: '#FFFFFF' },
  tipsContainer: { marginTop: 32, alignItems: 'center' },
  tipsTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 },
  tipsText: { fontSize: 14, color: '#4B5563', textAlign: 'center' },
})