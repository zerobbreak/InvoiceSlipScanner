import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  TextInput,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BudgetItem from '@/components/BudgetItem';

const BudgetsScreen = () => {
  const [budgets, setBudgets] = useState([
    { id: '1', name: 'SmartHydro' },
    { id: '2', name: 'MovewithMe' },
    { id: '3', name: 'SATNAC Conference' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newBudgetName, setNewBudgetName] = useState('');
  const [inputError, setInputError] = useState(false);

  const handleAddBudget = () => {
    if (newBudgetName.trim() === '') {
      setInputError(true);
      return;
    }
    const newBudget = {
      id: (budgets.length + 1).toString(),
      name: newBudgetName,
    };
    setBudgets([...budgets, newBudget]);
    setNewBudgetName('');
    setInputError(false);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Budget List */}
      <FlatList
        data={budgets}
        keyExtractor={item => item.id}
        renderItem={BudgetItem}
        contentContainerStyle={styles.listContent}
        initialNumToRender={10}
        getItemLayout={(data, index) => ({
          length: 80,
          offset: 80 * index,
          index,
        })}
      />

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        accessible
        accessibilityLabel="Create new budget"
        accessibilityRole="button"
      >
        <Animated.View style={styles.fabContent}>
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </Animated.View>
      </TouchableOpacity>

      {/* Create Budget Modal */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Budget</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                accessible
                accessibilityLabel="Close modal"
                accessibilityRole="button"
              >
                <Ionicons name="close" size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="wallet-outline" size={20} color="#4B5563" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, inputError && styles.inputError]}
                placeholder="Enter budget name"
                value={newBudgetName}
                onChangeText={text => {
                  setNewBudgetName(text);
                  setInputError(text.trim() === '');
                }}
                accessible
                accessibilityLabel="Budget name input"
              />
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
                accessible
                accessibilityLabel="Cancel budget creation"
                accessibilityRole="button"
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.addButton]}
                onPress={handleAddBudget}
                accessible
                accessibilityLabel="Add new budget"
                accessibilityRole="button"
              >
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  listContent: {
    padding: 20,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  fabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#2563EB',
    paddingBottom: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: '#D1D5DB',
  },
  addButton: {
    backgroundColor: '#2563EB',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BudgetsScreen;