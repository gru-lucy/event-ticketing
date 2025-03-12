import React from 'react';
import { FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Event } from '@/types';

const GET_EVENTS = gql`
  query GetEvents {
    events {
      id
      name
      date
      totalTickets
      availableTickets
    }
  }
`;

export default function EventsListScreen() {
  const { loading, error, data, refetch } = useQuery(GET_EVENTS);
  const router = useRouter();

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" color="#6200EE" />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText style={styles.errorText}>Error loading events: {error.message}</ThemedText>
      </ThemedView>
    );
  }

  const events = data.events;

  const renderItem = ({ item }: { item: Event }) => (
    <TouchableOpacity
      style={styles.eventContainer}
      onPress={() => {
        router.push({
          pathname: '/events/purchase',
          params: { event: JSON.stringify(item) },
        });
      }}>
      <ThemedText style={styles.title}>{item.name}</ThemedText>
      <ThemedText style={styles.dateText}>Date: {new Date(item.date).toLocaleString()}</ThemedText>
      <ThemedText style={item.availableTickets > 0 ? styles.ticketsAvailable : styles.soldOut}>
        {item.availableTickets > 0 ? `Tickets Available: ${item.availableTickets}` : 'Sold Out'}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onRefresh={refetch}
        refreshing={loading}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  eventContainer: {
    padding: 16,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  ticketsAvailable: {
    fontSize: 16,
    color: '#0a7ea4',
  },
  soldOut: {
    fontSize: 16,
    color: '#F44336',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});