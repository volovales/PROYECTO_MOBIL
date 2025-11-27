import React, { useState } from "react";
import { Alert, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,} from "react-native";
import InicioSesion from "./InicioSesion";
export default function RecuperarContraseña() {
  const [email, setEmail] = useState("");
  const [mostrarInicioSesion, setMostrarInicio] = useState(false);


  const showAlert = (title, message) => {
    // Fallback para web (o entornos donde Alert falle)
    if (Platform.OS === "web") {
      // eslint-disable-next-line no-alert
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const goInicioSesion = () => {
       Alert.alert( "Inicio Sesion", "Navegando al inicio de sesion.", [
        {
          text: "OK",
          onPress: () => setMostrarInicio(true),
        },
      ]);
    };
    if (mostrarInicioSesion) {
      return <InicioSesion />;
    }

  const onRecover = () => {
    console.log("BOTÓN PRESIONADO con email:", email);
    if (!email.trim()) {
      showAlert(
        "Campo incompleto",
        "Por favor introduce tu correo para recuperar la contraseña."
      );
      return;
    }
    // Aquí iría la petición real al backend
    showAlert(
      "Recuperación",
      `Se ha enviado un enlace de recuperación a ${email}`
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <TouchableOpacity style={styles.InicioBtn} onPress={goInicioSesion}>
          <Text style={styles.ReturnBtnText}> Regresar</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ahorra+ App</Text>
      </View>

      

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
        <Text style={styles.title}>Recupérala</Text>

        <Text style={styles.label}>E-Mail</Text>
        <TextInput
          style={styles.input}
          placeholder="correo@dominio.com"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          returnKeyType="done"
        />

        <TouchableOpacity style={styles.primaryBtn} onPress={onRecover}>
          <Text style={styles.primaryBtnText}>Recuperar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  headerTitle: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
  },
  scroll: {
    flexGrow: 1,
    padding: 24,
  },
  InicioBtn: {
    textAlign: 'left',

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
    fontWeight: "700" 
  },
  ReturnBtnText: { 
    color: "#000", 
    fontWeight: "700"
  },
});
