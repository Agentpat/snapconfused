import { useEffect, useState } from "react";

import {
    HiArrowLeft,
    HiArrowRight,
    HiOutlineChatBubbleLeftEllipsis,
    HiOutlineShare,
    HiSparkles,
} from "react-icons/hi2";

import "./Confessions.css";

import ConfessionSubmission from "../../components/ConfessionSubmission/ConfessionSubmission";

import ConfessionShare from "../../components/ConfessionShare/ConfessionShare";


const API_URL =
    import.meta.env.VITE_API_URL;

const ITEMS_PER_PAGE = 12;


const Confessions = () => {

    // =========================================================
    // STATE
    // =========================================================

    const [confessions, setConfessions] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [showSubmission, setShowSubmission] =
        useState(false);

    const [shareConfession, setShareConfession] =
        useState(null);

    const [page, setPage] =
        useState(1);

    const [totalPages, setTotalPages] =
        useState(1);

    const [totalConfessions, setTotalConfessions] =
        useState(0);


    // =========================================================
    // FETCH CONFESSIONS
    // =========================================================

    const fetchConfessions = async (
        requestedPage = 1
    ) => {

        if (requestedPage < 1) {
            return;
        }


        if (
            totalPages > 1 &&
            requestedPage > totalPages
        ) {
            return;
        }


        try {

            setLoading(true);

            setError("");


            const response =
                await fetch(
                    `${API_URL}/confessions?page=${requestedPage}&limit=${ITEMS_PER_PAGE}`
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to load confessions."
                );

            }


            setConfessions(
                data.confessions || []
            );


            setPage(
                data.page ||
                requestedPage
            );


            setTotalPages(
                data.totalPages ||
                1
            );


            setTotalConfessions(
                data.total ||
                0
            );


            if (
                requestedPage !== page
            ) {

                requestAnimationFrame(() => {

                    const feed =
                        document.querySelector(
                            ".confessions-feed"
                        );


                    if (feed) {

                        feed.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                        });

                    }

                });

            }

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


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        fetchConfessions(1);

    }, []);


    // =========================================================
    // PAGINATION
    // =========================================================

    const handlePreviousPage = () => {

        if (
            loading ||
            page <= 1
        ) {
            return;
        }


        fetchConfessions(
            page - 1
        );

    };


    const handleNextPage = () => {

        if (
            loading ||
            page >= totalPages
        ) {
            return;
        }


        fetchConfessions(
            page + 1
        );

    };


    // =========================================================
    // SHARE
    // =========================================================

    const handleShareConfession = (
        confession,
        index
    ) => {

        setShareConfession({
            confession,
            index,
        });

    };


    const handleCloseShare = () => {

        setShareConfession(null);

    };


    // =========================================================
    // RENDER
    // =========================================================

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

                        <span>
                            too embarrassed
                        </span>

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


                        <HiArrowRight
                            aria-hidden="true"
                        />

                    </button>

                </div>

            </section>


            {/* =================================================
                CONFESSIONS
            ================================================= */}

            <section className="confessions-feed">

                <div className="confessions-feed-inner">


                    {/* =================================================
                        FEED HEADING
                    ================================================= */}

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

                            <HiSparkles
                                aria-hidden="true"
                            />

                            <span>

                                {loading
                                    ? "..."
                                    : `${totalConfessions} shared`
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

                    {!loading &&
                        error && (

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
                                    onClick={() =>
                                        fetchConfessions(page)
                                    }
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

                                    <HiArrowRight
                                        aria-hidden="true"
                                    />

                                </button>

                            </div>

                        )}


                    {/* =================================================
                        GRID
                    ================================================= */}

                    {!loading &&
                        !error &&
                        confessions.length > 0 && (

                            <>

                                <div className="confessions-grid">

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
                                                    confession-feed-card
                                                    confession-feed-card-${(
                                                        index % 4
                                                    ) + 1}
                                                `}
                                            >

                                                {/* --------------------------------
                                                    QUOTE MARK
                                                -------------------------------- */}

                                                <span
                                                    className="confession-feed-quote"
                                                    aria-hidden="true"
                                                >
                                                    “
                                                </span>


                                                {/* --------------------------------
                                                    CONTENT
                                                -------------------------------- */}

                                                <div className="confession-feed-card-content">

                                                    <p>
                                                        {
                                                            confession.content
                                                        }
                                                    </p>


                                                    {/* --------------------------------
                                                        AUTHOR
                                                    -------------------------------- */}

                                                    <div className="confession-feed-author">

                                                        <div className="confession-author-avatar">

                                                            {
                                                                confession.isAnonymous
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

                                                            {
                                                                confession.isAnonymous
                                                                    ? "Anonymous"
                                                                    : confession.author
                                                            }

                                                        </span>

                                                    </div>

                                                </div>


                                                {/* --------------------------------
                                                    DECORATION
                                                -------------------------------- */}

                                                <HiOutlineChatBubbleLeftEllipsis
                                                    className="confession-feed-decoration"
                                                    aria-hidden="true"
                                                />


                                                {/* --------------------------------
                                                    SHARE
                                                -------------------------------- */}

                                                <button
                                                    type="button"
                                                    className="confession-feed-share"
                                                    onClick={() =>
                                                        handleShareConfession(
                                                            confession,
                                                            index
                                                        )
                                                    }
                                                    aria-label={`Share confession ${index + 1}`}
                                                >

                                                    <HiOutlineShare
                                                        aria-hidden="true"
                                                    />

                                                    <span>
                                                        Share
                                                    </span>

                                                </button>

                                            </article>

                                        )
                                    )}

                                </div>


                                {/* =================================================
                                    PAGINATION
                                ================================================= */}

                                {totalPages > 1 && (

                                    <div
                                        className="confessions-pagination"
                                        aria-label="Confession pagination"
                                    >

                                        <button
                                            type="button"
                                            className="confessions-page-button"
                                            disabled={
                                                page <= 1 ||
                                                loading
                                            }
                                            onClick={
                                                handlePreviousPage
                                            }
                                            aria-label="Previous page"
                                        >

                                            <HiArrowLeft
                                                aria-hidden="true"
                                            />

                                            <span>
                                                Previous
                                            </span>

                                        </button>


                                        <div
                                            className="confessions-page-indicator"
                                            aria-live="polite"
                                        >

                                            <span>
                                                Page
                                            </span>


                                            <strong>
                                                {page}
                                            </strong>


                                            <span>
                                                of {totalPages}
                                            </span>

                                        </div>


                                        <button
                                            type="button"
                                            className="confessions-page-button"
                                            disabled={
                                                page >= totalPages ||
                                                loading
                                            }
                                            onClick={
                                                handleNextPage
                                            }
                                            aria-label="Next page"
                                        >

                                            <span>
                                                Next
                                            </span>


                                            <HiArrowRight
                                                aria-hidden="true"
                                            />

                                        </button>

                                    </div>

                                )}

                            </>

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
                            Still confused?
                            That's exactly why we're here.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="confessions-bottom-button"
                        onClick={() =>
                            setShowSubmission(true)
                        }
                    >

                        <span>
                            Share the pain
                        </span>


                        <HiArrowRight
                            aria-hidden="true"
                        />

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


            {/* =================================================
                CONFESSION SHARE MODAL
            ================================================= */}

            {shareConfession && (

                <ConfessionShare
                    confession={
                        shareConfession.confession
                    }
                    index={
                        shareConfession.index
                    }
                    onClose={
                        handleCloseShare
                    }
                />

            )}

        </main>

    );

};


export default Confessions;