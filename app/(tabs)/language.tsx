import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';

import { ScreenWrapper } from '../../components/ScreenWrapper';
const languages = ['English', 'Slovak', 'Hindi', 'Spanish'];

export default function Language() {
  return (
    <ScreenWrapper>
      <View style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Language</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView>
        {languages.map((lang, index) => (
          <TouchableOpacity key={index} style={styles.item}>
            <Text style={styles.text}>{lang}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  item: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  text: {
    fontSize: 16,
    color: '#111827',
  },
});
