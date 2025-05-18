import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import authContext from "../contexts/authContext";
import { gql, useLazyQuery } from "@apollo/client";
import * as SecureStore from "expo-secure-store";

const LOGIN = gql`
  query Login($input: LoginInput) {
    login(input: $input) {
      access_token
    }
  }
`;

export default function LoginScreen() {
  const navigation = useNavigation();
  const { setIsSignedIn } = useContext(authContext);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [doLogin, { loading }] = useLazyQuery(LOGIN, {
    onCompleted: async (result) => {
      await SecureStore.setItemAsync("access_token", result.login.access_token);
      setIsSignedIn(true);
    },
    onError: (err) => {
      Alert.alert("Login Gagal", err.message || "Coba lagi nanti");
    },
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleLogin = () => {
    const { username, password } = form;
    if (!username || !password) {
      Alert.alert("Error", "Username dan password wajib diisi.");
      return;
    }

    doLogin({ variables: { input: { username, password } } });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.box}>
        <Text style={styles.header}>Telesosmed</Text>
        <Text style={styles.subHeader}>Enter your login details</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#888"
          value={form.username}
          onChangeText={(text) => handleChange("username", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={form.password}
          onChangeText={(text) => handleChange("password", text)}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
          <Text style={styles.registerText}>
            Don't have an account? Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e9f5fe",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "85%",
    padding: 30,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    fontSize: 32,
    color: "#0088cc",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontSize: 16,
    paddingVertical: 10,
    marginBottom: 20,
    color: "#333",
  },
  button: {
    backgroundColor: "#0088cc",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#87c6e4",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerText: {
    fontSize: 14,
    color: "#0088cc",
    textAlign: "center",
  },
});
