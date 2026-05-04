import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import axios from "axios";
import { BASE_URL } from "../src/config"; // path adjust if needed
import { getAuth } from "firebase/auth";

export default function AadhaarCardScreen() {
  const router = useRouter();

  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [kycEnabled, setKycEnabled] = useState(false);

  // FORMATTER
  const formatAadhaar = (text) => {
    let cleaned = text.replace(/\D/g, ""); // remove non-digits
    cleaned = cleaned.slice(0, 12); // limit to 12 digits
    let formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1 ");
    setAadhaarNumber(formatted);
  };

  // FILE PICKER (FIXED)
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf"],
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAadhaarFile(result.assets[0]);
      }
    } catch (error) {
      console.log("Document Picker error:", error);
    }
  };

  // NEXT BUTTON
  const handleNext = async () => {
  const cleanAadhaar = aadhaarNumber.replace(/\s/g, "");

  if (cleanAadhaar.length !== 12) {
    Alert.alert("Invalid Aadhaar", "Aadhaar number must be 12 digits.");
    return;
  }

  if (!aadhaarFile) {
    Alert.alert("Missing File", "Please upload your Aadhaar card.");
    return;
  }

  try {
    const auth = getAuth();
    const token = await auth.currentUser.getIdToken();

    const formData = new FormData();
    formData.append("aadhaarPdf", {
      uri: aadhaarFile.uri,
      name: aadhaarFile.name,
      type: "application/pdf",
    });

    formData.append("aadhaarNumber", cleanAadhaar);

    await axios.post(
      `${BASE_URL}/api/profile/aadhaar/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    //only AFTER successful upload
    router.push("/fulladdress");

  } catch (err) {
    console.log("AADHAAR UPLOAD ERROR", err.response?.data || err.message);
    Alert.alert("Upload failed", "Could not upload Aadhaar. Try again.");
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

          <View style={styles.iconCircle}>
            <Ionicons name="finger-print-outline" size={40} color="white" />
          </View>

          <Text style={styles.title}>Aadhaar Card</Text>

          <Text style={styles.subtitle}>
            Enter your Aadhaar number and upload your Aadhaar card.
          </Text>

          <View style={styles.card}>

            {/* AADHAAR INPUT */}
            <TextInput
              style={styles.input}
              placeholder="Aadhaar Number"
              placeholderTextColor="#aaa"
              keyboardType="number-pad"
              value={aadhaarNumber}
              maxLength={14}
              onChangeText={formatAadhaar}
            />

            {/* FILE UPLOAD */}
            <TouchableOpacity style={styles.uploadBox} onPress={pickDocument}>
              <Ionicons name="cloud-upload-outline" size={28} color="#777" />
              <Text style={styles.uploadText}>
                {aadhaarFile ? aadhaarFile.name : "Upload Aadhaar card PDF"}
              </Text>
            </TouchableOpacity>

            {/* UIDAI API SWITCH */}
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Verify via UIDAI KYC API</Text>
              <Switch value={kycEnabled} onValueChange={setKycEnabled} />
            </View>

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
    paddingTop: 80,
  },

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
    marginTop: 60,
    alignSelf: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#dcdcdc",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 15,
  },

  uploadBox: {
    borderWidth: 1.5,
    borderColor: "#dcdcdc",
    borderRadius: 8,
    padding: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  uploadText: {
    color: "#666",
    marginTop: 6,
    fontSize: 13,
  },

  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },

  toggleLabel: {
    fontSize: 14,
    color: "#444",
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
