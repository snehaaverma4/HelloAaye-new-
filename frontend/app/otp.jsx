import React, { useState, useEffect, useRef } from "react";
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
import { useRouter, useLocalSearchParams } from "expo-router";
import { auth } from "../src/firebaseConfig";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";

export default function MobileOTP() {
  const router = useRouter();
  const { phone, verificationId } = useLocalSearchParams();  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const inputRef = useRef(null);

  useEffect(() => {
    if (timer === 0) return;
    const i = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(i);
  }, [timer]);

  const handleVerify = async () => {
  try {
    const credential = PhoneAuthProvider.credential(
      verificationId,
      otp
    );

    await signInWithCredential(auth, credential);

    Alert.alert("Login Successful");
    router.replace("/email");

  } catch (err) {
    console.log("VERIFY ERROR 👉", err.message);
    Alert.alert("Invalid OTP");
  }
};

  return (
    <LinearGradient colors={["#1e5cff", "#1444dd"]} style={styles.bg}>
      <SafeAreaView style={styles.safe}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>

        <View style={styles.centerWrapper}>
          <View style={styles.topSection}>
            <View style={styles.iconCircle}>
              <Text style={styles.icon}>🛡️</Text>
            </View>

            <Text style={styles.title}>Verify Mobile Number</Text>
            <Text style={styles.subtitle}>OTP sent to {phone}</Text>
          </View>

          <View style={styles.card}>
            <TouchableOpacity
              style={styles.otpContainer}
              onPress={() => inputRef.current.focus()}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <View key={i} style={styles.otpBox}>
                  <Text style={styles.otpText}>{otp[i] || ""}</Text>
                </View>
              ))}
            </TouchableOpacity>

            <TextInput
              ref={inputRef}
              style={styles.hiddenInput}
              keyboardType="numeric"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
            />

            <Text style={styles.resendText}>Use OTP: 000000</Text>

            <TouchableOpacity style={styles.verifyBtn} onPress={handleVerify}>
              <Text style={styles.verifyText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safe: { flex: 1 },
  backButton: { position: "absolute", top: 37, left: 20 },
  centerWrapper: { flex: 1, alignItems: "center", paddingTop: 80 },
  topSection: { alignItems: "center", marginBottom: 20 },
  iconCircle: {
    width: 65,
    height: 65,
    borderRadius: 50,
    backgroundColor: "#2C6BFF40",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: { fontSize: 26 },
  title: { fontSize: 18, color: "#fff", fontWeight: "700" },
  subtitle: { fontSize: 14, color: "#e8ecff" },
  card: {
    backgroundColor: "#fff",
    width: "95%",
    borderRadius: 14,
    padding: 22,
    marginTop: 60,
    alignItems: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 15,
  },
  otpBox: {
    width: 42,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#f5f5f7",
    justifyContent: "center",
    alignItems: "center",
  },
  otpText: { fontSize: 18, fontWeight: "600" },
  hiddenInput: { opacity: 0, position: "absolute" },
  resendText: { fontSize: 14, marginBottom: 15, color: "#1E5BFF" },
  verifyBtn: {
    backgroundColor: "#1e5cff",
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  verifyText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});

