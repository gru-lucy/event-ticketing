import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function ConfirmationScreen() {
  const { order: orderParam } = useLocalSearchParams();
  const router = useRouter();
  const order = orderParam ? JSON.parse(orderParam as string) : null;

  if (!order) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>No order data available.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Order Confirmation</ThemedText>
      <ThemedText>Order Number: {order.orderNumber}</ThemedText>
      <ThemedText>Event: {order.event.name}</ThemedText>
      <ThemedText>Date: {new Date(order.event.date).toLocaleString()}</ThemedText>
      <ThemedText>Tickets Purchased: {order.quantity}</ThemedText>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.push('/events');
        }}>
        <ThemedText style={styles.buttonText}>Back to Events</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#0a7ea4',
    padding: 12,
    width: '100%',
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
