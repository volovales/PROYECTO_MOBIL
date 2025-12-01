import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";

import DatabaseService from "../database/DatabaseService";
import { TransController } from "../controller/TransController";

const transController = new TransController();

// Formatea dinero con comas y 2 decimales
function formatMoney(num) {
  if (num === null || num === undefined || num === "") return "0.00";
  const n = Number(num);
  if (isNaN(n)) return "0.00";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function PresupuestosScreen({ navigation }) {
  const isFocused = useIsFocused();

  const [presupuestos, setPresupuestos] = useState([]);
  const [saldoActual, setSaldoActual] = useState(0);

  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoMonto, setNuevoMonto] = useState("");

  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editMonto, setEditMonto] = useState("");

  const calendarioIcon =
    "https://cdn-icons-png.flaticon.com/512/3652/3652191.png";

  const cargarPresupuestos = async () => {
    try {
      const data = await DatabaseService.obtenerPresupuestos();
      setPresupuestos(data || []);
    } catch (e) {
      console.log("Error al cargar presupuestos:", e);
      Alert.alert(
        "Error",
        e?.message || "No se pudieron cargar los presupuestos."
      );
    }
  };

  const cargarSaldo = async () => {
    try {
      const { ingresos, gastos } = await transController.totales();
      const saldo =
        (Number(ingresos) || 0) - (Number(gastos) || 0);
      setSaldoActual(saldo);
    } catch (e) {
      console.log("Error al cargar saldo actual en Presupuesto:", e);
    }
  };

  useEffect(() => {
    if (isFocused) {
      cargarPresupuestos();
      cargarSaldo();
    }
  }, [isFocused]);

  const subtotal = presupuestos.reduce(
    (acc, p) => acc + (Number(p.limite) || 0),
    0
  );

  const impuestos = subtotal * 0.1;
  const total = subtotal + impuestos;

  const agregarPresupuesto = async () => {
    if (!nuevoNombre.trim() || !nuevoMonto.trim()) {
      Alert.alert("Campos incompletos", "Completa categoría y monto.");
      return;
    }

    const montoLimpio = nuevoMonto.replace(/\s/g, "").replace(",", ".");
    const limite = parseFloat(montoLimpio);

    if (isNaN(limite) || limite <= 0) {
      Alert.alert("Monto inválido", "Ingresa un monto numérico mayor a 0.");
      return;
    }

    // 🔎 Verificar que la suma de presupuestos + este nuevo NO supere el saldo actual
    const sumaActualPresupuestos = presupuestos.reduce(
      (acc, p) => acc + (Number(p.limite) || 0),
      0
    );
    const sumaConNuevo = sumaActualPresupuestos + limite;

    if (sumaConNuevo > saldoActual) {
      Alert.alert(
        "Presupuesto excedido",
        `La suma de tus presupuestos (${formatMoney(
          sumaConNuevo
        )}) supera tu saldo actual (${formatMoney(
          saldoActual
        )}). No se puede agregar este presupuesto.`
      );
      return;
    }

    // 🟢 Fecha automática (hoy)
    const fechaFinal = new Date().toISOString().split("T")[0];

    try {
      const nuevo = await DatabaseService.agregarPresupuesto(
        nuevoNombre.trim(),
        limite,
        fechaFinal
      );

      console.log("Presupuesto agregado:", nuevo);

      await cargarPresupuestos();
      setNuevoNombre("");
      setNuevoMonto("");

      Alert.alert("Presupuesto", "Presupuesto agregado correctamente.");
    } catch (e) {
      console.log("Error al agregar presupuesto:", e);
      Alert.alert(
        "Error",
        e?.message ||
          "No se pudo agregar el presupuesto. Verifica que hayas iniciado sesión."
      );
    }
  };

  const borrar = async (id) => {
    try {
      await DatabaseService.eliminarPresupuesto(id);
      await cargarPresupuestos();
    } catch (e) {
      console.log("Error al eliminar presupuesto:", e);
      Alert.alert("Error", "No se pudo eliminar el presupuesto.");
    }
  };

  const abrirEdicion = (pres) => {
    setEditId(pres.id);
    setEditNombre(pres.categoria);
    setEditMonto(String(pres.limite));
    setModalVisible(true);
  };

  const guardarEdicion = async () => {
    if (!editNombre.trim() || !editMonto.trim()) {
      Alert.alert("Campos incompletos", "Completa categoría y monto.");
      return;
    }

    const montoLimpio = editMonto.replace(/\s/g, "").replace(",", ".");
    const limiteNum = parseFloat(montoLimpio);

    if (isNaN(limiteNum) || limiteNum <= 0) {
      Alert.alert("Monto inválido", "Ingresa un monto numérico mayor a 0.");
      return;
    }

    // 🔎 Verificar que la suma de presupuestos (reemplazando el editado) no supere el saldo
    const sumaSinEditado = presupuestos.reduce((acc, p) => {
      if (p.id === editId) return acc;
      return acc + (Number(p.limite) || 0);
    }, 0);

    const sumaConEditado = sumaSinEditado + limiteNum;

    if (sumaConEditado > saldoActual) {
      Alert.alert(
        "Presupuesto excedido",
        `La suma de tus presupuestos (${formatMoney(
          sumaConEditado
        )}) supera tu saldo actual (${formatMoney(
          saldoActual
        )}). No se puede actualizar este presupuesto.`
      );
      return;
    }

    // 🟢 Fecha automática también al editar
    const fechaFinal = new Date().toISOString().split("T")[0];

    try {
      await DatabaseService.editarPresupuesto(
        editId,
        editNombre.trim(),
        limiteNum,
        fechaFinal
      );

      setModalVisible(false);
      await cargarPresupuestos();
      Alert.alert("Presupuesto", "Presupuesto actualizado correctamente.");
    } catch (e) {
      console.log("Error al editar presupuesto:", e);
      Alert.alert("Error", "No se pudo actualizar el presupuesto.");
    }
  };

  const filtrar = () => {
    cargarPresupuestos().then(() => {
      setPresupuestos((prev) =>
        prev.filter(
          (p) =>
            (!filtroCategoria ||
              (p.categoria &&
                p.categoria
                  .toLowerCase()
                  .includes(filtroCategoria.toLowerCase()))) &&
            (!filtroFecha || (p.fecha && p.fecha.startsWith(filtroFecha)))
        )
      );
    });
  };

  const quitarFiltros = () => {
    setFiltroCategoria("");
    setFiltroFecha("");
    cargarPresupuestos();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 350 }}
    >
      {/* Saldo actual total */}
      <Text style={styles.saldoLabel}>
        Saldo actual total:{" "}
        <Text style={styles.saldoValor}>
          ${formatMoney(saldoActual)}
        </Text>
      </Text>

      <Text style={styles.subtitle}>Filtros</Text>

      <TextInput
        placeholder="Filtrar por categoría"
        value={filtroCategoria}
        style={styles.input}
        onChangeText={setFiltroCategoria}
      />

      <TextInput
        placeholder="Filtrar por fecha YYYY-MM-DD"
        value={filtroFecha}
        style={styles.input}
        onChangeText={setFiltroFecha}
      />

      <TouchableOpacity style={styles.darkButton} onPress={filtrar}>
        <Text style={styles.buttonText}>Aplicar filtros</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.grayButton} onPress={quitarFiltros}>
        <Text style={styles.buttonText}>Quitar filtros</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Presupuestos Mensual</Text>

      {presupuestos.map((p) => (
        <View key={p.id} style={styles.item}>
          <Image source={{ uri: calendarioIcon }} style={styles.icon} />

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{p.categoria}</Text>
            <Text style={styles.details}>Fecha: {p.fecha || "N/A"}</Text>
          </View>

          <Text style={styles.price}>${formatMoney(p.limite)}</Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => abrirEdicion(p)}
          >
            <Text style={styles.editText}>✎</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => borrar(p.id)}
          >
            <Text style={styles.deleteText}>🗑</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.separator} />

      <Text style={styles.total}>
        Subtotal: ${formatMoney(subtotal)}
      </Text>
      <Text style={styles.total}>
        Impuestos (10%): ${formatMoney(impuestos)}
      </Text>
      <Text style={styles.totalFinal}>
        Total: ${formatMoney(total)}
      </Text>

      <Text style={styles.formTitle}>Agregar nuevo presupuesto</Text>

      <TextInput
        placeholder="Categoría"
        style={styles.input}
        value={nuevoNombre}
        onChangeText={setNuevoNombre}
      />

      <TextInput
        placeholder="Monto"
        keyboardType="numeric"
        style={styles.input}
        value={nuevoMonto}
        onChangeText={setNuevoMonto}
      />

      <TouchableOpacity style={styles.darkButton} onPress={agregarPresupuesto}>
        <Text style={styles.buttonText}>Agregar</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Editar presupuesto</Text>

            <TextInput
              style={styles.input}
              value={editNombre}
              onChangeText={setEditNombre}
            />

            <TextInput
              style={styles.input}
              value={editMonto}
              keyboardType="numeric"
              onChangeText={setEditMonto}
            />

            <View style={styles.modalRow}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSave}
                onPress={guardarEdicion}
              >
                <Text style={styles.modalBtnText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: "100%",
    backgroundColor: "#fff",
    padding: 20,
  },

  saldoLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },

  saldoValor: {
    color: "#008000",
    fontWeight: "700",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#007AFF",
    borderBottomWidth: 2,
    paddingBottom: 10,
    marginBottom: 10,
  },

  backRectButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 10,
  },

  backArrow: { fontSize: 20, fontWeight: "bold" },

  headerTitle: { fontSize: 20, fontWeight: "600" },

  subtitle: {
    marginTop: 20,
    fontSize: 18,
    color: "#555",
    marginBottom: 10,
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },

  darkButton: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },

  grayButton: {
    backgroundColor: "#777",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  icon: { width: 45, height: 45, marginRight: 10 },

  name: { fontSize: 16, fontWeight: "600" },

  details: { fontSize: 13, color: "#777" },

  price: { fontWeight: "bold", marginRight: 10 },

  editButton: { padding: 8 },

  editText: { fontSize: 20 },

  deleteButton: { padding: 8 },

  deleteText: { fontSize: 20, color: "red" },

  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginVertical: 15,
  },

  total: { textAlign: "right", fontSize: 16, fontWeight: "500" },

  totalFinal: {
    textAlign: "right",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 5,
  },

  formTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },

  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },

  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },

  modalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  modalCancel: {
    backgroundColor: "#999",
    padding: 10,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },

  modalSave: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },

  modalBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
