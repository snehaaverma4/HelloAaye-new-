// app/email_otp.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { auth } from "../src/firebaseConfig";


export default function EmailOTPScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams(); // <-- get email from previous screen

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);

  const [timer, setTimer] = useState(30);
  const [resendEnabled, setResendEnabled] = useState(false);

  // TIMER
  useEffect(() => {
    if (timer === 0) {
      setResendEnabled(true);
      return;
    }
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
  if (!resendEnabled) return;

  try {

    console.log("RESENDING OTP...");

    await axios.post(
      `${BASE_URL}/api/auth/send-email-otp`,
      {
        email: email,
        uid: auth.currentUser.uid,
      }
    );

    alert("OTP resent successfully");

    setTimer(30);
    setResendEnabled(false);
    setOtp(["", "", "", "", "", ""]);
    inputs.current[0].focus();

  } catch (err) {
    console.log("RESEND ERROR 👉", err.response?.data || err.message);
    alert("Failed to resend OTP");
  }
};

  const handleOtpChange = (text, index) => {
    if (/^\d$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (index < 5) {
        inputs.current[index + 1].focus();
      }
    } else if (text === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const BASE_URL = "http://192.168.0.102:5000";
const verifyEmailOtp = async () => {
  const finalOtp = otp.join("");

  console.log("UID 👉", auth.currentUser.uid);
  console.log("OTP 👉", finalOtp);

  try {
    const res = await axios.post(
      `${BASE_URL}/api/auth/verify-email-otp`,
      {
        uid: auth.currentUser.uid,
        otp: finalOtp,
      }
    );

    console.log("RESPONSE 👉", res.data);

    if (res.data.success) {
      router.push("/fullname");
    } else {
      alert(res.data.message || "Invalid OTP");
    }

  } catch (err) {
    console.log("FULL ERROR 👉", err);
    alert("Verification failed");
  }
};

  return (
    <LinearGradient colors={["#1e5cff", "#1444dd"]} style={styles.bg}>
      <SafeAreaView style={styles.safe}>

        {/* BACK BUTTON */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>

        {/* MAIN CONTENT (same layout as otp.jsx) */}
        <View style={styles.centerWrapper}>

          <View style={styles.topSection}>
            <View style={styles.iconCircle}>
              <Text style={styles.icon}>✉️</Text>
            </View>

            <Text style={styles.title}>Verify Email</Text>
            <Text style={styles.subtitle}>OTP sent to {email}</Text>
          </View>

          {/* WHITE CARD */}
          <View style={styles.card}>
            <View style={styles.otpRow}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputs.current[index] = ref)}
                  style={styles.otpInput}
                  keyboardType="numeric"
                  maxLength={1}
                  onChangeText={(t) => handleOtpChange(t, index)}
                  value={digit}
                />
              ))}
            </View>

            {/* RESEND TIMER */}
            <TouchableOpacity disabled={!resendEnabled} onPress={handleResend}>
              <Text
                style={[
                  styles.resend,
                  { color: resendEnabled ? "#1E5BFF" : "#9ea3b5" },
                ]}
              >
                {resendEnabled
                  ? "Resend OTP"
                  : `Didn't receive OTP? Resend in ${timer}s`}
              </Text>
            </TouchableOpacity>

            {/* VERIFY BUTTON */}
            <TouchableOpacity style={styles.verifyBtn} onPress={verifyEmailOtp}>
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

  backButton: {
    position: "absolute",
    top: 37,
    left: 20,
    zIndex: 99,
  },

  centerWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 80,
    paddingHorizontal: 20,
  },

  topSection: {
    alignItems: "center",
    marginBottom: 20,
  },

  iconCircle: {
    width: 65,
    height: 65,
    borderRadius: 50,
    backgroundColor: "#2C6BFF40",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  icon: { fontSize: 30 },

  title: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 14,
    color: "#e8ecff",
    marginTop: 5,
  },

  card: {
    width: "95%",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 25,
    paddingHorizontal: 20,
    marginTop: 60,
    alignItems: "center",
  },

  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 20,
  },

  otpInput: {
    width: 45,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#f5f5f7",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },

  resend: {
    fontSize: 14,
    marginBottom: 20,
  },

  verifyBtn: {
    backgroundColor: "#1e5cff",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  verifyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  footer: {
    color: "#e8e8e8",
    textAlign: "center",
    fontSize: 12,
    marginTop: 10,
  },
});
