import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseconfig"; // Update this path if needed
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Your CSS file
import logo from '../../Images/logo.png';

const organizations = [
  "Deloitte",
  "Amazon",
  "Accenture",
  "EY",
  "IBM",
  "Yash Technologies",
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [organization, setOrganization] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const usersRef = collection(db, "users");
      if (isLogin) {
        // Validate login
        const q = query(
          usersRef,
          where("username", "==", username),
          where("password", "==", password)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          setError("Invalid username or password.");
          return;
        }

        // Store the logged-in user in localStorage
        const loggedInUser = querySnapshot.docs[0].data();
        localStorage.setItem("currentUser", JSON.stringify(loggedInUser));

        setError(""); // Clear any existing error messages

        // Handle successful login
        console.log("User logged in:", loggedInUser);

        // Navigate to the dashboard
        navigate("/dashboard");
      } else {
        // Check if user already exists
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setError("Username already exists.");
          return;
        }

        // Add user to Firestore
        await addDoc(usersRef, {
          name,
          username,
          phoneNum,
          email,
          password, // Make sure to hash or encrypt passwords in a real application
          organization,
        });

        // Clear error and reset form
        setError("");
        setName("");
        setUsername("");
        setPhoneNum("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setOrganization("");
        setIsLogin(true); // Switch back to login mode after registration
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");
    const container = document.getElementById("container");

    if (signUpButton && signInButton && container) {
      signUpButton.addEventListener("click", () => {
        container.classList.add("right-panel-active");
        setIsLogin(false);
      });

      signInButton.addEventListener("click", () => {
        container.classList.remove("right-panel-active");
        setIsLogin(true);
      });
    }

    return () => {
      if (signUpButton && signInButton) {
        signUpButton.removeEventListener("click", () => {
          container.classList.add("right-panel-active");
          setIsLogin(false);
        });

        signInButton.removeEventListener("click", () => {
          container.classList.remove("right-panel-active");
          setIsLogin(true);
        });
      }
    };
  }, []);

  return (
    <div className="container body-login" id="container">
      <div
        className={`form-container sign-up-container ${
          !isLogin ? "active" : ""
        }`}
      >
        <form onSubmit={handleSubmit}>
          <h1>Create Account</h1>
          {error && <p className="error">{error}</p>}
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required={!isLogin}
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required={!isLogin}
          />
          <input
            type="text"
            placeholder="Phone"
            value={phoneNum}
            onChange={(e) => setPhoneNum(e.target.value)}
            required={!isLogin}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required={!isLogin}
            />
          )}
          <select
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            required={!isLogin}
          >
            <option value="">Select Organization</option>
            {organizations.map((org) => (
              <option key={org} value={org}>
                {org}
              </option>
            ))}
          </select>
          <button type="submit">{isLogin ? "Sign In" : "Sign Up"}</button>
        </form>
      </div>
      <div
        className={`form-container sign-in-container ${
          isLogin ? "active" : ""
        }`}
      >
        <form onSubmit={handleSubmit}>
          <h1>Sign in</h1>
          {error && <p className="error">{error}</p>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <a href="#">Forgot your password?</a>
          <button type="submit">Sign In</button>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>
              To keep connected with us please login with your personal info
            </p>
            <button className="ghost" id="signIn">
              Sign In
            </button>
          </div>
          <div className="overlay-panel overlay-right">
          
            <h1>Hello, Welcome to </h1>
            <div id="logo">
        <img src={logo} alt='Logo' />
      </div>
            <p>
              WorkWise is your all-in-one HR management solution. Our platform
              simplifies administrative tasks with user-friendly interfaces and
              powerful integrations. Elevate your HR operations and focus on
              what matters most—your team.
            </p>
            <p>Enter your personal details and start your journey with us</p>
            <button className="ghost" id="signUp">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
