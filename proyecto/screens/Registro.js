// Registro.jsx
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

export default function Registro({ goLogin }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onRegister = () => {
    if (!fullName || !email || !username || !password) {
      Alert.alert("Campos incompletos", "Llena todos los campos para continuar.");
      return;
    }
    Alert.alert("Registro", "¡Cuenta creada (demo)!");
  };

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.headerTitle}>Ahorra+ App</Text>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        
        <Text style={styles.title}>Registrarse</Text>

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
          onPress={() => Alert.alert("Apple", "Continuar con Apple ")}
        >
          <View style={styles.socialContent}>
            <Text style={styles.socialText}>Continuar con Apple</Text>
          </View>
        </TouchableOpacity>
        

        <TouchableOpacity style={styles.primaryBtn} onPress={onRegister}>
          <Text style={styles.primaryBtnText}>Registrarse</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  scroll: { flexGrow: 1, padding: 24 },
  title: { fontSize: 28, fontWeight: "700", textAlign: "center", marginBottom: 16 },
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
        fontWeight: "700" 
    },
  input: {
    height: 44,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  socialBtn: {
    height: 44,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    marginTop: 14,
  },
  socialContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  socialIcon: { fontSize: 16, marginRight: 8 },
  socialText: { fontSize: 14, fontWeight: "600" },
  smallText: { fontSize: 12, color: "#6B7280", textAlign: "center", marginTop: 10 },
  link: { textDecorationLine: "underline" },
  primaryBtn: {
    height: 46,
    borderRadius: 10,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  primaryBtnText: { color: "#fff", fontWeight: "700" },
});
