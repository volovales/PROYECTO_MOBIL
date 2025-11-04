import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importa tus pantallas
import Menu from './screens/Menu';
import InicioSesion from './screens/InicioSesion';
import Registro from './screens/Registro';
import HomeScreen from './screens/HomeScreen';
import TransaccionesScreen from './screens/TransacciScreen';
import PresupuestoScreen from './screens/PresupuestoScreen';
import NotifiScreen from './screens/NotifiScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Menu">
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="InicioSesion" component={InicioSesion} />
        <Stack.Screen name="Registro" component={Registro} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Transacciones" component={TransaccionesScreen} />
        <Stack.Screen name="Presupuesto" component={PresupuestoScreen} />
        <Stack.Screen name="Notificaciones" component={NotifiScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
