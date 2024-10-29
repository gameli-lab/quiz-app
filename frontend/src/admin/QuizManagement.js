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
  const [editingQuiz, setEditingQuiz] = useState(null); // New state for editing quizzes

  useEffect(() => {
    fetchQuizzes();
    fetchCategories();
  }, []);

  const fetchQuizzes = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch("http://localhost:5000/quizzes", {
        headers: {
          "x-token": token
        }
      });
      const data = await response.json();
      setQuizzes(data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/categories", {
        headers: {
          "x-token": localStorage.getItem("authToken")
        }
      });
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
      await fetch(`http://localhost:5000/quizzes/${quizId}/approve`, {
        method: "PUT",
        headers: {
          "x-token": localStorage.getItem("authToken")
        }
      });
      fetchQuizzes();
    } catch (error) {
      console.error("Error approving quiz:", error);
    }
  };

  const rejectQuiz = async (quizId) => {
    try {
      await fetch(`http://localhost:5000/quizzes/${quizId}/reject`, {
        method: "PUT",
        headers: {
          "x-token": localStorage.getItem("authToken")
        }
      });
      fetchQuizzes();
    } catch (error) {
      console.error("Error rejecting quiz:", error);
    }
  };

  const deleteQuiz = async (quizId) => {
    try {
      await fetch(`http://localhost:5000/quizzes/${quizId}`, {
        method: "DELETE",
        headers: {
          "x-token": localStorage.getItem("authToken")
        }
      });
      fetchQuizzes();
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await fetch(`http://localhost:5000/categories/${editingCategory}`, {
          method: "PUT",
          headers: {
            "x-token": localStorage.getItem("authToken"),
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ name: newCategory })
        });
      } else {
        await fetch("http://localhost:5000/categories", {
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
      if (editingQuiz) {
        await fetch(`http://localhost:5000/quizzes/${editingQuiz}`, {
          method: "PUT",
          headers: {
            "x-token": localStorage.getItem("authToken"),
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newQuiz)
        });
      } else {
        await fetch("http://localhost:5000/quizzes", {
          method: "POST",
          headers: {
            "x-token": localStorage.getItem("authToken"),
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newQuiz)
        });
      }
      setNewQuiz({ title: "", questions: [] });
      setEditingQuiz(null); // Reset editing state
      fetchQuizzes();
    } catch (error) {
      console.error("Error adding/updating quiz:", error);
    }
  };

  const handleFileUpload = async (e) => {
    const token = localStorage.getItem("authToken");
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      await fetch("http://localhost:5000/quizzes/upload", {
        headers: {
          "x-token": token
        },
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

  const editCategory = (category) => {
    setNewCategory(category.name);
    setEditingCategory(category._id);
  };

  const deleteCategory = async (categoryId) => {
    try {
      await fetch(`http://localhost:5000/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          "x-token": localStorage.getItem("authToken")
        }
      });
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // Function to edit a quiz
  const editQuiz = (quiz) => {
    setNewQuiz(quiz);
    setEditingQuiz(quiz._id); // Set the ID for the quiz being edited
  };

  return (
    <div>
      <h2>Quiz Management</h2>

      {/* Add/Edit Quiz Form */}
      <form onSubmit={handleQuizSubmit}>
        <h3>{editingQuiz ? "Edit Quiz" : "Add New Quiz"}</h3>
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
        <button type="submit">
          {editingQuiz ? "Update Quiz" : "Add Quiz"}
        </button>
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
                  <>
                    <button onClick={() => approveQuiz(quiz._id)}>
                      Approve
                    </button>
                    <button onClick={() => rejectQuiz(quiz._id)}>Reject</button>
                  </>
                )}
                <button onClick={() => editQuiz(quiz)}>Edit</button>
                <button onClick={() => deleteQuiz(quiz._id)}>Delete</button>
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
