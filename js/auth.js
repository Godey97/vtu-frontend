/* ======================================
   GLOBAL CONFIG
====================================== */
const API_BASE = "https://vtu-backend-72rg.onrender.com/api";

/* ======================================
   HELPERS
====================================== */
function showMessage(msg, type = "error") {
  const box = document.getElementById("message");
  if (!box) return;

  box.textContent = msg;
  box.className = type;
}

function setLoading(btn, isLoading) {
  if (!btn) return;
  btn.disabled = isLoading;
  btn.textContent = isLoading ? "Please wait..." : btn.dataset.text;
}

/* ======================================
   SIGNUP
====================================== */
async function signup() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const btn = document.querySelector("button");

  if (!email || !password) {
    showMessage("All fields are required");
    return;
  }

  setLoading(btn, true);

  try {
    const res = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      showMessage(data.error || "Signup failed");
      setLoading(btn, false);
      return;
    }

    showMessage("Signup successful! Redirecting...", "success");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);

  } catch (err) {
    console.error(err);
    showMessage("Server error. Try again.");
  }

  setLoading(btn, false);
}

/* ======================================
   LOGIN
====================================== */
async function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const btn = document.querySelector("button");

  if (!email || !password) {
    showMessage("Enter email and password");
    return;
  }

  setLoading(btn, true);

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      showMessage(data.error || "Login failed");
      setLoading(btn, false);
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.userId);

    window.location.href = "home.html";

  } catch (err) {
    console.error(err);
    showMessage("Server error");
  }

  setLoading(btn, false);
}

/* ======================================
   AUTH GUARD
====================================== */
function requireAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html";
  }
}

/* ======================================
   LOGOUT
====================================== */
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
