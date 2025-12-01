import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import DatabaseService from "../database/DatabaseService";
import { TransController } from "../controller/TransController";

const transController = new TransController();

function formatMoney(num) {
  return Number(num).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function HomeScreen({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);

  const [totalIngresos, setTotalIngresos] = useState(0);
  const [totalGastos, setTotalGastos] = useState(0);

  const cerrarSesion = () => {
    DatabaseService.setCurrentUser(null);
    navigation.replace("InicioSesion");
  };

  const cargarDatosTransacciones = async () => {
    try {
      const lista = await transController.obtener();

      let ing = 0;
      let gas = 0;

      lista.forEach((t) => {
        const montoNum = Number(t.monto) || 0;
        if (t.tipo === "ingreso") ing += montoNum;
        if (t.tipo === "gasto") gas += montoNum;
      });

      setTotalIngresos(ing);
      setTotalGastos(gas);
    } catch (e) {
      console.log("Error cargando transacciones en Home:", e);
    }
  };

  useEffect(() => {
    cargarDatosTransacciones();

    const unsubscribe = navigation.addListener("focus", () => {
      cargarDatosTransacciones();
    });

    return unsubscribe;
  }, [navigation]);

  const saldoActual = totalIngresos - totalGastos;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => setMenuVisible(!menuVisible)}
        >
          <Text style={styles.profileText}>Perfil</Text>
        </TouchableOpacity>

        {menuVisible && (
          <View style={styles.menuBox}>
            <TouchableOpacity onPress={cerrarSesion}>
              <Text style={styles.menuOption}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text style={styles.title}>Bienvenido</Text>
      <Text style={styles.subtitulo}>Sus finanzas son:</Text>

      <View className="card" style={styles.card}>
        <Text style={styles.cardTitle}>Saldo actual:</Text>

        {/* SALDO PRINCIPAL */}
        <Text style={styles.balance}>${formatMoney(saldoActual)}</Text>

        {/* INGRESOS CENTRADOS */}
        <View style={styles.saldoVerticalBox}>
          <Text style={styles.saldoLabel}>Ingresos</Text>
          <Text style={styles.saldoValor}>
            ${formatMoney(totalIngresos)}
          </Text>
        </View>
        <View style={{ height: 25 }} />


        <View style={styles.saldoVerticalBox}>
          <Text style={styles.saldoLabel}>Gastos</Text>
          <Text style={styles.saldoValorGastos}>
            ${formatMoney(totalGastos)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 130,
    paddingHorizontal: 20,
  },

  header: {
    position: "absolute",
    top: 10,
    right: 20,
  },

  profileButton: {
    padding: 10,
    backgroundColor: "#eaeaea",
    borderRadius: 8,
  },

  profileText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  menuBox: {
    marginTop: 8,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 2,
  },

  menuOption: {
    fontSize: 16,
    paddingVertical: 5,
    fontWeight: "500",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 10,
  },

  subtitulo: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },

  card: {
    width: "90%",
    backgroundColor: "#f0f0f0",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 4,
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },

  balance: {
    fontSize: 22,
    color: "#009688",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },
  saldoVerticalBox: {
    alignItems: "center",
  },

  saldoLabel: {
    fontSize: 15,
    color: "#555",
    marginBottom: 4,
  },

  saldoValor: {
    fontSize: 18,
    fontWeight: "700",
    color: "blue",
  },

  saldoValorGastos: {
    fontSize: 18,
    fontWeight: "700",
    color: "red",
  },
});
