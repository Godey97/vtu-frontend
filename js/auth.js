/* ======================================
   GLOBAL API CONFIG
====================================== */
const API_BASE = "https://vtu-backend-72rg.onrender.com/api";

/* =====================
   SIGNUP
===================== */
async function signup() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    alert("Server error");
    console.error(err);
  }
}

/* =====================
   LOGIN
===================== */
async function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }

    // ✅ SAVE SESSION
    localStorage.setItem("userId", data.userId);
    if (data.token) localStorage.setItem("token", data.token);

    window.location.href = "home.html";

  } catch (err) {
    alert("Server error");
    console.error(err);
  }
}

/* =====================
   LOGOUT
===================== */
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

/* =====================
   PROTECT PAGES
===================== */
function protect() {
  if (!localStorage.getItem("userId")) {
    window.location.href = "index.html";
  }
}
