import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./ProductMaster.css"; // Import CSS file

const ProductMaster = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productName, setProductName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredCategory, setFilteredCategory] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });

  // Fetch products with pagination
  const fetchProducts = (page = pagination.page, pageSize = pagination.pageSize) => {
    axios
      .get("http://localhost:5000/api/products", {
        params: { page, pageSize },
      })
      .then((response) => {
        setProducts(response.data.data);
        setPagination(response.data.pagination);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

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

  // Fetch products on component mount and when pagination changes
  useEffect(() => {
    fetchProducts();
  }, [pagination.page, pagination.pageSize]);

  // Add product
  const addProduct = () => {
    axios
      .post("http://localhost:5000/api/products", {
        name: productName,
        categoryId: selectedCategory,
      })
      .then((response) => {
        setProducts([...products, response.data]);
        setProductName("");
        setSelectedCategory("");
        fetchProducts(); // Refresh the product list
      })
      .catch((error) => {
        console.error("Error adding product:", error);
      });
  };

  // Delete product
  const deleteProduct = (id) => {
    axios
      .delete(`http://localhost:5000/api/products/${id}`)
      .then(() => {
        setProducts(products.filter((prod) => prod.id !== id));
        setShowDeletePopup(false);
        fetchProducts(); // Refresh the product list
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
      });
  };

  // Show delete confirmation popup
  const confirmDelete = (id) => {
    setProductToDelete(id);
    setShowDeletePopup(true);
  };

  // Edit product
  const editProduct = (product) => {
    setEditingProduct({ ...product });
  };

  // Save edited product
  const saveEditedProduct = () => {
    axios
      .put(`http://localhost:5000/api/products/${editingProduct.id}`, editingProduct)
      .then((response) => {
        setProducts(
          products.map((prod) =>
            prod.id === editingProduct.id ? response.data : prod
          )
        );
        setEditingProduct(null);
        fetchProducts(); // Refresh the product list
      })
      .catch((error) => {
        console.error("Error updating product:", error);
      });
  };

  // Filter products by category
  const filteredProducts = filteredCategory
    ? products.filter((prod) => prod.categoryId === parseInt(filteredCategory))
    : products;

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  return (
    <div className="product-master">
      <h2>Product Master</h2>

      {/* Add Product Form */}
      <div className="product-form">
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Product Name"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button onClick={addProduct}>Add Product</button>
      </div>

      {/* Filter by Category */}
      <div className="filter-section">
        <label>Filter by Category:</label>
        <select
          value={filteredCategory}
          onChange={(e) => setFilteredCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product Table */}
      <table className="product-table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Category Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((prod) => (
            <tr key={prod.id}>
              <td>
                {editingProduct?.id === prod.id ? (
                  <input
                    type="text"
                    value={editingProduct.id}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        id: e.target.value,
                      })
                    }
                  />
                ) : (
                  prod.id
                )}
              </td>
              <td>
                {editingProduct?.id === prod.id ? (
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        name: e.target.value,
                      })
                    }
                  />
                ) : (
                  prod.name
                )}
              </td>
              <td>
                {editingProduct?.id === prod.id ? (
                  <select
                    value={editingProduct.categoryId}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        categoryId: e.target.value,
                      })
                    }
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  categories.find((cat) => cat.id === prod.categoryId)?.name
                )}
              </td>
              <td>
                {editingProduct?.id === prod.id ? (
                  <button className="save-button" onClick={saveEditedProduct}>
                    Save
                  </button>
                ) : (
                  <>
                    <button
                      className="icon-button"
                      onClick={() => editProduct(prod)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="icon-button"
                      onClick={() => confirmDelete(prod.id)}
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

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
        >
          Previous
        </button>
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
        >
          Next
        </button>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Are you sure you want to delete this product?</p>
            <button className="yes-button" onClick={() => deleteProduct(productToDelete)}>
              Yes
            </button>
            <button className="no-button" onClick={() => setShowDeletePopup(false)}>
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductMaster;