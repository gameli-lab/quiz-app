import './QuizManagement.css';
import React, { useState, useEffect } from 'react';

function QuizManagement() {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [approvalStatus, setApprovalStatus] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  // Fetch quizzes and categories on component mount
  useEffect(() => {
    fetchQuizzes();
    fetchCategories();
  }, []);

  // Fetch quizzes from API
  const fetchQuizzes = async () => {
    try {
      const response = await fetch('/api/quizzes');
      const data = await response.json();
      setQuizzes(data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Filter quizzes by category and approval status
  const filterQuizzes = () => {
    return quizzes.filter(quiz => 
      (selectedCategory ? quiz.category === selectedCategory : true) &&
      (approvalStatus ? quiz.status === approvalStatus : true)
    );
  };

  // Handle quiz approval
  const approveQuiz = async (quizId) => {
    try {
      await fetch(`/api/quizzes/${quizId}/approve`, { method: 'PUT' });
      fetchQuizzes(); // Refresh quiz list
    } catch (error) {
      console.error('Error approving quiz:', error);
    }
  };

  // Handle quiz deletion
  const deleteQuiz = async (quizId) => {
    try {
      await fetch(`/api/quizzes/${quizId}`, { method: 'DELETE' });
      fetchQuizzes(); // Refresh quiz list
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  // Handle creating or updating categories
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        // Update existing category
        await fetch(`/api/categories/${editingCategory}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newCategory }),
        });
      } else {
        // Create new category
        await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newCategory }),
        });
      }
      setNewCategory('');
      setEditingCategory(null);
      fetchCategories(); // Refresh category list
    } catch (error) {
      console.error('Error managing category:', error);
    }
  };

  // Handle editing category
  const editCategory = (category) => {
    setNewCategory(category.name);
    setEditingCategory(category._id);
  };

  // Handle deleting category
  const deleteCategory = async (categoryId) => {
    try {
      await fetch(`/api/categories/${categoryId}`, { method: 'DELETE' });
      fetchCategories(); // Refresh category list
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div>
      <h2>Quiz Management</h2>

      {/* Filters */}
      <div>
        <label>
          Filter by Category:
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category._id} value={category.name}>{category.name}</option>
            ))}
          </select>
        </label>

        <label>
          Filter by Approval Status:
          <select value={approvalStatus} onChange={e => setApprovalStatus(e.target.value)}>
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
          {filterQuizzes().map(quiz => (
            <tr key={quiz._id}>
              <td>{quiz.title}</td>
              <td>{quiz.category}</td>
              <td>{quiz.status}</td>
              <td>
                {quiz.status === 'pending' && <button onClick={() => approveQuiz(quiz._id)}>Approve</button>}
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
            onChange={e => setNewCategory(e.target.value)}
            placeholder="Category name"
            required
          />
          <button type="submit">{editingCategory ? 'Update Category' : 'Add Category'}</button>
        </form>

        <ul>
          {categories.map(category => (
            <li key={category._id}>
              {category.name} 
              <button onClick={() => editCategory(category)}>Edit</button>
              <button onClick={() => deleteCategory(category._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default QuizManagement;
