import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { api } from "../utils/api";
import Header from "../components/Header";
import { useCurrentUser } from "../contexts/AuthContext";
import AppTitle from "../components/AppTitle";

export default function AdminScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const { user, logout } = useCurrentUser();

  const loadUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      Alert.alert(
        "Erreur",
        "Impossible de charger les utilisateurs (accès admin requis)"
      );
    }
  };

  const loadArticles = async () => {
    try {
      const res = await api.get("/articles");
      setArticles(res.data);
    } catch (err) {
      Alert.alert(
        "Erreur",
        "Impossible de charger les articles (accès admin requis)"
      );
    }
  };

  useEffect(() => {
    loadUsers();
    loadArticles();
  }, []);

  const confirmDeleteUser = (id, username) => {
    Alert.alert("Confirmation", `Supprimer l'utilisateur "${username}" ?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => deleteUser(id),
      },
    ]);
  };

  const deleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      loadUsers();
    } catch (err) {
      Alert.alert("Erreur", err.response?.data?.error || "Erreur suppression");
    }
  };

  const confirmDeleteArticle = (id, title) => {
    Alert.alert("Confirmation", `Supprimer l'article "${title}" ?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => deleteArticle(id),
      },
    ]);
  };

  const deleteArticle = async (id) => {
    try {
      await api.delete(`/articles/${id}`);
      loadArticles();
    } catch (err) {
      Alert.alert("Erreur", err.response?.data?.error || "Erreur suppression");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.body}>
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

        <Text style={styles.title}>Utilisateurs</Text>
        {users.map((item) => (
          <View style={styles.userCard} key={item._id}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(item.username || "?")[0].toUpperCase()}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.username}</Text>
              <Text style={styles.userRole}>({item.role})</Text>
            </View>
            <TouchableOpacity
              style={styles.delButton}
              onPress={() => confirmDeleteUser(item._id, item.username)}
            >
              <Text style={styles.delButtonText}>🗑</Text>
            </TouchableOpacity>
          </View>
        ))}

        <Text style={styles.title}>Articles</Text>
        {articles.map((item) => (
          <View style={styles.articleCard} key={item._id}>
            <View style={styles.articleInfo}>
              <Text style={styles.articleTitle}>{item.title}</Text>
              <Text style={styles.articleMeta}>
                par {item.author?.username || "Inconnu"} —{" "}
                {new Date(item.createdAt).toLocaleDateString("fr-FR")} —{" "}
                {item.category?.name || "Sans catégorie"}
              </Text>
            </View>
            <View style={styles.articleActions}>
              <TouchableOpacity
                style={styles.consultButton}
                onPress={() => navigation.navigate("Article", { id: item._id })}
              >
                <Text style={styles.consultButtonText}>👁</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.delButton}
                onPress={() => confirmDeleteArticle(item._id, item.title)}
              >
                <Text style={styles.delButtonText}>🗑</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f8ff",
  },
  body: {
    paddingHorizontal: 0,
    paddingTop: 75,
    paddingBottom: 75,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 16,
    marginTop: 30,
    paddingLeft: 20,
    color: "#3556a8",
    letterSpacing: 0.7,
  },
  list: {
    marginBottom: 12,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#4260b1",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#5b7bfa",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#223a5f",
  },
  userRole: {
    color: "#8593b8",
    fontSize: 13,
    marginTop: 2,
    fontStyle: "italic",
  },
  articleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f6ff",
    marginHorizontal: 16,
    marginBottom: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#4260b1",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 7,
  },
  articleInfo: {
    flex: 1,
  },
  articleTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#31457a",
  },
  articleMeta: {
    color: "#667ca3",
    fontSize: 12,
    marginTop: 2,
  },
  articleActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  consultButton: {
    marginRight: 6,
    backgroundColor: "#49b9ed",
    borderRadius: 7,
    paddingVertical: 7,
    paddingHorizontal: 14,
    elevation: 1,
  },
  consultButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  delButton: {
    marginLeft: 8,
    backgroundColor: "#f05252",
    borderRadius: 7,
    paddingVertical: 7,
    paddingHorizontal: 14,
    elevation: 1,
  },
  delButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    letterSpacing: 0.5,
  },
});
