const API_BASE_URL = "http://localhost:8000/api";

export async function apiGet(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error("Request failed");
  }
  return response.json();
}
