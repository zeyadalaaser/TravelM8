import React, { useState } from "react";

const CategoryForm = ({ createCategory }) => {
  const [category, setCategory] = useState(""); // State to hold the category input

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (category) {
      createCategory(category); // Call the createCategory function passed as a prop
      setCategory(""); // Clear the input field after submission
    }
  };

  return (
    <form onSubmit={handleSubmit} className="category-form">
      <input
        type="text"
        placeholder="Add Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)} // Update state with input value
        required
      />
      <button type="submit">Add</button> {/* Button to submit the form */}
    </form>
  );
};

export default CategoryForm; // Export the component
