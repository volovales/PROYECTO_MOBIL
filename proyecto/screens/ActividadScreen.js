import { useState } from 'react';
import { Text, StyleSheet, View, FlatList, Button, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';

export default function ActividadScreen() {

  const [mostrar, setMostrar] = useState('recibidos');
  const [recibidos, setRecibidos] = useState([
    { id: '1', nombre: 'Gasolina', descripcion: 'Presupuesto Gasolina del Mes', monto: 2000, fecha: 'hace 10 minutos' },
    { id: '2', nombre: 'GYM', descripcion: 'Presupuestos mensualidades', monto: 350, fecha: 'hace 1 hora' },
    { id: '3', nombre: 'Comidas', descripcion: 'Presupuesto de comidas del mes', monto: 3500, fecha: 'hace 1 día' },
  ]);

  const [realizados, setRealizados] = useState([
    { id: '1', nombre: 'Comidas', descripcion: 'Pago Gorditas', monto: 100, fecha: 'hace 10 minutos' },
    { id: '2', nombre: 'GYM IronHeart', descripcion: 'Mensualidad GYM', monto: 350, fecha: 'hace 1 hora' },
    { id: '3', nombre: 'Carga Gasolina', descripcion: 'Carga semanal de gasolina', monto: 500, fecha: 'hace 1 día' },
  ]);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [tipoRegistro, setTipoRegistro] = useState('');
  const [editando, setEditando] = useState(null);

  const datos = mostrar === 'recibidos' ? recibidos : realizados;

  const abrirModal = (tipo) => {
    setTipoRegistro(tipo);
    setEditando(null);
    setNombre('');
    setDescripcion('');
    setMonto('');
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setNombre('');
    setDescripcion('');
    setMonto('');
    setEditando(null);
  };

  const agregarElemento = () => {
    if (!nombre || !descripcion || !monto) {
      Alert.alert("Campos incompletos", "Debes llenar todos los campos antes de confirmar.");
      return;
    }

    if (editando) {
      const actualizado = {
        ...editando,
        nombre,
        descripcion,
        monto: parseFloat(monto),
      };

      if (mostrar === "recibidos") {
        setRecibidos(recibidos.map(i => i.id === editando.id ? actualizado : i));
      } else {
        setRealizados(realizados.map(i => i.id === editando.id ? actualizado : i));
      }

      cerrarModal();
      return;
    }

    const nuevo = {
      id: Date.now().toString(),
      nombre,
      descripcion,
      monto: parseFloat(monto),
      fecha: 'ahora mismo'
    };

    if (tipoRegistro === 'ingreso') {
      setRecibidos([...recibidos, nuevo]);
    } else if (tipoRegistro === 'gasto') {
      setRealizados([...realizados, nuevo]);
    }

    cerrarModal();
  };

  const eliminarElemento = (id) => {
    if (mostrar === 'recibidos') {
      setRecibidos(recibidos.filter(i => i.id !== id));
    } else {
      setRealizados(realizados.filter(i => i.id !== id));
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
      <View style={styles.botonesContainer}>
        <View style={styles.boton}>
          <Button color='black' title='Ingresos' onPress={() => setMostrar('recibidos')} />
        </View>
        <View>
          <Button color='black' title='Gastos' onPress={() => setMostrar('realizados')} />
        </View>
      </View>

      <Text style={styles.titulo}>{mostrar === 'recibidos' ? 'Ingresos' : 'Gastos'}</Text>

      <FlatList
        data={datos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.nombre}>Nombre: {item.nombre}</Text>
              <Text style={styles.descripcion}>Descripción: {item.descripcion || 'Sin descripción'}</Text>
              <Text style={styles.monto}>Monto: ${item.monto}</Text>
              <Text style={styles.fecha}>Fecha: {item.fecha}</Text>
            </View>

            <View style={styles.acciones}>
              <TouchableOpacity
                style={styles.btnEditar}
                onPress={() => editarElemento(item)}
              >
                <Text style={{ color: 'white' }}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnEliminar}
                onPress={() => eliminarElemento(item.id)}
              >
                <Text style={{ color: 'white' }}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={styles.botonesAccion}>
        {mostrar === 'recibidos' ? (
          <Button color='black' title='Registrar ingreso' onPress={() => abrirModal('ingreso')} />
        ) : (
          <Button color='black' title='Registrar gasto' onPress={() => abrirModal('gasto')} />
        )}
      </View>

      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={cerrarModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>
              {editando ? "Editar Registro" : (tipoRegistro === 'ingreso' ? 'Registrar Ingreso' : 'Registrar Gasto')}
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
              <View style={styles.modalBoton}>
                <Button color='gray' title="Cancelar" onPress={cerrarModal} />
              </View>
              <View style={styles.modalBoton}>
                <Button color='black' title="Confirmar" onPress={agregarElemento} />
              </View>
            </View>

          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10,
  },
  item: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#dbdbdbd2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  descripcion: {
    fontSize: 14,
    color: '#000000',
  },
  monto: {
    fontSize: 14,
    color: '#000000',
  },
  fecha: {
    fontSize: 14,
    color: '#000000',
  },
  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  botonesAccion: {
    marginTop: 20,
  },
  acciones: {
    flexDirection: 'column',
    gap: 5,
  },
  btnEditar: {
    backgroundColor: 'blue',
    padding: 5,
    borderRadius: 5,
  },
  btnEliminar: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    padding: 8,
    marginVertical: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    elevation: 5,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalBotones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  modalBoton: {
    flex: 1,
    marginHorizontal: 5,
  },
});
