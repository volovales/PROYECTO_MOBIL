import { Text, StyleSheet, View, Button } from 'react-native'
import React, { useState } from 'react'
import TransaccionesScreen from './TransaccionesScreen'
import HomeScreen from './HomeScreen'

export default function Menu() {
  const [screen, setScreen] = useState('menu');
  switch (screen) {
    case 'pantalla 3':
    return <HomeScreen />;
    case 'pantalla 4':
    return <TransaccionesScreen/>;
      default:
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Menú de Pantallas</Text>
          <Button onPress={() =>setScreen('pantalla 3')} title=' pantalla 3' ></Button>
          <Button onPress={() =>setScreen('pantalla 4')} title=' pantalla 4' ></Button>
        </View>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
})