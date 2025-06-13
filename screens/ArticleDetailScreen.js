import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { api } from "../utils/api";
import Header from "../components/Header";
import { useCurrentUser } from "../contexts/AuthContext";
import AppTitle from "../components/AppTitle";

export default function ArticleDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { user, logout } = useCurrentUser();

  // Droits d'accès
  const isAuthor = user && article && user._id === article.author?._id;
  const isAdmin = user && user.role === "admin";

  // Charger la liste des catégories
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      setCategories([]);
    }
  };

  // Charger l'article
  const fetchArticle = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/articles/${id}`);
      setArticle(res.data);
    } catch (err) {
      setArticle(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${id}`);
      setComments(res.data);
    } catch {
      setComments([]);
    }
  };

  useEffect(() => {
    fetchArticle();
    fetchCategories();
    fetchComments();
  }, []);

  const handleEdit = async () => {
    try {
      await api.put(`/articles/${id}`, {
        title: newTitle,
        content: newContent,
        category: selectedCategory || null,
      });
      setEditing(false);
      fetchArticle();
    } catch (err) {
      Alert.alert("Erreur", err.response?.data?.error || "Erreur");
    }
  };

  const handleDelete = async () => {
    Alert.alert("Supprimer ?", "Confirmer suppression ?", [
      { text: "Annuler" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/articles/${id}`);
            navigation.goBack();
          } catch (err) {
            Alert.alert("Erreur", err.response?.data?.error || "Erreur");
          }
        },
      },
    ]);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await api.post(`/comments/${id}`, { content: newComment });
      setNewComment("");
      fetchComments();
    } catch (err) {
      Alert.alert("Erreur", err.response?.data?.error || "Erreur");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4e8cff" />
      </View>
    );
  }

  if (!article) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "red" }}>Article introuvable.</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.editButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (editing) {
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
          <View style={styles.card}>
            <TextInput
              value={newTitle}
              onChangeText={setNewTitle}
              style={styles.input}
              placeholder="Titre"
            />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Aucune catégorie" value="" />
                {categories.map((cat) => (
                  <Picker.Item key={cat._id} label={cat.name} value={cat._id} />
                ))}
              </Picker>
            </View>
            <TextInput
              value={newContent}
              onChangeText={setNewContent}
              style={[styles.input, { height: 120 }]}
              placeholder="Contenu"
              multiline
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                <Text style={styles.editButtonText}>Enregistrer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.delButton}
                onPress={() => setEditing(false)}
              >
                <Text style={styles.delButtonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
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

          {/* Article card */}
          <View style={styles.card}>
            <Text style={styles.title}>{article.title}</Text>
            <Text style={styles.author}>
              par {article.author?.username || "Inconnu"}
            </Text>
            {article.category && (
              <Text style={styles.category}>
                Catégorie : {article.category.name}
              </Text>
            )}
            <Text style={styles.content}>{article.content}</Text>
            <View style={styles.buttonRow}>
              {isAuthor && (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    setNewTitle(article.title);
                    setNewContent(article.content);
                    setSelectedCategory(article.category?._id || "");
                    setEditing(true);
                  }}
                >
                  <Text style={styles.editButtonText}>Modifier</Text>
                </TouchableOpacity>
              )}
              {(isAuthor || isAdmin) && (
                <TouchableOpacity
                  style={styles.delButton}
                  onPress={handleDelete}
                >
                  <Text style={styles.delButtonText}>Supprimer</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Commentaires */}
          <View style={styles.commentSection}>
            <Text style={styles.commentTitle}>Commentaires</Text>
            {comments.length === 0 ? (
              <Text style={styles.noComment}>
                Aucun commentaire pour l’instant.
              </Text>
            ) : (
              comments.map((item) => (
                <View style={styles.commentCard} key={item._id}>
                  <View style={styles.commentAvatar}>
                    <Text style={styles.commentAvatarText}>
                      {(item.author?.username || "?")[0].toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.commentBubble}>
                    <Text style={styles.commentAuthor}>
                      {item.author?.username || "?"}
                    </Text>
                    <Text style={styles.commentContent}>{item.content}</Text>
                    <Text style={styles.commentDate}>
                      {new Date(item.createdAt).toLocaleString("fr-FR")}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        {/* Input commentaire toujours visible en bas */}
        {user && (
          <View style={styles.commentInputRow}>
            <TextInput
              style={styles.commentInput}
              placeholder="Votre commentaire…"
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity
              style={styles.addCommentBtn}
              onPress={handleAddComment}
            >
              <Text style={styles.addCommentBtnText}>Envoyer</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
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
    paddingHorizontal: 0,
    paddingTop: 55,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f8ff",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    marginVertical: 24,
    width: "90%",
    elevation: 3,
    shadowColor: "#3556a8",
    shadowOpacity: 0.13,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 18,
  },
  title: {
    fontWeight: "bold",
    fontSize: 26,
    color: "#3556a8",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: 0.7,
  },
  author: {
    backgroundColor: "#e6f0ff",
    color: "#3556a8",
    alignSelf: "center",
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 14,
    fontSize: 14,
    marginBottom: 14,
    fontWeight: "bold",
  },
  category: {
    backgroundColor: "#f2ffe6",
    color: "#5b885e",
    alignSelf: "center",
    paddingVertical: 3,
    paddingHorizontal: 13,
    borderRadius: 12,
    fontSize: 13,
    marginBottom: 14,
    fontWeight: "bold",
  },
  content: {
    fontSize: 18,
    color: "#223",
    lineHeight: 26,
    marginBottom: 22,
    textAlign: "left",
  },
  input: {
    borderWidth: 1,
    borderColor: "#b6c6e3",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fafdff",
    fontSize: 16,
    shadowColor: "#3556a8",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 2,
  },
  pickerContainer: {
    backgroundColor: "#fafdff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#b6c6e3",
    marginBottom: 16,
    marginTop: 6,
    paddingHorizontal: 6,
    elevation: 2,
  },
  picker: {
    height: 60,
    width: "100%",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 15,
  },
  editButton: {
    backgroundColor: "#49b9ed",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginRight: 8,
    elevation: 2,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    letterSpacing: 0.4,
  },
  delButton: {
    backgroundColor: "#f05252",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginLeft: 8,
    elevation: 2,
  },
  delButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    letterSpacing: 0.4,
  },
  commentSection: {
    marginTop: 24,
    paddingHorizontal: 6,
    width: "100%",
  },
  commentTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#3556a8",
    marginBottom: 14,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  commentList: {
    marginBottom: 8,
  },
  commentCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
    marginHorizontal: 15,
    paddingVertical: 6,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#a2c7ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    elevation: 1,
    shadowColor: "#4e8cff",
    shadowOpacity: 0.12,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  commentAvatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 0.5,
  },
  commentBubble: {
    flex: 1,
    backgroundColor: "#f7fafd",
    borderRadius: 16,
    paddingVertical: 9,
    paddingHorizontal: 14,
    elevation: 1,
    shadowColor: "#b9d1f7",
    shadowOpacity: 0.11,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  commentAuthor: {
    fontWeight: "bold",
    color: "#4260b1",
    fontSize: 15,
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  commentContent: {
    fontSize: 16,
    color: "#223",
    marginBottom: 4,
  },
  commentDate: {
    fontSize: 12,
    color: "#92a2bb",
    textAlign: "right",
  },
  noComment: {
    color: "#a3b1ce",
    fontStyle: "italic",
    marginVertical: 12,
    textAlign: "center",
  },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: "100%",
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#b6c6e3",
    borderRadius: 8,
    padding: 11,
    backgroundColor: "#fff",
    fontSize: 16,
    marginRight: 8,
    marginBottom: 50,
  },
  addCommentBtn: {
    backgroundColor: "#4e8cff",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    elevation: 2,
    marginBottom: 50,
  },
  addCommentBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    letterSpacing: 0.2,
  },
  scrollContent: {
    alignItems: "center",
    paddingTop: 0,
  },
});
