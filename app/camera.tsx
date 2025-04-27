import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Animated, Alert, StyleSheet } from 'react-native';
import { RNCamera, TakePictureOptions } from 'react-native-camera';
import { Ionicons } from '@expo/vector-icons';
// import { processOCR, validateReceipt, computeImageHash } from './ocrUtils';
// import { databases, DATABASE_ID, COLLECTION_ID } from './appwriteConfig';
import { ID, Query } from 'appwrite';

const CameraScreen = ({ navigation }) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [flashOn, setFlashOn] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const cameraRef = useRef<RNCamera>(null);

  const captureImage = async () => {
    if (cameraRef.current && !isScanning) {
      try {
        setIsScanning(true);
        setValidationError(null);
        setProcessingStatus('Capturing image...');

        const options: TakePictureOptions = { quality: 0.8, base64: true };
        const data = await cameraRef.current.takePictureAsync(options);

        // Check for duplicate scan
        setProcessingStatus('Checking for duplicates...');
        const imageHash = await computeImageHash(data.uri);
        const existingDoc = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
          Query.equal('imageHash', imageHash),
        ]);

        if (existingDoc.documents.length > 0) {
          Alert.alert(
            'Duplicate Scan Detected',
            'This image appears to be a duplicate. Do you want to update or cancel?',
            [
              { text: 'Cancel', onPress: () => setIsScanning(false) },
              {
                text: 'Update',
                onPress: async () => {
                  await processAndNavigate(data.uri, imageHash, existingDoc.documents[0].$id);
                },
              },
            ]
          );
          setIsScanning(false);
          return;
        }

        await processAndNavigate(data.uri, imageHash);
      } catch (error) {
        console.error('Capture failed:', error);
        Alert.alert('Error', 'Failed to capture image. Please try again.');
        setIsScanning(false);
        setProcessingStatus('');
      }
    }
  };

  const processAndNavigate = async (imageUri: string, imageHash: string, existingDocId?: string) => {
    try {
      setProcessingStatus('Processing image...');
      const ocrData = await processOCR(imageUri);

      setProcessingStatus(`Receipt validated (${ocrData.confidence}% confidence)`);
      if (!ocrData.isValid) {
        setValidationError(`This doesn't appear to be a receipt (${ocrData.confidence}% confidence). Please try again.`);
        setIsScanning(false);
        return;
      }

      // Store or update in Appwrite
      if (existingDocId) {
        await databases.updateDocument(DATABASE_ID, COLLECTION_ID, existingDocId, {
          imageUri,
          imageHash,
          ocrData: JSON.stringify(ocrData),
          updatedAt: new Date().toISOString(),
        });
      } else {
        await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
          imageUri,
          imageHash,
          ocrData: JSON.stringify(ocrData),
          createdAt: new Date().toISOString(),
        });
      }

      setTimeout(() => {
        setIsScanning(false);
        navigation.navigate('Review', { imageUri, ocrData });
      }, 1000);
    } catch (error) {
      console.error('OCR processing failed:', error);
      setValidationError('OCR processing failed. Please try again.');
      setIsScanning(false);
    }
  };

  const toggleFlash = () => {
    setFlashOn((prev) => !prev);
  };

  const captureButtonScale = new Animated.Value(1);
  const captureButtonOpacity = new Animated.Value(1);

  const handleCapturePressIn = () => {
    Animated.parallel([
      Animated.spring(captureButtonScale, { toValue: 0.95, friction: 8, useNativeDriver: true }),
      Animated.timing(captureButtonOpacity, { toValue: 0.9, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleCapturePressOut = () => {
    Animated.parallel([
      Animated.spring(captureButtonScale, { toValue: 1, friction: 8, useNativeDriver: true }),
      Animated.timing(captureButtonOpacity, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={styles.cameraContainer}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={
          flashOn
            ? RNCamera.Constants.FlashMode.torch
            : RNCamera.Constants.FlashMode.off
        }
        captureAudio={false}
      >
        {/* Alignment Frame */}
        <View style={styles.alignmentFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>

        {/* Top Controls */}
        <View style={styles.topControls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => navigation.goBack()}
            accessible
            accessibilityLabel="Cancel scanning"
            accessibilityRole="button"
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={toggleFlash}
            accessible
            accessibilityLabel={flashOn ? 'Turn off flash' : 'Turn on flash'}
            accessibilityRole="button"
          >
            <Ionicons
              name={flashOn ? 'flash' : 'flash-off'}
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* Capture Button */}
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={captureImage}
            onPressIn={handleCapturePressIn}
            onPressOut={handleCapturePressOut}
            disabled={isScanning}
            accessible
            accessibilityLabel="Capture receipt image"
            accessibilityRole="button"
          >
            <Animated.View
              style={[
                styles.captureButton,
                {
                  transform: [{ scale: captureButtonScale }],
                  opacity: captureButtonOpacity,
                },
              ]}
            >
              <View style={styles.innerCircle} />
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Scanning Progress Overlay */}
        {isScanning && (
          <View style={styles.progressOverlay}>
            <Text style={styles.progressText}>{processingStatus || 'Scanning in progress...'}</Text>
            <View style={styles.progressIndicator}>
              <ActivityIndicator size="large" color="#2563EB" />
            </View>
          </View>
        )}

        {/* Validation Error */}
        {validationError && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#DC2626" style={styles.errorIcon} />
            <Text style={styles.errorText}>{validationError}</Text>
          </View>
        )}
      </RNCamera>
    </View>
  );
};


export default CameraScreen;

const styles = StyleSheet.create({
    cameraContainer: { flex: 1, backgroundColor: 'black' },
  preview: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  alignmentFrame: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    right: '10%',
    height: '60%',
    borderWidth: 3,
    borderColor: '#2563EB',
    borderStyle: 'dashed',
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  corner: {
    position: 'absolute',
    width: 16,
    height: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  topLeft: { top: -8, left: -8 },
  topRight: { top: -8, right: -8 },
  bottomLeft: { bottom: -8, left: -8 },
  bottomRight: { bottom: -8, right: -8 },
  topControls: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: { position: 'absolute', bottom: 40, alignSelf: 'center' },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  progressOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: { color: '#FFFFFF', fontSize: 20, fontWeight: '600', marginBottom: 16 },
  progressIndicator: {
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    padding: 8,
  },
  errorContainer: {
    position: 'absolute',
    bottom: 120,
    left: 16,
    right: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorIcon: { marginRight: 8 },
  errorText: { color: '#DC2626', fontSize: 14, flex: 1 },
})