const API_BASE_URL = "http://127.0.0.1:8000/mayor-registry";

const getProvince = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/provinces/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Failed to fetch provinces");
      }
  
      return await response.json(); 
    } catch (error) {
      console.error("Error fetching provinces:", error.message);
      throw error;
    }
  };
  export { getProvince };

export const getCity = async (ProvinceID) => {
    try {
        const response = await fetch(`${API_BASE_URL}/cities/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ ProvinceID: ProvinceID }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log("Cities Error Response:", errorData);

            let errorMessage = "Cities fetch failed!";
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Error in Cities fetch:", error);
        throw error;
    }
};

export const addMayor = async (MayorData) => {
  try {
      const response = await fetch(`${API_BASE_URL}/add/`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ 
            FullName: MayorData.FullName,
            Email: MayorData.Email,
            Password: MayorData.Password,
            CityID: MayorData.CityID
          }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Signup Error Response:", errorData);
        console.log(typeof errorData) ;
        let errorMessage = "Signup failed!";
        if (errorData.detail) {
            errorMessage = errorData.detail; 
        } else if (typeof errorData === "string") {
            errorMessage = errorData;
        }

        throw new Error(errorMessage);
    }

    return await response.json();
} catch (error) {
    console.error("Error in Mayor Signup:", error);
    throw error;
}
};
