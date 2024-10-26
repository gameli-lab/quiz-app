// logout.js
export const handleLogout = async (navigate) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    try {
      await fetch("http://localhost:5000/disconnect", {
        method: "POST",
        headers: {
          "x-token": token
        }
      });
      // Remove token and user role from localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      localStorage.setItem("isLoggedIn", "false");

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  } else {
    // If no token is found, just redirect to login
    navigate("/login");
  }
};
