import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useGlobalSearchParams, useNavigation } from "expo-router";
import { databases, DATABASE_ID, COLLECTION_ID } from "../appwriteConfig";
import type { NavigationProp } from "@react-navigation/native";

interface OcrData {
  vendor?: string;
  date?: string;
  amount?: number | string;
  items?: Array<{ name: string; price: number }>;
  rawText?: string;
  confidence?: number;
  isValid?: boolean;
}

interface DocumentData {
  imageUri: string;
  ocrData: string;
  categoryId: string;
  budgetId: string;
}

interface CategoryData {
  $id: string;
  name: string;
}

interface BudgetData {
  $id: string;
  name: string;
}

type RootStackParamList = {
  Camera: undefined;
  Review: { docId: string };
  index: undefined;
};

const ReviewScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const params = useGlobalSearchParams();
  const docId = params.docId as string | undefined; // Explicitly type docId
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);
  const [parsedOcrData, setParsedOcrData] = useState<OcrData>({});
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [budgets, setBudgets] = useState<BudgetData[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedBudgetId, setSelectedBudgetId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debug docId
  useEffect(() => {
    console.log("Received docId from useGlobalSearchParams:", docId);
    console.log("Raw params:", params);
  }, [docId, params]);

  // Fetch document, categories, and budgets from Appwrite
  useEffect(() => {
    const fetchData = async () => {
      if (!docId || typeof docId !== "string") {
        setError("Invalid document ID. Please try scanning again.");
        setLoading(false);
        Alert.alert("Error", "Invalid document ID. Returning to Camera.", [
          {
            text: "OK",
            // @ts-ignore
            onPress: () => navigation.navigate("camera"),
          },
        ]);
        return;
      }

      try {
        // Fetch the receipt document
        const document = await databases.getDocument(
          DATABASE_ID,
          COLLECTION_ID.DOCUMENTS,
          docId
        );
        setDocumentData({
          imageUri: document.imageUri,
          ocrData: document.ocrData,
          categoryId: document.categoryId,
          budgetId: document.budgetId,
        });
        setSelectedCategoryId(document.categoryId || "");
        setSelectedBudgetId(document.budgetId || "");
        console.log("Fetched document:", document);

        // Parse ocrData
        try {
          const ocrData = JSON.parse(document.ocrData);
          setParsedOcrData(ocrData);
        } catch (parseError) {
          console.error("Failed to parse ocrData:", parseError);
          setError("Invalid receipt data. Please try scanning again.");
          return;
        }

        // Fetch all categories
        try {
          const categoryResponse = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID.CATEGORIES
          );
          setCategories(
            categoryResponse.documents.map((doc) => ({
              $id: doc.$id,
              name: doc.name,
            })) as CategoryData[]
          );
        } catch (categoryError) {
          console.error("Failed to fetch categories:", categoryError);
          setCategories([]);
        }

        // Fetch all budgets
        try {
          const budgetResponse = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID.BUDGETS
          );
          setBudgets(
            budgetResponse.documents.map((doc) => ({
              $id: doc.$id,
              name: doc.name,
            })) as BudgetData[]
          );
        } catch (budgetError) {
          console.error("Failed to fetch budgets:", budgetError);
          setBudgets([]);
        }
      } catch (fetchError) {
        console.error("Failed to fetch document:", fetchError);
        setError("Failed to load receipt data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [docId, navigation]);

  // Handle confirm action
  const handleConfirm = async () => {
    if (!docId || typeof docId !== "string") {
      Alert.alert("Error", "Invalid document ID. Please try scanning again.");
      return;
    }

    if (!documentData) {
      Alert.alert("Error", "No document data available.");
      return;
    }

    if (!selectedCategoryId || !selectedBudgetId) {
      Alert.alert("Error", "Please select a category and budget.");
      return;
    }

    try {
      // Update document with selected categoryId, budgetId, and confirmed status
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID.DOCUMENTS,
        docId,
        {
          categoryId: selectedCategoryId,
          budgetId: selectedBudgetId,
          confirmed: true,
        }
      );
      Alert.alert("Success", "Receipt scan confirmed and saved", [
        {
          text: "OK",
          onPress: () => navigation.navigate("index"),
        },
      ]);
    } catch (error) {
      console.error("Confirm failed:", error);
      Alert.alert("Error", "Failed to confirm receipt. Please try again.", [
        {
          text: "Retry",
          onPress: () => handleConfirm(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]);
    }
  };

  // Retry fetch
  const retryFetch = () => {
    setLoading(true);
    setError(null);
  };

  // Handle loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.reviewContainer}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
          style={styles.loadingIndicator}
        />
        <Text style={styles.loadingText}>Loading receipt data...</Text>
      </SafeAreaView>
    );
  }

  // Handle error state
  if (error || !documentData) {
    return (
      <SafeAreaView style={styles.reviewContainer}>
        <Text style={styles.errorText}>
          {error || "No receipt data available."}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={retryFetch}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.retryButton, styles.backButton]}
          //@ts-ignore
          onPress={() => navigation.navigate("camera")}
        >
          <Text style={styles.retryButtonText}>Back to Camera</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Validate imageUri
  if (!documentData.imageUri || typeof documentData.imageUri !== "string") {
    return (
      <SafeAreaView style={styles.reviewContainer}>
        <Text style={styles.errorText}>
          No image provided. Please try scanning again.
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          // @ts-ignore
          onPress={() => navigation.navigate("camera")}
        >
          <Text style={styles.retryButtonText}>Back to Camera</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

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
      <ScrollView style={styles.reviewContent}>
        <Image
          source={{ uri: documentData.imageUri }}
          style={styles.reviewImage}
        />
        <Text style={styles.reviewSectionTitle}>Extracted Data</Text>
        <Text style={styles.reviewText}>
          Vendor: {parsedOcrData.vendor || "N/A"}
        </Text>
        <Text style={styles.reviewText}>
          Date: {parsedOcrData.date || "N/A"}
        </Text>
        <Text style={styles.reviewText}>
          Total: $
          {parsedOcrData.amount
            ? Number(parsedOcrData.amount).toFixed(2)
            : "N/A"}
        </Text>
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Category:</Text>
          <Picker
            selectedValue={selectedCategoryId}
            onValueChange={(value) => setSelectedCategoryId(value)}
            style={styles.picker}
            enabled={categories.length > 0}
          >
            {categories.length > 0 ? (
              categories.map((category) => (
                <Picker.Item
                  key={category.$id}
                  label={category.name}
                  value={category.$id}
                />
              ))
            ) : (
              <Picker.Item label="No categories available" value="" />
            )}
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Budget:</Text>
          <Picker
            selectedValue={selectedBudgetId}
            onValueChange={(value) => setSelectedBudgetId(value)}
            style={styles.picker}
            enabled={budgets.length > 0}
          >
            {budgets.length > 0 ? (
              budgets.map((budget) => (
                <Picker.Item
                  key={budget.$id}
                  label={budget.name}
                  value={budget.$id}
                />
              ))
            ) : (
              <Picker.Item label="No budgets available" value="" />
            )}
          </Picker>
        </View>
        <Text style={styles.reviewSectionTitle}>Items</Text>
        {parsedOcrData.items &&
        Array.isArray(parsedOcrData.items) &&
        parsedOcrData.items.length > 0 ? (
          parsedOcrData.items.map((item, index) => (
            <View key={index} style={styles.reviewItem}>
              <Text style={styles.reviewItemText}>
                {item.name || "Unknown Item"}: $
                {item.price ? item.price.toFixed(2) : "N/A"}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.reviewText}>No items detected</Text>
        )}
        <Text style={styles.reviewSectionTitle}>Raw Text</Text>
        <Text style={styles.reviewText}>{parsedOcrData.rawText || "N/A"}</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleConfirm}
          accessible
          accessibilityLabel="Confirm scan"
          accessibilityRole="button"
        >
          <Text style={styles.saveButtonText}>Confirm</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReviewScreen;

const styles = StyleSheet.create({
  reviewContainer: { flex: 1, backgroundColor: "#F9FAFB" },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 8,
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginLeft: 16,
  },
  reviewContent: { flex: 1, padding: 20 },
  reviewImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  reviewSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 16,
    color: "#4B5563",
    marginBottom: 8,
  },
  reviewItem: {
    padding: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 8,
  },
  reviewItemText: {
    fontSize: 16,
    color: "#111827",
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    color: "#4B5563",
    marginBottom: 4,
  },
  picker: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  saveButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 20,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  loadingText: {
    fontSize: 16,
    color: "#4B5563",
    textAlign: "center",
    marginTop: 10,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#DC2626",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  retryButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
