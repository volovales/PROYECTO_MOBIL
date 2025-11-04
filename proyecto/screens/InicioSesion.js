import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function InicioSesion({ goRegistro }) {
  const [email, setEmail] = useState("");

  const onContinue = () => {
    if (!email.trim()) {
      Alert.alert("Campo vacío", "Ingresa tu correo electrónico.");
      return;
    }
    Alert.alert("Continuar", `Intento de inicio con: ${email}`);
  };

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.headerTitle}>Ahorra+ App</Text>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        
        <Text style={styles.title}>Inicia Sesion</Text>
        <Text style={styles.subtitle}>para continuar</Text>

        <Text style={styles.sectionTitle}>Inicia en tu cuenta</Text>
        <Text style={styles.helperText}>
          Ingresa tu correo electrónico{"\n"}</Text>

        <TextInput
          style={[styles.input, { marginTop: 12 }]}
          placeholder="correoelectrónico@dominio.com"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity style={styles.primaryBtn} onPress={onContinue}>
          <Text style={styles.primaryBtnText}>Continuar</Text>
        </TouchableOpacity>

        {/* Separador */}
        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorDot}>o</Text>
          <View style={styles.separatorLine} />
        </View>

        {/* BOTÓN GOOGLE */}
        <TouchableOpacity
          style={styles.socialBtn}
          onPress={() => Alert.alert("Google", "Continuar con Google (demo)")}
        >
          <View style={styles.socialContent}>
            <Text style={styles.socialText}>Continuar con Google</Text>
          </View>
        </TouchableOpacity>

        {/* BOTÓN APPLE */}
        <TouchableOpacity
          style={styles.socialBtn}
          onPress={() => Alert.alert("Apple", "Continuar con Apple (demo)")}
        >
          <View style={styles.socialContent}>
            <Text style={styles.socialText}>Continuar con Apple</Text>
          </View>
        </TouchableOpacity>

        {/* Texto inferior */}
        <Text style={styles.terms}>
          Al hacer clic en continuar, aceptas nuestros{"\n"}
          <Text style={styles.link}>Términos de servicio</Text> y{" "}
          <Text style={styles.link}>Política de privacidad</Text>.
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
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 4,
  },
   headerTitle: { 
        flex: 1, 
        textAlign: "center", 
        fontSize: 18, 
        fontWeight: "700" 
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

  socialContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  socialIcon: {
    fontSize: 16,
    marginRight: 8,
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
  link: { textDecorationLine: "underline" },
  switchAuth: { textAlign: "center", marginTop: 16, color: "#374151" },
});
