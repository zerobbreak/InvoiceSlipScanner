import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Alert,
  StyleSheet,
  Button,
} from "react-native";
import {
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { databases, DATABASE_ID, COLLECTION_ID, client, } from "../appwriteConfig";
import { ID, Query } from "react-native-appwrite";
import { useNavigation } from "expo-router";
import { computeImageHash, processOCR } from "@/utils";

const CameraScreen = () => {
  const navigation = useNavigation();
  const [permission, setHasPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState("");
  const cameraRef = useRef<CameraView>(null);

  // Request camera permissions
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={setHasPermission} title="Grant Permission" />
      </View>
    );
  }

  const captureImage = async () => {
    if (cameraRef.current && !isScanning) {
      try {
        setIsScanning(true);
        setValidationError(null);
        setProcessingStatus("Capturing image...");

        const data = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });

        setProcessingStatus("Checking for duplicates...");
        const imageHash = await computeImageHash(data?.uri || "");
        const existingDoc = await databases.listDocuments(DATABASE_ID, COLLECTION_ID.DOCUMENTS, [
          Query.equal("imageHash", imageHash),
        ]);

        if (existingDoc.documents.length > 0) {
          Alert.alert(
            "Duplicate Scan Detected",
            "This image appears to be a duplicate. Do you want to update or cancel?",
            [
              { text: "Cancel", onPress: () => setIsScanning(false) },
              {
                text: "Update",
                onPress: async () => {
                  if (data?.uri) {
                    await processAndNavigate(data.uri, imageHash, existingDoc.documents[0].$id);
                  } else {
                    throw new Error("Failed to capture image data.");
                  }
                },
              },
            ]
          );
          setIsScanning(false);
          return;
        }

        if (data?.uri) {
          await processAndNavigate(data.uri, imageHash, null);
        } else {
          throw new Error("Failed to capture image data.");
        }
      } catch (error) {
        console.error("Capture failed:", error);
        Alert.alert("Error", "Failed to capture image. Please try again.");
        setIsScanning(false);
        setProcessingStatus("");
      }
    }
  };

  //@ts-ignore
  const processAndNavigate = async (imageUri, imageHash, existingDocId) => {
    try {
      setProcessingStatus("Processing image...");
      const ocrData = await processOCR(imageUri);

      setProcessingStatus(`Receipt validated (${ocrData.confidence}% confidence)`);
      if (!ocrData.isValid) {
        setValidationError(
          `This doesn't appear to be a receipt (${ocrData.confidence}% confidence). Please try again.`
        );
        setIsScanning(false);
        return;
      }

      const documentData = {
        imageUri,
        imageHash,
        ocrData: JSON.stringify(ocrData),
        categoryId: "680e934400337dc334b2",
        budgetId: "680e930e003d3b8e731e",
      };

      let docId: string;
      if (existingDocId) {
        await databases.updateDocument(DATABASE_ID, COLLECTION_ID.DOCUMENTS, existingDocId, documentData);
        docId = existingDocId;
      } else {
        const newDoc = await databases.createDocument(DATABASE_ID, COLLECTION_ID.DOCUMENTS, ID.unique(), documentData);
        docId = newDoc.$id;
      }

      setTimeout(() => {
        setIsScanning(false);
        //@ts-ignore
        navigation.navigate("review", {
          docId,
        });
      }, 1000);
    } catch (error) {
      console.error("OCR processing failed:", error);
      setValidationError("OCR processing failed. Please try again.");
      setIsScanning(false);
    }
  };


  const captureButtonScale = new Animated.Value(1);
  const captureButtonOpacity = new Animated.Value(1);

  const handleCapturePressIn = () => {
    Animated.parallel([
      Animated.spring(captureButtonScale, {
        toValue: 0.95,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(captureButtonOpacity, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCapturePressOut = () => {
    Animated.parallel([
      Animated.spring(captureButtonScale, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(captureButtonOpacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.cameraContainer}>
      <CameraView
        ref={cameraRef}
        style={styles.preview}
        facing="back"
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
            <Text style={styles.progressText}>
              {processingStatus || "Scanning in progress..."}
            </Text>
            <View style={styles.progressIndicator}>
              <ActivityIndicator size="large" color="#2563EB" />
            </View>
          </View>
        )}

        {/* Validation Error */}
        {validationError && (
          <View style={styles.errorContainer}>
            <Ionicons
              name="alert-circle"
              size={20}
              color="#DC2626"
              style={styles.errorIcon}
            />
            <Text style={styles.errorText}>{validationError}</Text>
          </View>
        )}
      </CameraView>
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  cameraContainer: { flex: 1, backgroundColor: "black" },
  preview: { flex: 1, justifyContent: "flex-end", alignItems: "center" },
  alignmentFrame: {
    position: "absolute",
    top: "20%",
    left: "10%",
    right: "10%",
    height: "60%",
    borderWidth: 3,
    borderColor: "#2563EB",
    borderStyle: "dashed",
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  corner: {
    position: "absolute",
    width: 16,
    height: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
  },
  topLeft: { top: -8, left: -8 },
  topRight: { top: -8, right: -8 },
  bottomLeft: { bottom: -8, left: -8 },
  bottomRight: { bottom: -8, right: -8 },
  topControls: {
    position: "absolute",
    top: 40,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  controls: { position: "absolute", bottom: 40, alignSelf: "center" },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
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
    borderColor: "#FFFFFF",
  },
  progressOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  progressIndicator: {
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    padding: 8,
  },
  errorContainer: {
    position: "absolute",
    bottom: 120,
    left: 16,
    right: 16,
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  errorIcon: { marginRight: 8 },
  errorText: { color: "#DC2626", fontSize: 14, flex: 1 },
  selectionContainer: {
    position: "absolute",
    top: 100,
    left: 16,
    right: 16,
    flexDirection: "column",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 8,
  },
  selectionBox: {
    marginBottom: 10,
  },
  selectionLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  selectionButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: 2,
  },
  selectedButton: {
    backgroundColor: "#2563EB",
  },
  selectionText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
});