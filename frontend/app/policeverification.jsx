// app/policeverification.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";

export default function PoliceVerification() {
  const router = useRouter();

  const [status, setStatus] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [reportFile, setReportFile] = useState(null);

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf"],
    });

    if (!result.canceled && result.assets?.length > 0) {
      setReportFile(result.assets[0]);
    }
  };

  return (
    <LinearGradient colors={["#1e5cff", "#1444dd"]} style={styles.bg}>
      <SafeAreaView style={styles.safe}>

        {/* BACK ARROW */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>

        {/* Top Content */}
        <View style={styles.centerBox}>

          {/* ICON */}
          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark-outline" size={40} color="white" />
          </View>

          <Text style={styles.title}>Police Verification</Text>
          <Text style={styles.subtitle}>
            Upload your police verification certificate or select status.
          </Text>

          {/* CARD - EXACT POSITION LIKE index.jsx */}
          <View style={styles.card}>

            <Text style={styles.label}>Verification Status</Text>

            {/* DROPDOWN */}
            <TouchableOpacity
              style={styles.dropdownBox}
              onPress={() => setDropdownOpen(!dropdownOpen)}
            >
              <Text style={styles.dropdownText}>
                {status ? status : "Select Status"}
              </Text>
              <Ionicons
                name={dropdownOpen ? "chevron-up-outline" : "chevron-down-outline"}
                size={20}
                color="#555"
              />
            </TouchableOpacity>

            {dropdownOpen && (
              <View style={styles.dropdownList}>
                {["Pending", "Approved", "Rejected"].map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setStatus(item);
                      setDropdownOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.label}>Upload Police Verification Report</Text>

            <TouchableOpacity style={styles.uploadBox} onPress={pickDocument}>
              <Ionicons name="cloud-upload-outline" size={32} color="#1e5cff" />
              <Text style={styles.uploadText}>
                {reportFile ? reportFile.name : "Click to Upload Document"}
              </Text>

              {!reportFile && (
                <Text style={styles.uploadSubText}>
                  PDF, JPG, or PNG (max 5MB)
                </Text>
              )}
            </TouchableOpacity>

            {/* NEXT BUTTON */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/bank_details")}
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
    paddingTop: 80, // EXACT same as index.jsx
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
    textAlign: "center",
    marginBottom: 20,
  },

  // **THIS CARD IS NOW IDENTICAL TO index.jsx**
  card: {
    backgroundColor: "white",
    width: "95%",
    borderRadius: 12,
    padding: 20,
    marginTop: 60, // SAME SPACING AS index.jsx
    alignSelf: "center",
  },

  label: {
    fontSize: 14,
    color: "#444",
    marginBottom: 6,
    fontWeight: "600",
  },

  dropdownBox: {
    borderWidth: 1,
    borderColor: "#dcdcdc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dropdownText: {
    fontSize: 14,
    color: "#555",
  },

  dropdownList: {
    borderWidth: 1,
    borderColor: "#dcdcdc",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },

  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  dropdownItemText: {
    fontSize: 14,
    color: "#333",
  },

  uploadBox: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#1e5cff",
    borderRadius: 10,
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
