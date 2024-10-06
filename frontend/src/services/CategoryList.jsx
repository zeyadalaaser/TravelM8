import React from "react";
import CategoryItem from "./CategoryItem";

const CategoryList = ({ categories, updateCategory, deleteCategory }) => {
  if (categories.length === 0) {
    return <p>No categories found.</p>;
  }

  return (
    <div className="categories-list">
      {categories.map((category) => (
        <CategoryItem
          key={category.name}
          category={category}
          updateCategory={updateCategory}
          deleteCategory={deleteCategory}
        />
      ))}
    </div>
  );
};

export default CategoryList;
