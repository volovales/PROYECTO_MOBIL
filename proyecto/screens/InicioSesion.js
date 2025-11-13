import React, { useState } from "react";
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";
import Home from "./HomeScreen";
import Recuperar from "./RecuperarContraseña";
import Registro from "./Registro";
export default function InicioSesion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarHome, setMostrarHome] = useState(false); 
  const [mostrarRegistro, setMostrarRegistro] = useState(false); 
  const [mostrarOlvContra, setMostrarOlvContra] = useState(false); 
  
  const onContinue = () => {
    if (email.trim() === "" || password.trim() === "") {
      Alert.alert("Campo vacío", "Ingresa tu correo electrónico y contraseña.");
      return;
    }

    Alert.alert("Inicio de sesión", "Gracias por iniciar sesión.", [
      {
        text: "OK",
        onPress: () => setMostrarHome(true),
      },
    ]);
  };
  if (mostrarHome) {
    return <Home />;
  }

  const goRecuperar = () => {
     Alert.alert( "Recuperar Contraseña", "Navegando a Recuperar Contraseña.", [
      {
        text: "OK",
        onPress: () => setMostrarOlvContra(true),
      },
    ]);
  };
  if (mostrarOlvContra) {
    return <Recuperar />;
  }

  const goRegistro = () => {
     Alert.alert( "Registro", "Navegando a Registro.", [
      {
        text: "OK",
        onPress: () => setMostrarRegistro(true),
      },
    ]);
  };
  if (mostrarRegistro) {
    return <Registro />;
  }

 
  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.headerTitle}>Ahorra+ App</Text>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Inicia Sesión</Text>
        <Text style={styles.subtitle}>para continuar</Text>

        <Text style={styles.sectionTitle}>Inicia en tu cuenta</Text>
        <Text style={styles.helperText}>
          Ingresa tu correo electrónico{"\n"}
        </Text>

        <TextInput
          style={[styles.input, { marginTop: 12 }]}
          placeholder="correoelectrónico@dominio.com"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.helperText}>Ingresa tu contraseña{"\n"}</Text>
        <TextInput
          style={[styles.input, { marginTop: 12 }]}
          placeholder="************"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.primaryBtn} onPress={onContinue}>
          <Text style={styles.primaryBtnText}>Continuar</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.primaryBtn} onPress={goRecuperar}>
          <Text style={styles.primaryBtnText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorDot}>o</Text>
          <View style={styles.separatorLine} />
        </View>

        <TouchableOpacity
          style={styles.socialBtn}
          onPress={() => Alert.alert("Google", "Continuar con Google")}
        >
          <View style={styles.socialContent}>
            <Text style={styles.socialText}>Continuar con Google</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialBtn}
          onPress={() => Alert.alert("Apple", "Continuar con Apple")}
        >
          <View style={styles.socialContent}>
            <Text style={styles.socialText}>Continuar con Apple</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.terms}>
          Al hacer clic en continuar, aceptas nuestros{"\n"}
          <Text>Términos de servicio</Text> y{" "}
          <Text>Política de privacidad</Text>.
        </Text>

        {goRegistro ? (
          <Text style={styles.switchAuth}>
            ¿No tienes cuenta?{" "}
            <Text style={styles.link} onPress={goRegistro}>
              Regístrate
            </Text>
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  scroll: { flexGrow: 1, padding: 24 },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "700",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
  helperText: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 6,
    lineHeight: 18,
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
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  separatorContainer: {
    marginVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  separatorDot: {
    marginHorizontal: 8,
    color: "#6B7280",
    fontWeight: "500",
  },
  socialBtn: {
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  socialContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  socialText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  terms: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 12,
    marginTop: 14,
    lineHeight: 18,
  },
  switchAuth: { textAlign: "center", marginTop: 16, color: "#374151" },
});
