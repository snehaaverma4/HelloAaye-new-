"photo_capture.tsx" 

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { BASE_URL } from "../src/config";
import { auth } from "../src/firebaseConfig";

export default function PhotoCapture() {
  const uid = auth.currentUser?.uid;
  const router = useRouter();
  const { requestId, formData } = useLocalSearchParams();
  const parsedForm = formData
    ? JSON.parse(decodeURIComponent(formData))
    : {};

  const [photos, setPhotos] = useState({
    gate: null,
    reception: null,
    board: null,
    person: null,
    selfie: null,
  });

  const [flags, setFlags] = useState({
    receptionNA: false,
    boardNA: false,
  });

  const [comments, setComments] = useState({
    reception: "",
    board: "",
  });

const pickImage = async (key) => {
  try {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      alert("Camera permission required");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    console.log("RESULT 👉", result);

    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri;

      console.log("IMAGE SELECTED 👉", key, uri);

      setPhotos((prev) => ({
        ...prev,
        [key]: uri,
      }));
    }

  } catch (err) {
    console.log("IMAGE ERROR 👉", err);
  }
};

  const isComplete =
    photos.gate &&
    photos.person &&
    photos.selfie &&
    (photos.reception || flags.receptionNA) &&
    (photos.board || flags.boardNA);

    console.log("PHOTOS 👉", photos);
    console.log("FLAGS 👉", flags); 
    console.log("IS COMPLETE 👉", isComplete);
    console.log("FINAL PHOTOS 👉", photos);

  const handleSubmit = async () => {
  try {
    if (!auth.currentUser) {
      Alert.alert("User not logged in");
      return;
    }

    const uid = auth.currentUser.uid;
    const formDataPayload = new FormData();

    formDataPayload.append("requestId", requestId);
    formDataPayload.append("executiveId", uid);
    formDataPayload.append("details", JSON.stringify(parsedForm));

    // Append each photo as a file blob
    const photoKeys = ["gate", "person", "selfie"];
    if (!flags.receptionNA) photoKeys.push("reception");
    if (!flags.boardNA) photoKeys.push("board");

    for (const key of photoKeys) {
      if (photos[key]) {
        const uri = photos[key];
        const filename = `${key}_${Date.now()}.jpg`;
        formDataPayload.append(`photos[${key}]`, {
          uri,
          name: filename,
          type: "image/jpeg",
        });
      }
    }

    // Handle NA flags
    if (flags.receptionNA) formDataPayload.append("photos[reception]", "NA");
    if (flags.boardNA) formDataPayload.append("photos[board]", "NA");

    await axios.post(`${BASE_URL}/api/executive/request/form`, formDataPayload, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    Alert.alert("Success", "Verification submitted");
    router.replace("/dashboard");

  } catch (err) {
    console.log("SUBMIT ERROR 👉", err.response?.data || err.message);
    Alert.alert("Submission failed", err.response?.data?.message || err.message);
  }
};

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Photo Capture</Text>
        <View style={{ width: 22 }} />
      </View>

      <PhotoBlock
        title="Office Gate"
        image={photos.gate}
        onPick={() => pickImage("gate")}
      />

      <PhotoBlock
        title="Reception Area"
        image={photos.reception}
        onPick={() => pickImage("reception")}
        isNA={flags.receptionNA}
        onToggleNA={() =>
          setFlags({ ...flags, receptionNA: !flags.receptionNA })
        }
        comment={comments.reception}
        onComment={(t) => setComments({ ...comments, reception: t })}
        naLabel="No reception available"
      />

      <PhotoBlock
        title="Office Board"
        image={photos.board}
        onPick={() => pickImage("board")}
        isNA={flags.boardNA}
        onToggleNA={() =>
          setFlags({ ...flags, boardNA: !flags.boardNA })
        }
        comment={comments.board}
        onComment={(t) => setComments({ ...comments, board: t })}
        naLabel="Board not available"
      />

      <PhotoBlock
        title="Met Person Photo"
        image={photos.person}
        onPick={() => pickImage("person")}
      />

      <PhotoBlock
        title="Executive Selfie with Office Gate"
        image={photos.selfie}
        onPick={() => pickImage("selfie")}
      />

      <TouchableOpacity
        disabled={!isComplete}
        style={[styles.submitBtn, isComplete && styles.submitActive]}
        onPress={handleSubmit}
      >
        <Text style={styles.submitText}>Submit Verification</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ---------- REUSABLE BLOCK ---------- */

function PhotoBlock({
  title,
  image,
  onPick,
  isNA,
  onToggleNA,
  comment,
  onComment,
  naLabel,
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      {naLabel && (
        <TouchableOpacity style={styles.naToggle} onPress={onToggleNA}>
          <Ionicons
            name={isNA ? "checkbox" : "square-outline"}
            size={20}
            color="#0052cc"
          />
          <Text style={styles.naText}>{naLabel}</Text>
        </TouchableOpacity>
      )}

      {!isNA && (
        <TouchableOpacity style={styles.uploadBox} 
        onPress={() => {
          console.log("CLICKED 👉", title);
          onPick();
        }}>
          {image ? (
            <Image source={{ uri: image }} style={styles.preview} />
          ) : (
            <>
              <Ionicons name="camera" size={28} color="#0052cc" />
              <Text style={styles.uploadText}>Tap to capture</Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {isNA && (
        <TextInput
          style={styles.comment}
          placeholder="Please mention reason"
          value={comment}
          onChangeText={onComment}
        />
      )}
    </View>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7ff",
  },

  header: {
    backgroundColor: "#0052cc",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
    paddingTop: 50,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 14,
    padding: 14,
    elevation: 2,
  },

  title: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },

  uploadBox: {
    height: 140,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#d6dbe9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  uploadText: {
    marginTop: 6,
    color: "#777",
  },

  preview: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },

  comment: {
    borderWidth: 1,
    borderColor: "#e6ecff",
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
  },

  submitBtn: {
    marginHorizontal: 20,
    backgroundColor: "#cbd6ff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  submitActive: {
    backgroundColor: "#0052cc",
  },

  submitText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  naToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },

  naText: {
    fontSize: 13,
    color: "#0052cc",
    fontWeight: "500",
  },
});