import React, { useState, useEffect } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DatabaseService from "../database/DatabaseService";

export default function RecuperarContraseña({ navigation }) {
  const [email, setEmail] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    DatabaseService.initialize();
  }, []);

  const showAlert = (title, message, onClose) => {
    if (Platform.OS === "web") {
      window.alert(`${title}\n\n${message}`);
      if (onClose) onClose();
    } else {
      const buttons = onClose
        ? [{ text: "OK", onPress: onClose }]
        : [{ text: "OK" }];
      Alert.alert(title, message, buttons);
    }
  };

  const goInicioSesion = () => {
    navigation.goBack();
  };

  const onRecover = async () => {
    if (!email.trim()) {
      showAlert(
        "Campo incompleto",
        "Por favor introduce tu correo para recuperar la contraseña."
      );
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email.trim())) {
      showAlert("Correo inválido", "Ingresa un correo electrónico válido.");
      return;
    }

    try {
      const user = await DatabaseService.getUserByEmail(email.trim());

      if (!user) {
        showAlert(
          "Correo no encontrado",
          "No existe ninguna cuenta registrada con ese correo."
        );
        return;
      }

      showAlert(
        "Recuperación",
        `Hemos localizado tu cuenta, ${user.nombre}. Ahora ingresa una nueva contraseña.`,
        () => {
          setShowPasswordForm(true);
        }
      );
    } catch (error) {
      console.log("Error en recuperación:", error);
      showAlert(
        "Error",
        "No se pudo procesar la recuperación. Intenta de nuevo más tarde."
      );
    }
  };

  const onChangePassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      showAlert(
        "Campos incompletos",
        "Ingresa y confirma la nueva contraseña."
      );
      return;
    }

    if (newPassword.trim().length < 6) {
      showAlert(
        "Contraseña débil",
        "La nueva contraseña debe tener al menos 6 caracteres."
      );
      return;
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      showAlert(
        "No coinciden",
        "La contraseña y la confirmación no coinciden."
      );
      return;
    }

    try {
      await DatabaseService.updateUserPasswordByEmail(
        email.trim(),
        newPassword.trim()
      );

      showAlert(
        "Contraseña actualizada",
        "Tu contraseña ha sido modificada correctamente.",
        () => {
          navigation.goBack();
        }
      );
    } catch (error) {
      console.log("Error actualizando contraseña:", error);
      showAlert(
        "Error",
        "No se pudo actualizar la contraseña. Intenta más tarde."
      );
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <TouchableOpacity style={styles.InicioBtn} onPress={goInicioSesion}>
        <Text style={styles.ReturnBtnText}>Regresar</Text>
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
          editable={!showPasswordForm}
        />

        {!showPasswordForm && (
          <TouchableOpacity style={styles.primaryBtn} onPress={onRecover}>
            <Text style={styles.primaryBtnText}>Recuperar</Text>
          </TouchableOpacity>
        )}

        {showPasswordForm && (
          <>
            <Text style={styles.label}>Nueva contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Nueva contraseña"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <Text style={styles.label}>Confirmar contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={onChangePassword}
            >
              <Text style={styles.primaryBtnText}>Actualizar contraseña</Text>
            </TouchableOpacity>
          </>
        )}
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
    marginLeft: 16,
    marginTop: 16,
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
    fontWeight: "700",
  },
  ReturnBtnText: {
    color: "#000",
    fontWeight: "700",
  },
});
