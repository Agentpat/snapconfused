import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    HiArrowRight,
    HiOutlineLockClosed,
} from "react-icons/hi2";

import "./AdminLogin.css";

const API_URL =
    import.meta.env.VITE_API_URL;

const AdminLogin = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email.trim() || !password.trim()) {
            setError("Enter your email and password.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/admin/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to sign in."
                );
            }

            /*
             * Adjust this if your existing login controller
             * returns the token under another property.
             */
            const token =
                data.token ||
                data.admin?.token;

            if (!token) {
                throw new Error(
                    "Login succeeded but no authentication token was returned."
                );
            }

            localStorage.setItem(
                "snapconfused_admin_token",
                token
            );

            navigate("/admin");
        } catch (error) {
            console.error(
                "Admin login failed:",
                error
            );

            setError(
                error.message ||
                "Unable to sign in."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="admin-login">

            <div className="admin-login-card">

                <div className="admin-login-icon">
                    👻
                </div>

                <span className="admin-login-eyebrow">
                    SNAPCONFUSED
                </span>

                <h1>
                    Welcome back.
                </h1>

                <p>
                    The confusion needs
                    supervision.
                </p>


                {error && (
                    <div className="admin-login-error">
                        {error}
                    </div>
                )}


                <form
                    className="admin-login-form"
                    onSubmit={handleSubmit}
                >

                    <label>
                        Email

                        <input
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            placeholder="admin@example.com"
                            autoComplete="email"
                        />
                    </label>


                    <label>
                        Password

                        <input
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            placeholder="••••••••"
                            autoComplete="current-password"
                        />
                    </label>


                    <button
                        type="submit"
                        disabled={loading}
                    >
                        <HiOutlineLockClosed />

                        <span>
                            {loading
                                ? "Signing in..."
                                : "Enter the control room"}
                        </span>

                        {!loading && (
                            <HiArrowRight />
                        )}
                    </button>

                </form>

            </div>

        </main>
    );
};

export default AdminLogin;