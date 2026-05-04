import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { BASE_URL } from "../src/config"; 

export default function VerificationForm() {
  const router = useRouter();
  const { requestId } = useLocalSearchParams();
  const EXECUTIVE_ID = "696bdfd957ca06dff5d7bbd2";

  const [addressCorrect, setAddressCorrect] = useState(null);
  const [locality, setLocality] = useState("");
  const [buildingColor, setBuildingColor] = useState("");
  const [officeSetup, setOfficeSetup] = useState("");
  const [employeeVintage, setEmployeeVintage] = useState("");
  const [employeeDesignation, setEmployeeDesignation] = useState("");
  const [employeeDepartment, setEmployeeDepartment] = useState("");
  const [idPhoto, setIdPhoto] = useState(null);

  // NEW elements
  const [refusalComment, setRefusalComment] = useState("");
  const [ref1Name, setRef1Name] = useState("");
  const [ref1Mobile, setRef1Mobile] = useState("");
  const [ref2Name, setRef2Name] = useState("");
  const [ref2Mobile, setRef2Mobile] = useState("");

  // Required fields check
  const isFormComplete =
    addressCorrect !== null &&
    locality.trim() !== "" &&
    buildingColor.trim() !== "" &&
    officeSetup.trim() !== "" &&
    employeeVintage.trim() !== "" &&
    employeeDesignation.trim() !== "" &&
    employeeDepartment.trim() !== "" &&
    idPhoto;

  // Pick Image
  const pickImage = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Permission to access photos is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setIdPhoto(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
  try {
    await axios.post(`${BASE_URL}/api/executive/request/form`, {

      requestId,
      executiveId: EXECUTIVE_ID,
      // result: addressCorrect ? "verified" : "failed",
      details: {
        locality,
        buildingColor,
        officeSetup,
        employeeVintage,
        employeeDesignation,
        employeeDepartment,
        refusalComment,
        references: [
          { name: ref1Name, mobile: ref1Mobile },
          { name: ref2Name, mobile: ref2Mobile },
        ],
      },
    });

    Alert.alert("Success", "Verification completed");
    router.replace("/dashboard");
  } catch (err) {
    Alert.alert("Error", "Verification submit failed");
  }
};

const handleContinue = () => {
  if (!requestId) {
    Alert.alert("Error", "Request ID missing");
    return;
  }

  const data = JSON.stringify({
    addressCorrect,
    locality,
    buildingColor,
    officeSetup,
    employeeVintage,
    employeeDesignation,
    employeeDepartment,
    refusalComment,
    ref1Name,
    ref1Mobile,
    ref2Name,
    ref2Mobile,
  });

  console.log("PASSING ID 👉", requestId);

  router.push(
    `/photo_capture?requestId=${requestId}&formData=${encodeURIComponent(data)}`
  );
};


  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f5f7ff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={22}
          color="#fff"
          style={{ marginRight: 12 }}
        />
        <View>
          <Text style={styles.headerTitle}>Verification Form</Text>
          <Text style={styles.headerSubtitle}>Sneha Reddy</Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 14 }}
      >
        {/* Yes / No */}
        <Text style={styles.label}>Office address correct?</Text>
        <View style={styles.yesNoRow}>
          <TouchableOpacity
            style={[
              styles.yesNoBtn,
              addressCorrect === true && styles.yesSelected,
            ]}
            onPress={() => setAddressCorrect(true)}
          >
            <Text style={styles.yesNoText}>Yes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.yesNoBtn,
              addressCorrect === false && styles.noSelected,
            ]}
            onPress={() => setAddressCorrect(false)}
          >
            <Text style={styles.yesNoText}>No</Text>
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        <FormInput
          icon="business"
          label="Company locality"
          placeholder="Select locality class"
          value={locality}
          setValue={setLocality}
          options={["Middle class", "Upper class", "Lower class"]}
        />

        <FormInput
          icon="color-palette"
          label="Office building color"
          placeholder="e.g., White, Blue, Grey"
          value={buildingColor}
          setValue={setBuildingColor}
        />

        <FormInput
          icon="briefcase"
          label="Office setup"
          placeholder="Select office size"
          value={officeSetup}
          setValue={setOfficeSetup}
          options={["Small", "Medium", "Large"]}
        />

        <FormInput
          icon="time"
          label="Employee vintage (years)"
          placeholder="Years of experience"
          value={employeeVintage}
          setValue={setEmployeeVintage}
        />

        <FormInput
          icon="person"
          label="Employee designation"
          placeholder="e.g., Software Engineer"
          value={employeeDesignation}
          setValue={setEmployeeDesignation}
        />

        <FormInput
          icon="people"
          label="Employee department"
          placeholder="e.g., IT, Finance, HR"
          value={employeeDepartment}
          setValue={setEmployeeDepartment}
        />

        {/* Image Upload */}
        <Text style={[styles.label, { marginTop: 6 }]}>
          Capture ID card photo
        </Text>

        <TouchableOpacity
          style={styles.uploadBox}
          onPress={pickImage}
          activeOpacity={0.8}
        >
          {!idPhoto ? (
            <View style={{ alignItems: "center" }}>
              <Ionicons name="camera" size={36} color="#0052cc" />
              <Text style={{ color: "#777", marginTop: 8 }}>
                Tap to capture
              </Text>
            </View>
          ) : (
            <Image source={{ uri: idPhoto }} style={styles.uploadedImage} />
          )}
        </TouchableOpacity>

        {/* Comment */}
        <Text style={[styles.smallLabel, { marginTop: 6 }]}>
          Comment (if applicant refuses)
        </Text>
        <TextInput
          style={styles.commentInput}
          placeholder="Enter comments if applicant refuses verification"
          value={refusalComment}
          onChangeText={setRefusalComment}
          multiline
        />

        {/* Reference 1 */}
        <View style={styles.refCard}>
          <View style={styles.refHeader}>
            <Ionicons name="call" size={18} color="#e85c5c" />
            <Text style={styles.refTitle}> Office Reference 1</Text>
          </View>

          <View style={styles.inputBox}>
            <Ionicons
              name="person-outline"
              size={18}
              color="#0052cc"
              style={{ marginRight: 8 }}
            />
            <TextInput
              placeholder="Reference name"
              value={ref1Name}
              onChangeText={setRef1Name}
              style={{ flex: 1 }}
            />
          </View>

          <View style={[styles.inputBox, { marginTop: 10 }]}>
            <Ionicons
              name="call-outline"
              size={18}
              color="#0052cc"
              style={{ marginRight: 8 }}
            />
            <TextInput
              placeholder="Mobile number"
              value={ref1Mobile}
              onChangeText={setRef1Mobile}
              keyboardType="phone-pad"
              style={{ flex: 1 }}
            />
          </View>
        </View>

        {/* Reference 2 */}
        <View style={styles.refCard}>
          <View style={styles.refHeader}>
            <Ionicons name="call" size={18} color="#e85c5c" />
            <Text style={styles.refTitle}> Office Reference 2</Text>
          </View>

          <View style={styles.inputBox}>
            <Ionicons
              name="person-outline"
              size={18}
              color="#0052cc"
              style={{ marginRight: 8 }}
            />
            <TextInput
              placeholder="Reference name"
              value={ref2Name}
              onChangeText={setRef2Name}
              style={{ flex: 1 }}
            />
          </View>

          <View style={[styles.inputBox, { marginTop: 10 }]}>
            <Ionicons
              name="call-outline"
              size={18}
              color="#0052cc"
              style={{ marginRight: 8 }}
            />
            <TextInput
              placeholder="Mobile number"
              value={ref2Mobile}
              onChangeText={setRef2Mobile}
              keyboardType="phone-pad"
              style={{ flex: 1 }}
            />
          </View>
        </View>

        {/* Continue */}
        <TouchableOpacity
          disabled={!isFormComplete}
          style={[
            styles.continueBtn,
            isFormComplete && styles.continueActive,
          ]}
          onPress={handleContinue}    
        >
          <Text style={styles.continueText}>Continue to Photos</Text>
        </TouchableOpacity>
              </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ================= REUSABLE INPUT =================

