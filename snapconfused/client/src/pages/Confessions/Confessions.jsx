import { useEffect, useState } from "react";

import {
    HiArrowRight,
    HiOutlineChatBubbleLeftEllipsis,
    HiSparkles,
} from "react-icons/hi2";

import "./Confessions.css";

import ConfessionSubmission from "../../components/ConfessionSubmission/ConfessionSubmission";


const API_URL =
    import.meta.env.VITE_API_URL;
const Confessions = () => {

    const [confessions, setConfessions] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [showSubmission, setShowSubmission] =
        useState(false);


    const fetchConfessions = async () => {

        try {

            setLoading(true);

            setError("");


            const response = await fetch(
                `${API_URL}/confessions`
            );


            const data = await response.json();


            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to load confessions."
                );
            }


            setConfessions(
                data.confessions || []
            );

        } catch (error) {

            console.error(
                "Failed to load confessions:",
                error
            );

            setError(
                error.message ||
                "Something went wrong while loading confessions."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {
        fetchConfessions();
    }, []);


    return (
        <main className="confessions-page">

            {/* =================================================
                HERO
            ================================================= */}

            <section className="confessions-hero">

                <div className="confessions-hero-inner">

                    <span className="confessions-eyebrow">
                        THE CONFESSIONAL
                    </span>


                    <h1>
                        Things we were
                        <br />
                        <span>too embarrassed</span>
                        <br />
                        to ask.
                    </h1>


                    <p>
                        Real Snapchat struggles.
                        Real people.
                        Absolutely no judgment.
                    </p>


                    <button
                        type="button"
                        className="confessions-share-button"
                        onClick={() =>
                            setShowSubmission(true)
                        }
                    >
                        <span>
                            Share your confusion
                        </span>

                        <HiArrowRight />
                    </button>

                </div>

            </section>


            {/* =================================================
                CONFESSIONS
            ================================================= */}

            <section className="confessions-feed">

                <div className="confessions-feed-inner">

                    <div className="confessions-feed-heading">

                        <div>
                            <span className="confessions-feed-eyebrow">
                                FROM THE CONFUSED
                            </span>

                            <h2>
                                The confessions.
                            </h2>
                        </div>


                        <div className="confessions-count">

                            <HiSparkles />

                            <span>
                                {loading
                                    ? "..."
                                    : `${confessions.length} shared`
                                }
                            </span>

                        </div>

                    </div>


                    {/* =================================================
                        LOADING
                    ================================================= */}

                    {loading && (

                        <div className="confessions-loading">

                            <div className="confessions-loader" />

                            <p>
                                Looking through the
                                confusion...
                            </p>

                        </div>

                    )}


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {!loading && error && (

                        <div className="confessions-state">

                            <div className="confessions-state-icon">
                                😵
                            </div>

                            <h3>
                                Snapchat confused us again.
                            </h3>

                            <p>
                                We couldn't load the
                                confessions right now.
                            </p>

                            <button
                                type="button"
                                onClick={fetchConfessions}
                            >
                                Try again
                            </button>

                        </div>

                    )}


                    {/* =================================================
                        EMPTY
                    ================================================= */}

                    {!loading &&
                        !error &&
                        confessions.length === 0 && (

                            <div className="confessions-state">

                                <div className="confessions-state-icon">
                                    👻
                                </div>

                                <h3>
                                    It's suspiciously quiet.
                                </h3>

                                <p>
                                    Nobody has confessed yet.
                                    Be brave. Go first.
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowSubmission(true)
                                    }
                                >
                                    <span>
                                        Be the first confession
                                    </span>

                                    <HiArrowRight />
                                </button>

                            </div>

                        )}


                    {/* =================================================
                        GRID
                    ================================================= */}

                    {!loading &&
                        !error &&
                        confessions.length > 0 && (

                            <div className="confessions-grid">

                                {confessions.map(
                                    (confession, index) => (

                                        <article
                                            key={
                                                confession._id ||
                                                index
                                            }
                                            className={`
                                                confession-feed-card
                                                confession-feed-card-${(
                                                    index % 4
                                                ) + 1}
                                            `}
                                        >

                                            <span
                                                className="confession-feed-quote"
                                                aria-hidden="true"
                                            >
                                                “
                                            </span>


                                            <div className="confession-feed-card-content">

                                                <p>
                                                    {confession.content}
                                                </p>


                                                <div className="confession-feed-author">

                                                    <div className="confession-author-avatar">
                                                        {confession.isAnonymous
                                                            ? "?"
                                                            : (
                                                                confession.author
                                                                    ?.charAt(0)
                                                                    ?.toUpperCase() ||
                                                                "?"
                                                            )
                                                        }
                                                    </div>

                                                    <span>
                                                        {confession.isAnonymous
                                                            ? "Anonymous"
                                                            : confession.author
                                                        }
                                                    </span>

                                                </div>

                                            </div>


                                            <HiOutlineChatBubbleLeftEllipsis
                                                className="confession-feed-decoration"
                                                aria-hidden="true"
                                            />

                                        </article>

                                    )
                                )}

                            </div>

                        )}

                </div>

            </section>


            {/* =================================================
    BOTTOM CTA
================================================= */}

            <section className="confessions-bottom-cta">

                <div className="confessions-bottom-cta-inner">

                    <div className="confessions-bottom-copy">

                        <span>
                            STILL CONFUSED?
                        </span>

                        <h2>
                            You're definitely not alone.
                        </h2>

                        <p>
                            Still confused? That's exactly why we're here.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="confessions-bottom-button"
                        onClick={() => setShowSubmission(true)}
                    >
                        <span>
                            Share the pain
                        </span>

                        <HiArrowRight />
                    </button>

                </div>

            </section>

            {/* =================================================
                SUBMISSION MODAL
            ================================================= */}

            {showSubmission && (
                <ConfessionSubmission
                    onClose={() =>
                        setShowSubmission(false)
                    }
                />
            )}

        </main>
    );
};


export default Confessions;