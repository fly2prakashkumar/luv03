// ============================================================
// LUV03 AUTHENTICATION & MULTI-ADMIN PRIVILEGE SYSTEM
// ============================================================

export const ADMIN_EMAIL = "jeyakumarluvo3@gmail.com";
export const ADMIN_EMAIL_ALT = "jeyakumarluv03@gmail.com"; // Support common 'o' vs '0' alias
export const ADMIN_PASSWORD = "Welcome@123";

export const DEFAULT_ADMIN_EMAILS = [
  "jeyakumarluvo3@gmail.com",
  "jeyakumarluv03@gmail.com",
];

// ============================================================
// ADMIN REGISTRY MANAGEMENT (LOCALSTORAGE KEY: luv03-admin-emails)
// ============================================================

export const getAdminEmails = () => {
  try {
    const raw = localStorage.getItem("luv03-admin-emails");
    const parsed = raw ? JSON.parse(raw) : null;
    const list = Array.isArray(parsed) && parsed.length > 0 ? parsed : [...DEFAULT_ADMIN_EMAILS];

    // Always guarantee primary default admin emails are included
    DEFAULT_ADMIN_EMAILS.forEach((adm) => {
      if (!list.some((e) => (e || "").toLowerCase().trim() === adm.toLowerCase())) {
        list.push(adm);
      }
    });

    return Array.from(new Set(list.map((e) => (e || "").toLowerCase().trim()).filter(Boolean)));
  } catch (e) {
    return DEFAULT_ADMIN_EMAILS.map((e) => e.toLowerCase());
  }
};

export const isEmailAdmin = (email) => {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  const admins = getAdminEmails();
  return admins.includes(clean);
};

export const grantAdminAccess = (email, name = "") => {
  if (!email || !email.includes("@")) {
    return {
      success: false,
      message: "Please enter a valid email address.",
    };
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();

  // 1. Add to admin emails registry
  const adminEmails = getAdminEmails();
  if (!adminEmails.includes(cleanEmail)) {
    adminEmails.push(cleanEmail);
    localStorage.setItem("luv03-admin-emails", JSON.stringify(adminEmails));
  }

  // 2. Add or update user record in luv03-users
  const users = JSON.parse(localStorage.getItem("luv03-users") || "[]");
  const userIdx = users.findIndex((u) => (u.email || "").toLowerCase().trim() === cleanEmail);

  if (userIdx !== -1) {
    users[userIdx] = {
      ...users[userIdx],
      role: "admin",
      name: cleanName || users[userIdx].name || cleanEmail.split("@")[0],
      updatedAt: new Date().toISOString(),
    };
  } else {
    users.unshift({
      id: Date.now(),
      name: cleanName || cleanEmail.split("@")[0],
      email: cleanEmail,
      role: "admin",
      password: ADMIN_PASSWORD, // Default fallback password for seamless login
      createdAt: new Date().toISOString(),
    });
  }
  localStorage.setItem("luv03-users", JSON.stringify(users));

  // 3. If currently logged in user matches, promote active session
  const currentUser = getCurrentUser();
  if (currentUser?.email?.toLowerCase().trim() === cleanEmail) {
    localStorage.setItem(
      "luv03-user",
      JSON.stringify({ ...currentUser, role: "admin" })
    );
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("luv03-users-change"));
    window.dispatchEvent(new Event("storage"));
  }

  return {
    success: true,
    message: `Administrator access granted to ${cleanEmail}.`,
  };
};

export const revokeAdminAccess = (email) => {
  if (!email) {
    return { success: false, message: "Email required." };
  }

  const cleanEmail = email.trim().toLowerCase();

  // Super admin cannot be revoked
  if (
    cleanEmail === ADMIN_EMAIL.toLowerCase() ||
    cleanEmail === ADMIN_EMAIL_ALT.toLowerCase()
  ) {
    return {
      success: false,
      message: "Primary super administrator access cannot be revoked.",
    };
  }

  // 1. Remove from admin emails registry
  const adminEmails = getAdminEmails().filter((e) => e !== cleanEmail);
  localStorage.setItem("luv03-admin-emails", JSON.stringify(adminEmails));

  // 2. Update user record in luv03-users to customer
  const users = JSON.parse(localStorage.getItem("luv03-users") || "[]");
  const userIdx = users.findIndex((u) => (u.email || "").toLowerCase().trim() === cleanEmail);
  if (userIdx !== -1) {
    users[userIdx] = {
      ...users[userIdx],
      role: "customer",
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem("luv03-users", JSON.stringify(users));
  }

  // 3. If currently logged in user matches, demote active session
  const currentUser = getCurrentUser();
  if (currentUser?.email?.toLowerCase().trim() === cleanEmail) {
    localStorage.setItem(
      "luv03-user",
      JSON.stringify({ ...currentUser, role: "customer" })
    );
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("luv03-users-change"));
    window.dispatchEvent(new Event("storage"));
  }

  return {
    success: true,
    message: `Administrator access revoked for ${cleanEmail}.`,
  };
};

