const getProfile = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/profile/", {
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
  