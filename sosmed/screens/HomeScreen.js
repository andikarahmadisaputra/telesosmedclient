import { useQuery, gql } from "@apollo/client";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  FlatList,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export const GET_POSTS = gql`
  query GetPosts {
    getPosts {
      _id
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      author {
        _id
        name
        username
        email
      }
    }
  }
`;

export default function HomeScreen() {
  const navigation = useNavigation();
  const { data, loading, error } = useQuery(GET_POSTS);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0088cc" />
        <Text>Loading posts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>Error: {error.message}</Text>
      </View>
    );
  }

  const renderItem = ({ item: post }) => (
    <Pressable
      onPress={() =>
        navigation.navigate("PostDetailScreen", { postId: post._id })
      }
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <Ionicons name="person-circle" size={40} color="#0088cc" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.username}>@{post.author.username}</Text>
            <Text style={styles.date}>
              {post.createdAt
                ? new Date(Number(post.createdAt)).toLocaleString()
                : "Loading date..."}
            </Text>
          </View>
        </View>

        {post.imgUrl ? (
          <Image source={{ uri: post.imgUrl }} style={styles.image} />
        ) : null}

        <Text style={styles.content}>{post.content}</Text>

        <View style={styles.footer}>
          <View style={styles.iconRow}>
            <Ionicons name="heart-outline" size={22} color="#555" />
            <Text style={styles.count}>{post.likes.length}</Text>
          </View>
          <View style={styles.iconRow}>
            <Ionicons name="chatbubble-outline" size={22} color="#555" />
            <Text style={styles.count}>{post.comments.length}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <FlatList
      data={data?.getPosts}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: "#e5f3ff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  username: {
    fontWeight: "bold",
    color: "#0088cc",
  },
  date: {
    fontSize: 12,
    color: "#666",
  },
  content: {
    fontSize: 15,
    marginBottom: 10,
    color: "#333",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 5,
    gap: 16,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  count: {
    fontSize: 14,
    color: "#555",
  },
});
