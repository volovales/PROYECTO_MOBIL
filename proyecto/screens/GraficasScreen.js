import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, BackHandler } from "react-native";
import { LineChart } from "react-native-chart-kit";

import DatabaseService from "../database/DatabaseService";   // <-- IMPORTANTE

export default function GraficasScreen({ navigation }) {
  const [tipo, setTipo] = useState("ingresos");
  const [datosIngresos, setDatosIngresos] = useState([]);
  const [datosGastos, setDatosGastos] = useState([]);

  const [totalIngresos, setTotalIngresos] = useState(0);
  const [totalGastos, setTotalGastos] = useState(0);

  useEffect(() => {
    const cargarDatos = async () => {

      // 🔵 OBTENER DATOS REALMENTE DE LA BD
      const ingresos = await DatabaseService.obtenerTotalIngresos();
      const gastos = await DatabaseService.obtenerTotalGastos();

      setTotalIngresos(ingresos);
      setTotalGastos(gastos);

      // 🔵 Datos de ejemplo para gráfica
      setDatosIngresos([300, 500, 700]);
      setDatosGastos([200, 300, 150]);
    };

    cargarDatos();
  }, []);

  // Botón físico para regresar
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>

      {/* BOTONES */}
      <View style={styles.botones}>
        <TouchableOpacity
          style={[styles.boton, tipo === "ingresos" ? styles.botonActivo : styles.botonInactivo]}
          onPress={() => setTipo("ingresos")}
        >
          <Text style={[styles.textoBoton, tipo === "ingresos" ? styles.textoActivo : styles.textoInactivo]}>
            INGRESOS
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.boton, tipo === "gastos" ? styles.botonActivo : styles.botonInactivo]}
          onPress={() => setTipo("gastos")}
        >
          <Text style={[styles.textoBoton, tipo === "gastos" ? styles.textoActivo : styles.textoInactivo]}>
            GASTOS
          </Text>
        </TouchableOpacity>
      </View>

      {/* RESUMEN */}
      <View style={styles.resumen}>
        <View style={styles.caja}>
          <Text style={styles.valor}>
            {tipo === "ingresos" ? `$${totalIngresos}` : `$${totalGastos}`}
          </Text>
          <Text style={styles.etiqueta}>
            {tipo === "ingresos" ? "Ganancias" : "Gastos Totales"}
          </Text>
        </View>

        <View style={styles.caja}>
          <Text style={styles.valor}>
            {tipo === "ingresos" ? "+33%" : "-14%"}
          </Text>
          <Text style={styles.etiqueta}>
            {tipo === "ingresos" ? "Rendimiento" : "Disminución"}
          </Text>
        </View>
      </View>

      {/* GRÁFICA */}
      <LineChart
        data={{
          labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
          datasets: [
            {
              data: tipo === "ingresos" ? datosIngresos : datosGastos,
              strokeWidth: 2,
            },
          ],
        }}
        width={Dimensions.get("window").width - 40}
        height={260}
        chartConfig={{
          backgroundColor: "#f8f8f8",
          backgroundGradientFrom: "#f8f8f8",
          backgroundGradientTo: "#f8f8f8",
          decimalPlaces: 2,
          color: () => "#009688",
          labelColor: () => "#333",
        }}
        bezier
        style={styles.grafica}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20, justifyContent: "center" },
  botones: { flexDirection: "row", justifyContent: "space-around", marginBottom: 20 },
  boton: { paddingVertical: 10, paddingHorizontal: 25, borderRadius: 10 },
  botonActivo: { backgroundColor: "#009688" },
  botonInactivo: { backgroundColor: "#e0e0e0" },
  textoBoton: { fontWeight: "bold", fontSize: 14 },
  textoActivo: { color: "white" },
  textoInactivo: { color: "black" },
  resumen: { flexDirection: "row", justifyContent: "space-around", marginBottom: 20 },
  caja: { backgroundColor: "#e0f2f1", borderRadius: 10, padding: 12, alignItems: "center", width: "40%" },
  valor: { fontSize: 18, fontWeight: "bold", color: "#009688" },
  etiqueta: { fontSize: 14, color: "#555" },
  grafica: { borderRadius: 10, marginTop: 10 },
});
