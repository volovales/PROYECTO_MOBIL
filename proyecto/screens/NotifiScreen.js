
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';

export default function NotifiScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
       <Text style={styles.headerTitle}>Ahorra+ App</Text>
      <Text style={styles.title}>Notificaciones</Text>

      <View style={styles.centerContainer}>
        <View style={styles.card}>
          <View style={styles.headerText}>
            <Text style={styles.subtitle}>Notificaciones de la cuenta</Text>
            <Text style={styles.time}>Hace 2 horas</Text>
          </View>

          <Text style={styles.message}>
            ¡Hola! Le informamos que ha superado el presupuesto mensual asignado en la categoría.
            Hasta la fecha, su gasto registrado asciende a un monto mayor, lo que representa un
            exceso respecto al límite establecido.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginVertical: 15,
    textAlign: 'center',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  card: {
    backgroundColor: '#f3f3f3',
    borderRadius: 16,
    padding: 20,
    width: '85%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  headerText: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
    color: 'gray',
    marginTop: 2,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  headerTitle: { 
        flex: 1, 
        textAlign: "center", 
        fontSize: 18, 
        fontWeight: "700" 
    },
});
