const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root", 
  password: "Prathamesh@3101", // Replace with your MySQL password
  database: "products",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Get all categories
app.get("/api/categories", (req, res) => {
  pool.query("SELECT * FROM categories", (error, results) => {
    if (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Internal server error" });
    } else {
      res.json(results);
    }
  });
});

// Add a new category
app.post("/api/categories", (req, res) => {
  const { name } = req.body;
  pool.query(
    "INSERT INTO categories (name) VALUES (?)",
    [name],
    (error, results) => {
      if (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ message: "Internal server error" });
      } else {
        res.json({ id: results.insertId, name });
      }
    }
  );
});

// Update a category
app.put("/api/categories/:id", (req, res) => {
  const categoryId = req.params.id;
  const { name } = req.body;
  pool.query(
    "UPDATE categories SET name = ? WHERE id = ?",
    [name, categoryId],
    (error, results) => {
      if (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ message: "Internal server error" });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ message: "Category not found" });
      } else {
        res.json({ id: categoryId, name });
      }
    }
  );
});

// Delete a category
app.delete("/api/categories/:id", (req, res) => {
  const categoryId = req.params.id;
  pool.query(
    "DELETE FROM categories WHERE id = ?",
    [categoryId],
    (error, results) => {
      if (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ message: "Internal server error" });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ message: "Category not found" });
      } else {
        res.json({ message: "Category deleted" });
      }
    }
  );
});

// Get all categories
app.get("/api/categories", (req, res) => {
    pool.query("SELECT * FROM categories", (error, results) => {
      if (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Internal server error" });
      } else {
        res.json(results);
      }
    });
  });


// Add a new product
app.post("/api/products", (req, res) => {
  const { name, categoryId } = req.body;
  pool.query(
    "SELECT name FROM categories WHERE id = ?",
    [categoryId],
    (error, results) => {
      if (error) {
        console.error("Error fetching category name:", error);
        res.status(500).json({ message: "Internal server error" });
      } else if (results.length === 0) {
        res.status(404).json({ message: "Category not found" });
      } else {
        const categoryName = results[0].name;
        pool.query(
          "INSERT INTO products (name, categoryId, categoryName) VALUES (?, ?, ?)",
          [name, categoryId, categoryName],
          (error, results) => {
            if (error) {
              console.error("Error adding product:", error);
              res.status(500).json({ message: "Internal server error" });
            } else {
              res.json({ id: results.insertId, name, categoryId, categoryName });
            }
          }
        );
      }
    }
  );
});

// Update a product
app.put("/api/products/:id", (req, res) => {
  const productId = req.params.id;
  const { name, categoryId } = req.body;
  pool.query(
    "SELECT name FROM categories WHERE id = ?",
    [categoryId],
    (error, results) => {
      if (error) {
        console.error("Error fetching category name:", error);
        res.status(500).json({ message: "Internal server error" });
      } else if (results.length === 0) {
        res.status(404).json({ message: "Category not found" });
      } else {
        const categoryName = results[0].name;
        pool.query(
          "UPDATE products SET name = ?, categoryId = ?, categoryName = ? WHERE id = ?",
          [name, categoryId, categoryName, productId],
          (error, results) => {
            if (error) {
              console.error("Error updating product:", error);
              res.status(500).json({ message: "Internal server error" });
            } else if (results.affectedRows === 0) {
              res.status(404).json({ message: "Product not found" });
            } else {
              res.json({ id: productId, name, categoryId, categoryName });
            }
          }
        );
      }
    }
  );
});

// Delete a product
app.delete("/api/products/:id", (req, res) => {
  const productId = req.params.id;
  pool.query(
    "DELETE FROM products WHERE id = ?",
    [productId],
    (error, results) => {
      if (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Internal server error" });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ message: "Product not found" });
      } else {
        res.json({ message: "Product deleted" });
      }
    }
  );
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



// Get all products with pagination
app.get("/api/products", (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 items per page
  const offset = (page - 1) * pageSize;

  // Fetch paginated products
  pool.query(
    "SELECT * FROM products LIMIT ? OFFSET ?",
    [pageSize, offset],
    (error, results) => {
      if (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal server error" });
      } else {
        // Fetch total count of products for pagination
        pool.query("SELECT COUNT(*) AS total FROM products", (error, countResults) => {
          if (error) {
            console.error("Error fetching total count:", error);
            res.status(500).json({ message: "Internal server error" });
          } else {
            const total = countResults[0].total;
            res.json({
              data: results,
              pagination: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize),
              },
            });
          }
        });
      }
    }
  );
});