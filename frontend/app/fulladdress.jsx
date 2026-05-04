// app/fulladdress.jsx
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
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";

export default function FullAddress() {
  const router = useRouter();

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [addressFile, setAddressFile] = useState(null);

  // PICK DOCUMENT
  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf"],
    });

    if (!result.canceled && result.assets?.length > 0) {
      setAddressFile(result.assets[0]);
    }
  };

  return (
    <LinearGradient colors={["#1e5cff", "#1444dd"]} style={styles.bg}>
      <SafeAreaView style={styles.safe}>
        
        {/* BACK ARROW */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>

        {/* Center content */}
        <View style={styles.centerBox}>

          {/* ICON */}
          <View style={styles.iconCircle}>
            <Ionicons name="location-outline" size={42} color="white" />
          </View>

          {/* TITLE */}
          <Text style={styles.title}>Address Information</Text>
          <Text style={styles.subtitle}>
            Please provide your current residential address.
          </Text>

          {/* CARD (exact as index.jsx) */}
          <View style={styles.card}>

            <TextInput
              style={styles.input}
              placeholder="Street Address"
              placeholderTextColor="#777"
              value={street}
              onChangeText={setStreet}
            />

            {/* City + State */}
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.half]}
                placeholder="City"
                placeholderTextColor="#777"
                value={city}
                onChangeText={setCity}
              />
              <TextInput
                style={[styles.input, styles.half]}
                placeholder="State"
                placeholderTextColor="#777"
                value={state}
                onChangeText={setState}
              />
            </View>

            {/* Pincode */}
            <TextInput
              style={styles.input}
              placeholder="Pincode"
              placeholderTextColor="#777"
              value={pincode}
              onChangeText={setPincode}
              keyboardType="number-pad"
              maxLength={6}
            />

            {/* Upload Box */}
            <Text style={styles.uploadTitle}>Upload Address Proof</Text>

            <TouchableOpacity style={styles.uploadBox} onPress={pickDocument}>
              <Ionicons name="cloud-upload-outline" size={32} color="#1e5cff" />

              <Text style={styles.uploadText}>
                {addressFile ? addressFile.name : "Click to Upload"}
              </Text>

              {!addressFile && (
                <Text style={styles.uploadSubText}>
                  Aadhaar, Passport, or Utility Bill
                </Text>
              )}
            </TouchableOpacity>

            {/* Next Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/policeverification")}   // 👈 Navigation added
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>

          </View>

          

        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },

  safe: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 80, // EXACT like index.jsx
  },

  backBtn: {
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
    marginTop: 60, // EXACT positioning match
    alignSelf: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#dcdcdc",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  half: {
    width: "48%",
  },

  uploadTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 5,
  },

  uploadBox: {
    borderWidth: 1.5,
    borderColor: "#1e5cff",
    borderRadius: 10,
    borderStyle: "dashed",
    padding: 22,
    alignItems: "center",
    marginBottom: 20,
  },

  uploadText: {
    color: "#1e5cff",
    fontWeight: "600",
    marginTop: 6,
  },

  uploadSubText: {
    fontSize: 11,
    color: "#777",
    marginTop: 4,
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
    marginTop: 30,
    color: "white",
    textAlign: "center",
    fontSize: 12,
    opacity: 0.9,
  },
});
