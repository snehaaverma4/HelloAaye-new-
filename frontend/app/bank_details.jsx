// app/bankdetails.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function BankDetails() {
  const router = useRouter();

  const [account, setAccount] = useState("");
  const [confirmAccount, setConfirmAccount] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [bankName, setBankName] = useState("");

  const handleSubmit = () => {
    if (!account || !confirmAccount || !ifsc) {
      Alert.alert("Missing Details", "Please fill all the fields.");
      return;
    }

    if (account !== confirmAccount) {
      Alert.alert("Mismatch", "Account numbers do not match.");
      return;
    }

   

    Alert.alert(
      "Success",
      "Submitted!",
      [
        {
          text: "OK",
          onPress: () => router.push("/dashboard"),
        },
      ],
      { cancelable: false }
    );
  };
  

  return (
    <LinearGradient colors={["#1e5cff", "#1444dd"]} style={styles.bg}>
      <SafeAreaView style={styles.safe}>

        {/* BACK ARROW */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>

        {/* CENTER BOX */}
        <View style={styles.centerBox}>

          {/* ICON */}
          <View style={styles.iconCircle}>
            <Ionicons name="business-outline" size={40} color="white" />
          </View>

          {/* TITLE */}
          <Text style={styles.title}>Bank Details</Text>
          <Text style={styles.subtitle}>
            Enter your bank account details for verification.
          </Text>

          {/* WHITE CARD (SAME AS index.jsx) */}
          <View style={styles.card}>

            <Text style={styles.label}>Account Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Account Number"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              value={account}
              onChangeText={setAccount}
            />

            <Text style={styles.label}>Confirm Account Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Re-enter Account Number"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              value={confirmAccount}
              onChangeText={setConfirmAccount}
            />

            <Text style={styles.label}>IFSC Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter IFSC Code (e.g., SBIN0001234)"
              placeholderTextColor="#999"
              autoCapitalize="characters"
              value={ifsc}
              onChangeText={(text) => {
                setIfsc(text.toUpperCase());
                
                // Simulated IFSC fetch
                if (text.length === 11) {
                  setBankName("Auto-fetched Bank Name");
                }
              }}
            />

            <Text style={styles.label}>Bank Name</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              placeholder="Auto-fetched from IFSC"
              placeholderTextColor="#ccc"
              editable={false}
              value={bankName}
            />

          </View>

          {/* SUBMIT BUTTON (Same as index.jsx Next button) */}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>

          

        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },

  // EXACT SAME SAFE AREA AS index.jsx
  safe: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 80,
  },

  // SAME BACK BUTTON POSITION AS aadhar.jsx & index.jsx
  backBtn: {
    position: "absolute",
    top: 37,
    left: 20,
    padding: 8,
    zIndex: 99,
  },

  centerBox: {
    alignItems: "center",
    width: "100%",
  },

  // SAME ICON CIRCLE AS index.jsx
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

  // CARD EXACT LIKE index.jsx
  card: {
    backgroundColor: "white",
    width: "95%",
    borderRadius: 12,
    padding: 20,
    marginTop: 60,
    alignSelf: "center",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 5,
  },

  input: {
    borderWidth: 1,
    borderColor: "#dcdcdc",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
  },

  disabledInput: {
    backgroundColor: "#E8E8E8",
  },

  button: {
    backgroundColor: "#1e5cff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "95%",
    marginTop: 20,
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },

  footer: {
    marginTop: 30,
    color: "white",
    textAlign: "center",
    fontSize: 12,
    opacity: 0.9,
  },
});

