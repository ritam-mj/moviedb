import React, { useState } from 'react';
import { LayoutAnimation, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';

interface ReportFilterProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiSelect?: boolean;
}

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ReportFilter({
  options,
  selected,
  onChange,
  multiSelect = true
}: ReportFilterProps) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleOption = (option: string) => {
    if (multiSelect) {
      if (selected.includes(option)) {
        onChange(selected.filter(item => item !== option));
      } else {
        onChange([...selected, option]);
      }
    } else {
      onChange([option]);
    }
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const toggleCollapse = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCollapsed(!collapsed);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleCollapse}>
          <Text style={styles.toggleText}>
            {collapsed ? 'Show Filters ▾' : 'Hide Filters ▴'}
          </Text>
        </TouchableOpacity>
        {!collapsed && selected.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {!collapsed && (
        <ScrollView style={styles.container}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.item,
                selected.includes(option) && styles.itemSelected
              ]}
              onPress={() => toggleOption(option)}
            >
              <View
                style={[
                  styles.checkbox,
                  selected.includes(option) && styles.checkboxChecked
                ]}
              />
              <Text
                style={[
                  styles.label,
                  selected.includes(option) && styles.labelSelected
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 12,
    backgroundColor: '#f0f4f8',
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#e0ecff',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleText: {
    fontWeight: 'bold',
    color: '#23509c',
  },
  clearText: {
    fontWeight: '600',
    color: '#d11a2a',
  },
  container: {
    maxHeight: 320,
    padding: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 4,
    borderRadius: 6,
    backgroundColor: '#fff',
    elevation: 1,
  },
  itemSelected: {
    backgroundColor: '#dceeff',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#007AFF',
    marginRight: 12,
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  label: {
    fontSize: 15,
    color: '#333',
  },
  labelSelected: {
    fontWeight: '600',
    color: '#007AFF',
  },
});
