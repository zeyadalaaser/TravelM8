import React from "react";

const CategoryItem = ({ category, updateCategory, deleteCategory }) => {
  const handleUpdate = () => {
    const newName = prompt("Enter new name", category.name);
    if (newName) {
      updateCategory(category.name, newName);
    }
  };

  return (
    <div className="category-item">
      <span>{category.name}</span>
      <div>
        <button onClick={handleUpdate}>Update</button>
        <button onClick={() => deleteCategory(category.name)}>Delete</button>
      </div>
    </div>
  );
};

export default CategoryItem;
