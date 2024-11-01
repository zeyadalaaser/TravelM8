import React, { useState, useEffect } from "react";
import CategoryList from "./CategoryList";
import CategoryForm from "./CategoryForm";
import "@/styles/main.css"; // Import your main CSS file
import Navbar from "@/components/Navbar.jsx"; // Import the Navbar component

const ActivityCategories = () => {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // For loading feedback

  // Fetch all categories when the component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(
        "http://localhost:5001/api/activity-categories"
      ); // Ensure this URL is correct

      if (!response.ok) {
        console.error("Response not OK:", response);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched categories:", data); // For debugging
      setCategories(data); // Update state with fetched data
      setMessage(""); // Clear any previous error message
    } catch (error) {
      console.error("Failed to fetch activity categories:", error);
      setMessage("Failed to load categories. Please try again later.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const createCategory = async (name) => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/activity-categories",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        }
      );
      if (response.ok) {
        fetchCategories(); // Refresh the list after creating a new category
        setMessage("Category created successfully!");
      } else {
        setMessage("Error creating category. Please try again.");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      setMessage("Error creating category.");
    }
  };

  const updateCategory = async (currentName, newName) => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/activity-categories",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: currentName, newName }),
        }
      );
      if (response.ok) {
        fetchCategories(); // Refresh the list after updating a category
        setMessage("Category updated successfully!");
      } else {
        setMessage("Error updating category. Please try again.");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      setMessage("Error updating category.");
    }
  };

  const deleteCategory = async (name) => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/activity-categories",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        }
      );
      if (response.ok) {
        fetchCategories(); // Refresh the list after deleting a category
        setMessage("Category deleted successfully!");
      } else {
        setMessage("Error deleting category. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      setMessage("Error deleting category.");
    }
  };

  return (
    <>
      <Navbar /> {/* Include the Navbar component at the top */}
      <div className="container">
        <h1>Manage Activity Categories</h1>
        {message && <p className="message">{message}</p>}{" "}
        {/* Message for feedback */}
        {loading ? (
          <p>Loading...</p> /* Show loading state */
        ) : (
          <>
            <CategoryForm createCategory={createCategory} />
            <h2>All Activity Categories</h2>
            <CategoryList
              categories={categories}
              updateCategory={updateCategory}
              deleteCategory={deleteCategory}
            />
          </>
        )}
      </div>
    </>
  );
};

export default ActivityCategories;