// ============================================================
// CHECK IF USER IS LOGGED IN
// ============================================================

export const isLoggedIn = () => {
  return localStorage.getItem("luv03-user") !== null;
};

// ============================================================
// GET CURRENT USER
// ============================================================

export const getCurrentUser = () => {
  try {
    const savedUser = localStorage.getItem("luv03-user");
    if (!savedUser) {
      return null;
    }

    const parsed = JSON.parse(savedUser);

    // Dynamically re-verify role based on admin registry
    if (parsed?.email && isEmailAdmin(parsed.email)) {
      parsed.role = "admin";
    }

    return parsed;
  } catch (error) {
    console.error("Could not load user:", error);
    return null;
  }
};

// ============================================================
// CHECK IF CURRENT USER IS ADMIN
// ============================================================

export const isAdmin = () => {
  const user = getCurrentUser();
  if (!user) return false;
  if (user.role === "admin") return true;
  return isEmailAdmin(user.email);
};

// ============================================================
// LOGIN USER (SEAMLESS MULTI-ADMIN & CUSTOMER AUTH)
// ============================================================

export const loginUser = (email, password) => {
  if (!email || !password) {
    return {
      success: false,
      message: "Please enter both email and password.",
    };
  }

  const cleanEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();

  const isMasterAdminEmail =
    cleanEmail === ADMIN_EMAIL.toLowerCase() ||
    cleanEmail === ADMIN_EMAIL_ALT.toLowerCase();
  const isAdminEmail = isMasterAdminEmail || isEmailAdmin(cleanEmail);

  const savedUsers = JSON.parse(
    localStorage.getItem("luv03-users") || "[]"
  );
  const existingUserIndex = savedUsers.findIndex(
    (u) => (u.email || "").toLowerCase().trim() === cleanEmail
  );
  const existingUser = existingUserIndex !== -1 ? savedUsers[existingUserIndex] : null;

  // ==========================================================
  // ADMIN LOGIN
  // ==========================================================
  if (isAdminEmail) {
    const isMasterPass = trimmedPassword === ADMIN_PASSWORD;
    const isRegisteredPass = existingUser && existingUser.password === trimmedPassword;

    // Allow login if:
    // 1. Master password entered ("Welcome@123")
    // 2. Custom registered password matches
    // 3. Primary admin logging in for the first time before setting a password
    if (isMasterPass || isRegisteredPass || (!existingUser && isMasterAdminEmail)) {
      const adminName = existingUser?.name || "Luv03 Admin";
      const adminUser = {
        name: adminName,
        email: cleanEmail,
        role: "admin",
      };

      // Ensure user record in luv03-users
      if (!existingUser) {
        savedUsers.unshift({
          id: Date.now(),
          name: adminName,
          email: cleanEmail,
          password: trimmedPassword,
          role: "admin",
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem("luv03-users", JSON.stringify(savedUsers));
      } else if (existingUser.role !== "admin") {
        savedUsers[existingUserIndex].role = "admin";
        localStorage.setItem("luv03-users", JSON.stringify(savedUsers));
      }

      // Ensure in admin registry
      const currentAdmins = getAdminEmails();
      if (!currentAdmins.includes(cleanEmail)) {
        currentAdmins.push(cleanEmail);
        localStorage.setItem("luv03-admin-emails", JSON.stringify(currentAdmins));
      }

      localStorage.setItem("luv03-user", JSON.stringify(adminUser));

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("luv03-users-change"));
        window.dispatchEvent(new Event("storage"));
      }

      return {
        success: true,
        user: adminUser,
      };
    }

    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  // ==========================================================
  // NORMAL CUSTOMER LOGIN
  // ==========================================================
  if (!existingUser || existingUser.password !== trimmedPassword) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  const loggedInUser = {
    name: existingUser.name,
    email: existingUser.email,
    role: existingUser.role || "customer",
  };

  localStorage.setItem("luv03-user", JSON.stringify(loggedInUser));

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("luv03-users-change"));
    window.dispatchEvent(new Event("storage"));
  }

  return {
    success: true,
    user: loggedInUser,
  };
};

