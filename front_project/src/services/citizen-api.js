const getReportData = async (reportID) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/supervise/public-report/?CityProblem_ID=${reportID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "omit", // چون endpoint عمومی است نیازی به کوکی نیست
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Failed to fetch report");
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error fetching report:", error.message);
      throw error;
    }
  };
  
  export { getReportData };
  