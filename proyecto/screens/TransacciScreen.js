import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { TransController } from "../controller/TransController";
import DatabaseService from "../database/DatabaseService";

const controller = new TransController();

// Formatea con comas y dos decimales
function formatMoney(num) {
  if (num === null || num === undefined || num === "") return "0.00";
  const n = Number(num);
  if (isNaN(n)) return "0.00";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Saca la categoría del texto si viene algo como "... [Categoria]"
function extraerCategoria(descripcion = "") {
  const match = descripcion.match(/\[(.+?)\]\s*$/);
  return match ? match[1] : "";
}

export default function TransaccionesScreen() {
  const isFocused = useIsFocused();

  const [tipo] = useState("gasto");
  const [categoria, setCategoria] = useState("");
  const [monto, setMonto] = useState("");

  const [fechaFiltro, setFechaFiltro] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [transFiltradas, setTransFiltradas] = useState([]);

  const [saldo, setSaldo] = useState(0);

  // Carga el saldo disponible entre (ingresos - gastos)
  const cargarSaldo = async () => {
    try {
      const { ingresos, gastos } = await controller.totales();
      const disponible = (Number(ingresos) || 0) - (Number(gastos) || 0);
      setSaldo(disponible);
    } catch (e) {
      console.log("Error cargando saldo:", e);
    }
  };

  useEffect(() => {
    if (isFocused) cargarSaldo();
  }, [isFocused]);

  // Revisa si ya te pasaste del presupuesto en una categoría
  const verificarPresupuestoExcedido = async (categoriaTexto) => {
    try {
      const presupuestos = await DatabaseService.obtenerPresupuestos();
      if (!presupuestos || presupuestos.length === 0) return;

      const lista = await controller.obtener();

      const catNormalizada =
        categoriaTexto && categoriaTexto.trim().length > 0
          ? categoriaTexto.trim().toLowerCase()
          : null;

      if (catNormalizada) {
        const presupuestoCat = presupuestos.find(
          (p) =>
            p.categoria &&
            p.categoria.toLowerCase() === catNormalizada
        );

        if (!presupuestoCat) return;

        const totalGastadoCat = lista
          .filter(
            (t) =>
              t.tipo === "gasto" &&
              extraerCategoria(t.descripcion).toLowerCase() ===
                catNormalizada
          )
          .reduce((acc, t) => acc + (Number(t.monto) || 0), 0);

        if (totalGastadoCat > Number(presupuestoCat.limite || 0)) {
          Alert.alert(
            "Presupuesto excedido",
            Has superado el presupuesto para la categoría "${presupuestoCat.categoria}".
          );
        }
      }
    } catch (e) {
      console.log("Error al verificar presupuesto:", e);
    }
  };
  
  // Guarda la transacción después de revisar todo

  const completarTransaccion = async () => {
    if (!monto.trim()) {
      Alert.alert("Monto vacío", "Ingresa una cantidad.");
      return;
    }

    const cantidad = parseFloat(monto.replace(",", "."));
    if (isNaN(cantidad) || cantidad <= 0) {
      Alert.alert("Monto inválido", "Ingresa un monto válido.");
      return;
    }

    if (cantidad > saldo) {
      Alert.alert(
        "Saldo insuficiente",
        "No se puede realizar esta transacción, el monto excede tu saldo disponible."
      );
      return;
    }

    try {
      const categoriaLimpia = categoria.trim();
      const descripcionFinal = categoriaLimpia
        ? Gasto [${categoriaLimpia}]
        : "Gasto";

      await controller.agregar("gasto", descripcionFinal, cantidad);

      await cargarSaldo();
      await verificarPresupuestoExcedido(categoriaLimpia);

      Alert.alert("Transacción", "Gasto registrado correctamente.");

      setCategoria("");
      setMonto("");
    } catch (e) {
      console.log("Error guardando:", e);
      Alert.alert("Error", "No se pudo guardar la transacción.");
    }
  };

  const aplicarFiltro = async () => {
    if (!fechaFiltro.trim() && !filtroCategoria.trim()) {
      Alert.alert("Filtros", "Ingresa al menos fecha o categoría.");
      return;
    }

    try {
      const lista = await controller.obtener();
      let filtradas = lista.filter((t) => t.tipo === "gasto");

      if (fechaFiltro.trim()) {
        filtradas = filtradas.filter(
          (t) => t.fecha && t.fecha.startsWith(fechaFiltro)
        );
      }

      if (filtroCategoria.trim()) {
        const buscada = filtroCategoria.trim().toLowerCase();
        filtradas = filtradas.filter((t) =>
          extraerCategoria(t.descripcion).toLowerCase().includes(buscada)
        );
      }

      setTransFiltradas(filtradas);
    } catch (e) {
      console.log("Error al filtrar:", e);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.saldoLabel}>
        Saldo disponible:{" "}
        <Text style={styles.saldoMonto}>${formatMoney(saldo)}</Text>
      </Text>

      {/* Categoría */}
      <View style={styles.fieldBlock}>
        <Text style={styles.label}>Categoría (opcional)</Text>
        <TextInput
          style={styles.input}
          value={categoria}
          onChangeText={setCategoria}
          placeholder="Ej: Comida"
        />
      </View>

      {/* Monto */}
      <View style={styles.fieldBlock}>
        <Text style={styles.label}>Cantidad</Text>
        <TextInput
          style={styles.input}
          value={monto}
          onChangeText={setMonto}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.btn} onPress={completarTransaccion}>
        <Text style={styles.btnText}>Registrar gasto</Text>
      </TouchableOpacity>

      {/* FILTROS */}
      <View style={styles.fieldBlock}>
        <Text style={styles.label}>Filtrar por fecha (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={fechaFiltro}
          onChangeText={setFechaFiltro}
        />
      </View>

      <View style={styles.fieldBlock}>
        <Text style={styles.label}>Filtrar por categoría</Text>
        <TextInput
          style={styles.input}
          value={filtroCategoria}
          onChangeText={setFiltroCategoria}
        />
      </View>

      <TouchableOpacity style={styles.btn} onPress={aplicarFiltro}>
        <Text style={styles.btnText}>Aplicar filtro</Text>
      </TouchableOpacity>

      {transFiltradas.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.label}>Resultados:</Text>
          {transFiltradas.map((t) => (
            <Text key={t.id} style={{ marginVertical: 3 }}>
              {t.fecha} — {t.descripcion} — ${formatMoney(t.monto)}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },

  fieldBlock: { marginBottom: 16 },

  label: { fontSize: 14, color: "#000", marginBottom: 6 },

  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    height: 44,
    paddingHorizontal: 12,
  },

  btn: {
    backgroundColor: "#000",
    borderRadius: 8,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  saldoLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },

  saldoMonto: {
    color: "#008000",
    fontWeight: "700",
  },
});
