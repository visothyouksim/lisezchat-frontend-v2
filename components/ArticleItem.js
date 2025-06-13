import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

function formatDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ArticleItem({ article, onPress }) {
  const avatarLetter = article.author?.username
    ? article.author.username[0].toUpperCase()
    : "?";

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.card}
      activeOpacity={0.85}
    >
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarLetter}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {article.title}
          </Text>
          <View style={styles.authorRow}>
            <Text style={styles.author}>
              par {article.author?.username || "Inconnu"}
            </Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.date}>{formatDate(article.createdAt)}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.category}>
              {article.category?.name || "Sans catégorie"}
            </Text>
          </View>
        </View>
      </View>
      <Text numberOfLines={3} style={styles.content}>
        {article.content}
      </Text>
      <View style={styles.bottomRow}>
        <Text style={styles.commentsCount}>
          {article.commentsCount ?? 0} commentaire
          {article.commentsCount === 1 ? "" : "s"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 14,
    marginBottom: 15,
    width: 360,
    maxWidth: "96%",
    shadowColor: "#000",
    shadowOpacity: 0.09,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#4e8cff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    shadowColor: "#4e8cff",
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatarText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 17,
    marginBottom: 1,
    color: "#333",
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  author: {
    color: "#4e8cff",
    fontSize: 13,
    fontWeight: "600",
    marginRight: 3,
  },
  dot: {
    color: "#bbb",
    fontSize: 12,
    marginHorizontal: 2,
    marginTop: 2,
  },
  date: {
    color: "#999",
    fontSize: 12,
    fontWeight: "400",
  },
  content: {
    color: "#444",
    fontSize: 15,
    marginTop: 8,
    lineHeight: 21,
  },
  bottomRow: {
    marginTop: 9,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  commentsCount: {
    color: "#888",
    fontSize: 13,
    fontWeight: "600",
    backgroundColor: "#f4f8ff",
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
});
