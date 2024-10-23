import React, { useState, useEffect } from "react";
import "./ProfileSection.css";

const ProfileSection = () => {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:5000/users/me",{
        method: 'GET',
        headers: {
          'x-token': token
      }
    });

  if (!response.ok) {
        console.error("Error fetching profile:", await response.json());
        return;
    }
                                  );
      const data = await response.json();
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
