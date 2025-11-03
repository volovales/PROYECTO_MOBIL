import React from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
export default function TransaccionesScreen({ navigation }) {
  const datos = [
    { id: '1', tipo: 'Ingreso', categoria: 'Salario', monto: 5000, fecha: '2025-11-02' },
    { id: '2', tipo: 'Gasto', categoria: 'Comida', monto: 300, fecha: '2025-11-01' },
  ];
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transacciones</Text>
      <FlatList
        data={datos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.tipo}>{item.tipo}</Text>
            <Text>{item.categoria}</Text>
            <Text>${item.monto}</Text>
            <Text style={styles.fecha}>{item.fecha}</Text>
          </View>
        )}
      />
      <Button title="Agregar transacción" onPress={() => alert('Función próximamente')} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 20 
},
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center' 
},
  item: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  tipo: { fontWeight: 'bold', color: '#009688' },
  fecha: { fontSize: 12, color: '#666' },
});
