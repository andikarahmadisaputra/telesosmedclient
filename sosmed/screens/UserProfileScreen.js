import { gql, useMutation, useQuery } from "@apollo/client";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

export const GET_PROFILE_BY_ID = gql`
  query GetUserById($userId: ID) {
    getUserById(id: $userId) {
      _id
      name
      username
      email
      following {
        _id
        name
        username
        email
      }
      follower {
        _id
        name
        username
        email
      }
    }
  }
`;

const FOLLOW = gql`
  mutation Follow($input: FollowInput) {
    follow(input: $input) {
      status
      data {
        _id
      }
    }
  }
`;

export default function UserProfileScreen({ route }) {
  const { userId } = route.params;

  const { data, loading, error, refetch } = useQuery(GET_PROFILE_BY_ID, {
    variables: { userId },
  });

  const [doFollow] = useMutation(FOLLOW);

  const handleFollow = async () => {
    try {
      await doFollow({
        variables: {
          input: {
            userId,
          },
        },
      });
      refetch();
    } catch (err) {
      console.error(err);
    }
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

  const profile = data.getUserById;

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

      <TouchableOpacity style={styles.button} onPress={handleFollow}>
        <Text style={styles.buttonText}>Follow</Text>
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
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
