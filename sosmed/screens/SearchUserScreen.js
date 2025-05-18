import { gql, useLazyQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const SEARCH = gql`
  query SearchUsers($query: String) {
    searchUsers(query: $query) {
      _id
      name
      username
      email
    }
  }
`;

export default function SearchUserScreen() {
  const navigation = useNavigation();
  const [input, setInput] = useState("");
  const [searchUsers, { data, loading, error }] = useLazyQuery(SEARCH);

  const handleSearch = () => {
    if (input.trim()) {
      searchUsers({ variables: { query: input } });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Cari nama atau username..."
          value={input}
          onChangeText={setInput}
          style={styles.input}
          onSubmitEditing={handleSearch}
        />
        <Pressable onPress={handleSearch} style={styles.searchButton}>
          <Ionicons name="search" size={20} color="#fff" />
        </Pressable>
      </View>

      {loading && <Text style={styles.status}>Mencari...</Text>}
      {error && <Text style={styles.status}>Terjadi kesalahan</Text>}

      <FlatList
        data={data?.searchUsers || []}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.resultItem}
            onPress={() =>
              navigation.navigate("UserProfileScreen", { userId: item._id })
            }
          >
            <Text style={styles.username}>@{item.username}</Text>
            <Text style={styles.name}>{item.name}</Text>
          </Pressable>
        )}
        ListEmptyComponent={
          data?.searchUsers?.length === 0 && (
            <Text style={styles.status}>Tidak ada hasil ditemukan</Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f9fcff",
  },
  searchBox: {
    flexDirection: "row",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#eef3f7",
    paddingHorizontal: 15,
    fontSize: 14,
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: "#0088cc",
    borderRadius: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  resultItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#0088cc",
  },
  username: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0088cc",
  },
  name: {
    fontSize: 14,
    color: "#333",
  },
  status: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
});
