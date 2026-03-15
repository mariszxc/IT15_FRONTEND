import { activityLogsRequest, storeActivityRequest } from "../services/api";

const ACTIVITY_STORAGE_KEY = "user_activity_logs";

const readRawLogs = () => {
  try {
    const raw = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeRawLogs = (logs) => {
  localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(logs));
};

const getCurrentActor = () => {
  try {
    const raw = localStorage.getItem("auth_user");
    const user = raw ? JSON.parse(raw) : null;

    return {
      id: user?.id ?? null,
      name: user?.name ?? "Current User",
      email: user?.email ?? "unknown@example.com",
    };
  } catch {
    return {
      id: null,
      name: "Current User",
      email: "unknown@example.com",
    };
  }
};

export const logUserActivity = ({ action, entity, description, metadata = {} }) => {
  const actor = getCurrentActor();
  const logs = readRawLogs();

  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    actor,
    action,
    entity,
    description,
    metadata,
    timestamp: new Date().toISOString(),
  };

  const next = [entry, ...logs].slice(0, 500);
  writeRawLogs(next);

  storeActivityRequest({
    action,
    entity,
    description,
    metadata,
    timestamp: entry.timestamp,
  }).catch(() => {
    // Keep local fallback only when API is unavailable.
  });

  return entry;
};

const normalizeActivitiesPayload = (payload) => {
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  return [];
};

export const getUserActivities = async () => {
  const actor = getCurrentActor();

  try {
    const response = await activityLogsRequest({ per_page: 500 });
    const logs = normalizeActivitiesPayload(response?.data);

    if (logs.length > 0) {
      writeRawLogs(logs);
    }

    return logs;
  } catch {
    const logs = readRawLogs();

    return logs.filter((entry) => {
      if (!entry?.actor) {
        return false;
      }

      if (actor.id != null && entry.actor.id != null) {
        return entry.actor.id === actor.id;
      }

      return entry.actor.email === actor.email;
    });
  }
};