// ============================================================
// CREATE ACCOUNT (SUPPORTS CUSTOMERS & ADMIN SIGNUP/PASSWORD RESET)
// ============================================================

export const createAccount = (name, email, password) => {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();

  const isMasterAdminEmail =
    cleanEmail === ADMIN_EMAIL.toLowerCase() ||
    cleanEmail === ADMIN_EMAIL_ALT.toLowerCase();
  const isAdminEmail = isMasterAdminEmail || isEmailAdmin(cleanEmail);

  const savedUsers = JSON.parse(
    localStorage.getItem("luv03-users") || "[]"
  );
  const existingUserIndex = savedUsers.findIndex(
    (u) => (u.email || "").toLowerCase().trim() === cleanEmail
  );

  // If this is an Admin email registering or updating password
  if (isAdminEmail) {
    const adminUser = {
      id: existingUserIndex !== -1 ? savedUsers[existingUserIndex].id : Date.now(),
      name: cleanName || (existingUserIndex !== -1 ? savedUsers[existingUserIndex].name : "Luv03 Admin"),
      email: cleanEmail,
      password: trimmedPassword,
      role: "admin",
      createdAt: existingUserIndex !== -1 ? savedUsers[existingUserIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (existingUserIndex !== -1) {
      savedUsers[existingUserIndex] = {
        ...savedUsers[existingUserIndex],
        ...adminUser,
      };
    } else {
      savedUsers.unshift(adminUser);
    }
    localStorage.setItem("luv03-users", JSON.stringify(savedUsers));

    // Ensure email is in admin registry
    const currentAdmins = getAdminEmails();
    if (!currentAdmins.includes(cleanEmail)) {
      currentAdmins.push(cleanEmail);
      localStorage.setItem("luv03-admin-emails", JSON.stringify(currentAdmins));
    }

    const loggedInUser = {
      name: adminUser.name,
      email: adminUser.email,
      role: "admin",
    };
    localStorage.setItem("luv03-user", JSON.stringify(loggedInUser));

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("luv03-users-change"));
      window.dispatchEvent(new Event("storage"));
    }

    return {
      success: true,
      user: loggedInUser,
    };
  }

  // Normal Customer duplicate check
  if (existingUserIndex !== -1) {
    return {
      success: false,
      message: "An account with this email already exists.",
    };
  }

  const newUser = {
    id: Date.now(),
    name: cleanName,
    email: cleanEmail,
    password: trimmedPassword,
    role: "customer",
    createdAt: new Date().toISOString(),
  };

  savedUsers.push(newUser);
  localStorage.setItem("luv03-users", JSON.stringify(savedUsers));

  const loggedInUser = {
    name: newUser.name,
    email: newUser.email,
    role: "customer",
  };

  localStorage.setItem("luv03-user", JSON.stringify(loggedInUser));

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("luv03-users-change"));
    window.dispatchEvent(new Event("storage"));
  }

  return {
    success: true,
    user: loggedInUser,
  };
};

// ============================================================
// LOGOUT
// ============================================================

export const logoutUser = () => {
  localStorage.removeItem("luv03-user");
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("luv03-users-change"));
    window.dispatchEvent(new Event("storage"));
  }
};

// ============================================================
// REQUIRE LOGIN
// ============================================================

export const requireLogin = (navigate) => {
  if (!isLoggedIn()) {
    navigate("/login");
    return false;
  }
  return true;
};

// ============================================================
// REQUIRE ADMIN
// ============================================================

export const requireAdmin = (navigate) => {
  if (!isLoggedIn()) {
    navigate("/login");
    return false;
  }

  if (!isAdmin()) {
    navigate("/");
    return false;
  }

  return true;
};

// ============================================================
// SAVE ORDER
// ============================================================

