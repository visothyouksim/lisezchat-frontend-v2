import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Header({
  user,
  onLogout,
  onNavigateHome,
  onNavigateAdmin,
  onNavigateRegister,
  onNavigateLogin,
}) {
  return (
    <View style={styles.header}>
      {/* Navbar */}
      <View style={styles.navbar}>
        {/* Accueil */}
        <TouchableOpacity onPress={onNavigateHome} style={styles.navBtn}>
          <Text style={styles.navText}>Accueil</Text>
        </TouchableOpacity>

        {/* Administration (admin seulement) */}
        {user?.role === "admin" && (
          <TouchableOpacity onPress={onNavigateAdmin} style={styles.navBtn}>
            <Text style={styles.navText}>Administration</Text>
          </TouchableOpacity>
        )}

        {/* Inscription / Connexion / Déconnexion */}
        {!user ? (
          <>
            <TouchableOpacity
              onPress={onNavigateRegister}
              style={styles.navBtn}
            >
              <Text style={styles.navText}>Inscription</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onNavigateLogin} style={styles.navBtn}>
              <Text style={styles.navText}>Connexion</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={onLogout} style={styles.navBtn}>
            <Text style={[styles.navText, styles.logout]}>Déconnexion</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#4e8cff",
    paddingTop: 8,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.11,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    width: "100%",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 34,
    marginTop: 3,
  },
  navBtn: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 7,
  },
  navText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.6,
    textAlign: "center",
  },
  logout: {
    color: "#ffd4d4",
  },
});


