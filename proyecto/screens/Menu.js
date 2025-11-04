import React, { useState } from 'react';
import { Text, StyleSheet, View, Button } from 'react-native';

import InicioSesion from './InicioSesion';
import Registro from './Registro';
import Actividad from './Actividad';
import HomeScreen from './HomeScreen';
import NotifiScreen from './NotiScreen';
import TransaccionesScreen from './Transacciones';
import PresupuestoScreen from './PresupuestoScreen';


export default function MenuScreen() {
  const [screen, setScreen] = useState('menu');

  switch (screen) 
  {

    case 'InicioSesion':
      return <InicioSesion/>;
    
    case 'Registro':
      return <Registro/>;

    case 'Actividad':
      return <Actividad/>;
    
      case 'HomeScreen':
      return <HomeScreen/>;
    
      case 'NotifiScreen':
      return <NotifiScreen/>;
    
      case 'Transacciones':
      return <TransaccionesScreen/>;
    
      case 'Presupuesto':
      return <PresupuestoScreen/>;

    default:
      return (
        <View style = {styles.container}>
          <Text style ={styles.texto} >Menu</ Text>
          <Button color = 'grey' onPress={()=>setScreen('InicioSesion')} title='Practica Inicio Sesion'></Button>
          <Button color = 'grey' onPress={()=>setScreen('Registro')} title='Practica Registro'></Button>
            <Button color = 'grey' onPress={()=>setScreen('Actividad')} title='Practica Actividad'></Button>
            <Button color = 'grey' onPress={()=>setScreen('HomeScreen')} title='Practica HomeScreen'></Button>
            <Button color = 'grey' onPress={()=>setScreen('NotifiScreen')} title='Practica Notificaciones'></Button>
            <Button color = 'grey' onPress={()=>setScreen('Transacciones')} title='Practica Transacciones'></Button>
            <Button color = 'grey' onPress={()=>setScreen('Presupuesto')} title='Practica Presupuesto'></Button>
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
    fontSize: 60,
    fontWeight: 'bold',
    fontStyle: 'italic',
  }
}
);
