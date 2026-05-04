import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from "react-native";
// import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { BASE_URL } from "../src/config";
import axios from "axios";

const EXECUTIVE_ID = "696bdfd957ca06dff5d7bbd2";

export default function Dashboard() {
  const router = useRouter();

  const [tasks, setTasks] = useState([]);
  // const [tasks, setTasks] = useState([
  //   {
  //     id: 1,
  //     name: "Rajesh Kumar",
  //     address: "123, MG Road, Bengaluru - 560001",
  //     distance: "2.3 km",
  //     status: "pending",
  //   },
  //   {
  //     id: 2,
  //     name: "Priya Sharma",
  //     address: "456, Sector 18, Noida - 201301",
  //     distance: "5.8 km",
  //     status: "pending",
  //   },
  //   {
  //     id: 3,
  //     name: "Amit Patel",
  //     address: "789, Bandra West, Mumbai - 400050",
  //     distance: "12.1 km",
  //     status: "pending",
  //   },
  // ]);

  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const acceptedCount = tasks.filter((t) => t.status === "accepted").length;

  const updateStatus = (id, newStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };


  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return { backgroundColor: "#ffeb99", color: "#996c00" };
      case "accepted":
        return { backgroundColor: "#c8f7c5", color: "#1b8a29" };
      case "declined":
        return { backgroundColor: "#ffb3b3", color: "#b30000" };
      default:
        return { backgroundColor: "#eee", color: "#333" };
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {

    try {
      const res = await axios.get(
        `${BASE_URL}/api/executive/requests`,
        {
          params: {
            lat: 12.9716,
            lng: 77.5946,
            executiveId: EXECUTIVE_ID,
          },
        }
      );

      console.log("EXECUTIVE REQUEST API RESPONSE 👉", res.data);


      // Convert backend format → your UI format
      const formattedTasks = res.data.map((item, index) => ({
        id: item.requestId,
        name: item.user?.name || item.customerName || "Unknown",
        address: item.user?.addressText || item.address || "No address",
        distance: `${item.distanceKm} km`,
        status: "pending",
      }));

      setTasks(formattedTasks);
    } catch (err) {
      console.log("Dashboard fetch error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Dashboard</Text>

        {/* Earnings Icon */}
        <TouchableOpacity
          style={styles.earningIcon}
          onPress={() => router.push("/earnings")
            
          }
        >
          <Ionicons name="wallet-outline" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{acceptedCount}</Text>
          <Text style={styles.statLabel}>Accepted</Text>
        </View>
      </View>

      <Text style={styles.listTitle}>Assigned Tasks</Text>

      {/* Task List */}
      <ScrollView style={{ marginBottom: 80 }}>
        {tasks.map((task) => (
          <View key={task.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardName}>{task.name}</Text>
              <Text style={[styles.statusPill, getStatusStyle(task.status)]}>
                {task.status.toUpperCase()}
              </Text>
            </View>

            <Text style={styles.cardAddress}>{task.address}</Text>
            <Text style={styles.cardDistance}>{task.distance}</Text>

            {task.status === "pending" && (
              <View style={styles.btnRow}>
                <TouchableOpacity
                  style={styles.acceptBtn}
                //   onPress={() => updateStatus(task.id, "accepted")}
                  onPress={async () => {
                    try {
                      await axios.post(`${BASE_URL}/api/executive/request/accept`, {
                        requestId: task.id,        // real requestId
                        executiveId: EXECUTIVE_ID,
                      });

                      updateStatus(task.id, "accepted");

                      router.push("/location"); // 🔥 map screen
                    } catch (err) {
                      alert("Already accepted by someone else");
                    }
                  }}


                    
                >
                  <Text style={styles.btnText}>Accept</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.declineBtn}
                  onPress={() => updateStatus(task.id, "declined")}
                >
                  <Text style={styles.btnText}>Decline</Text>
                </TouchableOpacity>
              </View>
            )}

            {task.status === "accepted" && (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/verificationform",
                    params: { requestId: item._id },
                  })
                }
              >
                <Text style={styles.verifyLink}>
                  Tap to start verification →
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={28} color="#0052cc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person" size={28} color="#0052cc" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ====================== STYLES ======================

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7ff" },

  header: {
    backgroundColor: "#0052cc",
    paddingVertical: 30,
    marginBottom: 10,
    alignItems: "center",
  },

  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: -25,
    marginBottom: 10,
  },

  statBox: {
    backgroundColor: "#fff",
    width: "42%",
    paddingVertical: 20,
    borderRadius: 14,
    alignItems: "center",
    elevation: 4,
  },

  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0052cc",
  },

  statLabel: { fontSize: 14, color: "#555" },

  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 20,
    marginVertical: 10,
    color: "#0052cc",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 18,
    borderRadius: 14,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardName: { fontSize: 18, fontWeight: "bold" },

  statusPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: "bold",
  },

  cardAddress: { color: "#666", marginVertical: 4 },
  cardDistance: { color: "#888", marginBottom: 12 },

  btnRow: { flexDirection: "row", justifyContent: "space-between" },

  acceptBtn: {
    backgroundColor: "#0052cc",
    padding: 10,
    width: "48%",
    borderRadius: 8,
  },

  declineBtn: {
    backgroundColor: "#cc0000",
    padding: 10,
    width: "48%",
    borderRadius: 8,
  },

  btnText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },

  verifyLink: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "600",
    color: "#0052cc",
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: "#ddd",
    elevation: 10,
  },

  navItem: { alignItems: "center" },

  earningIcon: {
    position: "absolute",
    right: 30,
    top: 30,
  },
});
