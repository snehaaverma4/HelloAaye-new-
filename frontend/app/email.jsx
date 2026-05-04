// app/email.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { useRouter } from "expo-router";
import { auth } from "../src/firebaseConfig";

const BASE_URL = "http://192.168.0.102:5000"; 

export default function EmailVerify() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendEmailOtp = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter email");
      return;
    }

    if (!auth.currentUser) {
      Alert.alert("Error", "User not logged in");
      return;
    }

    try {
      setLoading(true);
      console.log("Sending UID 👉", auth.currentUser.uid);
      await axios.post(`${BASE_URL}/api/auth/send-email-otp`, {
        email,
        uid: auth.currentUser.uid,
      });

      Alert.alert("Success", "OTP sent to email");

      router.push({
        pathname: "/email_otp",
        params: { email },
      });

    } catch (err) {
      console.log("EMAIL OTP ERROR:", err.response?.data || err.message);

      Alert.alert(
        "Error",
        err.response?.data?.message || "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#1e5cff", "#1444dd"]} style={styles.bg}>
      <View style={styles.container}>
        <Text style={styles.title}>Verify Email</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSendEmailOtp}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Sending..." : "Send OTP"}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: "white",
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 14,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#1e5cff",
    fontWeight: "700",
  },
});

