const API = "http://localhost:3000/api";

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
    const res = await fetch(`${API}/signup`, {
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
   LOGIN (FIXED)
===================== */
async function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }

    // ✅ STORE USER SESSION
    localStorage.setItem("userId", data.userId);

    // OPTIONAL (future JWT support)
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

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
  localStorage.removeItem("userId");
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

/* =====================
   PROTECT PAGES
===================== */
function protect() {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    window.location.href = "index.html";
  }
}
