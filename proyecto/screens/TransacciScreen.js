import { Text, StyleSheet, View, Platform, Alert, Button, TextInput, ActivityIndicator } from 'react-native'
import React, {useState} from 'react'

export default function TransaccionesScreen() {


  const [nombreApartado, setNombreApartado] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [presionar, setPresionar] = useState(false);


  const carga =()=>{
    if(descripcion.trim()=== '' && nombreApartado.trim() === '' && cantidad.trim() === ''){
      if(Platform.OS === 'web'){
        window.alert('Error, por favor complete todos los campos');
      }
      else{
        Alert.alert('Error, por favor complete todo los campos')
      }
    }
    else if(descripcion.trim() === ''){
      if(Platform.OS === 'web'){
        window.alert('Error, ingrese la descripción del apartado');
      }
      else{
        Alert.alert('Error, ingrese la descripción del apartado');
      }
    }
    else if(nombreApartado.trim() === ''){
      if(Platform.OS === 'web'){
        window.alert('Error, ingrese el nombre del apartado');
      }
      else{
        Alert.alert('Error, ingrese el nombre del apartado');
      }
    }
    else if(cantidad.trim() === ''){
      if(Platform.OS === 'web'){
        window.alert('Error, ingrese el monto del movimiento');
      }
      else{
        Alert.alert('Error, ingrese el monto del movimiento');
      }
    }
    else{
      setPresionar(true);
      setTimeout(()=>{
      setPresionar(false);
      if(Platform.OS === 'web'){
        window.alert('Transaccion realizada');
      }
      else{
        Alert.alert('Transaccion realizada');
      }
      }, 3000);
    } 
  };



  return (
    <View style={styles.container}>

      <View style={styles.contenido}>

        <Text style={styles.titulo}>Nueva Transacción</Text>

        <Text style={styles.subtitulo}>Nombre del Apartado: </Text>
        <TextInput 
        value = {nombreApartado} 
        onChangeText={setNombreApartado}
        maxLength={50}
        style={styles.recuadro}>
        </TextInput>

        <Text style={styles.subtitulo}>Descripción:</Text>
        <TextInput 
        value = {descripcion} 
        onChangeText={setDescripcion}
        maxLength={50}
        style={styles.recuadro}>
        </TextInput>

        <Text style={styles.subtitulo}>Cantidad del Presupuesto</Text>
        <TextInput
        value={cantidad}
        onChangeText={setCantidad}
        maxLength={20}
        style={styles.recuadro}
        keyboardType='numeric'>
        </TextInput>

        <Text style={styles.totalOperacion}>Total: ${parseFloat(cantidad|| 0).toFixed(2)}</Text>
      </View>

        <View style={styles.botonContainer}>
          {presionar ? (<ActivityIndicator size='large' color='blue'></ActivityIndicator>) : (<Button color='black' title='Completar Carga' onPress={carga}></Button>)}
        </View>

      </View>
    )
  
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#ffffffff',
  },
  titulo:{
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  subtitulo:{
    fontSize: 18,
  },
  recuadro:{
    backgroundColor: '#cac8c8ee',
    borderRadius: 5,
    bordeColor: '#cac8c8ee',
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginBottom: 5,
    height: 50,
    width: '100%',
  },
  contenido:{
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  botonContainer:{
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent:'center',
    borderRadius: 10,
    bottom: 20,
    alignSelf: 'center',
  },
})
