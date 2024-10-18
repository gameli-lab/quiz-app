import React from 'react';
import './teacher-dashboard.css';

const CreateQuizSection = () => {
  return (
    <div className="create-quiz-section">
      <h2>Create New Quiz</h2>
      {/* Quiz creation form goes here */}
      <form>
        <div>
          <label htmlFor="title">Quiz Title</label>
          <input type="text" id="title" name="title" required />
        </div>
        <div>
          <label htmlFor="category">Category</label>
          <input type="text" id="category" name="category" required />
        </div>
        <div>
          <label htmlFor="questions">Questions</label>
          <textarea id="questions" name="questions" required></textarea>
        </div>
        <button type="submit">Create Quiz</button>
      </form>
    </div>
  );
};

export default CreateQuizSection;
