import { useState } from 'react';
import { Text, StyleSheet, View, FlatList, Button, Alert } from 'react-native';

export default function ActividadScreen() {
  const [mostrar, setMostrar] = useState('recibidos'); // estado inicial

  const recibidos = [
    {id: '1', nombre: 'Andrea', descripcion: 'Pago gorditas', monto: 100, fecha:'hace 10 minutos'},
    {id: '2', nombre: 'Susana', descripcion: 'Tanda', monto: 350, fecha:'hace 1 hora'},
    {id: '3', nombre: 'Leonardo', descripcion: 'Pago nomina', monto: 3500, fecha: 'hace 1 día'},
    {id: '4', nombre: 'Ivan', descripcion: null, monto: 150, fecha: 'hace 2 días'},
    {id: '5', nombre: 'Luisa', descripcion: null, monto: 150, fecha:'hace 3 días'},
    {id: '6', nombre: 'Sergio', descripcion: 'Parte del material de trabajo', monto: 250, fecha:'hace 1 semana'},
    {id: '7', nombre: 'Ricardo', descripcion: null, monto: 50, fecha: 'hace 2 semanas'},
    {id: '8', nombre: 'Miguel', descripcion: 'Prestamo', monto: 300, fecha:'hace 2 semanas'},
    {id: '9', nombre: 'Susana', descripcion: null, monto: 500, fecha:'hace 2 semanas'},
    {id: '10', nombre: 'Rodrigo', descripcion: 'Salida al cine', monto: 1000, fecha:'hace 3 semanas'},
  ];

  const realizados = [
    {id: '1', nombre: 'Juana', descripcion: 'Pago tienda', monto: 100, fecha:'hace 10 minutos'},
    {id: '2', nombre: 'GYM IronHeart', descripcion: 'Pago mensualidad', monto: 350, fecha:'hace 1 hora'},
    {id: '3', nombre: 'Leonardo', descripcion: 'Pago proyecto', monto: 3500, fecha: 'hace 1 día'},
    {id: '4', nombre: 'Tienda "La suerte"', descripcion: null, monto: 150, fecha: 'hace 2 días'},
    {id: '5', nombre: 'Pasteleria Edelweise', descripcion: 'Pago apartado pastel', monto: 200, fecha:'hace 3 días'},
    {id: '6', nombre: 'Banco BBVA', descripcion: 'Pago anualidad Tarjeta de Crédito', monto: 250, fecha:'hace 1 semana'},
    {id: '7', nombre: 'Ricardo', descripcion: 'Fiesta Juan', monto: 200, fecha: 'hace 2 semanas'},
    {id: '8', nombre: 'Papeleria TONY', descripcion: 'Pago papeleria', monto: 300, fecha:'hace 2 semanas'},
    {id: '9', nombre: 'Susana', descripcion: 'Tanda', monto: 500, fecha:'hace 2 semanas'},
    {id: '10', nombre: 'Gas Nieto', descripcion: 'Pago Cilindro de gas', monto: 850, fecha:'hace 3 semanas'},
  ];

  const datos = mostrar === 'recibidos' ? recibidos : realizados;

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Ahorra+ App</Text>
      </View>

      <View style={styles.buttonsRow}>
        <View style={styles.buttonWrap}>
          <Button color="black" title="Recibidos" onPress={() => setMostrar('recibidos')} />
        </View>
        <View style={styles.buttonWrap}>
          <Button color="black" title="Realizados" onPress={() => setMostrar('realizados')} />
        </View>
      </View>

      {/* Lista */}
      <View style={styles.listWrap}>
        <Text style={styles.titulo}>
          {mostrar === 'recibidos' ? 'Recibidos Octubre / Noviembre' : 'Realizados Octubre / Noviembre'}
        </Text>

        <FlatList
          data={datos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.nombre}>Nombre: <Text style={styles.normal}>{item.nombre}</Text></Text>
              <Text style={styles.descripcion}>
                Descripción: <Text style={styles.normal}>{item.descripcion ?? '—'}</Text>
              </Text>
              <Text style={styles.monto}>Monto: <Text style={styles.normal}>${item.monto}</Text></Text>
              <Text style={styles.fecha}>Fecha: <Text style={styles.normal}>{item.fecha}</Text></Text>
            </View>
          )}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          color="black"
          title="Nueva Transacción"
          onPress={() => Alert.alert('Acción', 'Iniciar nueva transacción')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff', 
    padding: 10,
  },
  headerRow: {
    paddingVertical: 6,
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },

  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 10,
  },
  buttonWrap: {
    flex: 1,
  },

  listWrap: {
    flex: 1, 
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  listContent: {
    paddingBottom: 16,
  },

  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10,
    color: '#111',
    textAlign: 'center',
  },
  item: {
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#111',
  },
  normal: {
    fontWeight: '400',
    color: '#111',
  },
  descripcion: {
    fontSize: 14,
    color: '#111',
    marginBottom: 2,
  },
  monto: {
    fontSize: 14,
    color: '#111',
    marginBottom: 2,
  },
  fecha: {
    fontSize: 14,
    color: '#111',
  },

  footer: {
    paddingTop: 8,
    paddingBottom: 12,
  },
});
