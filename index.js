const express = require("express");
const app = express();

app.use(express.json());

// 👇 Array-based storage (no database)
const users = [];

// 👇 Email validation function
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  // Logic: check existing user
  const exists = users.find((u) => u.email === email);
  if (exists) {
    return res.status(409).json({ message: "Email already exists" });
  }

  // Save user
  users.push({ email, password });

  res.status(201).json({ message: "User registered successfully" });
});
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  // Logic: validate credentials
  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({ message: "Login successful" });
});
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
