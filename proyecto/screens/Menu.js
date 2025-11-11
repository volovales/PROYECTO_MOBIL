import React, { useState } from 'react';
import { Text, StyleSheet, View, Button } from 'react-native';

import InicioSesion from './InicioSesion';
import Registro from './Registro';
import ActividadScreen from './ActividadScreen';
import HomeScreen from './HomeScreen';
import NotifiScreen from './NotifiScreen';
import TransaccionesScreen from './TransacciScreen'; 
import PresupuestoScreen from './PresupuestoScreen';
import GraficasScreen from './GraficasScreen';



export default function MenuScreen() {
  const [screen, setScreen] = useState('menu');

  switch (screen) {
    case 'InicioSesion':
      return <InicioSesion />;

    case 'Registro':
      return <Registro />;

    case 'Actividad':
      return <ActividadScreen />;

    case 'HomeScreen':
      return <HomeScreen />;

    case 'NotifiScreen':
      return <NotifiScreen />;

    case 'Transacciones':
      return <TransaccionesScreen />;

    case 'Presupuesto':
      return <PresupuestoScreen />;

    case 'Graficas':
      return <GraficasScreen />; 

    default:
      return (
        <View style={styles.container}>
          <Text style={styles.texto}>Menú</Text>

          <Button color="grey" onPress={() => setScreen('InicioSesion')} title="Inicio Sesión" />
          <Button color="grey" onPress={() => setScreen('Registro')} title="Registro" />
          <Button color="grey" onPress={() => setScreen('Actividad')} title="Actividad" />
          <Button color="grey" onPress={() => setScreen('HomeScreen')} title="HomeScreen" />
          <Button color="grey" onPress={() => setScreen('NotifiScreen')} title="Notificaciones" />
          <Button color="grey" onPress={() => setScreen('Transacciones')} title="Transacciones" />
          <Button color="grey" onPress={() => setScreen('Presupuesto')} title="Presupuesto" />
          <Button color="grey" onPress={() => setScreen('Graficas')} title="Gráficas" />
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#aeaaaaff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  texto: {
    color: 'black',
    fontSize: 50,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
});
