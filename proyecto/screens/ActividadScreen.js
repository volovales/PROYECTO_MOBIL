// Screens/Actividad.js
import { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  Button,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { TransController } from "../controller/TransController";

const transController = new TransController();

export default function ActividadScreen() {
  const [mostrar, setMostrar] = useState("recibidos");

  // SIN DATOS INICIALES
  const [recibidos, setRecibidos] = useState([]);
  const [realizados, setRealizados] = useState([]);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [tipoRegistro, setTipoRegistro] = useState("");
  const [editando, setEditando] = useState(null);

  const datos = mostrar === "recibidos" ? recibidos : realizados;

  const abrirModal = (tipo) => {
    setTipoRegistro(tipo);
    setEditando(null);
    setNombre("");
    setDescripcion("");
    setMonto("");
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setNombre("");
    setDescripcion("");
    setMonto("");
    setEditando(null);
  };

  const agregarElemento = async () => {
    if (!nombre.trim() || !descripcion.trim() || !monto.trim()) {
      Alert.alert("Error", "Completa todos los campos antes de continuar.");
      return;
    }

    const montoNum = parseFloat(monto.replace(",", "."));
    if (isNaN(montoNum)) {
      Alert.alert("Error", "El monto debe ser un número válido");
      return;
    }

    if (editando) {
      const actualizado = {
        ...editando,
        nombre,
        descripcion,
        monto: montoNum,
      };

      if (mostrar === "recibidos") {
        setRecibidos((prev) =>
          prev.map((i) => (i.id === editando.id ? actualizado : i))
        );
      } else {
        setRealizados((prev) =>
          prev.map((i) => (i.id === editando.id ? actualizado : i))
        );
      }

      cerrarModal();
      return;
    }

    const nuevo = {
      id: Date.now().toString(),
      nombre,
      descripcion,
      monto: montoNum,
      fecha: "ahora mismo",
    };

    if (tipoRegistro === "ingreso") {
      setRecibidos((prev) => [...prev, nuevo]);
    } else {
      setRealizados((prev) => [...prev, nuevo]);
    }

    try {
      await transController.agregar(
        tipoRegistro,
        ${nombre} - ${descripcion},
        montoNum
      );
    } catch (e) {
      console.log("Error guardando BD:", e);
      Alert.alert("Advertencia", "Se guardó localmente pero hubo error en la BD.");
    }

    cerrarModal();
  };

  const eliminarElemento = (id) => {
    if (mostrar === "recibidos") {
      setRecibidos((prev) => prev.filter((i) => i.id !== id));
    } else {
      setRealizados((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const editarElemento = (item) => {
    setEditando(item);
    setNombre(item.nombre);
    setDescripcion(item.descripcion);
    setMonto(item.monto.toString());
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Botones principales */}
      <View style={styles.botonesContainer}>
        <Button
          color="black"
          title="Ingresos"
          onPress={() => setMostrar("recibidos")}
        />
        <Button
          color="black"
          title="Gastos"
          onPress={() => setMostrar("realizados")}
        />
      </View>

      <Text style={styles.titulo}>
        {mostrar === "recibidos" ? "Ingresos" : "Gastos"}
      </Text>

      {/* Lista */}
      <FlatList
        data={datos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.nombre}>Nombre: {item.nombre}</Text>
              <Text style={styles.descripcion}>
                Descripción: {item.descripcion}
              </Text>
              <Text style={styles.monto}>Monto: ${item.monto}</Text>
              <Text style={styles.fecha}>Fecha: {item.fecha}</Text>
            </View>

            <View style={styles.acciones}>
              <TouchableOpacity
                style={styles.btnEditar}
                onPress={() => editarElemento(item)}
              >
                <Text style={{ color: "white" }}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnEliminar}
                onPress={() => eliminarElemento(item.id)}
              >
                <Text style={{ color: "white" }}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Botón registrar */}
      <View style={styles.botonesAccion}>
        <Button
          color="black"
          title={
            mostrar === "recibidos"
              ? "Registrar ingreso"
              : "Registrar gasto"
          }
          onPress={() =>
            abrirModal(mostrar === "recibidos" ? "ingreso" : "gasto")
          }
        />
      </View>

      {/* Modal */}
      <Modal animationType="fade" transparent visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>
              {editando
                ? "Editar Registro"
                : tipoRegistro === "ingreso"
                ? "Registrar Ingreso"
                : "Registrar Gasto"}
            </Text>

            <TextInput
              placeholder="Nombre"
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
            />
            <TextInput
              placeholder="Descripción"
              style={styles.input}
              value={descripcion}
              onChangeText={setDescripcion}
            />
            <TextInput
              placeholder="Monto"
              style={styles.input}
              value={monto}
              keyboardType="numeric"
              onChangeText={setMonto}
            />

            <View style={styles.modalBotones}>
              <Button color="gray" title="Cancelar" onPress={cerrarModal} />
              <Button color="black" title="Confirmar" onPress={agregarElemento} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  titulo: { fontSize: 18, fontWeight: "bold", margin: 10 },
  item: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#dbdbdbd2",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nombre: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  descripcion: { fontSize: 14 },
  monto: { fontSize: 14 },
  fecha: { fontSize: 14 },
  botonesContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
    gap: 10,
  },
  acciones: { flexDirection: "column", gap: 5 },
  btnEditar: { backgroundColor: "blue", padding: 5, borderRadius: 5 },
  btnEliminar: { backgroundColor: "red", padding: 5, borderRadius: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 5,
    padding: 8,
    marginVertical: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitulo: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  modalBotones: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
});
