import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import axios from "axios";
// import { auth } from "../src/firebaseConfig";

var BASE_URL = "http://192.168.0.102:5000";


export default function PANCardScreen() {
  const router = useRouter();
  const [panNumber, setPanNumber] = useState("");

  const handleNext = async () => {
  const cleanPan = panNumber.trim().toUpperCase();

  if (cleanPan.length !== 10) {
    alert("Please enter a valid PAN number.");
    return;
  }

  try {
    // const user = auth.currentUser;
    // if (!user) {
    //   alert("Session expired, please login again.");
    //   return;
    // }

    // const idToken = await user.getIdToken();

await axios.post(
  BASE_URL + "/api/profile/pan",
  { panNumber: cleanPan },
  {
    headers: {
      Authorization: "Bearer DEV_TOKEN",
    },
  }
);



    router.push("/aadhar");
  } catch (err) {
    console.log("PAN save error:", err);
    alert("Error while saving PAN. Please try again.");
  }
};

  return (
    <LinearGradient colors={["#1e5cff", "#1444dd"]} style={styles.bg}>
      <SafeAreaView style={styles.safe}>
        
        {/* BACK BUTTON */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>

        <View style={styles.centerBox}>
          
          {/* ICON CIRCLE */}
          <View style={styles.iconCircle}>
            <Ionicons name="card-outline" size={40} color="white" />
          </View>

          <Text style={styles.title}>PAN Card</Text>
          <Text style={styles.subtitle}>
            Please enter your PAN number.
          </Text>

          {/* WHITE CARD BOX */}
          <View style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="PAN Number (ABCDE1234F format)"
              placeholderTextColor="#aaa"
              value={panNumber}
              onChangeText={setPanNumber}
              autoCapitalize="characters"
            />

            {/* NEXT BUTTON */}
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
    paddingTop: 20,
  },

  backBtn: {
    width: "100%",
     
    top:37,
    left:20,
    zIndex:99
  },

  centerBox: {
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },

  iconCircle: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 25,
    borderRadius: 50,
    marginBottom: 15,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginTop: 10,
  },

  subtitle: {
    fontSize: 13,
    color: "white",
    opacity: 0.9,
    marginBottom: 20,
    textAlign: "center",
  },

  card: {
    backgroundColor: "white",
    width: "95%",
    borderRadius: 12,
    padding: 20,
    marginTop: 40,
    alignSelf: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#dcdcdc",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 15,
  },

  button: {
    backgroundColor: "#1e5cff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },

  footer: {
    marginTop: 30,
    color: "white",
    textAlign: "center",
    fontSize: 12,
    opacity: 0.9,
  },
});
