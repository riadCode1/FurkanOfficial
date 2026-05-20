import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";
import { useQuranApi, Bookmark, Collection } from "@/services/quranApi";

export default function HomeScreen() {
  const { session, logout } = useAuth();
  const api = useQuranApi();

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [streaks, setStreaks] = useState<{ current_streak: number; longest_streak: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const user = session?.userProfile;

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setApiError(null);

    try {
      // Parallel fetch of user data — all use x-auth-token + x-client-id headers
      const [bkRes, colRes, strRes] = await Promise.all([
        api.getBookmarks(),
        api.getCollections(),
        api.getStreaks(),
      ]);
      setBookmarks(bkRes.bookmarks);
      setCollections(colRes.collections);
      setStreaks(strRes);
    } catch (err) {
      setApiError((err as Error).message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleLogout = () => {
    Alert.alert("Sign out", "Sign out of your Quran.com account?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: logout },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={GREEN} />
        <Text style={styles.loadingText}>Loading your Quran data…</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>
            {greeting()},{" "}
            {user?.first_name || user?.name?.split(" ")[0] || "Reader"} 🌙
          </Text>
          <Text style={styles.headerEmail}>{user?.email}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.signOutBtn}>
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadData(true)}
            tintColor={GREEN}
          />
        }
      >
        {apiError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {apiError}</Text>
          </View>
        )}

        {/* Streak card */}
        {streaks && (
          <View style={styles.streakCard}>
            <View style={styles.streakItem}>
              <Text style={styles.streakNumber}>{streaks.current_streak}</Text>
              <Text style={styles.streakLabel}>Day streak 🔥</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.streakItem}>
              <Text style={styles.streakNumber}>{streaks.longest_streak}</Text>
              <Text style={styles.streakLabel}>Best streak ⭐</Text>
            </View>
          </View>
        )}

        {/* Bookmarks */}
        <SectionHeader title="Bookmarks" count={bookmarks.length} />
        {bookmarks.length === 0 ? (
          <EmptyState message="No bookmarks yet. Bookmark a verse on Quran.com and it will appear here." />
        ) : (
          bookmarks.slice(0, 8).map((bk) => (
            <View key={bk.id} style={styles.listItem}>
              <Text style={styles.listItemPrimary}>{bk.verse_key}</Text>
              <Text style={styles.listItemSecondary}>
                {new Date(bk.created_at).toLocaleDateString()}
              </Text>
            </View>
          ))
        )}

        {/* Collections */}
        <SectionHeader title="Collections" count={collections.length} />
        {collections.length === 0 ? (
          <EmptyState message="No collections yet. Create one on Quran.com to organise your favourite verses." />
        ) : (
          collections.map((col) => (
            <View key={col.id} style={styles.listItem}>
              <Text style={styles.listItemPrimary}>{col.name}</Text>
              <Text style={styles.listItemSecondary}>
                {col.bookmarks_count} verse{col.bookmarks_count !== 1 ? "s" : ""}
              </Text>
            </View>
          ))
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Small components ─────────────────────────────────────────────────────────

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{count}</Text>
      </View>
    </View>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const GREEN = "#1A7F5A";
const DARK = "#0D1B1E";
const CARD = "#132020";
const GOLD = "#C9973F";
const TEXT = "#E8F0F2";
const MUTED = "#607880";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DARK },
  center: { flex: 1, backgroundColor: DARK, justifyContent: "center", alignItems: "center" },
  loadingText: { color: MUTED, marginTop: 12, fontSize: 14 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1C3030",
  },
  headerGreeting: { fontSize: 17, fontWeight: "700", color: TEXT },
  headerEmail: { fontSize: 12, color: MUTED, marginTop: 2 },
  signOutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2A4040",
  },
  signOutText: { fontSize: 12, color: MUTED },
  scroll: { padding: 16 },
  errorBox: {
    backgroundColor: "#3D1515",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#E55",
  },
  errorText: { color: "#FFAAAA", fontSize: 13 },
  streakCard: {
    backgroundColor: CARD,
    borderRadius: 14,
    flexDirection: "row",
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: GOLD + "40",
  },
  streakItem: { flex: 1, alignItems: "center" },
  streakNumber: { fontSize: 36, fontWeight: "800", color: GOLD },
  streakLabel: { fontSize: 12, color: MUTED, marginTop: 4 },
  divider: { width: 1, backgroundColor: "#1C3030" },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: TEXT },
  badge: {
    backgroundColor: GREEN + "33",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 12, color: GREEN, fontWeight: "600" },
  listItem: {
    backgroundColor: CARD,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1C3030",
  },
  listItemPrimary: { fontSize: 14, color: TEXT, fontWeight: "500" },
  listItemSecondary: { fontSize: 12, color: MUTED },
  emptyState: {
    padding: 20,
    backgroundColor: CARD,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1C3030",
    borderStyle: "dashed",
    marginBottom: 8,
  },
  emptyText: { fontSize: 13, color: MUTED, textAlign: "center", lineHeight: 20 },
});