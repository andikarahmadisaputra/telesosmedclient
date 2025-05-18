import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import SearchUserScreen from "./screens/SearchUserScreen";
import ProfileScreen from "./screens/ProfileScreen";
import PostDetailScreen from "./screens/PostDetailScreen";
import CreatePostScreen from "./screens/CreatePostScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { ApolloProvider } from "@apollo/client";
import authContext from "./contexts/authContext";
import client from "./config/apollo";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import UserProfileScreen from "./screens/UserProfileScreen";
import { Ionicons } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "HomeScreen") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "CreatePostNavigator") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "SearchScreen") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "ProfileNavigator") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="HomeScreen"
        component={PostNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="CreatePostNavigator"
        component={CreatePostNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="SearchScreen"
        component={SearchNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="ProfileNavigator"
        component={ProfileNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const SearchNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchUserScreen"
        component={SearchUserScreen}
        options={{ title: "Search User" }}
      />
      <Stack.Screen
        name="UserProfileScreen"
        component={UserProfileScreen}
        options={{ title: "Profile" }}
      />
    </Stack.Navigator>
  );
};

const PostNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PostScreen"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Stack.Screen
        name="PostDetailScreen"
        component={PostDetailScreen}
        options={{ title: "Detail Post" }}
      />
    </Stack.Navigator>
  );
};

const CreatePostNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="CreatePostScreen"
      component={CreatePostScreen}
      options={{ title: "Create Post" }}
    />
  </Stack.Navigator>
);

const ProfileNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ProfileScreen"
      component={ProfileScreen}
      options={{ title: "Profile" }}
    />
  </Stack.Navigator>
);

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    checkToken();
  }, []);

  const logout = async () => {
    await SecureStore.deleteItemAsync("access_token");
    await client.clearStore();
    setIsSignedIn(false);
  };

  const checkToken = async () => {
    const token = await SecureStore.getItemAsync("access_token");
    if (token) {
      setIsSignedIn(true);
    }
  };

  return (
    <authContext.Provider
      value={{
        isSignedIn,
        setIsSignedIn,
        logout,
      }}
    >
      <ApolloProvider client={client}>
        <NavigationContainer>
          {isSignedIn ? (
            <TabNavigator />
          ) : (
            <Stack.Navigator>
              <Stack.Screen name="LoginScreen" component={LoginScreen} />
              <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </ApolloProvider>
    </authContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
