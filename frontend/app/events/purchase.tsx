import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useMutation, gql } from '@apollo/client';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Event } from '@/types';

const PURCHASE_TICKETS = gql`
  mutation PurchaseTickets($eventId: Int!, $quantity: Int!) {
    purchaseTickets(eventId: $eventId, quantity: $quantity) {
      id
      orderNumber
      quantity
      createdAt
      event {
        id
        name
        date
        totalTickets
        availableTickets
      }
    }
  }
`;

export default function PurchaseScreen() {
  const { event: eventParam } = useLocalSearchParams();
  const router = useRouter();
  const event: Event = eventParam ? JSON.parse(eventParam as string) : null;
  const [quantity, setQuantity] = useState('1');

  const [purchaseTickets, { loading, error }] = useMutation(PURCHASE_TICKETS, {
    onCompleted: (data) => {
      router.push({
        pathname: '/events/confirmation',
        params: { order: JSON.stringify(data.purchaseTickets) },
      });
    },
    onError: (err) => {
      Alert.alert('Purchase Error', err.message);
    },
  });

  if (!event) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>No event data provided.</ThemedText>
      </ThemedView>
    );
  }

  const handlePurchase = () => {
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert('Invalid Quantity', 'Please enter a valid number of tickets.');
      return;
    }
    if (qty > event.availableTickets) {
      Alert.alert('Not Enough Tickets', 'You cannot purchase more tickets than are available.');
      return;
    }
    purchaseTickets({
      variables: {
        eventId: event.id,
        quantity: qty,
      },
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{event.name}</ThemedText>
      <ThemedText>Date: {new Date(event.date).toLocaleString()}</ThemedText>
      <ThemedText>Tickets Available: {event.availableTickets}</ThemedText>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        placeholder="Enter quantity"
      />
      <TouchableOpacity style={styles.button} onPress={handlePurchase} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <ThemedText style={styles.buttonText}>Purchase Tickets</ThemedText>
        )}
      </TouchableOpacity>
      {error && <ThemedText style={styles.error}>Error: {error.message}</ThemedText>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 15,
    borderRadius: 6,
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  error: {
    color: 'red',
    marginTop: 10,
    fontSize: 14,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});