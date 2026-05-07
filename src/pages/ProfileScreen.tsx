import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { styles, type UserRecord } from "../shared";

export function ProfileScreen({
  username,
  onClose,
  onSignOut,
}: {
  username: string | null;
  onClose: () => void;
  onSignOut: () => void;
}) {
  const [userRecord, setUserRecord] = useState<UserRecord | null>(null);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!username) return;
      try {
        const raw = await AsyncStorage.getItem("plantdoctor:users");
        const users = raw
          ? (JSON.parse(raw) as Record<string, UserRecord>)
          : {};
        const record = users[username];
        if (record) setUserRecord(record);
        else
          setUserRecord({
            username,
            password: "",
            fullName: username,
            email: undefined,
            phone: undefined,
          });
      } catch {
        setUserRecord({
          username,
          password: "",
          fullName: username,
          email: undefined,
          phone: undefined,
        });
      }
    }

    load();
  }, [username]);

  async function submitPasswordChange() {
    setPasswordError(null);
    setPasswordMessage(null);

    if (!username) {
      setPasswordError("No user is signed in");
      return;
    }

    if (!newPassword.trim()) {
      setPasswordError("Enter a new password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      const raw = await AsyncStorage.getItem("plantdoctor:users");
      const users = raw ? (JSON.parse(raw) as Record<string, UserRecord>) : {};
      const record = users[username];
      if (!record) {
        setPasswordError("User not found");
        return;
      }

      users[username] = { ...record, password: newPassword };
      await AsyncStorage.setItem("plantdoctor:users", JSON.stringify(users));
      setPasswordMessage("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
      setChangePasswordOpen(false);
    } catch {
      setPasswordError("Could not update password");
    }
  }

  return (
    <View>
      <View style={styles.pageIntro}>
        <Text style={styles.pageTitle}>Profile</Text>
        <Text style={styles.bodyText}>
          Account details for {userRecord?.username ?? "user"}.
        </Text>
      </View>

      <View style={styles.formCard}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View
            style={[
              styles.loginLogo,
              {
                width: 64,
                height: 64,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <Text style={{ fontSize: 28, fontWeight: "900", color: "#214b35" }}>
              {userRecord?.fullName
                ? userRecord.fullName[0].toUpperCase()
                : username
                  ? username[0].toUpperCase()
                  : "U"}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>
              {userRecord?.fullName ?? "User"}
            </Text>
            <Text style={styles.bodyText}>
              Username: {userRecord?.username ?? username ?? "-"}
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 16, gap: 8 }}>
          <Text style={styles.bodyText}>
            Full name: {userRecord?.fullName ?? "Not provided"}
          </Text>
          <Text style={styles.bodyText}>
            Username: {userRecord?.username ?? "Not provided"}
          </Text>
          <Text style={styles.bodyText}>
            Phone number: {userRecord?.phone ?? "Not provided"}
          </Text>
          <Text style={styles.bodyText}>
            Email: {userRecord?.email ?? "No email provided"}
          </Text>
        </View>

        <Pressable
          onPress={() => setChangePasswordOpen((current) => !current)}
          style={[styles.smallButton, { marginTop: 16 }]}
        >
          <Text style={styles.smallButtonText}>
            {changePasswordOpen ? "Cancel password change" : "Change password"}
          </Text>
        </Pressable>

        {changePasswordOpen && (
          <View style={{ marginTop: 12 }}>
            <Text style={{ fontWeight: "900", marginBottom: 6 }}>
              New password
            </Text>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              secureTextEntry
              style={styles.input}
            />

            <Text style={{ fontWeight: "900", marginTop: 12, marginBottom: 6 }}>
              Confirm password
            </Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              secureTextEntry
              style={styles.input}
            />

            {passwordError && (
              <Text
                style={{ color: "#c14f3d", marginTop: 8, fontWeight: "800" }}
              >
                {passwordError}
              </Text>
            )}
            {passwordMessage && (
              <Text
                style={{ color: "#2d7d4a", marginTop: 8, fontWeight: "800" }}
              >
                {passwordMessage}
              </Text>
            )}

            <Pressable
              onPress={submitPasswordChange}
              style={[styles.primaryButton, { marginTop: 14 }]}
            >
              <Text style={styles.primaryButtonText}>Save password</Text>
            </Pressable>
          </View>
        )}

        <Pressable
          onPress={onSignOut}
          style={[styles.primaryButton, { marginTop: 16 }]}
        >
          <Text style={styles.primaryButtonText}>Sign out</Text>
        </Pressable>

        <Pressable
          onPress={onClose}
          style={[styles.smallButton, { marginTop: 8 }]}
        >
          <Text style={styles.smallButtonText}>Back</Text>
        </Pressable>
      </View>
    </View>
  );
}
