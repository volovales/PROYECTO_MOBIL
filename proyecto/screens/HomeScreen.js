import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
export default function HomeScreen({ navigation }) {
  return (
    
    <View style={styles.container}>
      
      <Text style={styles.title}>Bienvenido</Text>

      <View style={styles.container2} >
      <Button color = 'black' title="Ingresos" onPress={() => navigation.navigate('Ingresos')} />
      <Button color = 'grey' title="Gastos" onPress={() => navigation.navigate('Gastos')} />
      </View>
      <Text style={styles.subtitulo}>Sus finanzas son:</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Saldo actual:</Text>
        <Text style={styles.balance}>$0.00</Text>
      </View>
      <Button color = 'grey' title="Ver transacciones" onPress={() => navigation.navigate('Transacciones')} />
      <Button color = 'grey' title="Presupuesto" onPress={() => navigation.navigate('Presupuestos')} />
      <Button color = 'grey' title="Ver gráficas" onPress={() => navigation.navigate('Graficas')} />
      <Button color = 'grey' title="Ver perfil" onPress={() => navigation.navigate('Perfil')} />
    </View>
  );
}

const styles = StyleSheet.create({
  background:{

  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  container2: {
    flexDirection: "row",
    justifyContent: "space-between", 
    gap: 20,
    padding: 20,
    fontSize: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 16,
    color: '#333',
    marginBottom: 30,
  },
  card: {
    width: '90%',
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  balance: {
    fontSize: 22,
    color: '#009688',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  boton: {
    color: 'grey',
  },
});
