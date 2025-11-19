import { createContext, useContext, ReactNode, useMemo } from "react";
import type {
  RealtimePostgresChangesPayload,
  RealtimeChannel,
  SupabaseClient,
} from "@supabase/supabase-js";
import { supabaseClient } from "../lib/supabaseClient";

type SupabasePayload = RealtimePostgresChangesPayload<any>;

interface SupabaseContextType {
  client: SupabaseClient;
  subscribeToRides: (callback: (payload: SupabasePayload) => void) => () => void;
  subscribeToInventory: (callback: (payload: SupabasePayload) => void) => () => void;
  subscribeToOrders: (callback: (payload: SupabasePayload) => void) => () => void;
  uploadFile: (bucket: string, path: string, file: File) => Promise<string>;
  downloadFile: (bucket: string, path: string) => Promise<string>;
  trackUserPresence: (userId: string) => Promise<void>;
  getOnlineUsers: () => Promise<string[]>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

const presenceChannel = supabaseClient.channel("airbear-presence", {
  config: { presence: { key: "airbear-presence-user" } },
});
try {
  presenceChannel.subscribe();
} catch (err) {
  console.warn("Unable to subscribe to presence channel", err);
}

function createRealtimeSubscription(
  table: string,
  callback: (payload: SupabasePayload) => void
) {
  const channel = supabaseClient.channel(`airbear-${table}-updates`);
  channel.on(
    "postgres_changes",
    { event: "*", schema: "public", table },
    callback
  );
  try {
    channel.subscribe();
  } catch (err) {
    console.warn(`Realtime subscribe failed for ${table}`, err);
  }

  return () => {
    channel.unsubscribe();
    supabaseClient.removeChannel(channel);
  };
}

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const subscribeToRides = (callback: (payload: SupabasePayload) => void) =>
    createRealtimeSubscription("rides", callback);

  const subscribeToInventory = (callback: (payload: SupabasePayload) => void) =>
    createRealtimeSubscription("inventory", callback);

  const subscribeToOrders = (callback: (payload: SupabasePayload) => void) =>
    createRealtimeSubscription("orders", callback);

  const uploadFile = async (bucket: string, path: string, file: File) => {
    const { data, error } = await supabaseClient.storage
      .from(bucket)
      .upload(path, file, { upsert: true });
    if (error || !data) {
      throw error ?? new Error("Failed to upload file");
    }
    return data.path;
  };

  const downloadFile = async (bucket: string, path: string) => {
    const { data, error } = await supabaseClient.storage.from(bucket).download(path);
    if (error || !data) {
      throw error ?? new Error("Failed to download file");
    }
    const url = URL.createObjectURL(data);
    return url;
  };

  const trackUserPresence = async (userId: string) => {
    try {
      await presenceChannel.track({ userId });
    } catch (err) {
      console.warn("Unable to track user presence", err);
    }
  };

  const getOnlineUsers = async () => {
    const state = presenceChannel.presenceState();
    return Object.keys(state);
  };

  const value = useMemo(
    () => ({
      client: supabaseClient,
      subscribeToRides,
      subscribeToInventory,
      subscribeToOrders,
      uploadFile,
      downloadFile,
      trackUserPresence,
      getOnlineUsers,
    }),
    []
  );

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
}
