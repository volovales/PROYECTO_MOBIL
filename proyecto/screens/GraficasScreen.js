import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, BackHandler } from "react-native";
import { LineChart } from "react-native-chart-kit";
import DatabaseService from "../database/DatabaseService";

export default function GraficasScreen({ navigation }) {
  const [tipo, setTipo] = useState("ingresos");
  const [datosIngresos, setDatosIngresos] = useState([0, 0, 0]);
  const [datosGastos, setDatosGastos] = useState([0, 0, 0]);

  const [totalIngresos, setTotalIngresos] = useState(0);
  const [totalGastos, setTotalGastos] = useState(0);

  // ====== CARGAR DATOS REALES ======
  useEffect(() => {
    const cargarDatos = async () => {
      const ingresos = await DatabaseService.obtenerTotalIngresos();
      const gastos = await DatabaseService.obtenerTotalGastos();

      // Evitar Infinity o NaN
      const safe = (v) => (isFinite(v) && !isNaN(v) ? v : 0);

      setTotalIngresos(safe(ingresos));
      setTotalGastos(safe(gastos));

      // La gráfica usará los totales reales
      setDatosIngresos([
        safe(ingresos * 0.3),
        safe(ingresos * 0.5),
        safe(ingresos * 0.2),
      ]);

      setDatosGastos([
        safe(gastos * 0.4),
        safe(gastos * 0.3),
        safe(gastos * 0.3),
      ]);
    };

    cargarDatos();
  }, []);

  // Botón físico Android
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

      {/* ===== BOTONES ===== */}
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

      {/* ===== SECCIÓN CENTRADA ===== */}
      <View style={styles.centerWrapper}>
        
        {/* ===== RESUMEN ===== */}
        <View style={styles.resumen}>
          <View style={styles.caja}>
            <Text style={styles.valor}>
              {tipo === "ingresos" ? `$${totalIngresos.toFixed(2)}` : `$${totalGastos.toFixed(2)}`}
            </Text>
            <Text style={styles.etiqueta}>
              {tipo === "ingresos" ? "Ganancias totales" : "Gastos totales"}
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

        {/* ===== GRÁFICA ===== */}
        <LineChart
          data={{
            labels: ["Ene", "Feb", "Mar"],
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    justifyContent: "center"   // <-- TODO CENTRADO
  },

  centerWrapper: {
    alignItems: "center",
  },

  botones: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 25,
    gap: 20,
  },

  boton: { paddingVertical: 10, paddingHorizontal: 25, borderRadius: 10 },
  botonActivo: { backgroundColor: "#009688" },
  botonInactivo: { backgroundColor: "#e0e0e0" },
  textoBoton: { fontWeight: "bold", fontSize: 14 },
  textoActivo: { color: "white" },
  textoInactivo: { color: "black" },

  resumen: { 
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 30,
    width: "100%"
  },

  caja: { 
    backgroundColor: "#e0f2f1",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    width: "40%",
  },

  valor: { fontSize: 20, fontWeight: "bold", color: "#009688" },
  etiqueta: { fontSize: 14, color: "#555", textAlign: "center" },

  grafica: { borderRadius: 20 },
});
