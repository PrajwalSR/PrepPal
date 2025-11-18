import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { updateGroceryItem } from '../services/mealPlanService';

const GroceryListScreen = ({ route }) => {
  const { mealPlan } = route.params;
  const [groceryList, setGroceryList] = useState(mealPlan.groceryList || []);

  const toggleItem = async (categoryIndex, itemIndex) => {
    const category = groceryList[categoryIndex].category;
    const currentItem = groceryList[categoryIndex].items[itemIndex];
    const newChecked = !currentItem.checked;

    const updatedList = [...groceryList];
    updatedList[categoryIndex].items[itemIndex].checked = newChecked;
    setGroceryList(updatedList);

    if (mealPlan.id) {
      await updateGroceryItem(mealPlan.id, category, itemIndex, newChecked);
    }
  };

  const getTotalItems = () => {
    return groceryList.reduce((sum, cat) => sum + cat.items.length, 0);
  };

  const getCheckedItems = () => {
    return groceryList.reduce((sum, cat) => {
      return sum + cat.items.filter((item) => item.checked).length;
    }, 0);
  };

  const progress = getTotalItems() > 0 ? (getCheckedItems() / getTotalItems()) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Grocery List</Text>
        <Text style={styles.subtitle}>
          {getCheckedItems()} / {getTotalItems()} items
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {groceryList.map((category, catIdx) => (
          <View key={catIdx} style={styles.categoryCard}>
            <Text style={styles.categoryTitle}>
              {category.icon} {category.category}
            </Text>
            {category.items.map((item, itemIdx) => (
              <TouchableOpacity
                key={itemIdx}
                style={styles.itemRow}
                onPress={() => toggleItem(catIdx, itemIdx)}
              >
                <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
                  {item.checked && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, item.checked && styles.itemNameChecked]}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemQuantity}>
                    {item.quantity} {item.unit}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#FFF', padding: 20, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 12 },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#4CAF50', borderRadius: 4 },
  scrollView: { flex: 1, padding: 20 },
  categoryCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#4CAF50',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: { backgroundColor: '#4CAF50' },
  checkmark: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, color: '#333', marginBottom: 2 },
  itemNameChecked: { textDecorationLine: 'line-through', color: '#999' },
  itemQuantity: { fontSize: 14, color: '#666' },
});

export default GroceryListScreen;
