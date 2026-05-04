import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from "react-native";
// import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { BASE_URL } from "../src/config";
import { auth } from "../src/firebaseConfig";
import axios from "axios";


// const EXECUTIVE_ID = "696bdfd957ca06dff5d7bbd2";

export default function Dashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const EXECUTIVE_ID = auth.currentUser?.uid;
  
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

  const updateStatus = async (id, newStatus) => {
  try {
    // Backend '/request/accept' route 'requestId' aur 'executiveId' expect karta hai
    const response = await axios.post(`${BASE_URL}/api/executive/request/accept`, {
      requestId: id, // Ensure ye wahi ID hai jo fetchTasks se aa rahi hai
      executiveId: EXECUTIVE_ID,
    });

    if (response.status === 200) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, status: newStatus } : task
        )
      );
      Alert.alert("Success", `Request ${newStatus}ed successfully!`);
    }
  } catch (error) {
    console.error("Error updating status:", error.response?.data || error.message);
    Alert.alert("Error", error.response?.data?.message || "Failed to update status");
  }
};

//   const fetchRequests = async () => {
//   try {
//     const res = await axios.get(
//       `${BASE_URL}/api/executive/request/available`
//     );

//     console.log("DATA 👉", res.data);
//     setTasks(res.data.requests);

//   } catch (err) {
//     console.log("ERROR 👉", err.message);
//   }
// };

// useEffect(() => {
//   fetchRequests();
// }, []);

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

  const fetchTasks = async () => {
  try {
    const res = await axios.get(
      `${BASE_URL}/api/executive/requests`,
      {
        params: {
          lat: 12.9716, // Aap yahan user ki live location bhi le sakte hain
          lng: 77.5946,
          executiveId: EXECUTIVE_ID,
        },
      }
    );

    const formattedTasks = res.data.map((item) => ({
      id: item.requestId, // Backend 'requestId' bhej raha hai
      name: item.user?.name || "Unknown Customer",
      address: item.user?.addressText || "Address not available",
      distance: `${item.distanceKm} km`,
      status: "pending",
    }));

    setTasks(formattedTasks);
  } catch (err) {
    console.log("Dashboard fetch error", err.message);
  }
};
useEffect(() => {
      fetchTasks();
    }, []);

//   const handleAccept = async (requestId) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/executive/request/accept`, {
//       requestId: requestId, // Ensure this matches the backend variable name
//       executiveId: EXECUTIVE_ID,
//     });
//     alert("Request Accepted!");
//     // Refresh list or navigate
//   } catch (error) {
//     console.error(error.response?.data);
//     alert(error.response?.data?.message || "Error accepting request");
//   }
// };

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
                    onPress={async () => {
                      try {
                        await axios.post(`${BASE_URL}/api/executive/request/accept`, {
                          requestId: task.id, // Ab task.id mein valid string hogi
                          executiveId: EXECUTIVE_ID,
                        });
                        // updateStatus(task.id, "accepted");

                        Alert.alert("Success", "Request accepted",
                          [
                            {
                              text: "OK",
                              onPress: () => router.replace({
                                pathname: "/location",
                                params: { requestId: task.id },
                              }),
                            },
                          ]
                        );

                        // setTasks((prev) =>
                        //   prev.map((item) =>
                        //     item.id === task.id
                        //       ? { ...item, status: "accepted" }
                        //       : item
                        //   )
                        // );

                        // router.push("/location");
                      } catch (err) {
                        const msg = err.response?.data?.message || "Error accepting request";
                        alert(msg);
                      }
                    }}
                >
                  <Text style={styles.btnText}>Accept</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    console.log("TRY NAV");
                    router.push("/location");
                  }}>
                  <Text>TEST NAV</Text>
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
                    params: { requestId: task.id },
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
