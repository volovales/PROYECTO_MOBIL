import { Text, StyleSheet, View, Button } from 'react-native';

export default function Menu({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú de Pantallas</Text>
      <Button title="Ir a Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Ir a Transacciones" onPress={() => navigation.navigate('Transacciones')} />
      <Button title="Ir a Notificaciones" onPress={() => navigation.navigate('Notificaciones')} />
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