function FormInput({ icon, label, placeholder, value, setValue, options }) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => options && setShowDropdown(!showDropdown)}
        style={styles.inputBox}
      >
        <Ionicons name={icon} size={18} color="#0052cc" style={{ marginRight: 8 }} />

        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={setValue}
          editable={!options}
          style={{ flex: 1 }}
        />

        {options && (
          <Ionicons
            name={showDropdown ? "chevron-up" : "chevron-down"}
            size={20}
            color="#666"
          />
        )}
      </TouchableOpacity>

      {showDropdown && options && (
        <View style={styles.dropdownBox}>
          {options.map((opt, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.dropdownItem}
              onPress={() => {
                setValue(opt);
                setShowDropdown(false);
              }}
            >
              <Text style={styles.dropdownText}>{opt}</Text>
            </TouchableOpacity>
  
          ))}
        </View>
      )}
    </View>
  );
}

// ====================== STYLES ======================

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#0052cc",
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    paddingTop: 20,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  headerSubtitle: { color: "#e0e6ff", fontSize: 12 },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 20,
    marginBottom: 6,
    color: "#333",
  },

  smallLabel: {
    fontSize: 13,
    color: "#666",
    marginLeft: 20,
    marginBottom: 6,
  },

  yesNoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
    marginHorizontal: 10,
  },

  yesNoBtn: {
    width: "46%",
    paddingVertical: 12,
    backgroundColor: "#eee",
    borderRadius: 10,
    alignItems: "center",
  },

  yesSelected: { backgroundColor: "#c9f7c5" },
  noSelected: { backgroundColor: "#ffb3b3" },

  yesNoText: { fontSize: 16, fontWeight: "600", color: "#333" },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 12,
    elevation: 2,
  },

  uploadBox: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    height: 150,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    marginBottom: 14,
    borderStyle: "dashed",
    borderWidth: 1.5,
    borderColor: "#d6dbe9",
  },

  uploadedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },

  commentInput: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    minHeight: 70,
    textAlignVertical: "top",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e6ecff",
  },

  refCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    padding: 14,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 14,
  },

  refHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  refTitle: {
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },

  continueBtn: {
    marginHorizontal: 20,
    backgroundColor: "#cbd6ff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 40,
  },

  continueActive: { backgroundColor: "#0052cc" },

  continueText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  dropdownBox: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
  },

  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },

  dropdownText: { fontSize: 14, color: "#333" },
});
