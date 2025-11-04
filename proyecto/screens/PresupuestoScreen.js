import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Button } from 'react-native';

export default function PresupuestosScreen({ setScreen }) {
  return (
    <ScrollView style={styles.container}>
     
      <Text style={styles.title}>Presupuestos</Text>
      <Text style={styles.title2}>Octubre/Noviembre</Text>

      <View style={styles.item}>
        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png' }} style={styles.icon} />
        <View>
          <Text style={styles.name}>Alimentación</Text>
          <Text style={styles.details}>Cantidad: Mes</Text>
        </View>
        <Text style={styles.price}>$10.99</Text>
      </View>

      <View style={styles.item}>
        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1933/1933359.png' }} style={styles.icon} />
        <View>
          <Text style={styles.name}>Transporte</Text>
          <Text style={styles.details}>Cantidad: Mes</Text>
        </View>
        <Text style={styles.price}>$8.99</Text>
      </View>

      <View style={styles.item}>
        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2936/2936638.png' }} style={styles.icon} />
        <View>
          <Text style={styles.name}>Cine</Text>
          <Text style={styles.details}>Cantidad: Mes</Text>
        </View>
        <Text style={styles.price}>$10.99</Text>
      </View>

      <View style={styles.item}>
        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2964/2964514.png' }} style={styles.icon} />
        <View>
          <Text style={styles.name}>GYM</Text>
          <Text style={styles.details}>Cantidad: Mes</Text>
        </View>
        <Text style={styles.price}>$8.99</Text>
      </View>

      <Text style={styles.total}>Subtotal: $19.98</Text>
      <Text style={styles.total}>Impuestos: $2.00</Text>
      <Text style={styles.total}>Total: $21.98</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 22, fontWeight: '600', marginVertical: 15 },
  item: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  icon: { width: 50, height: 50, marginRight: 10 },
  name: { fontSize: 16, fontWeight: '500' },
  details: { color: 'gray', fontSize: 14 },
  price: { marginLeft: 'auto', fontSize: 16, fontWeight: 'bold' },
  total: { textAlign: 'right', marginTop: 5, fontWeight: '600' },
  title2: { fontSize: 22, fontWeight: '600', marginVertical: 15 },
});
