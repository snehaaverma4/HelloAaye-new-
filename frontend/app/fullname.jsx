// app/full_name.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import axios from "axios";
import { auth } from "../src/firebaseConfig";

var BASE_URL = "http://192.168.0.102:5000";


export default function FullNameScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");

const handleNext = async () => {
  if (fullName.trim().length < 3) {
    alert("Please enter your full PAN Card name.");
    return;
  }

  try {

await axios.post(
  BASE_URL + "/api/profile/fullname",
  { fullName: fullName.trim() },
  {
    headers: {
      Authorization: "Bearer DEV_TOKEN",
    },
  }
);


    router.push("/pan");
  } catch (err) {
    console.log("Fullname save error:", err);
    alert("Error while saving name. Please try again.");
  }
};


  return (
    <LinearGradient colors={["#1e5cff", "#1444dd"]} style={styles.bg}>
      <SafeAreaView style={styles.safe}>

        {/* BACK ARROW */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>

        <View style={styles.centerBox}>

          {/* ICON */}
          <View style={styles.iconCircle}>
            <Ionicons name="person-outline" size={42} color="#fff" />
          </View>

          {/* TITLE */}
          <Text style={styles.title}>Full Name</Text>
          <Text style={styles.subtitle}>
            Enter your full name as per your PAN Card.
          </Text>

          {/* CARD — EXACT LIKE index.jsx */}
          <View style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="Full Name (as per PAN Card)"
              placeholderTextColor="#aaa"
              value={fullName}
              onChangeText={setFullName}
            />

            <Text style={styles.hint}>Must match PAN Card name.</Text>

            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>

          

        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },

  safe: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 80, // SAME AS index.jsx
  },

  backButton: {
    position: "absolute",
    top: 37,
    left: 20,
    zIndex: 99,
  },

  centerBox: {
    alignItems: "center",
    width: "100%",
  },

  iconCircle: {
    backgroundColor: "rgba(255,255,255,0.2)", // SAME STYLE AS index.jsx
    padding: 25,
    borderRadius: 50,
    marginBottom: 15,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 13,
    color: "white",
    opacity: 0.9,
    marginBottom: 30, // SAME SPACING
  },

  // CARD EXACT POSITION LIKE index.jsx
  card: {
    backgroundColor: "white",
    width: "95%",
    borderRadius: 12,
    padding: 20,
    marginTop: 60, // EXACT SAME AS MOBILE SCREEN
    alignSelf: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#dcdcdc",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 10,
  },

  hint: {
    fontSize: 12,
    color: "#666",
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#1e5cff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },

  footer: {
    marginTop: 25,
    color: "white",
    textAlign: "center",
    fontSize: 12,
    opacity: 0.9,
  },
});
