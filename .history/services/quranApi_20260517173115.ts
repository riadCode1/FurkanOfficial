/**
 * quranApi.ts — Quran Foundation User API service
 *
 * Every request attaches the two required headers:
 *   x-auth-token  →  OAuth2 access_token (auto-refreshed if expired)
 *   x-client-id   →  your app's client_id
 *
 * Available User API endpoints (production):
 *   GET  /auth/v1/bookmarks
 *   POST /auth/v1/bookmarks
 *   GET  /auth/v1/collections
 *   POST /auth/v1/collections
 *   GET  /auth/v1/notes
 *   GET  /auth/v1/reading-sessions
 *   GET  /auth/v1/user/profile
 *   GET  /auth/v1/user/preferences
 *   GET  /auth/v1/goals
 *   GET  /auth/v1/streaks
 */

import { API_BASE_URL, CLIENT_ID } from "../config";

type GetTokenFn = () => Promise<string>;

class QuranApiService {
  private getToken: GetTokenFn | null = null;

  /** Called once by useQuranApi to inject the token getter */
  init(getToken: GetTokenFn) {
    this.getToken = getToken;
  }

  private async headers(): Promise<Record<string, string>> {
    if (!this.getToken) throw new Error("QuranApiService not initialized");
    const token = await this.getToken();
    return {
      "x-auth-token": token,
      "x-client-id": CLIENT_ID,
      "Content-Type": "application/json",
    };
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(options.headers ?? {}),
        ...(await this.headers()),
      },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message ?? `API error ${res.status}: ${path}`);
    }

    return res.json() as Promise<T>;
  }

  // ─── Bookmarks ────────────────────────────────────────────────────────────

  getBookmarks() {
    return this.request<BookmarkList>("/auth/v1/bookmarks");
  }

  addBookmark(verseKey: string) {
    return this.request<Bookmark>("/auth/v1/bookmarks", {
      method: "POST",
      body: JSON.stringify({ verse_key: verseKey }),
    });
  }

  deleteBookmark(id: number) {
    return this.request<void>(`/auth/v1/bookmarks/${id}`, { method: "DELETE" });
  }

  // ─── Collections ──────────────────────────────────────────────────────────

  getCollections() {
    return this.request<CollectionList>("/auth/v1/collections");
  }

  createCollection(name: string) {
    return this.request<Collection>("/auth/v1/collections", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  }

  // ─── Notes ────────────────────────────────────────────────────────────────

  getNotes(verseKey?: string) {
    const query = verseKey ? `?verse_key=${verseKey}` : "";
    return this.request<NoteList>(`/auth/v1/notes${query}`);
  }

  saveNote(verseKey: string, body: string) {
    return this.request<Note>("/auth/v1/notes", {
      method: "POST",
      body: JSON.stringify({ verse_key: verseKey, body }),
    });
  }

  // ─── Reading sessions & goals ─────────────────────────────────────────────

  getReadingSessions() {
    return this.request<ReadingSessionList>("/auth/v1/reading-sessions");
  }

  getGoals() {
    return this.request<GoalList>("/auth/v1/goals");
  }

  getStreaks() {
    return this.request<StreakList>("/auth/v1/streaks");
  }

  // ─── User profile & preferences ───────────────────────────────────────────

  getUserProfile() {
    return this.request<UserApiProfile>("/auth/v1/user/profile");
  }

  getPreferences() {
    return this.request<Preferences>("/auth/v1/user/preferences");
  }

  updatePreferences(prefs: Partial<Preferences>) {
    return this.request<Preferences>("/auth/v1/user/preferences", {
      method: "PATCH",
      body: JSON.stringify(prefs),
    });
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Bookmark {
  id: number;
  verse_key: string;
  created_at: string;
}

export interface BookmarkList {
  bookmarks: Bookmark[];
}

export interface Collection {
  id: number;
  name: string;
  bookmarks_count: number;
}

export interface CollectionList {
  collections: Collection[];
}

export interface Note {
  id: number;
  verse_key: string;
  body: string;
  created_at: string;
}

export interface NoteList {
  notes: Note[];
}

export interface ReadingSession {
  id: number;
  verse_key_from: string;
  verse_key_to: string;
  duration: number;
  created_at: string;
}

export interface ReadingSessionList {
  reading_sessions: ReadingSession[];
}

export interface Goal {
  id: number;
  pages: number;
  duration: string;
}

export interface GoalList {
  goals: Goal[];
}

export interface StreakList {
  current_streak: number;
  longest_streak: number;
}

export interface UserApiProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  username?: string;
}

export interface Preferences {
  font_size?: number;
  reading_mode?: "reading" | "translation";
  theme?: "light" | "dark" | "sepia";
  translations?: string[];
}

// Singleton
export const quranApi = new QuranApiService();

// ─── React hook ───────────────────────────────────────────────────────────────

import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

/** Initializes the API service with the current session's token getter */
export function useQuranApi() {
  const { getAccessToken } = useAuth();

  useEffect(() => {
    quranApi.init(getAccessToken);
  }, [getAccessToken]);

  return quranApi;
}

const createBookmark = async () => {
  console.log("Creating bookmark...");
  try {
    const data = {
      key: 2,
      type: "ayah",
      verseNumber: 3,
      isReading: true,
      mushafId: 4,
      mushaf: 4,
    };

    const response = await axios.post(
      "https://apis.quran.foundation/auth/v1/bookmarks",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-auth-token": "<API_KEY_VALUE>",
          "x-client-id": "<API_KEY_VALUE>",
        },
        maxBodyLength: Infinity,
      }
    );

    console.log("Success:", response.data);
    return response.data;
  } catch (error) {
    console.log("Error:", error?.response?.data || error.message);
  }
};

export default createBookmark;