import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";

const REGISTER = gql`
  mutation Register($input: RegisterInput) {
    register(input: $input) {
      _id
      email
      name
      username
    }
  }
`;

export default function RegisterScreen() {
  const navigation = useNavigation();

  const [register, { data, loading, error }] = useMutation(REGISTER, {
    onCompleted: () => {
      Alert.alert("Register Berhasil", `Selamat datang, ${form.name}!`);
      navigation.replace("LoginScreen");
    },
    onError: (err) => {
      setErrorMessage(err.message || "Terjadi kesalahan.");
      Alert.alert("Register Gagal", err.message || "Coba lagi nanti");
    },
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleRegister = () => {
    const { name, email, username, password } = form;

    if (!name || !email || !username || !password) {
      Alert.alert("Error", "Semua field harus diisi.");
      return;
    }

    register({
      variables: {
        input: {
          name: form.name,
          email: form.email,
          username: form.username,
          password: form.password,
        },
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={form.name}
        onChangeText={(text) => handleChange("name", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        onChangeText={(text) => handleChange("email", text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={form.username}
        onChangeText={(text) => handleChange("username", text)}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={form.password}
        onChangeText={(text) => handleChange("password", text)}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color="#0088cc"
            style={{ marginBottom: 16 }}
          />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
        <Text style={styles.loginLink}>
          Sudah punya akun? <Text style={styles.loginText}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    marginBottom: 32,
    color: "#0088cc",
    alignSelf: "center",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
    paddingVertical: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#0088cc",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  loginLink: {
    textAlign: "center",
    fontSize: 14,
    color: "#888",
  },
  loginText: {
    color: "#0088cc",
    fontWeight: "600",
  },
});
