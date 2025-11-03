import { useState } from 'react';
import { Text, StyleSheet, View, FlatList, Button } from 'react-native'


export default function ActividadScreen(){

    const[mostrar, setMostrar] = useState();

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

    const datos = mostrar === 'recibidos' ? recibidos : realizados
    

            return (
                <View style={styles.container}>
                    <View style={styles.botonesContainer}>

                        <View style={styles.boton}>
                            <Button color='black' title='Recibidos' onPress={()=>setMostrar('recibidos')}></Button>
                        </View>

                        <View>
                            <Button color='black' title='Realizados' onPress={()=>setMostrar('realizados')}></Button>
                        </View>

                    </View>

                    <View style={styles.listaContainer}>

                        <Text style={styles.titulo}>{mostrar === 'recibidos' ? 'Recibidos' : 'Realizados'}</Text>
                        <FlatList
                        data={datos}
                        keyExtractor={(item) => item.id}
                        renderItem={({item}) => (
                            <View style={styles.item}>
                            <Text style={styles.nombre}>Nombre: {item.nombre}</Text>
                            <Text style={styles.descripcion}>Descripción: {item.descripcion}</Text>
                            <Text style={styles.monto}>Monto: {item.monto}</Text>
                            <Text style={styles.fecha}>Fecha: {item.fecha}</Text>
                            </View>
                        )}/>
                        
                    </View>

                    <View style={styles.container}>
                        <Button color='black' onPress={()=>setPantalla('actividad')} title='Nueva Transacción'></Button>
                    </View>

                </View>
    )

}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 10,
        justifyContent:'center',
    },
    titulo:{
        fontSize: 18,
        fontWeight:'bold',
        margin: 10,
    },
    item:{
        padding: 10,
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#dbdbdbd2'
    },
    nombre:{
        fontSize: 16,
        fontWeight:'bold',
        marginBottom: 5,
    },
    descripcion:{
        fontSize: 14,
        color:'#000000'
    },
    monto:{
        fontSize: 14,
        color:'#000000'
    },
    fecha:{
        fontSize: 14,
        color:'#000000'
    },
    listaContainer:{
        flex: 10,
        marginBottom: 20,
    },
    botonesContainer:{
        flexDirection: 'row',
        justifyContent:'flex-start',
        marginBottom: 10,
        gap: 10,
    },
})
