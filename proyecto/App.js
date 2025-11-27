import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens
import Menu from './screens/Menu';
import InicioSesion from './screens/InicioSesion';
import Registro from './screens/Registro';
import HomeScreen from './screens/HomeScreen';
import TransaccionesScreen from './screens/TransacciScreen';
import PresupuestoScreen from './screens/PresupuestoScreen';
import NotifiScreen from './screens/NotifiScreen';
import GraficasScreen from './screens/GraficasScreen';
import ActividadScreen from './screens/ActividadScreen';

// Navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ---------------- TAB NAVIGATION ---------------- //
function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#009688",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
        },

        // Íconos inferiores
        tabBarIcon: ({ color }) => {
          let icon;

          switch (route.name) {
            case "Home":
              icon = "home";
              break;
            case "Transacciones":
              icon = "swap-horizontal";
              break;
            case "Presupuesto":
              icon = "wallet";
              break;
            case "Graficas":
              icon = "stats-chart";
              break;
            case "Notificaciones":
              icon = "notifications";
              break;
            case "Actividad":
              icon = "pulse";
              break;
            default:
              icon = "help";
          }

          return <Ionicons name={icon} size={26} color={color} />;
        },
      })}
    >

      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Transacciones" component={TransaccionesScreen} />
      <Tab.Screen name="Presupuesto" component={PresupuestoScreen} />
      <Tab.Screen name="Graficas" component={GraficasScreen} />
      <Tab.Screen name="Notificaciones" component={NotifiScreen} />
      <Tab.Screen name="Actividad" component={ActividadScreen}/>

    </Tab.Navigator>
  );
}

// ---------------- STACK NAVIGATION ---------------- //
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Menu">

        <Stack.Screen
          name="Menu"
          component={Menu}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="InicioSesion"
          component={InicioSesion}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Registro"
          component={Registro}
          options={{ headerShown: false }}
        />

        {/* Pantalla principal con las pestañas */}
        <Stack.Screen
          name="Principal"
          component={AppTabs}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
