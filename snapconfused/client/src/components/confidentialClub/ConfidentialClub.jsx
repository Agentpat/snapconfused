import { useState } from "react";

import {
    HiArrowRight,
    HiCheck,
    HiXMark,
} from "react-icons/hi2";

import "./ConfidentialClub.css";

import relaxNote from "../../assets/images/decorative/snapconfused-relax-we-get-it.png";
import notYouNote from "../../assets/images/decorative/snapconfused-not-you-its-snapchat.png";


const API_URL =
    import.meta.env.VITE_API_URL;


const ConfidentialClub = () => {

    const [email, setEmail] =
        useState("");

    const [status, setStatus] =
        useState("idle");

    const [message, setMessage] =
        useState("");


    /* =========================================================
       SUBMIT
    ========================================================= */

    const handleSubmit = async (event) => {

        event.preventDefault();


        if (
            status === "submitting"
        ) {
            return;
        }


        setMessage("");


        const trimmedEmail =
            email.trim();


        if (!trimmedEmail) {

            setStatus("error");

            setMessage(
                "Enter your email first."
            );

            return;

        }


        try {

            setStatus("submitting");


            const response =
                await fetch(
                    `${API_URL}/subscribers`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            email:
                                trimmedEmail,
                        }),
                    }
                );


            let data = {};

            try {

                data =
                    await response.json();

            } catch {

                data = {};

            }


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Something went wrong."
                );

            }


            setStatus("success");

            setMessage(
                data.message ||
                "Welcome to the Confidential Club. 🤫"
            );

            setEmail("");


        } catch (error) {

            console.error(
                "Confidential Club signup failed:",
                error
            );


            if (
                error.name ===
                "TypeError"
            ) {

                setMessage(
                    "We couldn't reach the club right now. Try again."
                );

            } else {

                setMessage(
                    error.message ||
                    "We couldn't add you to the club."
                );

            }


            setStatus("error");

        }

    };


    /* =========================================================
       RESET
    ========================================================= */

    const resetStatus = () => {

        setStatus("idle");

        setMessage("");

    };


    return (

        <section
            className="confidential-club"
            id="about"
        >

            <div className="confidential-club-inner">


                {/* =================================================
                    LEFT NOTE
                ================================================= */}

                <img
                    src={relaxNote}
                    alt=""
                    aria-hidden="true"
                    className="
                        confidential-note
                        confidential-note-left
                    "
                />


                {/* =================================================
                    MAIN CONTENT
                ================================================= */}

                <div className="confidential-content">


                    {/* =================================================
                        SUCCESS
                    ================================================= */}

                    {status === "success" ? (

                        <>

                            <h2 className="confidential-title">

                                You're officially
                                <span className="confidential-word">
                                    {" "}confidential.
                                </span>

                            </h2>


                            <p className="confidential-subtitle">

                                <HiCheck
                                    style={{
                                        verticalAlign:
                                            "middle",
                                        marginRight:
                                            "5px",
                                    }}
                                />

                                {message}

                            </p>


                            <button
                                type="button"
                                className="confidential-form"
                                onClick={
                                    resetStatus
                                }
                                style={{
                                    border: 0,
                                    cursor: "pointer",
                                    justifyContent:
                                        "center",
                                }}
                            >

                                <span
                                    style={{
                                        fontSize:
                                            "11px",
                                        fontWeight:
                                            700,
                                        color:
                                            "#111111",
                                    }}
                                >
                                    Join with another email
                                </span>

                            </button>

                        </>

                    ) : (

                        <>


                            {/* =================================================
                                TITLE
                            ================================================= */}

                            <h2 className="confidential-title">

                                Join the{" "}

                                <span className="confidential-word">

                                    confidential

                                </span>{" "}

                                club.

                            </h2>


                            <p className="confidential-subtitle">

                                {status === "error"
                                    ? message
                                    : "No judgment. Just confusion."}

                            </p>


                            {/* =================================================
                                FORM
                            ================================================= */}

                            <form
                                className="confidential-form"
                                onSubmit={
                                    handleSubmit
                                }
                            >

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(
                                        event
                                    ) =>
                                        setEmail(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter your email (we won't snap you)"
                                    aria-label="Email address"
                                    autoComplete="email"
                                    disabled={
                                        status ===
                                        "submitting"
                                    }
                                    required
                                />


                                <button
                                    type="submit"
                                    disabled={
                                        status ===
                                        "submitting"
                                    }
                                >

                                    <span>

                                        {status ===
                                            "submitting"
                                            ? "Joining..."
                                            : "Join the club"}

                                    </span>


                                    {status !==
                                        "submitting" && (

                                            <HiArrowRight
                                                aria-hidden="true"
                                            />

                                        )}

                                </button>

                            </form>


                            {/* =================================================
                                ERROR RETRY
                            ================================================= */}

                            {status === "error" && (

                                <button
                                    type="button"
                                    onClick={
                                        resetStatus
                                    }
                                    style={{
                                        marginTop:
                                            "8px",
                                        border: 0,
                                        background:
                                            "transparent",
                                        color:
                                            "#77705a",
                                        fontSize:
                                            "10px",
                                        fontWeight:
                                            700,
                                        cursor:
                                            "pointer",
                                    }}
                                >

                                    Try again

                                </button>

                            )}

                        </>

                    )}

                </div>


                {/* =================================================
                    RIGHT NOTE
                ================================================= */}

                <img
                    src={notYouNote}
                    alt=""
                    aria-hidden="true"
                    className="
                        confidential-note
                        confidential-note-right
                    "
                />

            </div>

        </section>

    );

};


export default ConfidentialClub;