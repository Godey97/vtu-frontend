/* ======================================
   GLOBAL CONFIG
====================================== */
const API = "http://localhost:3000/api";

/* ======================================
   AUTH HELPERS
====================================== */
const getToken = () => localStorage.getItem("token");
const getUserId = () => localStorage.getItem("userId");

function requireAuth() {
  if (!getToken()) {
    alert("Please login first");
    window.location.href = "index.html";
    throw new Error("Not authenticated");
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

/* ======================================
   FETCH HELPER
====================================== */
async function apiFetch(endpoint, options = {}) {
  requireAuth();

  const res = await fetch(`${API}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
      ...(options.headers || {})
    }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");

  return data;
}

/* ======================================
   BUY DATA
====================================== */
async function buyData() {
  try {
    const network = document.getElementById("network").value;
    const phone = document.getElementById("phone").value;
    const bundle = document.getElementById("bundle").value;

    if (!network || !phone || !bundle)
      return showToast("Fill all fields", "error");

    showLoader(true);

    await apiFetch("/order", {
      method: "POST",
      body: JSON.stringify({ network, phone, bundle })
    });

    showToast("✅ Purchase successful");
    setTimeout(() => (window.location.href = "orders.html"), 1200);
  } catch (err) {
    showToast(err.message, "error");
  } finally {
    showLoader(false);
  }
}

/* ======================================
   WALLET
====================================== */
async function loadWallet() {
  try {
    const data = await apiFetch("/wallet/balance", { method: "GET" });
    document.getElementById("walletBalance").textContent =
      `₵${Number(data.balance).toFixed(2)}`;
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function deposit() {
  try {
    const amount = Number(document.getElementById("amount").value);
    if (amount <= 0)
      return showToast("Invalid amount", "error");

    await apiFetch("/wallet/deposit", {
      method: "POST",
      body: JSON.stringify({ amount })
    });

    showToast("Wallet funded successfully");
    loadWallet();
  } catch (err) {
    showToast(err.message, "error");
  }
}

/* ======================================
   ADMIN ORDERS
====================================== */
async function loadAdminOrders() {
  try {
    const box = document.getElementById("adminOrders");
    if (!box) return;

    const orders = await apiFetch("/admin/orders", { method: "GET" });

    box.innerHTML = "";
    if (orders.length === 0) {
      box.innerHTML = "<p>No orders found</p>";
      return;
    }

    orders.forEach(o => {
      box.innerHTML += `
        <div class="card">
          <strong>User ID:</strong> ${o.userId}<br>
          <strong>Network:</strong> ${o.network}<br>
          <strong>Bundle:</strong> ${o.bundle}<br>
          <strong>Phone:</strong> ${o.phone}
        </div>
      `;
    });
  } catch (err) {
    showToast(err.message, "error");
  }
}
