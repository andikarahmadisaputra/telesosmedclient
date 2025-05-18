import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { GET_POSTS } from "./HomeScreen";

const ADD_POST = gql`
  mutation AddPost($input: PostInput) {
    addPost(input: $input) {
      _id
      content
      tags
      imgUrl
    }
  }
`;

export default function CreatePostScreen() {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    content: "",
    imgUrl: "",
    tags: [],
  });

  const [tagInput, setTagInput] = useState("");

  const [addPost, { loading }] = useMutation(ADD_POST, {
    onCompleted: () => {
      navigation.goBack();
    },
    onError: (err) => {
      console.error(err);
    },
    refetchQueries: [{ query: GET_POSTS }],
  });

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput("");
    }
  };

  const handleSubmit = () => {
    if (!form.content.trim()) return;
    addPost({ variables: { input: form } });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Konten</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Apa yang sedang kamu pikirkan?"
        value={form.content}
        onChangeText={(text) => setForm({ ...form, content: text })}
      />

      <Text style={styles.label}>Gambar (URL)</Text>
      <TextInput
        style={styles.input}
        placeholder="https://picsum.photos/200"
        value={form.imgUrl}
        onChangeText={(text) => setForm({ ...form, imgUrl: text })}
      />

      <Text style={styles.label}>Tags</Text>
      <View style={styles.tagInputBox}>
        <TextInput
          placeholder="Tambah tag..."
          style={styles.tagInput}
          value={tagInput}
          onChangeText={setTagInput}
          onSubmitEditing={handleAddTag}
        />
        <Pressable style={styles.tagButton} onPress={handleAddTag}>
          <Text style={styles.tagButtonText}>Tambah</Text>
        </Pressable>
      </View>

      <View style={styles.tagsWrapper}>
        {form.tags.map((tag, index) => (
          <View key={index} style={styles.tagBadge}>
            <Text style={styles.tagText}>#{tag}</Text>
          </View>
        ))}
      </View>

      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {loading ? "Mengirim..." : "Posting"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9fcff",
    flexGrow: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#0088cc",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cce6f8",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 14,
    textAlignVertical: "top",
  },
  tagInputBox: {
    flexDirection: "row",
    marginBottom: 10,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#cce6f8",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
    marginRight: 10,
    fontSize: 14,
  },
  tagButton: {
    backgroundColor: "#0088cc",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    justifyContent: "center",
  },
  tagButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  tagsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  tagBadge: {
    backgroundColor: "#cce6f8",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  tagText: {
    color: "#0077b6",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#0088cc",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
