// ============================================================
// LUV03 AUTH
// ============================================================


// ============================================================
// ADMIN CREDENTIALS
// ============================================================

export const ADMIN_EMAIL =
  "jeyakumarluvo3@gmail.com";

export const ADMIN_PASSWORD =
  "Welcome@123";


// ============================================================
// CHECK IF USER IS LOGGED IN
// ============================================================

export const isLoggedIn = () => {

  return (
    localStorage.getItem(
      "luv03-user"
    ) !== null
  );

};


// ============================================================
// GET CURRENT USER
// ============================================================

export const getCurrentUser = () => {

  try {

    const savedUser =
      localStorage.getItem(
        "luv03-user"
      );


    if (!savedUser) {
      return null;
    }


    return JSON.parse(
      savedUser
    );

  } catch (error) {

    console.error(
      "Could not load user:",
      error
    );

    return null;
  }

};


// ============================================================
// CHECK IF CURRENT USER IS ADMIN
// ============================================================

export const isAdmin = () => {

  const user =
    getCurrentUser();


  return (
    user?.role === "admin"
  );

};


// ============================================================
// LOGIN USER
// ============================================================

export const loginUser = (
  email,
  password
) => {

  const cleanEmail =
    email
      .trim()
      .toLowerCase();


  // ==========================================================
  // ADMIN LOGIN
  // ==========================================================

  if (
    cleanEmail ===
      ADMIN_EMAIL.toLowerCase() &&
    password ===
      ADMIN_PASSWORD
  ) {

    const adminUser = {

      name:
        "Luv03 Admin",

      email:
        ADMIN_EMAIL,

      role:
        "admin",

    };


    localStorage.setItem(
      "luv03-user",
      JSON.stringify(
        adminUser
      )
    );


    return {

      success:
        true,

      user:
        adminUser,

    };

  }


  // ==========================================================
  // NORMAL CUSTOMER LOGIN
  // ==========================================================

  const savedUsers =
    JSON.parse(
      localStorage.getItem(
        "luv03-users"
      ) || "[]"
    );


  const existingUser =
    savedUsers.find(
      (user) =>
        user.email
          .toLowerCase() ===
          cleanEmail &&
        user.password ===
          password
    );


  if (!existingUser) {

    return {

      success:
        false,

      message:
        "Invalid email or password.",

    };

  }


  const loggedInUser = {

    name:
      existingUser.name,

    email:
      existingUser.email,

    role:
      "customer",

  };


  localStorage.setItem(
    "luv03-user",
    JSON.stringify(
      loggedInUser
    )
  );


  return {

    success:
      true,

    user:
      loggedInUser,

  };

};


// ============================================================
// CREATE CUSTOMER ACCOUNT
// ============================================================

export const createAccount = (
  name,
  email,
  password
) => {

  const cleanName =
    name.trim();

  const cleanEmail =
    email
      .trim()
      .toLowerCase();


  // ==========================================================
  // PREVENT ADMIN EMAIL REGISTRATION
  // ==========================================================

  if (
    cleanEmail ===
    ADMIN_EMAIL.toLowerCase()
  ) {

    return {

      success:
        false,

      message:
        "This email is reserved for the administrator.",

    };

  }


  // ==========================================================
  // GET EXISTING USERS
  // ==========================================================

  const savedUsers =
    JSON.parse(
      localStorage.getItem(
        "luv03-users"
      ) || "[]"
    );


  // ==========================================================
  // CHECK DUPLICATE EMAIL
  // ==========================================================

  const existingUser =
    savedUsers.find(
      (user) =>
        user.email
          .toLowerCase() ===
        cleanEmail
    );


  if (existingUser) {

    return {

      success:
        false,

      message:
        "An account with this email already exists.",

    };

  }


  // ==========================================================
  // CREATE USER
  // ==========================================================

  const newUser = {

    id:
      Date.now(),

    name:
      cleanName,

    email:
      cleanEmail,

    password:
      password,

  };


  savedUsers.push(
    newUser
  );


  localStorage.setItem(
    "luv03-users",
    JSON.stringify(
      savedUsers
    )
  );


  // ==========================================================
  // LOG USER IN AUTOMATICALLY
  // ==========================================================

  const loggedInUser = {

    name:
      newUser.name,

    email:
      newUser.email,

    role:
      "customer",

  };


  localStorage.setItem(
    "luv03-user",
    JSON.stringify(
      loggedInUser
    )
  );


  return {

    success:
      true,

    user:
      loggedInUser,

  };

};


// ============================================================
// LOGOUT
// ============================================================

export const logoutUser = () => {

  localStorage.removeItem(
    "luv03-user"
  );

};


// ============================================================
// REQUIRE LOGIN
// ============================================================

export const requireLogin = (
  navigate
) => {

  if (!isLoggedIn()) {

    navigate(
      "/login"
    );

    return false;

  }


  return true;

};


// ============================================================
// REQUIRE ADMIN
// ============================================================

export const requireAdmin = (
  navigate
) => {

  if (!isLoggedIn()) {

    navigate(
      "/login"
    );

    return false;

  }


  if (!isAdmin()) {

    navigate(
      "/"
    );

    return false;

  }


  return true;

};


// ============================================================
// SAVE ORDER
// ============================================================

export const saveOrder = (
  order
) => {

  try {

    const existingOrders =
      JSON.parse(
        localStorage.getItem(
          "luv03-orders"
        ) || "[]"
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

    console.error(
      "Could not save order:",
      error
    );


    return false;

  }

};


// ============================================================
// GET ALL ORDERS
// ============================================================

export const getAllOrders = () => {

  try {

    return JSON.parse(
      localStorage.getItem(
        "luv03-orders"
      ) || "[]"
    );

  } catch (error) {

    console.error(
      "Could not load orders:",
      error
    );

    return [];

  }

};


// ============================================================
// GET CURRENT CUSTOMER ORDERS
// ============================================================

export const getUserOrders = () => {

  const user =
    getCurrentUser();


  // ----------------------------------------------------------
  // No logged-in user
  // ----------------------------------------------------------

  if (!user?.email) {

    return [];

  }


  const allOrders =
    getAllOrders();


  // ----------------------------------------------------------
  // Return only this customer's orders
  // ----------------------------------------------------------

  return allOrders.filter(
    (order) =>
      order.customerEmail
        ?.toLowerCase() ===
      user.email.toLowerCase()
  );

};


// ============================================================
// GET SINGLE ORDER
// ============================================================

export const getOrderById = (
  orderId
) => {

  const orders =
    getAllOrders();


  return orders.find(
    (order) =>
      order.id === orderId
  ) || null;

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
// GET ALL REGISTERED CUSTOMERS
// ============================================================

export const getAllCustomers = () => {
  try {
    const savedUsers = JSON.parse(
      localStorage.getItem("luv03-users") || "[]"
    );

    return savedUsers.filter(
      (user) => user.role !== "admin" && user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()
    );
  } catch (error) {
    console.error("Could not get customers:", error);
    return [];
  }
};
