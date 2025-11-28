import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { TransController } from "../controllers/TransController";

const controller = new TransController();

export default function TransaccionesScreen() {
  const [tipo, setTipo] = useState("ingreso");
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [lista, setLista] = useState([]);

  const cargar = async () => {
    const datos = await controller.obtener();
    setLista(datos);
  };

  const agregar = async () => {
    await controller.agregar(tipo, descripcion, parseFloat(monto));
    setDescripcion("");
    setMonto("");
    cargar();
  };

  useEffect(() => {
    cargar();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transacciones</Text>

      <View style={styles.box}>
        <Text>Tipo:</Text>
        <TouchableOpacity onPress={() => setTipo("ingreso")}><Text>Ingreso</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setTipo("gasto")}><Text>Gasto</Text></TouchableOpacity>
      </View>

      <TextInput placeholder="Descripción" style={styles.input} value={descripcion} onChangeText={setDescripcion} />
      <TextInput placeholder="Monto" style={styles.input} value={monto} onChangeText={setMonto} keyboardType="numeric" />

      <TouchableOpacity onPress={agregar} style={styles.btn}><Text style={styles.btnText}>Guardar</Text></TouchableOpacity>

      <FlatList
        data={lista}
        renderItem={({ item }) => (
          <Text>{item.tipo} - ${item.monto} - {item.descripcion}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, padding: 8, marginVertical: 5 },
  btn: { backgroundColor: "#009688", padding: 10, marginTop: 10, borderRadius: 5 },
  btnText: { color: "white", textAlign: "center" },
  box: { flexDirection: "row", gap: 10 }
});
