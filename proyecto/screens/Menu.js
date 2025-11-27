import { Text, StyleSheet, View, Button } from 'react-native';

export default function Menu({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú principal</Text>

      <Button title="Inicio de Sesión" onPress={() => navigation.navigate('InicioSesion')} />
      <Button title="Registro" onPress={() => navigation.navigate('Registro')} />

      {/* 🔥 TODAS ESTAS OPCIONES ENTRAN POR 'Principal' */}
      <Button title="Home" onPress={() => navigation.navigate('Principal')} />
      <Button title="Transacciones" onPress={() => navigation.navigate('Principal')} />
      <Button title="Presupuesto" onPress={() => navigation.navigate('Principal')} />
      <Button title="Notificaciones" onPress={() => navigation.navigate('Principal')} />
      <Button title="Gráficas" onPress={() => navigation.navigate('Principal')} />
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
