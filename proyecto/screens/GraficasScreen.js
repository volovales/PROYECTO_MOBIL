// Importación de módulos necesarios de React y React Native
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

// Importación de componentes de gráficas
import { LineChart, BarChart } from "react-native-chart-kit";

// Permite ejecutar código cuando la pantalla está enfocada
import { useIsFocused } from "@react-navigation/native";

// Controlador que maneja datos de transacciones
import { TransController } from "../controller/TransController";

const controller = new TransController();

// Extrae el texto entre corchetes al final de la descripción
function extraerCategoria(descripcion = "") {
  const match = descripcion.match(/\[(.+?)\]\s*$/);
  return match ? match[1] : "";
}

export default function GraficasScreen() {
  const isFocused = useIsFocused(); // Indica si la pantalla está actualmente en vista

  // Estado para modo ingreso o gasto
  const [modo, setModo] = useState("ingreso");

  // Lista completa de registros desde la base de datos
  const [lista, setLista] = useState([]);

  // Categorías detectadas en los registros
  const [categorias, setCategorias] = useState([]);

  // Categoría seleccionada para filtrar, null significa todas
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  // Texto para el filtro de fecha
  const [fechaFiltro, setFechaFiltro] = useState("");

  // Selector entre gráfica de línea o barras
  const [modoGrafica, setModoGrafica] = useState("linea");

  // Carga datos desde el controlador y extrae categorías únicas
  const cargarDatos = async () => {
    const registros = await controller.obtener();
    setLista(registros);

    const cats = [
      ...new Set(
        registros
          .map((r) => extraerCategoria(r.descripcion))
          .filter(Boolean)
      ),
    ];
    setCategorias(cats);
  };

  // Cuando la pantalla entra en foco, se actualizan los datos
  useEffect(() => {
    if (isFocused) cargarDatos();
  }, [isFocused]);

  // ------------------ FILTROS APLICADOS SOBRE LA LISTA ------------------

  let filtrado = lista.filter((t) => t.tipo === modo);

  // Filtro por categoría
  if (categoriaSeleccionada) {
    filtrado = filtrado.filter(
      (t) => extraerCategoria(t.descripcion) === categoriaSeleccionada
    );
  }

  // Filtro por fecha en formato YYYY-MM-DD
  if (fechaFiltro.trim() !== "") {
    filtrado = filtrado.filter((t) =>
      t.fecha ? t.fecha.startsWith(fechaFiltro) : false
    );
  }

  // ------------------ ACUMULADO MENSUAL PARA LA GRÁFICA PRINCIPAL ------------------

  const mesesOrden = [
    "Oct", "Nov", "Dic", "Ene", "Feb", "Mar",
    "Abr", "May", "Jun", "Jul", "Ago", "Sep",
  ];

  // Inicializa acumuladores por mes
  const acumuladoPorMes = {
    Oct: 0, Nov: 0, Dic: 0, Ene: 0, Feb: 0, Mar: 0, Abr: 0,
    May: 0, Jun: 0, Jul: 0, Ago: 0, Sep: 0,
  };

  // Recorre los registros filtrados y acumula por mes
  filtrado.forEach((t) => {
    if (!t.fecha) return;

    const mes = new Date(t.fecha).getMonth() + 1;
    let mesNombre = "";

    switch (mes) {
      case 1: mesNombre = "Ene"; break;
      case 2: mesNombre = "Feb"; break;
      case 3: mesNombre = "Mar"; break;
      case 4: mesNombre = "Abr"; break;
      case 5: mesNombre = "May"; break;
      case 6: mesNombre = "Jun"; break;
      case 7: mesNombre = "Jul"; break;
      case 8: mesNombre = "Ago"; break;
      case 9: mesNombre = "Sep"; break;
      case 10: mesNombre = "Oct"; break;
      case 11: mesNombre = "Nov"; break;
      case 12: mesNombre = "Dic"; break;
    }

    if (acumuladoPorMes[mesNombre] !== undefined) {
      acumuladoPorMes[mesNombre] += Number(t.monto);
    }
  });

  // Datos preparados para las gráficas
  const labels = mesesOrden;
  const datos = mesesOrden.map((m) => acumuladoPorMes[m]);
  const total = datos.reduce((acc, x) => acc + x, 0);

  // ------------------ COMPARACIÓN INGRESOS VS GASTOS ------------------

  let totalIngresosGlobal = 0;
  let totalGastosGlobal = 0;

  lista.forEach((t) => {
    if (t.tipo === "ingreso") {
      totalIngresosGlobal += Number(t.monto) || 0;
    } else if (t.tipo === "gasto") {
      totalGastosGlobal += Number(t.monto) || 0;
    }
  });

  // Límite superior para la gráfica comparativa
  const maxComparacion = Math.max(totalIngresosGlobal, totalGastosGlobal) || 0;

  // Ancho dinámico de las gráficas
  const widthChart = Dimensions.get("window").width - 40;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40, alignItems: "center" }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Gráficas Financieras</Text>

      {/* Selector entre ingresos y gastos */}
      <View style={styles.botones}>
        <Text
          style={[styles.tabText, modo === "ingreso" && styles.tabTextActivo]}
          onPress={() => {
            setModo("ingreso");
            setCategoriaSeleccionada(null);
          }}
        >
          Ingreso
        </Text>

        <Text
          style={[styles.tabText, modo === "gasto" && styles.tabTextActivo]}
          onPress={() => {
            setModo("gasto");
            setCategoriaSeleccionada(null);
          }}
        >
          Gasto
        </Text>
      </View>

      {/* Entrada para filtrar por fecha */}
      <TextInput
        style={styles.input}
        placeholder="Filtrar fecha YYYY-MM-DD"
        value={fechaFiltro}
        onChangeText={setFechaFiltro}
      />

      {/* Filtro por categoría */}
      <Text style={{ marginTop: 10, fontWeight: "bold" }}>Categorías:</Text>

      <View style={styles.categoriasRow}>
        <TouchableOpacity
          style={[
            styles.categoriaBtn,
            categoriaSeleccionada === null && styles.categoriaActiva,
          ]}
          onPress={() => setCategoriaSeleccionada(null)}
        >
          <Text style={{ color: "white" }}>Todas</Text>
        </TouchableOpacity>

        {categorias.map((cat, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoriaBtn,
              categoriaSeleccionada === cat && styles.categoriaActiva,
            ]}
            onPress={() => setCategoriaSeleccionada(cat)}
          >
            <Text style={{ color: "white" }}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Selector del tipo de gráfica */}
      <Text style={{ marginTop: 10, fontWeight: "bold" }}>
        Tipo de Gráfica (mensual):
      </Text>

      <View style={styles.selectorGrafica}>
        <TouchableOpacity
          style={[
            styles.btnGrafica,
            modoGrafica === "linea" && styles.btnGraficaActiva,
          ]}
          onPress={() => setModoGrafica("linea")}
        >
          <Text style={styles.btnGraficaText}>Línea</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.btnGrafica,
            modoGrafica === "barras" && styles.btnGraficaActiva,
          ]}
          onPress={() => setModoGrafica("barras")}
        >
          <Text style={styles.btnGraficaText}>Barras</Text>
        </TouchableOpacity>
      </View>

      {/* Resumen total del filtro aplicado */}
      <View style={styles.resumen}>
        <Text style={styles.resumenText}>Total: ${total.toFixed(2)}</Text>
      </View>

      {/* Gráfica principal mensual */}
      <View style={styles.chartBlock}>
        <Text style={styles.chartTitle}>
          {modo === "ingreso" ? "Ingresos por mes" : "Gastos por mes"}
        </Text>

        {modoGrafica === "linea" ? (
          <LineChart
            data={{
              labels,
              datasets: [{ data: datos }],
            }}
            width={widthChart}
            height={260}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
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
        ) : (
          <BarChart
            data={{
              labels,
              datasets: [{ data: datos }],
            }}
            width={widthChart}
            height={260}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 2,
              color: () => "#009688",
              labelColor: () => "#333",
            }}
            style={styles.grafica}
          />
        )}
      </View>

      {/* Comparación global entre ingresos y gastos */}
      {(totalIngresosGlobal > 0 || totalGastosGlobal > 0) && (
        <View style={styles.chartBlock}>
          <Text style={styles.chartTitle}>
            Comparación general: ingresos vs gastos
          </Text>

          <BarChart
            data={{
              labels: ["Ingresos", "Gastos"],
              datasets: [
                { data: [totalIngresosGlobal, totalGastosGlobal] },
              ],
            }}
            width={widthChart}
            height={260}
            fromZero={true}
            maxValue={maxComparacion}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 2,
              color: () => "#10b981",
              labelColor: () => "#333",
            }}
            style={styles.grafica}
          />

          <View style={{ marginTop: 10 }}>
            <Text style={{ textAlign: "center" }}>
              Ingresos totales: ${totalIngresosGlobal.toFixed(2)}
            </Text>
            <Text style={{ textAlign: "center" }}>
              Gastos totales: ${totalGastosGlobal.toFixed(2)}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

// Estilos para toda la pantalla
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },

  botones: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    marginBottom: 20,
  },
  tabText: {
    fontSize: 16,
    color: "#555",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  tabTextActivo: {
    backgroundColor: "#009688",
    color: "#fff",
    borderColor: "#009688",
  },

  input: {
    width: "100%",
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  categoriasRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 15,
  },
  categoriaBtn: {
    backgroundColor: "#777",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  categoriaActiva: {
    backgroundColor: "#009688",
  },

  selectorGrafica: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  btnGrafica: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#888",
  },
  btnGraficaActiva: {
    backgroundColor: "#009688",
  },
  btnGraficaText: {
    color: "white",
    fontWeight: "600",
  },

  resumen: {
    marginVertical: 10,
  },
  resumenText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#009688",
  },

  chartBlock: {
    marginTop: 15,
    width: "100%",
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },

  grafica: {
    marginTop: 4,
    borderRadius: 10,
  },
});
