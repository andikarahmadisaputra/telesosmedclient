import { gql, useQuery } from "@apollo/client";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import authContext from "../contexts/authContext";
import { useContext } from "react";

export const GET_PROFILE = gql`
  query GetProfile {
    getProfile {
      _id
      name
      username
      email
      following {
        _id
      }
      follower {
        _id
      }
    }
  }
`;

export default function ProfileScreen() {
  const { data, loading, error } = useQuery(GET_PROFILE);
  const { logout } = useContext(authContext);

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "Fitur edit profile bisa ditambahkan di sini.");
    // navigation.navigate("EditProfile");
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0088cc" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>
          Error: {JSON.stringify(error.message)}
        </Text>
      </View>
    );
  }

  const profile = data.getProfile;

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.username}>@{profile.username}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statCount}>{profile.follower.length}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statCount}>{profile.following.length}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={logout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: "#f2f9ff",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0088cc",
  },
  username: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
    marginBottom: 30,
  },
  statBox: {
    alignItems: "center",
  },
  statCount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  button: {
    backgroundColor: "#0088cc",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
    width: "80%",
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
