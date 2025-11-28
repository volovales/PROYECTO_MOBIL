import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "./screens/HomeScreen";
import TransaccionesScreen from "./screens/TransacciScreen";
import PresupuestoScreen from "./screens/PresupuestoScreen";
import GraficasScreen from "./screens/GraficasScreen";
import NotifiScreen from "./screens/NotifiScreen";

import DatabaseService from "./database/DatabaseService";

const Tab = createBottomTabNavigator();

export default function App() {

  React.useEffect(() => {
    DatabaseService.initialize(); // Inicializar BD
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: "#009688",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            height: 60,
            paddingBottom: 5,
          },

          tabBarIcon: ({ color }) => {
            let icon;

            if (route.name === "Home") icon = "home";
            else if (route.name === "Transacciones") icon = "swap-horizontal";
            else if (route.name === "Presupuesto") icon = "wallet";
            else if (route.name === "Graficas") icon = "stats-chart";
            else if (route.name === "Notificaciones") icon = "notifications";

            return <Ionicons name={icon} size={26} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Transacciones" component={TransaccionesScreen} />
        <Tab.Screen name="Presupuesto" component={PresupuestoScreen} />
        <Tab.Screen name="Graficas" component={GraficasScreen} />
        <Tab.Screen name="Notificaciones" component={NotifiScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
