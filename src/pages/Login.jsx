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

    <main className="min-h-screen bg-transparent px-5 py-12 sm:px-8 lg:py-16">

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

          <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#9E9084]">
            Luv03
          </p>


          <h1 className="mt-3 font-serif text-4xl text-[#161311] sm:text-5xl">

            {isCreateAccount
              ? "Create Account"
              : "Welcome Back"}

          </h1>


          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#524942]">

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
          className="mt-10 rounded-3xl border border-white/80 bg-white/70 p-6 shadow-[0_16px_40px_rgba(109,0,25,0.06)] backdrop-blur-xl sm:p-8"
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

                <label className="mb-2 block text-[9px] font-medium uppercase tracking-[0.16em] text-[#524942]">
                  Full Name
                </label>


                <div className="relative">

                  <UserRound
                    size={16}
                    strokeWidth={1.3}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9E9084]"
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
                    className="h-12 w-full rounded-full border border-[#E5DED3] bg-[#FAF7F2] pl-11 pr-4 text-sm text-[#161311] outline-none transition focus:border-[#161311]"
                  />

                </div>

              </div>

            )}


            {/* ==================================================
                EMAIL
            ================================================== */}

            <div>

              <label className="mb-2 block text-[9px] font-medium uppercase tracking-[0.16em] text-[#524942]">
                Email Address
              </label>


              <div className="relative">

                <Mail
                  size={16}
                  strokeWidth={1.3}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9E9084]"
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
                  className="h-12 w-full rounded-full border border-[#E5DED3] bg-[#FAF7F2] pl-11 pr-4 text-sm text-[#161311] outline-none transition focus:border-[#161311]"
                />

              </div>

            </div>


            {/* ==================================================
                PASSWORD
            ================================================== */}

            <div>

              <label className="mb-2 block text-[9px] font-medium uppercase tracking-[0.16em] text-[#524942]">
                Password
              </label>


              <div className="relative">

                <LockKeyhole
                  size={16}
                  strokeWidth={1.3}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9E9084]"
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
                  className="h-12 w-full rounded-full border border-[#E5DED3] bg-[#FAF7F2] pl-11 pr-12 text-sm text-[#161311] outline-none transition focus:border-[#161311]"
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9E9084] transition hover:text-[#161311]"
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

                <label className="mb-2 block text-[9px] font-medium uppercase tracking-[0.16em] text-[#524942]">
                  Confirm Password
                </label>


                <div className="relative">

                  <LockKeyhole
                    size={16}
                    strokeWidth={1.3}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9E9084]"
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
                    className="h-12 w-full rounded-full border border-[#E5DED3] bg-[#FAF7F2] pl-11 pr-12 text-sm text-[#161311] outline-none transition focus:border-[#161311]"
                  />


                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) =>
                          !current
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9E9084] transition hover:text-[#161311]"
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

                <p className="text-center text-xs text-[#161311]">
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
              className="flex h-12 w-full items-center justify-center rounded-full bg-[#161311] px-6 text-[9px] font-medium uppercase tracking-[0.18em] text-[#FAF7F2] transition hover:bg-[#161311]"
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

            <p className="text-xs text-[#524942]">

              {isCreateAccount
                ? "Already have an account?"
                : "Don't have an account?"}

            </p>


            <button
              type="button"
              onClick={switchMode}
              className="mt-2 text-[9px] font-medium uppercase tracking-[0.16em] text-[#C5A880] transition hover:text-[#161311]"
            >

              {isCreateAccount
                ? "Login"
                : "Create Account"}

            </button>

          </div>

        </motion.div>


        <p className="mt-6 text-center text-[8px] leading-5 text-[#B3A69A]">
          Administrator access is restricted to authorized credentials.
        </p>

      </div>

    </main>

  );
}


export default Login;