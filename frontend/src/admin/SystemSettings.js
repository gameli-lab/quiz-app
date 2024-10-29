import React, { useState, useEffect } from "react";
import axios from "axios";

const Settings = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const fetchCategories = async () => {
    const token = localStorage.getItem("authToken");
    const response = await axios.get("http://localhost:5000/categories", {
      headers: { "x-token": token }
    });
    setCategories(response.data);
  };

  const createCategory = async () => {
    const token = localStorage.getItem("authToken");
    await axios.post(
      "http://localhost:5000/categories",
      { name: categoryName },
      {
        headers: { "x-token": token }
      }
    );
    setCategoryName("");
    fetchCategories();
  };

  const updateCategory = async () => {
    const token = localStorage.getItem("authToken");
    await axios.put(
      `http://localhost:5000/categories/${selectedCategoryId}`,
      { name: categoryName },
      {
        headers: { "x-token": token }
      }
    );
    setCategoryName("");
    setSelectedCategoryId(null);
    fetchCategories();
  };

  const deleteCategory = async (id) => {
    const token = localStorage.getItem("authToken");
    await axios.delete(`http://localhost:5000/categories/${id}`, {
      headers: { "x-token": token }
    });
    fetchCategories();
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme; // Apply the theme to the body
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <h1>Settings</h1>

      <h2>Manage Categories</h2>
      <input
        type="text"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        placeholder="Category Name"
      />
      {selectedCategoryId ? (
        <button onClick={updateCategory}>Update Category</button>
      ) : (
        <button onClick={createCategory}>Create Category</button>
      )}

      <h3>Categories List</h3>
      <ul>
        {categories.map((category) => (
          <li key={category._id}>
            {category.name}
            <button
              onClick={() => {
                setCategoryName(category.name);
                setSelectedCategoryId(category._id);
              }}
            >
              Edit
            </button>
            <button onClick={() => deleteCategory(category._id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>System Theme</h2>
      <button onClick={toggleTheme}>
        Switch to {theme === "light" ? "Dark" : "Light"} Theme
      </button>
    </div>
  );
};

export default Settings;
