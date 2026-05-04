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
import { useRef } from "react";
import { auth, firebaseConfig } from "../src/firebaseConfig";
import { signInWithPhoneNumber } from "firebase/auth";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";

export default function MobileVerify() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const recaptchaVerifier = useRef(null);

  const handleSendOTP = async () => {
  if (mobile.length !== 10) {
    Alert.alert("Invalid Number", "Enter valid 10 digit number");
    return;
  }

  try {
    const fullNumber = "+91" + mobile;

    const confirmation = await signInWithPhoneNumber(
      auth,
      fullNumber,
      recaptchaVerifier.current
    );

    router.push({
      pathname: "/otp",
      params: {
        phone: fullNumber,
        verificationId: confirmation.verificationId,
      },
    });

  } catch (err) {
    console.log("SEND OTP ERROR 👉", err.message);
    Alert.alert("Failed to send OTP");
  }
};

  return (
    <LinearGradient colors={["#1e5cff", "#1444dd"]} style={styles.bg}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.centerBox}>
          <View style={styles.iconCircle}>
            <Ionicons name="phone-portrait-outline" size={40} color="white" />
          </View>

          <Text style={styles.title}>Mobile Verification</Text>
          <Text style={styles.subtitle}>
            Enter your mobile number to receive an OTP.
          </Text>

          <View style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              keyboardType="number-pad"
              maxLength={10}
              value={mobile}
              onChangeText={setMobile}
            />

            <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
              <Text style={styles.buttonText}>Send OTP</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safe: {
    flex: 1,
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  centerBox: { alignItems: "center", width: "100%" },
  iconCircle: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 25,
    borderRadius: 50,
    marginBottom: 15,
  },
  title: { fontSize: 18, fontWeight: "700", color: "white" },
  subtitle: { fontSize: 13, color: "white", marginBottom: 20 },
  card: {
    backgroundColor: "white",
    width: "95%",
    borderRadius: 12,
    padding: 20,
    marginTop: 60,
  },
  input: {
    borderWidth: 1,
    borderColor: "#dcdcdc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#1e5cff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "600" },
});

