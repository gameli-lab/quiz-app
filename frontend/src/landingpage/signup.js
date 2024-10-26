import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/signup.css"; // Import your CSS

const Signup = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State to capture user inputs
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [schoolName, setSchoolName] = useState("");

  // Student-specific state
  const [gradeLevel, setGradeLevel] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [guardianContact, setGuardianContact] = useState("");

  // Teacher-specific state
  const [subjectExpertise, setSubjectExpertise] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");

  // Capture role from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get("role");
    setRole(roleParam || ""); // Default to empty if no role is passed
  }, [location]);

  // Handle form submission
  const handleSignup = async (event) => {
    event.preventDefault();

    // Prepare the user data object
    const userData = {
      email,
      password,
      username,
      fullName,
      role,
      schoolName
    };

    // Add student-specific fields
    if (role === "student") {
      userData.gradeLevel = gradeLevel;
      userData.dateOfBirth = dateOfBirth;
      userData.guardianContact = guardianContact;
    }

    // Add teacher-specific fields
    if (role === "teacher") {
      userData.subjectExpertise = subjectExpertise;
      userData.phoneNumber = phoneNumber;
      userData.yearsOfExperience = yearsOfExperience;
    }

    try {
      // Send POST request to the backend
      const response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      // Handle the response
      const data = await response.json();
      if (response.ok) {
        console.log("User created successfully:", data);
        // Redirect user after successful signup (e.g., to login page or dashboard)
        if (data.role === "admin") {
          navigate("/admin/AdminDashboard"); // Redirect to admin dashboard
        } else if (data.role === "teacher") {
          navigate("/teacher/TeacherDashboard"); // Redirect to teacher dashboard
        } else {
          navigate("/student/StudentDashboard"); // Redirect to student dashboard
        } //navigate('/login');  // Redirect to login page after successful signup
      } else {
        console.error(
          "Error:",
          data.message || "An error occurred during signup"
        );
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="signup">
      <h2>Signup as {role.charAt(0).toUpperCase() + role.slice(1)}</h2>
      <form onSubmit={handleSignup}>
        {/* Common fields for all users */}
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="School Name"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          required
        />

        {/* Student-specific fields */}
        {role === "student" && (
          <>
            <input
              type="text"
              placeholder="Grade Level"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              required
            />
            <input
              type="date"
              placeholder="Date of Birth"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Guardian Contact"
              value={guardianContact}
              onChange={(e) => setGuardianContact(e.target.value)}
              required
            />
          </>
        )}

        {/* Teacher-specific fields */}
        {role === "teacher" && (
          <>
            <input
              type="text"
              placeholder="Subject Expertise"
              value={subjectExpertise}
              onChange={(e) => setSubjectExpertise(e.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Years of Experience"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
              required
            />
          </>
        )}

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
