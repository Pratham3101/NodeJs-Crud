import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./CategoryMaster.css"; // Import CSS file

const CategoryMaster = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Fetch categories
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  // Add category
  const addCategory = () => {
    axios
      .post("http://localhost:5000/api/categories", {
        name: categoryName,
      })
      .then((response) => {
        setCategories([...categories, response.data]);
        setCategoryName("");
      })
      .catch((error) => {
        console.error("Error adding category:", error);
      });
  };

  // Delete category
  const deleteCategory = (id) => {
    axios
      .delete(`http://localhost:5000/api/categories/${id}`)
      .then(() => {
        setCategories(categories.filter((cat) => cat.id !== id));
        setShowDeletePopup(false);
      })
      .catch((error) => {
        console.error("Error deleting category:", error);
      });
  };

  // Show delete confirmation popup
  const confirmDelete = (id) => {
    setCategoryToDelete(id);
    setShowDeletePopup(true);
  };

  // Edit category
  const editCategory = (category) => {
    setEditingCategory({ ...category });
  };

  // Save edited category
  const saveEditedCategory = () => {
    axios
      .put(
        `http://localhost:5000/api/categories/${editingCategory.id}`,
        editingCategory
      )
      .then((response) => {
        setCategories(
          categories.map((cat) =>
            cat.id === editingCategory.id ? response.data : cat
          )
        );
        setEditingCategory(null);
      })
      .catch((error) => {
        console.error("Error updating category:", error);
      });
  };

  return (
    <div className="category-master">
      <h2>Category Master</h2>

      {/* Add Category Form */}
      <div className="category-form">
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Category Name"
        />
        <button onClick={addCategory}>Add Category</button>
      </div>

      {/* Category Table */}
      <table className="category-table">
        <thead>
          <tr>
            <th>Category ID</th>
            <th>Category Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>
                {editingCategory?.id === cat.id ? (
                  <input
                    type="text"
                    value={editingCategory.id}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        id: e.target.value,
                      })
                    }
                  />
                ) : (
                  cat.id
                )}
              </td>
              <td>
                {editingCategory?.id === cat.id ? (
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        name: e.target.value,
                      })
                    }
                  />
                ) : (
                  cat.name
                )}
              </td>
              <td>
                {editingCategory?.id === cat.id ? (
                  <button className="save-button" onClick={saveEditedCategory}>
                    Save
                  </button>
                ) : (
                  <>
                    <button
                      className="icon-button"
                      onClick={() => editCategory(cat)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="icon-button"
                      onClick={() => confirmDelete(cat.id)}
                    >
                      <FaTrash />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Are you sure you want to delete this category?</p>
            <button
              className="yes-button"
              onClick={() => deleteCategory(categoryToDelete)}
            >
              Yes
            </button>
            <button
              className="no-button"
              onClick={() => setShowDeletePopup(false)}
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryMaster;
