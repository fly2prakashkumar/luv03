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


    existingOrders.push(
      order
    );


    localStorage.setItem(
      "luv03-orders",
      JSON.stringify(
        existingOrders
      )
    );


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