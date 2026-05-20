import * as React from "react";
import { Button, Text, View, StyleSheet } from "react-native";
import jwtDecode from "jwt-decode";
import { useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

// ⚙️ Configuration - Update these values!
const CLIENT_ID = process.env.EXPO_PUBLIC_CLIENT_ID; // From your OAuth application
const REDIRECT_URI = process.env.EXPO_PUBLIC_REDIRECT_URI; // Your Expo dev URL or custom scheme
const BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE; // Your backend base URL
const USE_PRELIVE = process.env.EXPO_PUBLIC_USE_PRELIVE === "true"; // set to false for production
const authBaseUrl = USE_PRELIVE
  ? "https://prelive-oauth2.quran.foundation"
  : "https://oauth2.quran.foundation";

// OAuth2 endpoints
const discovery = {
  authorizationEndpoint: `${authBaseUrl}/oauth2/auth`,
  tokenEndpoint: `${authBaseUrl}/oauth2/token`,
  revocationEndpoint: `${authBaseUrl}/oauth2/revoke`,
};



export default function App() {
  const [authSession, setAuthSession] = React.useState(null);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: ["openid", "offline_access", "bookmark", "collection", "user"],
      redirectUri: REDIRECT_URI,
      usePKCE: true,
    },
    discovery
  );

  React.useEffect(() => {
    const exchangeOnBackend = async () => {
      if (!response) {
        return;
      }

      if (response.error) {
        console.error("Auth error:", response.params.error_description);
        return;
      }

      if (response.type !== "success" || !request?.codeVerifier) {
        return;
      }

      try {
        const backendResponse = await fetch(
          `${BACKEND_BASE_URL}/api/auth/qf/exchange`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              code: response.params.code,
              codeVerifier: request.codeVerifier,
              redirectUri: REDIRECT_URI,
            }),
          }
        );

        const payload = await backendResponse.json();
        if (!backendResponse.ok) {
          throw new Error(payload.error || "Token exchange failed");
        }

        const userProfile = payload.user || jwtDecode(payload.idToken);
        setAuthSession({ ...payload, userProfile });
      } catch (error) {
        console.error("Token exchange failed:", error);
      }
    };

    exchangeOnBackend();
  }, [request?.codeVerifier, response]);

  const logout = async () => {
    await fetch(`${BACKEND_BASE_URL}/api/auth/qf/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: authSession?.refreshToken }),
    }).catch(() => {});
    setAuthSession(null);
  };
  console.log("OAuth2 Discovery:", authBaseUrl, discovery);

  // Logged in view
  if (authSession) {
    const { userProfile } = authSession;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome, {userProfile.first_name || userProfile.name || "User"}!
        </Text>
        <Text style={styles.email}>{userProfile.email}</Text>
        <View style={styles.buttonContainer}>
          <Button title="Logout" onPress={logout} />
        </View>
      </View>
    );
  }

  // Login view
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quran App</Text>
      <View style={styles.buttonContainer}>
        <Button
          disabled={!request}
          title="Login with Quran.com"
          onPress={() => promptAsync()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 40 },
  welcome: { fontSize: 24, fontWeight: "600", marginBottom: 10 },
  email: { fontSize: 16, color: "#666", marginBottom: 30 },
  buttonContainer: { marginTop: 20, width: "80%" },
});