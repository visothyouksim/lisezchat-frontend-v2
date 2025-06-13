import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { api } from "../utils/api";
import Header from "../components/Header";
import { useCurrentUser } from "../contexts/AuthContext";
import AppTitle from "../components/AppTitle";

export default function NewArticleScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const { user, logout } = useCurrentUser();

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  const addArticle = async () => {
    try {
      await api.post("/articles", { title, content, category });
      navigation.goBack();
    } catch (err) {
      Alert.alert("Erreur", err.response?.data?.error || "Erreur");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.body}>
        <AppTitle />
        <Header
          user={user}
          onLogout={() => {
            logout();
            navigation.replace("Accueil");
          }}
          onNavigateHome={() => navigation.navigate("Accueil")}
          onNavigateAdmin={() => navigation.navigate("Admin")}
          onNavigateRegister={() => navigation.navigate("Inscription")}
          onNavigateLogin={() => navigation.navigate("Connexion")}
        />
        <TextInput
          placeholder="Titre"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            style={styles.picker}
            onValueChange={(val) => setCategory(val)}
          >
            <Picker.Item label="Choisissez une catégorie" value="" />
            {categories.map((cat) => (
              <Picker.Item key={cat._id} label={cat.name} value={cat._id} />
            ))}
          </Picker>
        </View>
        <TextInput
          placeholder="Contenu"
          value={content}
          onChangeText={setContent}
          multiline
          style={[styles.input, { height: 120 }]}
        />

        <TouchableOpacity style={styles.publishButton} onPress={addArticle}>
          <Text style={styles.publishButtonText}>Publier</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 75,
    paddingBottom: 75,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    marginTop: 25,
    paddingHorizontal: 10,
    marginHorizontal: 20,
  },
  publishButton: {
    alignSelf: "center",
    backgroundColor: "#4e8cff",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
    elevation: 2,
  },
  publishButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
    marginTop: 25,
    paddingHorizontal: 10,
    marginHorizontal: 20,
  },
  picker: {
    height: 55,
    width: "100%",
  },
});
