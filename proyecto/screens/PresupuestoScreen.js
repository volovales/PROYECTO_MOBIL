// PresupuestosScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';

export default function PresupuestosScreen({ setScreen }) {
  const calendarioIcon = 'https://cdn-icons-png.flaticon.com/512/3652/3652191.png';

  const [presupuestos, setPresupuestos] = useState([
    { id: 1, nombre: 'Alimentación', cantidad: 10.99, icon: calendarioIcon },
    { id: 2, nombre: 'Transporte', cantidad: 8.99, icon: calendarioIcon },
    { id: 3, nombre: 'Cine', cantidad: 10.99, icon: calendarioIcon },
    { id: 4, nombre: 'GYM', cantidad: 8.99, icon: calendarioIcon },
  ]);

  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoMonto, setNuevoMonto] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [presupuestoEditando, setPresupuestoEditando] = useState(null);
  const [nuevoNombreEdicion, setNuevoNombreEdicion] = useState('');
  const [nuevoValorEdicion, setNuevoValorEdicion] = useState('');

  // Calcular totales
  const subtotal = presupuestos.reduce((acc, p) => acc + p.cantidad, 0);
  const impuestos = subtotal * 0.1;
  const total = subtotal + impuestos;

  const agregarPresupuesto = () => {
    if (!nuevoNombre || !nuevoMonto) {
      alert('Por favor completa todos los campos');
      return;
    }
    const nuevo = {
      id: Date.now(),
      nombre: nuevoNombre,
      cantidad: parseFloat(nuevoMonto),
      icon: calendarioIcon,
    };
    setPresupuestos([...presupuestos, nuevo]);
    setNuevoNombre('');
    setNuevoMonto('');
  };

  const eliminarPresupuesto = (id) => {
    setPresupuestos(presupuestos.filter((p) => p.id !== id));
  };

  const abrirModalEdicion = (presupuesto) => {
    setPresupuestoEditando(presupuesto);
    setNuevoNombreEdicion(presupuesto.nombre);
    setNuevoValorEdicion(presupuesto.cantidad.toString());
    setModalVisible(true);
  };

  const guardarEdicion = () => {
    if (!nuevoNombreEdicion || !nuevoValorEdicion || isNaN(nuevoValorEdicion)) {
      alert('Introduce un nombre y monto válido');
      return;
    }

    setPresupuestos(
      presupuestos.map((p) =>
        p.id === presupuestoEditando.id
          ? { ...p, nombre: nuevoNombreEdicion, cantidad: parseFloat(nuevoValorEdicion) }
          : p
      )
    );

    setModalVisible(false);
    setPresupuestoEditando(null);
    setNuevoValorEdicion('');
    setNuevoNombreEdicion('');
  };

  return (
    <ScrollView style={styles.container}>
      {/* 🔙 Botón de regresar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backRectButton}
          onPress={() => setScreen('Menu')}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Presupuestos</Text>
      </View>

      <Text style={styles.subtitle}>Octubre / Noviembre</Text>

      {presupuestos.map((p) => (
        <View key={p.id} style={styles.item}>
          <Image source={{ uri: p.icon }} style={styles.icon} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{p.nombre}</Text>
            <Text style={styles.details}>Cantidad mensual</Text>
          </View>
          <Text style={styles.price}>${p.cantidad.toFixed(2)}</Text>

          <TouchableOpacity onPress={() => abrirModalEdicion(p)}>
            <Text style={styles.edit}>✏</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => eliminarPresupuesto(p.id)}>
            <Text style={styles.delete}>🗑</Text>
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
          placeholder="Nombre"
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

      {/* MODAL DE EDICIÓN */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar presupuesto</Text>
            <Text style={styles.modalLabel}>Nombre:</Text>
            <TextInput
              style={styles.input}
              value={nuevoNombreEdicion}
              onChangeText={setNuevoNombreEdicion}
            />
            <Text style={styles.modalLabel}>Monto:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={nuevoValorEdicion}
              onChangeText={setNuevoValorEdicion}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.darkButton, { flex: 1, marginRight: 5 }]}
                onPress={guardarEdicion}
              >
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.darkButton, { flex: 1, marginLeft: 5 }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
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
  backgroundColor: '#fff',
  padding: 20,
  paddingTop: 60, // 👈 Esto baja todo el contenido sin afectar el navegador
},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#007AFF',
    borderBottomWidth: 2,
    paddingBottom: 10,
    marginBottom: 10,
  },
  backRectButton: {
    backgroundColor: '#ffffffff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 10,
  },
  backArrow: { fontSize: 20, color: '#000000ff', fontWeight: 'bold' },
  headerTitle: { fontSize: 20, fontWeight: '600', color: '#000' },
  subtitle: { fontSize: 18, color: '#777', marginBottom: 20 },
  item: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  icon: { width: 45, height: 45, marginRight: 10 },
  name: { fontSize: 16, fontWeight: '600' },
  details: { color: 'gray', fontSize: 13 },
  price: { fontWeight: 'bold', marginRight: 10 },
  edit: { fontSize: 18, marginRight: 8 },
  delete: { fontSize: 18, color: 'red' },
  total: { textAlign: 'right', fontSize: 16, fontWeight: '500' },
  totalFinal: { textAlign: 'right', fontSize: 18, fontWeight: '700', marginTop: 5 },
  separator: { borderBottomColor: '#ddd', borderBottomWidth: 1, marginVertical: 10 },
  form: { marginTop: 25 },
  formTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  darkButton: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 10, textAlign: 'center' },
  modalLabel: { fontSize: 16, marginBottom: 5 },
  modalButtons: { flexDirection: 'row', marginTop: 10 },
});