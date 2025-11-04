import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Importa tus pantallas
import Menu from './screens/Menu';
import HomeScreen from './screens/HomeScreen';
import TransaccionesScreen from './screens/TransaccionesScreen';
import NotifiScreen from './screens/NotifiScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Menu">
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Transacciones" component={TransaccionesScreen} />
        <Stack.Screen name="Notificaciones" component={NotifiScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
