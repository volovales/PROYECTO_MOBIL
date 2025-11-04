import { Text, StyleSheet, View, Button } from 'react-native';

export default function Menu({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú de Pantallas</Text>

      <Button title="Inicio de Sesión" onPress={() => navigation.navigate('InicioSesion')} />
      <Button title="Registro" onPress={() => navigation.navigate('Registro')} />
      <Button title="Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Transacciones" onPress={() => navigation.navigate('Transacciones')} />
      <Button title="Presupuesto" onPress={() => navigation.navigate('Presupuesto')} />
      <Button title="Notificaciones" onPress={() => navigation.navigate('Notificaciones')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
