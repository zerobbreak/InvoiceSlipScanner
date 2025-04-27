import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { documents } from '@/constants';
import DocumentCard from '@/components/DocumentCard';

interface itemProps{
    id: number
    title: string
    date: string
    budget: string
    category: string
}

const SlipOrganizerScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [filterType, setFilterType] = useState('budget');
  const [modalVisible, setModalVisible] = useState(false);

  const uniqueBudgets = ['All', ...Array.from(new Set(documents.map(doc => doc.budget)))];
  const uniqueCategories = ['All', ...Array.from(new Set(documents.map(doc => doc.category)))];
  const uniqueDates = ['All', ...Array.from(new Set(documents.map(doc => doc.date)))];

  const getFilterOptions = () => {
    switch (filterType) {
      case 'budget':
        return uniqueBudgets;
      case 'category':
        return uniqueCategories;
      case 'date':
        return uniqueDates;
      default:
        return [];
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === 'All' ||
      (filterType === 'budget' && doc.budget === selectedFilter) ||
      (filterType === 'category' && doc.category === selectedFilter) ||
      (filterType === 'date' && doc.date === selectedFilter);
    return matchesSearch && matchesFilter;
  });


  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#4B5563" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search slips by title..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          accessible
          accessibilityLabel="Search slips"
        />
      </View>

      {/* Filter Button */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setModalVisible(true)}
        accessible
        accessibilityLabel="Open filter options"
      >
        <Text style={styles.filterButtonText}>
          Filter: {filterType.charAt(0).toUpperCase() + filterType.slice(1)} - {selectedFilter}
        </Text>
        <Ionicons name="filter" size={20} color="#2563EB" />
      </TouchableOpacity>

      {/* Filter Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Slips</Text>
            <View style={styles.filterTypeContainer}>
              <Text style={styles.filterTypeLabel}>Filter Type:</Text>
              {['budget', 'category', 'date'].map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterTypeButton,
                    filterType === type && styles.filterTypeButtonActive,
                  ]}
                  onPress={() => {
                    setFilterType(type);
                    setSelectedFilter('All');
                  }}
                >
                  <Text
                    style={[
                      styles.filterTypeText,
                      filterType === type && styles.filterTypeTextActive,
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.filterTypeLabel}>Select Filter:</Text>
            <Picker
              selectedValue={selectedFilter}
              style={styles.modalPicker}
              onValueChange={setSelectedFilter}
            >
              {getFilterOptions().map(option => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.applyButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Documents List */}
      <FlatList
        data={filteredDocuments}
        keyExtractor={item => item.id.toString()}
        renderItem={DocumentCard}
        contentContainerStyle={styles.listContent}
        initialNumToRender={10}
        getItemLayout={(data, index) => ({
          length: 100,
          offset: 100 * index,
          index,
        })}
        refreshing={false}
        onRefresh={() => console.log('Refresh documents')} // Placeholder for cloud sync
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  filterButtonText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  filterTypeContainer: {
    marginBottom: 16,
  },
  filterTypeLabel: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 8,
  },
  filterTypeButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginBottom: 8,
  },
  filterTypeButtonActive: {
    backgroundColor: '#2563EB',
  },
  filterTypeText: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
  },
  filterTypeTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  modalPicker: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#D1D5DB',
    marginRight: 8,
  },
  applyButton: {
    backgroundColor: '#2563EB',
    marginLeft: 8,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
  },
});

export default SlipOrganizerScreen;