import { useEffect, useState } from "react";

import {
    HiChevronRight,
    HiArrowPath,
} from "react-icons/hi2";

import "./ConfessionCarousel.css";


const API_URL =
    import.meta.env.VITE_API_URL;

const ConfessionCarousel = () => {

    const [confessions, setConfessions] =
        useState([]);

    const [activeIndex, setActiveIndex] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    /* =========================================================
       FETCH FEATURED CONFESSIONS
    ========================================================= */

    const fetchFeaturedConfessions = async () => {

        try {

            setLoading(true);

            setError("");


            const response = await fetch(
                `${API_URL}/confessions/featured`
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to load confessions."
                );

            }


            const fetchedConfessions =
                data.confessions || [];


            setConfessions(
                fetchedConfessions
            );


            /*
                If the previous active index is
                larger than the new list, reset it.
            */

            setActiveIndex((current) => {

                if (
                    fetchedConfessions.length === 0
                ) {
                    return 0;
                }


                return Math.min(
                    current,
                    fetchedConfessions.length - 1
                );

            });

        } catch (error) {

            console.error(
                "Failed to load featured confessions:",
                error
            );


            setError(
                error.message ||
                "Unable to load confessions."
            );

        } finally {

            setLoading(false);

        }

    };


    /* =========================================================
       INITIAL LOAD
    ========================================================= */

    useEffect(() => {

        fetchFeaturedConfessions();

    }, []);


    /* =========================================================
       NEXT SLIDE
    ========================================================= */

    const nextSlide = () => {

        if (confessions.length === 0) {
            return;
        }


        setActiveIndex((current) =>
            current === confessions.length - 1
                ? 0
                : current + 1
        );

    };


    /* =========================================================
       SELECT SLIDE
    ========================================================= */

    const selectSlide = (index) => {

        setActiveIndex(index);

    };


    /* =========================================================
       EMPTY STATE
    ========================================================= */

    if (
        !loading &&
        !error &&
        confessions.length === 0
    ) {

        return (
            <section
                className="confession-section"
                id="confessions"
            >

                <div className="confession-inner">

                    <div className="confession-heading">

                        <h2>
                            You’re not alone.
                        </h2>

                        <p>
                            Real struggles from real people.
                        </p>

                    </div>


                    <div className="confession-empty">

                        <span className="confession-empty-icon">
                            👻
                        </span>

                        <p>
                            Nobody has confessed yet.
                        </p>

                        <span>
                            Be the first one to admit
                            you’re confused.
                        </span>

                    </div>

                </div>

            </section>
        );

    }


    /* =========================================================
       ERROR STATE
    ========================================================= */

    if (
        !loading &&
        error
    ) {

        return (
            <section
                className="confession-section"
                id="confessions"
            >

                <div className="confession-inner">

                    <div className="confession-heading">

                        <h2>
                            You’re not alone.
                        </h2>

                        <p>
                            Real struggles from real people.
                        </p>

                    </div>


                    <div className="confession-empty confession-empty-error">

                        <span className="confession-empty-icon">
                            😵‍💫
                        </span>

                        <p>
                            The confusion machine
                            is taking a break.
                        </p>

                        <button
                            type="button"
                            onClick={
                                fetchFeaturedConfessions
                            }
                        >

                            <HiArrowPath />

                            Try again

                        </button>

                    </div>

                </div>

            </section>
        );

    }


    return (

        <section
            className="confession-section"
            id="confessions"
        >

            <div className="confession-inner">


                {/* =================================================
                    SECTION HEADING
                ================================================= */}

                <div className="confession-heading">

                    <h2>
                        You’re not alone.
                    </h2>

                    <p>
                        Real struggles from real people.
                    </p>

                </div>


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading ? (

                    <div className="confession-loading">

                        <div className="confession-loading-card">
                            <span />
                            <span />
                            <span />
                        </div>

                        <p>
                            Gathering the confusion...
                        </p>

                    </div>

                ) : (

                    <>
                        {/* =================================================
                            CAROUSEL
                        ================================================= */}

                        <div className="confession-carousel">

                            <div className="confession-track">

                                {confessions.map(
                                    (
                                        confession,
                                        index
                                    ) => (

                                        <article
                                            key={
                                                confession._id ||
                                                confession.id ||
                                                index
                                            }
                                            className={`
                                                confession-card
                                                ${activeIndex === index
                                                    ? "confession-card-active"
                                                    : ""
                                                }
                                                confession-card-text-only
                                            `}
                                        >


                                            {/* QUOTE MARK */}

                                            <span
                                                className="confession-quote-mark"
                                                aria-hidden="true"
                                            >
                                                “
                                            </span>


                                            {/* CONTENT */}

                                            <div className="confession-content">

                                                <p className="confession-quote">

                                                    “
                                                    {
                                                        confession.content
                                                    }
                                                    ”

                                                </p>


                                                <span className="confession-author">

                                                    {
                                                        confession.isAnonymous
                                                            ? "Anonymous"
                                                            : confession.author ||
                                                            "Anonymous"
                                                    }

                                                </span>

                                            </div>

                                        </article>

                                    )
                                )}

                            </div>


                            {/* =================================================
                                NEXT BUTTON
                            ================================================= */}

                            {confessions.length > 1 && (

                                <button
                                    type="button"
                                    className="confession-next"
                                    onClick={
                                        nextSlide
                                    }
                                    aria-label="Show next confession"
                                >

                                    <HiChevronRight
                                        aria-hidden="true"
                                    />

                                </button>

                            )}

                        </div>


                        {/* =================================================
                            CAROUSEL INDICATORS
                        ================================================= */}

                        {confessions.length > 1 && (

                            <div
                                className="confession-dots"
                                aria-label="Confession carousel navigation"
                            >

                                {confessions.map(
                                    (
                                        confession,
                                        index
                                    ) => (

                                        <button
                                            key={
                                                confession._id ||
                                                confession.id ||
                                                index
                                            }
                                            type="button"
                                            className={`
                                                confession-dot
                                                ${activeIndex === index
                                                    ? "confession-dot-active"
                                                    : ""
                                                }
                                            `}
                                            onClick={() =>
                                                selectSlide(
                                                    index
                                                )
                                            }
                                            aria-label={
                                                `Show confession ${index + 1
                                                }`
                                            }
                                            aria-current={
                                                activeIndex === index
                                                    ? "true"
                                                    : undefined
                                            }
                                        />

                                    )
                                )}

                            </div>

                        )}

                    </>

                )}

            </div>

        </section>

    );

};


export default ConfessionCarousel;