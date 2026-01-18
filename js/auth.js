/* ======================================
   GLOBAL CONFIG
====================================== */
const API_BASE = "https://vtu-backend-72rg.onrender.com/api";

/* ======================================
   UTILITIES
====================================== */
function getToken() {
  return localStorage.getItem("token");
}

function isAuthenticated() {
  return !!getToken();
}

function logout(redirect = true) {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");

  if (redirect) {
    window.location.href = "index.html";
  }
}

/* ======================================
   API HELPER (AUTO AUTH HEADER)
====================================== */
async function apiFetch(endpoint, options = {}) {
  const headers = options.headers || {};

  if (isAuthenticated()) {
    headers.Authorization = `Bearer ${getToken()}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...headers
    }
  });

  // Auto logout if token is invalid/expired
  if (res.status === 401) {
    logout();
    throw new Error("Session expired. Please login again.");
  }

  return res;
}

/* ======================================
   AUTH GUARD (PROTECT PAGES)
====================================== */
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = "index.html";
  }
}

/* ======================================
   SIGNUP
====================================== */
async function signup() {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await apiFetch("/signup", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Signup failed");
      return;
    }

    alert("Signup successful. Please login.");
    window.location.href = "index.html";

  } catch (err) {
    alert(err.message || "Server error");
    console.error(err);
  }
}

/* ======================================
   LOGIN
====================================== */
async function login() {
  const email = document.getElementById("loginEmail")?.value.trim();
  const password = document.getElementById("loginPassword")?.value.trim();

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    const res = await apiFetch("/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }

    // ✅ SAVE SESSION (TOKEN ONLY)
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.userId);

    window.location.href = "home.html";

  } catch (err) {
    alert(err.message || "Server error");
    console.error(err);
  }
}

/* ======================================
   OPTIONAL: FETCH USER WALLET
====================================== */
async function getWalletBalance() {
  try {
    const res = await apiFetch("/wallet/balance");
    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to load wallet");
      return;
    }

    return data.balance;

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}
