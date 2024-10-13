// ---- Main function for fetching (GET) data from Spotify API
const getSpotifyApiData = async (token: string | null, url: string) => {
  if (!token) {
    throw new Error(`Invalid token`);
  }

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorBody}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching data from Spotify API:", error);
    throw error;
  }
};
