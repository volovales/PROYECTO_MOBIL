import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal
} from "react-native";

import DatabaseService from "../database/DatabaseService";

export default function PresupuestosScreen({ navigation }) {

  const [presupuestos, setPresupuestos] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoMonto, setNuevoMonto] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editMonto, setEditMonto] = useState("");

  const calendarioIcon = "https://cdn-icons-png.flaticon.com/512/3652/3652191.png";

  const cargarPresupuestos = async () => {
    try {
      const data = await DatabaseService.obtenerPresupuestos();
      setPresupuestos(data || []);
    } catch (e) {
      console.log("Error cargando presupuestos:", e);
    }
  };

  useEffect(() => {
    cargarPresupuestos();
  }, []);

  const subtotal = presupuestos.reduce(
    (acc, p) => acc + (Number(p.limite) || 0),
    0
  );
  const impuestos = subtotal * 0.10;
  const total = subtotal + impuestos;

  const agregarPresupuesto = async () => {
    if (!nuevoNombre.trim() || !nuevoMonto.trim()) {
      alert("Completa todos los campos");
      return;
    }

    const limite = parseFloat(nuevoMonto.toString().replace(",", "."));

    if (isNaN(limite)) {
      alert("El monto debe ser un número válido");
      return;
    }

    try {
      await DatabaseService.agregarPresupuesto(nuevoNombre.trim(), limite);
      await cargarPresupuestos();
      setNuevoNombre("");
      setNuevoMonto("");
    } catch (e) {
      console.log("Error al agregar presupuesto:", e);
      alert("Error al guardar presupuesto: " + (e?.message || "Error desconocido"));
    }
  };

  const borrar = async (id) => {
    try {
      await DatabaseService.eliminarPresupuesto(id);
      await cargarPresupuestos();
    } catch (e) {
      console.log("Error eliminando presupuesto:", e);
    }
  };

  const abrirEdicion = (pres) => {
    setEditId(pres.id);
    setEditNombre(pres.categoria);
    setEditMonto(String(pres.limite));
    setModalVisible(true);
  };

  const guardarEdicion = async () => {
    if (!editNombre.trim() || !editMonto) {
      alert("Completa todos los campos");
      return;
    }

    const limiteNuevo = parseFloat(editMonto.toString().replace(",", "."));

    if (isNaN(limiteNuevo)) {
      alert("El monto debe ser un número válido");
      return;
    }

    try {
      await DatabaseService.editarPresupuesto(editId, editNombre, limiteNuevo);
      setModalVisible(false);
      await cargarPresupuestos();
    } catch (e) {
      console.log("Error al editar presupuesto:", e);
      alert("Ocurrió un error al editar el presupuesto");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backRectButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Presupuestos</Text>
      </View>

      <Text style={styles.subtitle}>Octubre / Noviembre</Text>

      {presupuestos.map((p) => (
        <View key={p.id} style={styles.item}>
          <Image source={{ uri: calendarioIcon }} style={styles.icon} />

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{p.categoria}</Text>
            <Text style={styles.details}>Cantidad mensual</Text>
          </View>

          <Text style={styles.price}>${Number(p.limite || 0).toFixed(2)}</Text>

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

      <Text style={styles.total}>Subtotal: ${subtotal.toFixed(2)}</Text>
      <Text style={styles.total}>Impuestos (10%): ${impuestos.toFixed(2)}</Text>
      <Text style={styles.totalFinal}>Total: ${total.toFixed(2)}</Text>

      <View style={styles.form}>
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
      </View>

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
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 60 },
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
  backArrow: { fontSize: 20, color: "#000", fontWeight: "bold" },
  headerTitle: { fontSize: 20, fontWeight: "600" },
  subtitle: { fontSize: 18, color: "#777", marginBottom: 20 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15
  },
  icon: { width: 45, height: 45, marginRight: 10 },
  name: { fontSize: 16, fontWeight: "600" },
  details: { fontSize: 13, color: "gray" },
  price: { fontWeight: "bold", marginRight: 10 },
  editButton: { padding: 8 },
  editText: { fontSize: 20 },
  deleteButton: { padding: 8 },
  deleteText: { fontSize: 20, color: "red" },
  separator: { borderBottomWidth: 1, borderBottomColor: "#ddd", marginVertical: 15 },
  total: { textAlign: "right", fontSize: 16, fontWeight: "500" },
  totalFinal: { textAlign: "right", fontSize: 18, fontWeight: "700", marginTop: 5 },
  form: { marginTop: 25 },
  formTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  darkButton: {
    backgroundColor: "#333333ff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  modalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20
  },
  modalCancel: {
    backgroundColor: "#999",
    padding: 10,
    borderRadius: 8,
    width: "45%",
    alignItems: "center"
  },
  modalSave: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    width: "45%",
    alignItems: "center"
  },
  modalBtnText: { color: "#fff", fontWeight: "bold" }
});
