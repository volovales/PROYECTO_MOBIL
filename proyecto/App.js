import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import InicioSesion from "./Screens/InicioSesion";
import Registro from "./Screens/Registro";
import RecuperarContraseña from "./Screens/RecuperarContraseña";
import HomeScreen from "./Screens/HomeScreen";
import Graficas from "./Screens/Graficas";
import Transacciones from "./Screens/Transacciones";
import Presupuestos from "./Screens/PresupuestoScreen";
import ActividadScreen from "./Screens/Actividad";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarShowLabel: false,
        tabBarIcon: ({ color, size }) => {
          let iconName = "home";

          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "Transacciones") {
            iconName = "add-circle-outline";
          } else if (route.name === "Presupuestos") {
            iconName = "cart-outline";
          } else if (route.name === "Graficas") {
            iconName = "stats-chart-outline";
          } else if (route.name === "Actividad") {
            iconName = "time-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Transacciones" component={Transacciones} />
      <Tab.Screen name="Presupuestos" component={Presupuestos} />
      <Tab.Screen name="Graficas" component={Graficas} />
      <Tab.Screen name="Actividad" component={ActividadScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="InicioSesion">
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
        <Stack.Screen
          name="RecuperarContraseña"
          component={RecuperarContraseña}
          options={{ headerShown: false }}
        />

        {/* PANTALLA PRINCIPAL CON TABS ABAJO */}
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
