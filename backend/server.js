import express from "express";
import cors from "cors";
import fs from "fs";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CARTS_DIR = path.join(__dirname, "data", "carts");
const USERS_FILE = path.join(__dirname, "users.json");

const app = express();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const JWT_SECRET = "my-super-duper-secret-jwt-key-in-production";

// --- Middleware ---
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

// --- Auth Middleware ---
function authenticateToken(req, res, next) {
  const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access token required" });

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = payload;
    next();
  });
}

function getCartPath(userId) {
  return path.join(CARTS_DIR, `${userId}.json`);

}

// --- Routes ---

// --- User Routes ---
app.post("/me", authenticateToken, (req, res) => {
  res.json({ user: { id: req.user.userId, username: req.user.username } })
})

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Username and password required" });

    let users = fs.existsSync(USERS_FILE)
      ? JSON.parse(await fs.promises.readFile(USERS_FILE, "utf-8"))
      : [];

    if (users.find(u => u.username === username))
      return res.status(400).json({ message: "Username already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: users.length ? users[users.length - 1].id + 1 : 1, username, password: hashedPassword };
    users.push(newUser);
    await fs.promises.writeFile(USERS_FILE, JSON.stringify(users, null, 2));

    const token = jwt.sign({ userId: newUser.id, username: newUser.username }, JWT_SECRET, { expiresIn: "7h" });
    res
      .cookie("token", token, { httpOnly: true, sameSite: "strict", maxAge: 7 * 60 * 60 * 1000 })
      .status(201)
      .json({ message: `${username} registered successfully!`, user: { id: newUser.id, username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/log-in", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Username and password required" });

    const users = fs.existsSync(USERS_FILE)
      ? JSON.parse(await fs.promises.readFile(USERS_FILE, "utf-8")) : [];

    const user = users.find(u => u.username === username);

    if (!user) return res.status(400).json({ message: "Username or password incorrect" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ message: "Username or password incorrect" });

    const token = jwt.sign({ userId: user.id, username: user.username }
      , JWT_SECRET, { expiresIn: "7h" });
    res
      .cookie("token", token, { httpOnly: true, sameSite: "strict", maxAge: 7 * 60 * 60 * 1000 })
      .status(200)
      .json({ message: `${username} logged in successfully!`, user: { id: user.id, username } });
  }
  catch (err) {
    console.error("Login error: ", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
});

app.post("/ai", async (req, res) => {
  try {
    const { message } = req.body;
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }]
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.log("AI error ", err);
    res.status(500).json({ message: "AI error" })
  }
})

// --- Cart Routes ---
app.get("/api/cart", authenticateToken, async (req, res) => {
  try {
    const cartPath = getCartPath(req.user.userId);
    if (!fs.existsSync(cartPath)) return res.json({ items: [] });

    const data = await fs.promises.readFile(cartPath, "utf-8");
    const cart = JSON.parse(data);
    res.json({ items: cart.items || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error loading cart" });
  }
});

app.post("/api/cart/sync", authenticateToken, async (req, res) => {
  try {
    const cartPath = getCartPath(req.user.userId);
    const { items } = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ message: "Invalid cart data" });

    await fs.promises.writeFile(cartPath, JSON.stringify({ items }, null, 2));
    res.json({ message: "Cart synced", items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error syncing cart" });
  }
});

// --- Start Server ---
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
