import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';

export default function GraficasScreen() {
  const [grafica, setGrafica] = useState('ingresos');

  const imagenes = {
    ingresos: 'https://cdn.pixabay.com/photo/2017/01/10/00/47/chart-1964809_1280.png',
    gastos: 'https://cdn.pixabay.com/photo/2017/09/07/08/57/chart-2725602_1280.png',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gráficas Financieras</Text>

      {/* Botones de selección */}
      <View style={styles.botones}>
        <Button
          title="Ingresos"
          onPress={() => setGrafica('ingresos')}
          color={grafica === 'ingresos' ? '#05f8e0ff' : 'gray'}
        />
        <Button
          title="Gastos"
          onPress={() => setGrafica('gastos')}
          color={grafica === 'gastos' ? '#0af0d9ff' : 'gray'}
        />
      </View>

    
      <View style={styles.resumen}>
        <View style={styles.caja}>
          <Text style={styles.valor}>
            {grafica === 'ingresos' ? '$45,678.90' : '$1,500.90'}
          </Text>
          <Text style={styles.etiqueta}>
            {grafica === 'ingresos' ? 'Ganancias' : 'Gastos Totales'}
          </Text>
        </View>

        <View style={styles.caja}>
          <Text style={styles.valor}>
            {grafica === 'ingresos' ? '+33%' : '-14%'}
          </Text>
          <Text style={styles.etiqueta}>
            {grafica === 'ingresos' ? 'Rendimiento' : 'Disminución'}
          </Text>
        </View>
      </View>

      {/* Gráfica */}
      <View style={styles.card}>
        <Image
          source={{ uri: imagenes[grafica] }}
          style={styles.imagen}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  botones: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginBottom: 20,
  },
  resumen: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  caja: {
    backgroundColor: '#e0f2f1',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    width: '40%',
  },
  valor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#009688',
  },
  etiqueta: {
    fontSize: 14,
    color: '#555',
  },
  card: {
    width: '95%',
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    minHeight: 300,
  },
  imagen: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginTop: 10,
  },
});


