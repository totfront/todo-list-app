const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());

// Database setup
const dbPath = path.join(__dirname, "todos.db");
const db = new sqlite3.Database(dbPath);

// Initialize database table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed BOOLEAN DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Helper function to update the updatedAt timestamp
function updateTimestamp(id) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE todos SET updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
      [id],
      function (err) {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

// GET /todos - Get all todos
app.get("/todos", (req, res) => {
  db.all("SELECT * FROM todos ORDER BY createdAt ASC", [], (err, rows) => {
    if (err) {
      console.error("Error fetching todos:", err);
      res.status(500).json({ error: "Failed to fetch todos" });
      return;
    }

    // Convert boolean values
    const todos = rows.map((row) => ({
      id: row.id,
      title: row.title,
      completed: Boolean(row.completed),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));

    res.json(todos);
  });
});

// POST /todos - Create a new todo
app.post("/todos", (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  db.run(
    "INSERT INTO todos (title) VALUES (?)",
    [title.trim()],
    function (err) {
      if (err) {
        console.error("Error creating todo:", err);
        res.status(500).json({ error: "Failed to create todo" });
        return;
      }

      // Get the created todo
      db.get("SELECT * FROM todos WHERE id = ?", [this.lastID], (err, row) => {
        if (err) {
          console.error("Error fetching created todo:", err);
          res.status(500).json({ error: "Failed to fetch created todo" });
          return;
        }

        const todo = {
          id: row.id,
          title: row.title,
          completed: Boolean(row.completed),
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        };

        res.status(201).json(todo);
      });
    }
  );
});

// PATCH /todos/:id - Update a todo
app.patch("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const updates = [];
  const values = [];

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      return res
        .status(400)
        .json({ error: "Title must be a non-empty string" });
    }
    updates.push("title = ?");
    values.push(title.trim());
  }

  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      return res.status(400).json({ error: "Completed must be a boolean" });
    }
    updates.push("completed = ?");
    values.push(completed ? 1 : 0);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: "No valid fields to update" });
  }

  values.push(id);

  db.run(
    `UPDATE todos SET ${updates.join(
      ", "
    )}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
    values,
    function (err) {
      if (err) {
        console.error("Error updating todo:", err);
        res.status(500).json({ error: "Failed to update todo" });
        return;
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Todo not found" });
      }

      // Get the updated todo
      db.get("SELECT * FROM todos WHERE id = ?", [id], (err, row) => {
        if (err) {
          console.error("Error fetching updated todo:", err);
          res.status(500).json({ error: "Failed to fetch updated todo" });
          return;
        }

        const todo = {
          id: row.id,
          title: row.title,
          completed: Boolean(row.completed),
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        };

        res.json(todo);
      });
    }
  );
});

// PATCH /todos/:id/toggle - Toggle todo completion
app.patch("/todos/:id/toggle", (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM todos WHERE id = ?", [id], (err, row) => {
    if (err) {
      console.error("Error fetching todo:", err);
      res.status(500).json({ error: "Failed to fetch todo" });
      return;
    }

    if (!row) {
      return res.status(404).json({ error: "Todo not found" });
    }

    const newCompleted = row.completed ? 0 : 1;

    db.run(
      "UPDATE todos SET completed = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
      [newCompleted, id],
      function (err) {
        if (err) {
          console.error("Error toggling todo:", err);
          res.status(500).json({ error: "Failed to toggle todo" });
          return;
        }

        // Get the updated todo
        db.get("SELECT * FROM todos WHERE id = ?", [id], (err, row) => {
          if (err) {
            console.error("Error fetching toggled todo:", err);
            res.status(500).json({ error: "Failed to fetch toggled todo" });
            return;
          }

          const todo = {
            id: row.id,
            title: row.title,
            completed: Boolean(row.completed),
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
          };

          res.json(todo);
        });
      }
    );
  });
});

// DELETE /todos/:id - Delete a todo
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM todos WHERE id = ?", [id], function (err) {
    if (err) {
      console.error("Error deleting todo:", err);
      res.status(500).json({ error: "Failed to delete todo" });
      return;
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(204).send();
  });
});

// Test error endpoint for debugging
app.get("/todos/test-error", (req, res) => {
  res
    .status(500)
    .json({ error: "🧪 Test error message from Express backend!" });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(
    `🚀 Express.js backend server running on http://localhost:${PORT}`
  );
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down server...");
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err);
    } else {
      console.log("✅ Database connection closed");
    }
    process.exit(0);
  });
});
