import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function Earnings() {
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [dailyTaskText, setDailyTaskText] = useState("Complete 10 sales calls");

  return (
    <>
      <ScrollView style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Earnings</Text>
          <Text style={styles.headerDate}>Monday, Dec 8</Text>
        </View>

        {/* Today's Earnings Card */}
        <View style={styles.cardBig}>
          <Text style={styles.cardBigTitle}>Today's Earnings</Text>

          <View className="rowBetween" style={styles.rowBetween}>
            <Text style={styles.amount}>₹320.00</Text>
            <Text style={styles.resetText}>Resets in 5h 18m</Text>
          </View>

          <Text style={styles.goalProgress}>Goal Progress</Text>

          {/* Progress Bar */}
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: "64%" }]} />
          </View>

          <Text style={styles.goalText}>₹180.00 to reach ₹500.00 goal</Text>
        </View>

        {/* Daily Task Card */}
        <View style={styles.cardTask}>
          <Ionicons name="checkmark-done" size={28} color="#0052cc" />
          <View>
            <Text style={styles.taskTitle}>Daily Task</Text>
            <Text style={styles.taskSubtitle}>{dailyTaskText}</Text>
          </View>

          <TouchableOpacity onPress={() => setTaskModalVisible(true)}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Total Earned */}
        <View style={styles.cardSmall}>
          <View>
            <Text style={styles.smallLabel}>Total Earned</Text>
            <Text style={styles.smallAmount}>₹45,780.50</Text>
          </View>
          <Ionicons name="cash" size={30} color="#0052cc" style={styles.smallIcon} />
        </View>

        {/* Monthly Earnings */}
        <View style={styles.cardSmall}>
          <View>
            <Text style={styles.smallLabel}>Monthly Earnings</Text>
            <Text style={styles.smallAmount}>₹8,450.75</Text>
          </View>
          <Ionicons name="calendar" size={30} color="#0052cc" style={styles.smallIcon} />
        </View>

        {/* Missed Leads */}
        <View style={styles.cardSmall}>
          <View>
            <Text style={styles.smallLabel}>Missed Leads</Text>
            <Text style={styles.smallAmount}>23</Text>
          </View>
          <Ionicons name="alert-circle" size={30} color="#0052cc" style={styles.smallIcon} />
        </View>
      </ScrollView>

      {/* POPUP MODAL */}
      <Modal
        transparent
        visible={taskModalVisible}
        animationType="fade"
        onRequestClose={() => setTaskModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Set Daily Task</Text>

            <TextInput
              style={styles.input}
              value={dailyTaskText}
              onChangeText={setDailyTaskText}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setTaskModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => setTaskModalVisible(false)}
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

// ======================= STYLING =======================

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7ff" },

  header: {
    backgroundColor: "#0052cc",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  headerDate: { color: "#e0e6ff", marginTop: 5 },

  cardBig: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 5,
  },
  cardBigTitle: { fontSize: 16, fontWeight: "bold", color: "#0052cc" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  amount: { fontSize: 28, fontWeight: "bold", color: "#222" },
  resetText: { color: "#777" },

  goalProgress: { marginTop: 15, color: "#0052cc", fontWeight: "bold" },

  progressBarBackground: {
    height: 8,
    backgroundColor: "#e0e0ff",
    borderRadius: 10,
    marginTop: 8,
  },

  progressBarFill: {
    height: 8,
    backgroundColor: "#0052cc",
    borderRadius: 10,
  },

  goalText: { marginTop: 8, color: "#666", fontSize: 12 },

  // Daily task card
  cardTask: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  taskTitle: { fontSize: 12, color: "#777" },
  taskSubtitle: { fontSize: 16, fontWeight: "bold" },
  editText: { marginLeft : "auto" , paddingLeft : 80,  color: "#0052cc", fontWeight: "bold",  },

  // Small info cards
  cardSmall: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 15,
    padding: 20,
    borderRadius: 16,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  smallLabel: { color: "#777" },
  smallAmount: { fontSize: 20, fontWeight: "bold", marginTop: 3 },
  smallIcon: {
    backgroundColor: "#e8f0ff",
    padding: 10,
    borderRadius: 50,
  },

  // MODAL STYLING
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 18,
  },

  modalTitle: { fontSize: 16, fontWeight: "600", marginBottom: 15 },

  input: {
    borderWidth: 1,
    borderColor: "#d0d7ff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cancelButton: {
    backgroundColor: "#f2f2f2",
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  saveButton: {
    backgroundColor: "#1e5bff",
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  cancelText: { color: "#666", fontWeight: "600" },
  saveText: { color: "#fff", fontWeight: "600" },
});