import { useState } from "react";

import {
    HiArrowRight,
    HiCheck,
    HiXMark,
} from "react-icons/hi2";

import "./ConfessionSubmission.css";


const API_URL =
    import.meta.env.VITE_API_URL;


const ConfessionSubmission = ({ onClose }) => {

    const [content, setContent] = useState("");

    const [author, setAuthor] = useState("");

    const [isAnonymous, setIsAnonymous] =
        useState(true);

    const [status, setStatus] =
        useState("idle");

    const [error, setError] =
        useState("");


    /* =========================================================
       RESET FORM
    ========================================================= */

    const resetForm = () => {

        setContent("");

        setAuthor("");

        setIsAnonymous(true);

        setError("");

        setStatus("idle");

    };


    /* =========================================================
       SUBMIT
    ========================================================= */

    const handleSubmit = async (event) => {

        event.preventDefault();


        /*
            Prevent accidental double submission.
        */

        if (status === "submitting") {
            return;
        }


        setError("");


        /* =====================================================
           VALIDATION
        ===================================================== */

        const trimmedContent =
            content.trim();

        const trimmedAuthor =
            author.trim();


        if (!trimmedContent) {

            setError(
                "Tell us what happened first 😂"
            );

            return;

        }


        if (trimmedContent.length < 5) {

            setError(
                "Give us a little more context 😂"
            );

            return;

        }


        if (
            !isAnonymous &&
            !trimmedAuthor
        ) {

            setError(
                "Tell us what we should call you."
            );

            return;

        }


        /* =====================================================
           SUBMIT
        ===================================================== */

        try {

            setStatus("submitting");


            const response = await fetch(
                `${API_URL}/confessions`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        content:
                            trimmedContent,

                        author:
                            isAnonymous
                                ? "Anonymous"
                                : trimmedAuthor,

                        isAnonymous,
                    }),
                }
            );


            /*
                Some failed requests may not
                return valid JSON, so handle that
                safely.
            */

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
                    "We couldn't send your confession."
                );

            }


            /* =================================================
               SUCCESS
            ================================================= */

            setStatus("success");

            setContent("");

            setAuthor("");

            setIsAnonymous(true);


        } catch (error) {

            console.error(
                "Confession submission failed:",
                error
            );


            if (
                error.name ===
                "TypeError"
            ) {

                setError(
                    "We couldn't reach the confession machine. Try again."
                );

            } else {

                setError(
                    error.message ||
                    "We couldn't send your confession."
                );

            }


            setStatus("error");

        }

    };


    /* =========================================================
       TRY AGAIN
    ========================================================= */

    const handleTryAgain = () => {

        setError("");

        setStatus("idle");

    };


    /* =========================================================
       SUBMIT ANOTHER
    ========================================================= */

    const handleSubmitAnother = () => {

        resetForm();

    };


    return (

        <div
            className="confession-modal-overlay"
            onMouseDown={onClose}
        >

            <div
                className="confession-modal"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >

                {/* =================================================
                    CLOSE
                ================================================= */}

                <button
                    type="button"
                    className="confession-modal-close"
                    onClick={onClose}
                    aria-label="Close confession form"
                >

                    <HiXMark />

                </button>


                {/* =================================================
                    SUCCESS
                ================================================= */}

                {status === "success" ? (

                    <div className="confession-success">

                        <div className="confession-success-mark">

                            <HiCheck />

                        </div>


                        <span className="confession-success-eyebrow">

                            CONFESSION RECEIVED

                        </span>


                        <h2>

                            You're officially
                            <br />
                            one of us. 😂

                        </h2>


                        <p>

                            Your confusion has been
                            safely documented.

                            <br />

                            It's now waiting for
                            approval. No judgment here.

                        </p>


                        <div className="confession-success-actions">

                            <button
                                type="button"
                                className="confession-success-button"
                                onClick={
                                    handleSubmitAnother
                                }
                            >

                                Submit another

                            </button>


                            <button
                                type="button"
                                className="confession-success-button confession-success-button-secondary"
                                onClick={onClose}
                            >

                                Back to Snapchat confusion

                            </button>

                        </div>

                    </div>

                ) : (

                    /* =================================================
                       FORM
                    ================================================= */

                    <div className="confession-form-content">

                        <span className="confession-modal-eyebrow">

                            CONFIDENTIAL CLUB

                        </span>


                        <h2>

                            Share the pain.

                        </h2>


                        <p className="confession-modal-intro">

                            Tell us about the Snapchat
                            moment that made you question
                            everything.

                        </p>


                        <form
                            onSubmit={handleSubmit}
                            className="confession-submit-form"
                        >


                            {/* =================================================
                                CONFESSION
                            ================================================= */}

                            <div className="confession-field">

                                <label htmlFor="confession-content">

                                    What happened?

                                </label>


                                <textarea
                                    id="confession-content"
                                    value={content}
                                    onChange={(event) =>
                                        setContent(
                                            event.target.value
                                        )
                                    }
                                    placeholder="I accidentally..."
                                    maxLength={500}
                                    disabled={
                                        status ===
                                        "submitting"
                                    }
                                    autoFocus
                                />


                                <span className="confession-character-count">

                                    {content.length}/500

                                </span>

                            </div>


                            {/* =================================================
                                NAME
                            ================================================= */}

                            <div className="confession-field">

                                <label htmlFor="confession-author">

                                    What should we call you?

                                </label>


                                <input
                                    id="confession-author"
                                    type="text"
                                    value={author}
                                    onChange={(event) =>
                                        setAuthor(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Your name"
                                    maxLength={50}
                                    disabled={
                                        isAnonymous ||
                                        status ===
                                        "submitting"
                                    }
                                />

                            </div>


                            {/* =================================================
                                ANONYMOUS
                            ================================================= */}

                            <label
                                className="confession-anonymous"
                                htmlFor="confession-anonymous"
                            >

                                <input
                                    id="confession-anonymous"
                                    type="checkbox"
                                    checked={isAnonymous}
                                    onChange={(event) =>
                                        setIsAnonymous(
                                            event.target.checked
                                        )
                                    }
                                    disabled={
                                        status ===
                                        "submitting"
                                    }
                                />


                                <span className="confession-checkbox">

                                    <span>
                                        ✓
                                    </span>

                                </span>


                                <span>

                                    Keep me anonymous

                                </span>

                            </label>


                            {/* =================================================
                                ERROR
                            ================================================= */}

                            {error && (

                                <div
                                    className="confession-form-error"
                                    role="alert"
                                >

                                    {error}

                                    {status === "error" && (

                                        <button
                                            type="button"
                                            className="confession-error-retry"
                                            onClick={
                                                handleTryAgain
                                            }
                                        >

                                            Try again

                                        </button>

                                    )}

                                </div>

                            )}


                            {/* =================================================
                                SUBMIT
                            ================================================= */}

                            <button
                                type="submit"
                                className="confession-submit-button"
                                disabled={
                                    status ===
                                    "submitting"
                                }
                            >

                                <span>

                                    {status === "submitting"
                                        ? "Sending your confession..."
                                        : "Confess"}

                                </span>


                                {status !==
                                    "submitting" && (

                                        <HiArrowRight />

                                    )}

                            </button>

                        </form>

                    </div>

                )}

            </div>

        </div>

    );

};


export default ConfessionSubmission;