// Screens/Actividad.js
import { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
  Button,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { TransController } from "../controller/TransController";

const transController = new TransController();

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

// Quita la T si viene en formato ISO (YYYY-MM-DDTHH:mm...)
function formatFechaHora(fecha = "") {
  if (!fecha) return "";
  return fecha.replace("T", " ");
}

// Fecha y hora local en formato YYYY-MM-DD HH:MM
function getLocalDateTimeString() {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  const yyyy = now.getFullYear();
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const hh = pad(now.getHours());
  const mi = pad(now.getMinutes());
  return ${yyyy}-${mm}-${dd} ${hh}:${mi};
}

export default function ActividadScreen() {
  const isFocused = useIsFocused();

  const [mostrar, setMostrar] = useState("recibidos"); // "recibidos" = ingresos, "realizados" = gastos

  const [recibidos, setRecibidos] = useState([]); // ingresos
  const [realizados, setRealizados] = useState([]); // gastos

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [monto, setMonto] = useState("");

  const [fechaFiltro, setFechaFiltro] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [tipoRegistro, setTipoRegistro] = useState(""); // "ingreso" o "gasto"
  const [editando, setEditando] = useState(null); // transacción que se edita

  const datos = mostrar === "recibidos" ? recibidos : realizados;

  const cargarTransacciones = async () => {
    try {
      const lista = await transController.obtener();
      const ingresos = lista.filter((t) => t.tipo === "ingreso");
      const gastos = lista.filter((t) => t.tipo === "gasto");
      setRecibidos(ingresos);
      setRealizados(gastos);
    } catch (e) {
      console.log("Error al cargar transacciones en Actividad:", e);
      Alert.alert("Error", "No se pudieron cargar las transacciones");
    }
  };

  useEffect(() => {
    if (isFocused) cargarTransacciones();
  }, [isFocused]);

  const abrirModal = (tipo) => {
    setTipoRegistro(tipo); // "ingreso" o "gasto"
    setEditando(null);
    setNombre("");
    setDescripcion("");
    setCategoria("");
    setMonto("");
    setModalVisible(true);
  };

  const abrirEdicion = (item) => {
    setTipoRegistro(item.tipo);
    setEditando(item);
    setNombre(item.descripcion || "");
    setDescripcion("");
    setCategoria("");
    setMonto(String(item.monto || ""));
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setNombre("");
    setDescripcion("");
    setCategoria("");
    setMonto("");
    setEditando(null);
  };

  const agregarElemento = async () => {
    if (!nombre.trim() || !monto.trim()) {
      Alert.alert("Error", "Nombre y monto son obligatorios");
      return;
    }

    const montoNum = parseFloat(monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      Alert.alert("Monto inválido", "Debe ser un número positivo");
      return;
    }

    // 🔹 Validar saldo si es gasto
    try {
      const { ingresos, gastos } = await transController.totales();
      let disponible = (Number(ingresos) || 0) - (Number(gastos) || 0);

      // Si estamos editando un gasto, regresamos su monto anterior temporalmente
      if (editando && editando.tipo === "gasto") {
        disponible += Number(editando.monto) || 0;
      }

      if (tipoRegistro === "gasto" && montoNum > disponible) {
        Alert.alert(
          "Saldo insuficiente",
          "No se puede realizar esta transacción, el monto excede tu saldo disponible."
        );
        return;
      }
    } catch (e) {
      console.log("Error calculando saldo en Actividad:", e);
      if (tipoRegistro === "gasto") {
        Alert.alert(
          "Error de saldo",
          "Ocurrió un problema al calcular tu saldo. Intenta de nuevo."
        );
        return;
      }
    }

    // Fecha local (corrige el problema de zona horaria)
    const fechaFinal = getLocalDateTimeString();

    // Descripción final
    let descripcionFinal = nombre.trim();
    if (descripcion.trim()) {
      descripcionFinal += ` - ${descripcion.trim()}`;
    }
    if (categoria.trim()) {
      descripcionFinal += ` [${categoria.trim()}]`;
    }

    try {
      if (editando) {
        await transController.editar(
          editando.id,
          tipoRegistro,
          descripcionFinal,
          montoNum,
          fechaFinal
        );
      } else {
        // agregar() usa DatabaseService.agregarTransaccion
        await transController.agregar(tipoRegistro, descripcionFinal, montoNum);
      }

      await cargarTransacciones();
    } catch (e) {
      console.log("Error al guardar en BD (Actividad):", e);
      Alert.alert("Error", "Error al guardar en la base de datos");
    }

    cerrarModal();
  };

  const aplicarFiltroFecha = () => {
    if (!fechaFiltro.trim()) {
      cargarTransacciones();
      return;
    }

    if (mostrar === "recibidos") {
      setRecibidos((prev) =>
        prev.filter((i) => i.fecha && i.fecha.startsWith(fechaFiltro))
      );
    } else {
      setRealizados((prev) =>
        prev.filter((i) => i.fecha && i.fecha.startsWith(fechaFiltro))
      );
    }
  };

  const quitarFiltro = async () => {
    setFechaFiltro("");
    await cargarTransacciones();
  };

  const eliminarElemento = (item) => {
    Alert.alert("Confirmar", "¿Deseas eliminar esta transacción?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await transController.eliminar(item.id);
            await cargarTransacciones();
          } catch (e) {
            console.log("Error al eliminar transacción:", e);
            Alert.alert("Error", "No se pudo eliminar la transacción");
          }
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Botones para cambiar entre ingresos / gastos */}
      <View style={styles.botonesContainer}>
        <Button
          title="Ingresos"
          color="black"
          onPress={() => setMostrar("recibidos")}
        />
        <Button
          title="Gastos"
          color="black"
          onPress={() => setMostrar("realizados")}
        />
      </View>

      {/* Filtro por fecha */}
      <TextInput
        placeholder="Filtrar fecha (ej. 2025-11-30)"
        style={styles.input}
        value={fechaFiltro}
        onChangeText={setFechaFiltro}
      />

      <Button title="Filtrar fecha" color="black" onPress={aplicarFiltroFecha} />
      <Button title="Quitar filtro" color="gray" onPress={quitarFiltro} />

      <Text style={styles.titulo}>
        {mostrar === "recibidos" ? "Ingresos" : "Gastos"}
      </Text>

      {/* LISTA DE TRANSACCIONES */}
      {datos.map((item) => (
        <View
          key={item.id?.toString() ?? ${item.fecha}-${item.monto}}
          style={styles.item}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.labelDark}>
              Descripción:{" "}
              <Text style={styles.valueText}>{item.descripcion}</Text>
            </Text>
            <Text style={styles.labelDark}>
              Monto:{" "}
              <Text style={styles.valueText}>${formatMoney(item.monto)}</Text>
            </Text>
            <Text style={styles.labelDark}>
              Fecha:{" "}
              <Text style={styles.valueText}>
                {formatFechaHora(item.fecha)}
              </Text>
            </Text>
          </View>

          <View style={styles.acciones}>
            <TouchableOpacity
              style={styles.btnAccion}
              onPress={() => abrirEdicion(item)}
            >
              <Text style={styles.btnAccionText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnAccion, styles.btnEliminar]}
              onPress={() => eliminarElemento(item)}
            >
              <Text style={styles.btnAccionText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* BOTÓN PARA NUEVO REGISTRO */}
      <View style={styles.botonesAccion}>
        <Button
          title={
            mostrar === "recibidos" ? "Registrar ingreso" : "Registrar gasto"
          }
          color="black"
          onPress={() =>
            abrirModal(mostrar === "recibidos" ? "ingreso" : "gasto")
          }
        />
      </View>

      {/* MODAL ALTA / EDICIÓN */}
      <Modal animationType="fade" transparent visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>
              {editando ? "Editar registro" : "Nuevo registro"}
            </Text>
            <Text style={styles.labelDark}>Nombre</Text>
            <TextInput
              placeholder="Nombre"
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
            />

            <Text style={styles.labelDark}>Descripción (opcional)</Text>
            <TextInput
              placeholder="Descripción"
              style={styles.input}
              value={descripcion}
              onChangeText={setDescripcion}
            />

            <Text style={styles.labelDark}>Categoría (opcional)</Text>
            <TextInput
              placeholder="Categoría"
              style={styles.input}
              value={categoria}
              onChangeText={setCategoria}
            />

            <Text style={styles.labelDark}>Monto</Text>
            <TextInput
              placeholder="Monto"
              style={styles.input}
              value={monto}
              keyboardType="numeric"
              onChangeText={setMonto}
            />

            <View style={styles.modalBotones}>
              <Button title="Cancelar" color="gray" onPress={cerrarModal} />
              <Button
                title={editando ? "Guardar cambios" : "Confirmar"}
                color="black"
                onPress={agregarElemento}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: {
    flexGrow: 1,
    padding: 10,
    paddingBottom: 30,
  },

  botonesContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
    gap: 10,
  },

  titulo: { fontSize: 18, fontWeight: "bold", margin: 10 },

  item: {
    flexDirection: "row",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },

  labelDark: {
    fontSize: 14,
    color: "#222",
    fontWeight: "700",
    marginBottom: 2,
  },

  valueText: {
    color: "#333",
    fontWeight: "500",
  },

  acciones: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginLeft: 8,
  },

  btnAccion: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#333",
    borderRadius: 6,
    marginBottom: 4,
  },

  btnEliminar: {
    backgroundColor: "#b91c1c",
  },

  btnAccionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 5,
    padding: 8,
    marginVertical: 5,
  },

  botonesAccion: { marginTop: 10 },

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
    width: "85%",
  },

  modalTitulo: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },

  modalBotones: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
});
