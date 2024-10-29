import React, { useState, useEffect } from "react";
import "./ProfileSection.css";

const ProfileSection = () => {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/users/me", {
        method: "GET",
        headers: {
          "x-token": token
        }
      });

      if (!response.ok) {
        console.error("Error fetching profile:", await response.json());
        return;
      }
      const data = await response.json();
      // console.log(data);
      setProfile(data);
    }

    fetchProfile();
  }, []);

  return (
    <div className="profile-section">
      <h3>Name: {profile.name}</h3>
      <p>Email: {profile.email}</p>
      <p>Role: {profile.role}</p>
    </div>
  );
};

export default ProfileSection;

/* import React, { useState, useEffect } from "react";
import "./ProfileSection.css";

const ProfileSection = () => {
  const [profile, setProfile] = useState(null); // Start with null to check loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No authentication token found.");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/users/me", {
          method: "GET",
          headers: {
            "x-token": token,
            "Content-Type": "application/json" // Optional but good practice
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch profile.");
        }

        const data = await response.json();
        // console.log(data);
        setProfile(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <div className="error-message">Error: {error}</div>; // Display error message
  }

  if (!profile) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <div className="profile-section">
      <h3>Name: {profile.fullName || "N/A"}</h3>{" "}
      {/* Changed to fullName based on your backend response *}
      <p>Email: {profile.email || "N/A"}</p>
      <p>Role: {profile.role || "N/A"}</p>
      <p>ID: {profile._id || "N/A"}</p>
      {/* Add more fields as necessary *}
    </div>
  );
};

export default ProfileSection;
 */

/* import React, { useEffect, useState } from "react";

const ProfileSection = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch("http://localhost:5000/user/me", {
        method: "GET",
        headers: {
          "x-token": token,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile", response.statusText);
      }

      const data = await response.json();
      setUserProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userProfile) {
    return <div>No user profile found.</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <p>
        <strong>Name:</strong> {userProfile.fullName}
      </p>
      <p>
        <strong>Email:</strong> {userProfile.email}
      </p>
      <p>
        <strong>Role:</strong> {userProfile.role}
      </p>
    </div>
  );
};
 


export default ProfileSection;
*/
