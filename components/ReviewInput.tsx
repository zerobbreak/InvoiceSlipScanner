import { View, Text, Animated, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';

interface Errors {
    vendor: boolean;
    amount: boolean;
    date: boolean;
    item: boolean;
    description: boolean;
  }

  interface ReviewInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    field: keyof Errors;
    icon: any;
  }

const ReviewInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    field: keyof Errors,
    icon: any
  ) => {

    const [errors, setErrors] = useState<Errors>({
        vendor: false,
        amount: false,
        date: false,
        item: false,
        description: false,
      });

    
  const validateField = (field: keyof Errors, value: string) => {
    setErrors(prev => ({ ...prev, [field]: value.trim() === '' }));
  };
    const inputScale = new Animated.Value(1);
    const handleFocus = () => {
      Animated.spring(inputScale, { toValue: 1.02, friction: 8, useNativeDriver: true }).start();
    };
    const handleBlur = () => {
      Animated.spring(inputScale, { toValue: 1, friction: 8, useNativeDriver: true }).start();
    };

    return (
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>{label}</Text>
        <Animated.View style={[styles.inputContainer, errors[field] && styles.inputError, { transform: [{ scale: inputScale }] }]}>
          <Ionicons name={icon} size={20} color="#4B5563" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={(text: string) => {
              onChangeText(text);
              validateField(field, text);
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            accessible
            accessibilityLabel={`${label} input`}
            accessibilityHint={`Enter ${label.toLowerCase()} for the slip`}
          />
        </Animated.View>
      </View>
    );
  };

export default ReviewInput;

const styles = StyleSheet.create({
    inputWrapper: {
        marginBottom: 16,
      },
      label: {
        fontSize: 15,
        color: "#4B5563",
        marginBottom: 8,
        fontWeight: "600",
      },
      inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
      },
      inputIcon: {
        marginHorizontal: 12,
      },
      input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: "#111827",
      },
      inputError: {
        borderColor: "#EF4444",
      },
})