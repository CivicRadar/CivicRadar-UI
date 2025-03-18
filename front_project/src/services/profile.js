const getProfile = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/auth/profile/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Failed to fetch profile");
      }
  
      return await response.json(); 
    } catch (error) {
      console.error("Error fetching profile:", error.message);
      throw error;
    }
  };
  
  export { getProfile };
  