import "./QuizManagement.css";
import React, { useState, useEffect } from "react";

function QuizManagement() {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [newQuiz, setNewQuiz] = useState({ title: "", questions: [] });
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchQuizzes();
    fetchCategories();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch("/api/quizzes");
      const data = await response.json();
      setQuizzes(data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const filterQuizzes = () => {
    return quizzes.filter(
      (quiz) =>
        (selectedCategory ? quiz.category === selectedCategory : true) &&
        (approvalStatus ? quiz.status === approvalStatus : true)
    );
  };

  const approveQuiz = async (quizId) => {
    try {
      await fetch(`/api/quizzes/${quizId}/approve`, { method: "PUT" });
      fetchQuizzes();
    } catch (error) {
      console.error("Error approving quiz:", error);
    }
  };

  const deleteQuiz = async (quizId) => {
    try {
      await fetch(`/api/quizzes/${quizId}`, { method: "DELETE" });
      fetchQuizzes();
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await fetch(`/api/categories/${editingCategory}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newCategory })
        });
      } else {
        await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newCategory })
        });
      }
      setNewCategory("");
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error("Error managing category:", error);
    }
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuiz)
      });
      setNewQuiz({ title: "", questions: [] });
      fetchQuizzes();
    } catch (error) {
      console.error("Error adding quiz:", error);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      await fetch("/api/quizzes/upload", {
        method: "POST",
        body: formData
      });
      setFile(null);
      fetchQuizzes();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleAddQuestion = () => {
    setNewQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, { text: "", answer: "" }]
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = newQuiz.questions.map((question, i) => {
      if (i === index) {
        return { ...question, [field]: value };
      }
      return question;
    });
    setNewQuiz((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  // Define the editCategory function
  const editCategory = (category) => {
    setNewCategory(category.name);
    setEditingCategory(category._id); // Set the ID for the category being edited
  };

  const deleteCategory = async (categoryId) => {
    try {
      await fetch(`/api/categories/${categoryId}`, { method: "DELETE" });
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div>
      <h2>Quiz Management</h2>

      {/* Add Quiz Form */}
      <form onSubmit={handleQuizSubmit}>
        <h3>Add New Quiz</h3>
        <input
          type="text"
          placeholder="Quiz Title"
          value={newQuiz.title}
          onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
          required
        />
        <h4>Questions</h4>
        {newQuiz.questions.map((question, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Question"
              value={question.text}
              onChange={(e) =>
                handleQuestionChange(index, "text", e.target.value)
              }
              required
            />
            <input
              type="text"
              placeholder="Answer"
              value={question.answer}
              onChange={(e) =>
                handleQuestionChange(index, "answer", e.target.value)
              }
              required
            />
          </div>
        ))}
        <button type="button" onClick={handleAddQuestion}>
          Add Question
        </button>
        <button type="submit">Add Quiz</button>
      </form>

      {/* File Upload Form */}
      <form onSubmit={handleFileUpload}>
        <h3>Upload Quiz File</h3>
        <input
          type="file"
          accept=".txt,.pdf,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit">Upload</button>
      </form>

      {/* Filters */}
      <div>
        <label>
          Filter by Category:
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Filter by Approval Status:
          <select
            value={approvalStatus}
            onChange={(e) => setApprovalStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </label>
      </div>

      {/* Quiz List */}
      <table>
        <thead>
          <tr>
            <th>Quiz Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filterQuizzes().map((quiz) => (
            <tr key={quiz._id}>
              <td>{quiz.title}</td>
              <td>{quiz.category}</td>
              <td>{quiz.status}</td>
              <td>
                {quiz.status === "pending" && (
                  <button onClick={() => approveQuiz(quiz._id)}>Approve</button>
                )}
                <button onClick={() => deleteQuiz(quiz._id)}>Delete</button>
                <button>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Category Management */}
      <div>
        <h3>Manage Categories</h3>
        <form onSubmit={handleCategorySubmit}>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Category name"
            required
          />
          <button type="submit">
            {editingCategory ? "Update Category" : "Add Category"}
          </button>
        </form>

        <ul>
          {categories.map((category) => (
            <li key={category._id}>
              {category.name}
              <button onClick={() => editCategory(category)}>Edit</button>
              <button onClick={() => deleteCategory(category._id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default QuizManagement;
