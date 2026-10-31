import { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  loginUser,
  createAccount,
} from "../utils/auth";


function Login() {

  const navigate = useNavigate();


  // ==========================================================
  // LOGIN / CREATE ACCOUNT
  // ==========================================================

  const [isCreateAccount, setIsCreateAccount] =
    useState(false);


  // ==========================================================
  // FORM
  // ==========================================================

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");


  // ==========================================================
  // PASSWORD VISIBILITY
  // ==========================================================

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);


  // ==========================================================
  // MESSAGES
  // ==========================================================

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = (event) => {

    event.preventDefault();

    setError("");
    setSuccess("");


    // ========================================================
    // CREATE ACCOUNT
    // ========================================================

    if (isCreateAccount) {

      if (!name.trim()) {

        setError(
          "Please enter your name."
        );

        return;
      }


      if (!email.trim()) {

        setError(
          "Please enter your email."
        );

        return;
      }


      if (!password) {

        setError(
          "Please enter a password."
        );

        return;
      }


      if (password.length < 6) {

        setError(
          "Password must contain at least 6 characters."
        );

        return;
      }


      if (
        password !==
        confirmPassword
      ) {

        setError(
          "Passwords do not match."
        );

        return;
      }


      const result =
        createAccount(
          name,
          email,
          password
        );


      if (!result.success) {

        setError(
          result.message
        );

        return;
      }


      setSuccess(
        "Account created successfully."
      );


      setTimeout(() => {

        navigate("/");

      }, 700);


      return;
    }


    // ========================================================
    // LOGIN
    // ========================================================

    if (!email.trim()) {

      setError(
        "Please enter your email."
      );

      return;
    }


    if (!password) {

      setError(
        "Please enter your password."
      );

      return;
    }


    const result =
      loginUser(
        email,
        password
      );


    // ========================================================
    // LOGIN FAILED
    // ========================================================

    if (!result.success) {

      setError(
        result.message
      );

      return;
    }


    // ========================================================
    // ADMIN LOGIN
    // ========================================================

    if (
      result.user.role ===
      "admin"
    ) {

      setSuccess(
        "Admin login successful."
      );


      setTimeout(() => {

        navigate("/admin");

      }, 500);


      return;
    }


    // ========================================================
    // CUSTOMER LOGIN
    // ========================================================

    setSuccess(
      "Login successful."
    );


    setTimeout(() => {

      navigate("/");

    }, 500);

  };


  // ==========================================================
  // SWITCH LOGIN / SIGNUP
  // ==========================================================

  const switchMode = () => {

    setIsCreateAccount(
      (current) =>
        !current
    );

    setError("");
    setSuccess("");

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

  };


  return (

    <main className="min-h-screen bg-[#f8f6f1] px-5 py-12 sm:px-8 lg:py-16">

      <div className="mx-auto max-w-md">


        {/* ==================================================
            HEADER
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="text-center"
        >

          <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#9a897c]">
            Luv03
          </p>


          <h1 className="mt-3 font-serif text-4xl text-[#3d3028] sm:text-5xl">

            {isCreateAccount
              ? "Create Account"
              : "Welcome Back"}

          </h1>


          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#756960]">

            {isCreateAccount
              ? "Create your Luv03 account and start your skincare journey."
              : "Sign in to continue shopping with Luv03."}

          </p>

        </motion.div>


        {/* ==================================================
            FORM CARD
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.1,
          }}
          className="mt-10 rounded-3xl border border-[#ddd7ce] bg-[#eee9df] p-6 sm:p-8"
        >

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >


            {/* ==================================================
                NAME
            ================================================== */}

            {isCreateAccount && (

              <div>

                <label className="mb-2 block text-[9px] font-medium uppercase tracking-[0.16em] text-[#756960]">
                  Full Name
                </label>


                <div className="relative">

                  <UserRound
                    size={16}
                    strokeWidth={1.3}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a897c]"
                  />


                  <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    placeholder="Your name"
                    className="h-12 w-full rounded-full border border-[#d5cec5] bg-[#f8f6f1] pl-11 pr-4 text-sm text-[#3d3028] outline-none transition focus:border-[#584539]"
                  />

                </div>

              </div>

            )}


            {/* ==================================================
                EMAIL
            ================================================== */}

            <div>

              <label className="mb-2 block text-[9px] font-medium uppercase tracking-[0.16em] text-[#756960]">
                Email Address
              </label>


              <div className="relative">

                <Mail
                  size={16}
                  strokeWidth={1.3}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a897c]"
                />


                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="h-12 w-full rounded-full border border-[#d5cec5] bg-[#f8f6f1] pl-11 pr-4 text-sm text-[#3d3028] outline-none transition focus:border-[#584539]"
                />

              </div>

            </div>


            {/* ==================================================
                PASSWORD
            ================================================== */}

            <div>

              <label className="mb-2 block text-[9px] font-medium uppercase tracking-[0.16em] text-[#756960]">
                Password
              </label>


              <div className="relative">

                <LockKeyhole
                  size={16}
                  strokeWidth={1.3}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a897c]"
                />


                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter your password"
                  autoComplete={
                    isCreateAccount
                      ? "new-password"
                      : "current-password"
                  }
                  className="h-12 w-full rounded-full border border-[#d5cec5] bg-[#f8f6f1] pl-11 pr-12 text-sm text-[#3d3028] outline-none transition focus:border-[#584539]"
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9a897c] transition hover:text-[#584539]"
                >

                  {showPassword ? (

                    <EyeOff
                      size={16}
                      strokeWidth={1.3}
                    />

                  ) : (

                    <Eye
                      size={16}
                      strokeWidth={1.3}
                    />

                  )}

                </button>

              </div>

            </div>


            {/* ==================================================
                CONFIRM PASSWORD
            ================================================== */}

            {isCreateAccount && (

              <div>

                <label className="mb-2 block text-[9px] font-medium uppercase tracking-[0.16em] text-[#756960]">
                  Confirm Password
                </label>


                <div className="relative">

                  <LockKeyhole
                    size={16}
                    strokeWidth={1.3}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a897c]"
                  />


                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      confirmPassword
                    }
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    className="h-12 w-full rounded-full border border-[#d5cec5] bg-[#f8f6f1] pl-11 pr-12 text-sm text-[#3d3028] outline-none transition focus:border-[#584539]"
                  />


                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) =>
                          !current
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9a897c] transition hover:text-[#584539]"
                  >

                    {showConfirmPassword ? (

                      <EyeOff
                        size={16}
                        strokeWidth={1.3}
                      />

                    ) : (

                      <Eye
                        size={16}
                        strokeWidth={1.3}
                      />

                    )}

                  </button>

                </div>

              </div>

            )}


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

              <div className="rounded-2xl border border-[#d7aaa0] bg-[#f8e9e5] px-4 py-3">

                <p className="text-center text-xs text-[#8f4c40]">
                  {error}
                </p>

              </div>

            )}


            {/* ==================================================
                SUCCESS
            ================================================== */}

            {success && (

              <div className="rounded-2xl border border-[#b7c9b1] bg-[#eaf1e7] px-4 py-3">

                <p className="text-center text-xs text-[#52674b]">
                  {success}
                </p>

              </div>

            )}


            {/* ==================================================
                SUBMIT
            ================================================== */}

            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center rounded-full bg-[#584539] px-6 text-[9px] font-medium uppercase tracking-[0.18em] text-[#f8f6f1] transition hover:bg-[#3d3028]"
            >

              {isCreateAccount
                ? "Create Account"
                : "Login"}

            </button>

          </form>


          {/* ==================================================
              SWITCH LOGIN / SIGNUP
          ================================================== */}

          <div className="mt-7 text-center">

            <p className="text-xs text-[#756960]">

              {isCreateAccount
                ? "Already have an account?"
                : "Don't have an account?"}

            </p>


            <button
              type="button"
              onClick={switchMode}
              className="mt-2 text-[9px] font-medium uppercase tracking-[0.16em] text-[#b56d43] transition hover:text-[#584539]"
            >

              {isCreateAccount
                ? "Login"
                : "Create Account"}

            </button>

          </div>

        </motion.div>


        <p className="mt-6 text-center text-[8px] leading-5 text-[#aaa098]">
          Administrator access is restricted to authorized credentials.
        </p>

      </div>

    </main>

  );
}


export default Login;