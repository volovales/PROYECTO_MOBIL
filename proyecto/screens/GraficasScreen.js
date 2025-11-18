import React, { useState } from "react";
import { View, Text, StyleSheet, Button, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

export default function GraficasScreen() 
{
  const [tipo, setTipo] = useState("ingresos");

  const datosIngresos = [3000, 3500, 4200, 5000, 5500, 6000];
  const datosGastos = [1500, 1200, 1800, 1300, 1600, 2000];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gráficas Financieras</Text>

      <View style={styles.botones}>
        <Button
          title="Ingresos"
          onPress={() => setTipo("ingresos")}
          color={tipo === "ingresos" ? "#009688" : "gray"}
        />
        <Button
          title="Gastos"
          onPress={() => setTipo("gastos")}
          color={tipo === "gastos" ? "#009688" : "gray"}
        />
      </View>

      <View style={styles.resumen}>
        <View style={styles.caja}>
          <Text style={styles.valor}>
            {tipo === "ingresos" ? "$45,678.90" : "$1,500.90"}
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
          propsForDots: {
            r: "5",
            strokeWidth: "2",
            stroke: "#009688",
          },
        }}
        bezier
        style={styles.grafica}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  botones: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    marginBottom: 20,
  },
  resumen: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  caja: {
    backgroundColor: "#e0f2f1",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    width: "40%",
  },
  valor: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#009688",
  },
  etiqueta: {
    fontSize: 14,
    color: "#555",
  },
  grafica: {
    borderRadius: 10,
    marginTop: 10,
  },
});
