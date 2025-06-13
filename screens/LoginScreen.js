import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { api } from "../utils/api";
import { useCurrentUser } from "../contexts/AuthContext";
import AppTitle from "../components/AppTitle";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useCurrentUser();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      await login(res.data.token, res.data.user);
      navigation.replace("Accueil");
    } catch (err) {
      Alert.alert("Erreur", err.response?.data?.error || "Erreur de connexion");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.safe}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <AppTitle />
        <Text style={styles.title}>Connexion</Text>
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Mot de passe"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.btn} onPress={handleLogin}>
          <Text style={styles.btnText}>Se connecter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnOutline]}
          onPress={() => navigation.navigate("Inscription")}
        >
          <Text style={[styles.btnText, styles.btnTextOutline]}>
            Créer un compte
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#e7f0fd",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 28,
    borderRadius: 20,
    shadowColor: "#3556a8",
    shadowOpacity: 0.09,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
    color: "#3556a8",
    letterSpacing: 0.5,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#b6c6e3",
    borderRadius: 10,
    padding: 13,
    marginBottom: 17,
    fontSize: 16,
    backgroundColor: "#fafdff",
  },
  btn: {
    width: "100%",
    backgroundColor: "#4e8cff",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
    elevation: 1,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 0.4,
  },
  btnOutline: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#4e8cff",
  },
  btnTextOutline: {
    color: "#4e8cff",
  },
});
