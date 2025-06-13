import React, { useEffect, useState } from "react";
import ArticleItem from "../components/ArticleItem";
import Header from "../components/Header";
import { removeToken } from "../utils/auth";
import { useCurrentUser } from "../contexts/AuthContext";
import AppTitle from "../components/AppTitle";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { api } from "../utils/api";

export default function HomeScreen({ navigation }) {
  const [articles, setArticles] = useState([]);
  const { user, logout } = useCurrentUser();

  const loadArticles = async () => {
    try {
      const res = await api.get("/articles");
      setArticles(res.data.reverse());
    } catch (err) {
      setArticles([]);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadArticles);
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.body}>
        <AppTitle />
        <Header
          user={user}
          onLogout={() => {
            logout();
            navigation.replace("Accueil");
          }}
          onNavigateHome={() => navigation.navigate("Accueil")}
          onNavigateAdmin={() => navigation.navigate("Administration")}
          onNavigateRegister={() => navigation.navigate("Inscription")}
          onNavigateLogin={() => navigation.navigate("Connexion")}
        />

        <FlatList
          contentContainerStyle={styles.flatListContent}
          data={articles}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ArticleItem
              article={item}
              onPress={() => navigation.navigate("Article", { id: item._id })}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>Aucun article disponible.</Text>
          }
          showsVerticalScrollIndicator={false}
        />

        {user && (
          <TouchableOpacity
            style={[styles.addButton, { marginTop: 20 }]}
            onPress={() => navigation.navigate("Nouvel Article")}
          >
            <Text style={styles.addButtonText}>AJOUTER UN ARTICLE</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f8ff",
  },
  body: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 0,
    paddingTop: 75,
    paddingBottom: 75,
  },
  addButton: {
    width: "94%",
    marginTop: 14,
    marginBottom: 10,
    backgroundColor: "#4e8cff",
    borderRadius: 8,
    alignSelf: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  addButtonText: {
    color: "#fff",
    textAlign: "center",
    paddingVertical: 13,
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  flatListContent: {
    marginTop: 20,
    alignItems: "center",
    paddingBottom: 22,
    width: "100%",
  },
  empty: {
    textAlign: "center",
    marginTop: 30,
    color: "#888",
    fontSize: 16,
  },
});
