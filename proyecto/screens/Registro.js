import React, { useState } from "react";
import { Alert, SafeAreaView,ScrollView,StyleSheet,Text, TextInput,TouchableOpacity,} from "react-native";
import DatabaseService from "../database/DatabaseService";

// Pantalla de registro: administra el formulario y la creación del usuario en la base de datos
export default function Registro({ navigation }) {

  // Estados que guardan los datos ingresados en el formulario
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // Función para validar que los campos tengan formato y contenido correcto
  const validar = () => {
    if (!fullName || !email || !username || !password || !confirmPass) {
      Alert.alert("Campos incompletos", "Llena todos los campos para continuar");
      return false;
    }

    const emailname = /\S+@\S+\.\S+/;

    if (!emailname.test(email)) {
      Alert.alert("Correo inválido", "Ingresa un correo válido");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Contraseña muy corta", "Debe tener al menos 6 caracteres");
      return false;
    }

    if (password !== confirmPass) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return false;
    }

    return true;
  };

  // Acción para regresar a la pantalla anterior (Inicio de Sesión)
  const goInicioSesion = () => {
    navigation.goBack();
  };

  // Función que crea un nuevo usuario en la base de datos si la validación es correcta
  const onRegister = async () => {
    if (!validar()) return;

    try {
      await DatabaseService.registerUser(
        fullName.trim(),
        email.trim(),
        username.trim(),
        password
      );

      Alert.alert("Registro", "Cuenta creada correctamente", [
        {
          text: "Ir a inicio sesión",
          onPress: () => navigation.replace("InicioSesion"),
        },
      ]);
    } catch (error) {
      console.log("Error al registrar: " + error);

      if (error.message === "Datos duplicados") {
        Alert.alert(
          "Usuario existente",
          "El correo o nombre de usuario ya están registrados"
        );
      } else {
        Alert.alert("Error", "No se pudo crear la cuenta");
      }
    }
  };

  // Renderizado de la interfaz del formulario de registro
  return (
    <SafeAreaView style={styles.root}>
      <TouchableOpacity style={styles.InicioBtn} onPress={goInicioSesion}>
        <Text style={styles.ReturnBtnText}> Regresar</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Ahorra+ App</Text>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 300 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Registrarse</Text>

        {/* Bloque de inputs del formulario */}
        <Text style={styles.label}>Nombre Completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre Completo"
          placeholderTextColor="#9CA3AF"
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={styles.label}>E-Mail</Text>
        <TextInput
          style={styles.input}
          placeholder="correo@dominio.com"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Nombre de Usuario</Text>
        <TextInput
          style={styles.input}
          placeholder="usuario123"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Confirmar contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={confirmPass}
          onChangeText={setConfirmPass}
        />

        {/* Botón principal de registro */}
        <TouchableOpacity style={styles.primaryBtn} onPress={onRegister}>
          <Text style={styles.primaryBtnText}>Registrarse</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos visuales de la pantalla
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 200,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  label: {
    marginTop: 12,
    marginBottom: 6,
    color: "#111827",
    textAlign: "center",
    fontWeight: "600",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },
  input: {
    height: 44,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  primaryBtn: {
    height: 46,
    borderRadius: 10,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
  InicioBtn: {
    marginLeft: 16,
    marginTop: 16,
  },
  ReturnBtnText: {
    fontWeight: "700",
  },
});