export const saveOrder = (order) => {
  try {
    const existingOrders = JSON.parse(
      localStorage.getItem("luv03-orders") || "[]"
    );

    existingOrders.unshift(order);
    localStorage.setItem("luv03-orders", JSON.stringify(existingOrders));

    // Auto-sync customer to users directory
    if (order.customerEmail) {
      try {
        const users = JSON.parse(
          localStorage.getItem("luv03-users") || "[]"
        );
        const exists = users.some(
          (u) => u.email && u.email.toLowerCase() === order.customerEmail.toLowerCase()
        );
        if (!exists) {
          users.push({
            name:
              order.customer?.name ||
              `${order.customer?.firstName || ""} ${order.customer?.lastName || ""}`.trim() ||
              "Customer",
            email: order.customerEmail,
            phone: order.customer?.phone || "",
            role: "customer",
            createdAt: order.date || new Date().toISOString(),
          });
          localStorage.setItem("luv03-users", JSON.stringify(users));
        }
      } catch (e) {
        console.error("Customer sync error:", e);
      }
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("luv03-orders-change"));
    }

    return true;
  } catch (error) {
    console.error("Could not save order:", error);
    return false;
  }
};

// ============================================================
// GET ALL ORDERS
// ============================================================

export const getAllOrders = () => {
  try {
    return JSON.parse(
      localStorage.getItem("luv03-orders") || "[]"
    );
  } catch (error) {
    console.error("Could not load orders:", error);
    return [];
  }
};

// ============================================================
// GET CURRENT CUSTOMER ORDERS
// ============================================================

export const getUserOrders = () => {
  const user = getCurrentUser();
  if (!user?.email) {
    return [];
  }

  const allOrders = getAllOrders();
  return allOrders.filter(
    (order) =>
      order.customerEmail?.toLowerCase() === user.email.toLowerCase()
  );
};

// ============================================================
// GET SINGLE ORDER
// ============================================================

export const getOrderById = (orderId) => {
  const orders = getAllOrders();
  return orders.find((order) => order.id === orderId) || null;
};

// ============================================================
// UPDATE ORDER
// ============================================================

export const updateOrder = (updatedOrder) => {
  try {
    const existingOrders = getAllOrders();
    const index = existingOrders.findIndex(
      (order) => order.id === updatedOrder.id
    );

    if (index !== -1) {
      existingOrders[index] = {
        ...existingOrders[index],
        ...updatedOrder,
      };
    } else {
      existingOrders.push(updatedOrder);
    }

    localStorage.setItem("luv03-orders", JSON.stringify(existingOrders));

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("luv03-orders-change"));
    }

    return true;
  } catch (error) {
    console.error("Could not update order:", error);
    return false;
  }
};

// ============================================================
// DELETE ORDER
// ============================================================

export const deleteOrder = (orderId) => {
  try {
    const existingOrders = getAllOrders();
    const filtered = existingOrders.filter((order) => order.id !== orderId);
    localStorage.setItem("luv03-orders", JSON.stringify(filtered));

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("luv03-orders-change"));
    }

    return true;
  } catch (error) {
    console.error("Could not delete order:", error);
    return false;
  }
};

// ============================================================
// SAVE ALL ORDERS
// ============================================================

export const saveAllOrders = (orders) => {
  try {
    localStorage.setItem("luv03-orders", JSON.stringify(orders));

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("luv03-orders-change"));
    }

    return true;
  } catch (error) {
    console.error("Could not save orders:", error);
    return false;
  }
};

// ============================================================
// GET ALL REGISTERED USERS (ADMINS & CUSTOMERS)
// ============================================================

export const getAllUsers = () => {
  try {
    const savedUsers = JSON.parse(
      localStorage.getItem("luv03-users") || "[]"
    );
    const adminEmails = getAdminEmails();

    // Ensure primary admin jeyakumarluvo3@gmail.com is included
    const hasPrimary = savedUsers.some(
      (u) => (u.email || "").toLowerCase().trim() === ADMIN_EMAIL.toLowerCase()
    );
    if (!hasPrimary) {
      savedUsers.unshift({
        id: "admin-super",
        name: "Luv03 Admin (Super Admin)",
        email: ADMIN_EMAIL,
        phone: "+91 99999 00000",
        role: "admin",
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("luv03-users", JSON.stringify(savedUsers));
    }

    return savedUsers.map((u) => {
      const emailLower = (u.email || "").toLowerCase().trim();
      const isAdminRole = u.role === "admin" || adminEmails.includes(emailLower);
      return {
        ...u,
        role: isAdminRole ? "admin" : "customer",
      };
    });
  } catch (error) {
    console.error("Could not get users:", error);
    return [];
  }
};

// Backward-compatible alias used across dashboard
export const getAllCustomers = () => {
  return getAllUsers();
};
