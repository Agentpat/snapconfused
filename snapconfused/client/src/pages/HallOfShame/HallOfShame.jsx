import { useEffect, useState } from "react";

import {
    HiArrowRight,
    HiOutlineTrophy,
    HiArrowPath,
} from "react-icons/hi2";

import "./HallOfShame.css";


const API_URL =
    import.meta.env.VITE_API_URL;


const HallOfShame = () => {

    const [confessions, setConfessions] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    /* =========================================================
       FETCH FEATURED CONFESSIONS
    ========================================================= */

    const fetchFeatured = async () => {

        try {

            setLoading(true);

            setError("");


            const response = await fetch(
                `${API_URL}/confessions/featured`
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
                    "Unable to load the Hall of Shame."
                );

            }


            setConfessions(
                Array.isArray(data.confessions)
                    ? data.confessions
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load Hall of Shame:",
                error
            );


            setError(
                error.message ||
                "Something went wrong."
            );

        } finally {

            setLoading(false);

        }

    };


    /* =========================================================
       INITIAL LOAD
    ========================================================= */

    useEffect(() => {

        fetchFeatured();

    }, []);


    /* =========================================================
       HELPERS
    ========================================================= */

    const getAuthorName = (confession) => {

        if (confession.isAnonymous) {
            return "Anonymous";
        }

        return (
            confession.author?.trim() ||
            "Anonymous"
        );

    };


    const getAuthorInitial = (confession) => {

        const name =
            getAuthorName(confession);

        if (name === "Anonymous") {
            return "?";
        }

        return (
            name
                .charAt(0)
                .toUpperCase() || "?"
        );

    };


    const getDate = (confession) => {

        if (!confession.createdAt) {
            return "";
        }

        const date =
            new Date(
                confession.createdAt
            );

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "";
        }

        return date.toLocaleDateString(
            undefined,
            {
                month: "short",
                day: "numeric",
                year: "numeric",
            }
        );

    };


    return (

        <main className="hall-page">


            {/* =================================================
                HERO
            ================================================= */}

            <section className="hall-hero">

                <div className="hall-hero-inner">

                    <div className="hall-trophy">

                        <HiOutlineTrophy />

                    </div>


                    <span className="hall-eyebrow">

                        THE HALL OF SHAME

                    </span>


                    <h1>

                        They made the
                        <br />

                        <span>
                            mistakes.
                        </span>

                    </h1>


                    <p>

                        So the rest of us could learn
                        from them. Or at least laugh
                        a little.

                    </p>

                </div>

            </section>


            {/* =================================================
                FEATURED CONFESSIONS
            ================================================= */}

            <section className="hall-feed">

                <div className="hall-feed-inner">


                    {/* HEADING */}

                    <div className="hall-heading">

                        <div>

                            <span>
                                QUESTIONABLE DECISIONS
                            </span>

                            <h2>
                                The brave ones.
                            </h2>

                        </div>


                        <p>
                            Zero judgment.
                            <br />
                            Maximum respect.
                        </p>

                    </div>


                    {/* =================================================
                        LOADING
                    ================================================= */}

                    {loading && (

                        <div className="hall-state">

                            <div className="hall-loader" />

                            <p>
                                Reviewing the evidence...
                            </p>

                        </div>

                    )}


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {!loading && error && (

                        <div className="hall-state">

                            <div className="hall-state-icon">
                                😭
                            </div>


                            <h3>
                                The evidence disappeared.
                            </h3>


                            <p>
                                Try loading the Hall again.
                            </p>


                            <button
                                type="button"
                                onClick={fetchFeatured}
                            >

                                <HiArrowPath />

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

                            <div className="hall-state">

                                <div className="hall-state-icon">
                                    🏆
                                </div>


                                <h3>
                                    Nobody has earned this yet.
                                </h3>


                                <p>
                                    Give it time.
                                    Someone will mess up eventually.
                                </p>

                            </div>

                        )}


                    {/* =================================================
                        CONFESSIONS
                    ================================================= */}

                    {!loading &&
                        !error &&
                        confessions.length > 0 && (

                            <div className="hall-grid">

                                {confessions.map(
                                    (
                                        confession,
                                        index
                                    ) => (

                                        <article
                                            key={
                                                confession._id ||
                                                index
                                            }
                                            className={`
                                                hall-card
                                                hall-card-${(index % 3) + 1
                                                }
                                            `}
                                        >


                                            {/* CARD TOP */}

                                            <div className="hall-card-top">

                                                <span>

                                                    #
                                                    {String(
                                                        index + 1
                                                    ).padStart(
                                                        2,
                                                        "0"
                                                    )}

                                                </span>


                                                <HiOutlineTrophy />

                                            </div>


                                            {/* QUOTE */}

                                            <div
                                                className="hall-quote-mark"
                                                aria-hidden="true"
                                            >
                                                “
                                            </div>


                                            <p className="hall-quote">

                                                {confession.content}

                                            </p>


                                            {/* AUTHOR */}

                                            <div className="hall-author">

                                                <div className="hall-avatar">

                                                    {
                                                        getAuthorInitial(
                                                            confession
                                                        )
                                                    }

                                                </div>


                                                <span>

                                                    {
                                                        getAuthorName(
                                                            confession
                                                        )
                                                    }

                                                </span>


                                                {getDate(
                                                    confession
                                                ) && (

                                                        <small>
                                                            •{" "}
                                                            {
                                                                getDate(
                                                                    confession
                                                                )
                                                            }
                                                        </small>

                                                    )}

                                            </div>

                                        </article>

                                    )
                                )}

                            </div>

                        )}

                </div>

            </section>


            {/* =================================================
                CTA
            ================================================= */}

            <section className="hall-cta">

                <div className="hall-cta-inner">

                    <div>

                        <span>
                            THINK YOU BELONG HERE?
                        </span>

                        <h2>
                            You probably do.
                        </h2>

                    </div>


                    <a
                        href="/confessions"
                        className="hall-cta-button"
                    >

                        <span>
                            Confess something
                        </span>

                        <HiArrowRight />

                    </a>

                </div>

            </section>

        </main>

    );

};


export default HallOfShame;