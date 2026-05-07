import { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { styles } from "../shared";

export function LoginScreen({
  onLogin,
  onSignUp,
  onResetPassword,
}: {
  onLogin: (
    username: string,
    password: string,
  ) => Promise<{ ok: boolean; message?: string }>;
  onSignUp: (
    username: string,
    password: string,
    fullName: string,
    phone?: string,
    email?: string,
  ) => Promise<{ ok: boolean; message?: string }>;
  onResetPassword: (
    username: string,
    newPassword: string,
  ) => Promise<{ ok: boolean; message?: string }>;
}) {
  const [mode, setMode] = useState<"signIn" | "signUp" | "forgot">("signIn");
  const [username, setUsername] = useState("demo");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  async function submitSignIn() {
    setError(null);
    setLoading(true);
    try {
      const result = await onLogin(username.trim(), password);
      if (!result.ok) setError(result.message ?? "Sign in failed");
    } catch {
      setError("Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  async function submitSignUp() {
    setError(null);
    setLoading(true);
    try {
      const result = await onSignUp(
        username.trim(),
        password,
        fullName.trim(),
        phone.trim() || undefined,
        email.trim() || undefined,
      );
      if (!result.ok) setError(result.message ?? "Sign up failed");
    } catch {
      setError("Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  async function submitReset() {
    setError(null);
    setResetMessage(null);
    setLoading(true);
    try {
      const newPass = "newpass123";
      const result = await onResetPassword(username.trim(), newPass);
      if (!result.ok) setError(result.message ?? "Reset failed");
      else setResetMessage(`Password reset. New password: ${newPass}`);
    } catch {
      setError("Reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ width: "100%", maxWidth: 520, alignSelf: "center" }}>
      <View style={{ alignItems: "center", marginBottom: 12 }}>
        <Image
          source={require("../../assets/plantdoctor-icon.png")}
          style={styles.loginLogo}
          resizeMode="cover"
        />
      </View>

      <View style={styles.pageIntro}>
        <Text style={styles.pageTitle}>
          {mode === "signIn"
            ? "Sign in to Plant Doctor"
            : mode === "signUp"
              ? "Create your account"
              : "Reset password"}
        </Text>
        <Text style={styles.bodyText}>
          {mode === "signIn"
            ? "Enter your credentials to continue."
            : mode === "signUp"
              ? "Provide basic information to create an account."
              : "Enter your username to reset password."}
        </Text>
      </View>

      <View style={styles.formCard}>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
          <Pressable
            onPress={() => setMode("signIn")}
            style={[
              { padding: 8, borderRadius: 8 },
              mode === "signIn" && { backgroundColor: "#eef7f1" },
            ]}
          >
            <Text
              style={{
                fontWeight: "900",
                color: mode === "signIn" ? "#214b35" : "#58645d",
              }}
            >
              Sign in
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMode("signUp")}
            style={[
              { padding: 8, borderRadius: 8 },
              mode === "signUp" && { backgroundColor: "#eef7f1" },
            ]}
          >
            <Text
              style={{
                fontWeight: "900",
                color: mode === "signUp" ? "#214b35" : "#58645d",
              }}
            >
              Sign up
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMode("forgot")}
            style={[
              { padding: 8, borderRadius: 8 },
              mode === "forgot" && { backgroundColor: "#eef7f1" },
            ]}
          >
            <Text
              style={{
                fontWeight: "900",
                color: mode === "forgot" ? "#214b35" : "#58645d",
              }}
            >
              Forgot
            </Text>
          </Pressable>
        </View>

        {(mode === "signIn" || mode === "signUp" || mode === "forgot") && (
          <>
            <Text style={{ fontWeight: "900", marginBottom: 6 }}>Username</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="username"
              style={styles.input}
              autoCapitalize="none"
            />
          </>
        )}

        {mode !== "forgot" && (
          <>
            <Text style={{ fontWeight: "900", marginTop: 12, marginBottom: 6 }}>
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              style={styles.input}
            />
          </>
        )}

        {mode === "signUp" && (
          <>
            <Text style={{ fontWeight: "900", marginBottom: 6 }}>
              Full name
            </Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Your full name"
              style={styles.input}
            />

            <Text style={{ fontWeight: "900", marginTop: 12, marginBottom: 6 }}>
              Email (optional)
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              style={styles.input}
              keyboardType="email-address"
            />

            <Text style={{ fontWeight: "900", marginTop: 12, marginBottom: 6 }}>
              Phone number (optional)
            </Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="09xx xxx xxxx"
              style={styles.input}
              keyboardType="phone-pad"
            />
          </>
        )}

        {error && (
          <Text style={{ color: "#c14f3d", marginTop: 8, fontWeight: "800" }}>
            {error}
          </Text>
        )}
        {resetMessage && (
          <Text style={{ color: "#2d7d4a", marginTop: 8, fontWeight: "800" }}>
            {resetMessage}
          </Text>
        )}

        {mode === "signIn" && (
          <>
            <Pressable
              onPress={submitSignIn}
              style={[
                styles.primaryButton,
                { marginTop: 14, opacity: loading ? 0.7 : 1 },
              ]}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? "Signing in..." : "Sign in"}
              </Text>
            </Pressable>
            <Text style={{ marginTop: 10, color: "#58645d", fontSize: 13 }}>
              Demo credentials: username "demo" and password "demo123".
            </Text>
          </>
        )}

        {mode === "signUp" && (
          <Pressable
            onPress={submitSignUp}
            style={[
              styles.primaryButton,
              { marginTop: 14, opacity: loading ? 0.7 : 1 },
            ]}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? "Creating..." : "Create account"}
            </Text>
          </Pressable>
        )}

        {mode === "forgot" && (
          <Pressable
            onPress={submitReset}
            style={[
              styles.primaryButton,
              { marginTop: 14, opacity: loading ? 0.7 : 1 },
            ]}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? "Resetting..." : "Reset password"}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

