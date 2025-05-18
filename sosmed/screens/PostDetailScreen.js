import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

const GET_POST_BY_ID = gql`
  query GetPostById($postId: ID) {
    getPostById(id: $postId) {
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

const LIKE_POST = gql`
  mutation LikePost($input: LikeInput) {
    likePost(input: $input) {
      _id
    }
  }
`;

const COMMENT = gql`
  mutation CommentPost($input: CommentInput) {
    commentPost(input: $input) {
      _id
    }
  }
`;

export default function PostDetailScreen({ route }) {
  const navigation = useNavigation();
  const { postId } = route.params;
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_POST_BY_ID, {
    variables: { postId },
  });

  const [likePost, { loading: liking }] = useMutation(LIKE_POST, {
    refetchQueries: [{ query: GET_POST_BY_ID, variables: { postId } }],
  });

  const [saveComment] = useMutation(COMMENT, {
    onError: (error) => Alert.alert("Error", error.message),
  });

  const handleComment = async () => {
    if (!newComment.trim()) return;
    setCommentLoading(true);
    try {
      await saveComment({
        variables: {
          input: {
            content: newComment,
            postId,
          },
        },
      });
      setNewComment("");
      await refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await likePost({
        variables: {
          input: {
            postId,
          },
        },
      });
    } catch (err) {
      Alert.alert("Gagal Like", err.message);
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  if (error)
    return (
      <View style={styles.center}>
        <Text>Error: {error.message}</Text>
      </View>
    );

  const post = data.getPostById;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Ionicons name="person-circle" size={40} color="#0088cc" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.username}>@{post.author.username}</Text>
              <Text style={styles.date}>
                {new Date(Number(post.createdAt)).toLocaleString()}
              </Text>
            </View>
          </View>

          {post.imgUrl && (
            <Image source={{ uri: post.imgUrl }} style={styles.image} />
          )}

          <Text style={styles.content}>{post.content}</Text>

          <View style={styles.tagsContainer}>
            {post.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>

          <View style={styles.stats}>
            <Text style={styles.count}>
              ❤️ {post.likes.length} likes · 💬 {post.comments.length} comments
            </Text>
            <Pressable
              style={styles.likeButton}
              onPress={handleLike}
              disabled={liking}
            >
              <Ionicons name="heart" size={22} color="#e0245e" />
              <Text style={styles.likeText}>{liking ? "..." : "Like"}</Text>
            </Pressable>
          </View>

          <View style={styles.commentsHeader}>
            <Text style={styles.sectionTitle}>Komentar</Text>
          </View>

          {post.comments.map((comment, index) => (
            <View key={index} style={styles.comment}>
              <Text style={styles.commentUser}>@{comment.username}</Text>
              <Text style={styles.commentContent}>{comment.content}</Text>
              <Text style={styles.commentDate}>
                {new Date(Number(comment.createdAt)).toLocaleString()}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Ketik komentar..."
            style={styles.input}
            value={newComment}
            onChangeText={setNewComment}
          />
          <Pressable
            style={styles.sendButton}
            onPress={handleComment}
            disabled={commentLoading}
          >
            <Ionicons
              name={commentLoading ? "time" : "send"}
              size={22}
              color="#fff"
            />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f9fcff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#0088cc",
  },
  date: {
    fontSize: 12,
    color: "#666",
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 8,
    marginVertical: 10,
  },
  content: {
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  tag: {
    backgroundColor: "#def2ff",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 13,
    color: "#0077aa",
  },
  stats: {
    marginBottom: 15,
  },
  count: {
    fontSize: 14,
    color: "#444",
  },
  commentsHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  comment: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    elevation: 1,
  },
  commentUser: {
    fontWeight: "bold",
    color: "#0088cc",
    marginBottom: 2,
  },
  commentContent: {
    fontSize: 14,
    color: "#333",
  },
  commentDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 14,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#0088cc",
    borderRadius: 20,
    padding: 10,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  likeText: {
    marginLeft: 6,
    color: "#e0245e",
    fontWeight: "bold",
  },
});
