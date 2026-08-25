import { useEffect, useRef, useState } from "react";

import {
    HiChevronLeft,
    HiChevronRight,
    HiArrowPath,
} from "react-icons/hi2";

import "./ConfessionCarousel.css";


const API_URL =
    import.meta.env.VITE_API_URL;


const AUTO_PLAY_DELAY = 4500;


const ConfessionCarousel = () => {

    // =========================================================
    // STATE
    // =========================================================

    const [confessions, setConfessions] =
        useState([]);

    const [activeIndex, setActiveIndex] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [isPaused, setIsPaused] =
        useState(false);

    const [direction, setDirection] =
        useState("next");


    const autoPlayRef =
        useRef(null);


    // =========================================================
    // FETCH FEATURED CONFESSIONS
    // =========================================================

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


            setConfessions(
                data.confessions || []
            );


            setActiveIndex(0);

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


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        fetchFeaturedConfessions();

    }, []);


    // =========================================================
    // NEXT
    // =========================================================

    const handleNext = () => {

        if (
            confessions.length <= 1
        ) {
            return;
        }


        setDirection("next");


        setActiveIndex(
            (currentIndex) =>
                (
                    currentIndex + 1
                ) %
                confessions.length
        );

    };


    // =========================================================
    // PREVIOUS
    // =========================================================

    const handlePrevious = () => {

        if (
            confessions.length <= 1
        ) {
            return;
        }


        setDirection("previous");


        setActiveIndex(
            (currentIndex) =>
                (
                    currentIndex -
                    1 +
                    confessions.length
                ) %
                confessions.length
        );

    };


    // =========================================================
    // AUTO PLAY
    // =========================================================

    useEffect(() => {

        if (
            loading ||
            error ||
            confessions.length <= 1 ||
            isPaused
        ) {
            return;
        }


        autoPlayRef.current =
            setInterval(() => {

                handleNext();

            }, AUTO_PLAY_DELAY);


        return () => {

            clearInterval(
                autoPlayRef.current
            );

        };

    }, [
        loading,
        error,
        confessions.length,
        isPaused,
    ]);


    // =========================================================
    // KEYBOARD NAVIGATION
    // =========================================================

    useEffect(() => {

        const handleKeyDown = (event) => {

            if (
                event.key === "ArrowRight"
            ) {

                handleNext();

            }


            if (
                event.key === "ArrowLeft"
            ) {

                handlePrevious();

            }

        };


        window.addEventListener(
            "keydown",
            handleKeyDown
        );


        return () => {

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );

        };

    }, [
        confessions.length,
    ]);


    // =========================================================
    // TOUCH SWIPE
    // =========================================================

    const touchStartRef =
        useRef(null);


    const touchEndRef =
        useRef(null);


    const handleTouchStart = (
        event
    ) => {

        touchStartRef.current =
            event.touches[0].clientX;

    };


    const handleTouchMove = (
        event
    ) => {

        touchEndRef.current =
            event.touches[0].clientX;

    };


    const handleTouchEnd = () => {

        if (
            touchStartRef.current === null ||
            touchEndRef.current === null
        ) {
            return;
        }


        const distance =
            touchStartRef.current -
            touchEndRef.current;


        const minimumSwipe =
            45;


        if (
            Math.abs(distance) >=
            minimumSwipe
        ) {

            if (distance > 0) {

                handleNext();

            } else {

                handlePrevious();

            }

        }


        touchStartRef.current =
            null;

        touchEndRef.current =
            null;

    };


    // =========================================================
    // GET CARD
    //
    // Creates an infinite carousel:
    //
    // previous | active | next
    //
    // =========================================================

    const getConfession = (
        offset
    ) => {

        if (
            confessions.length === 0
        ) {
            return null;
        }


        const index =
            (
                activeIndex +
                offset +
                confessions.length
            ) %
            confessions.length;


        return {
            confession:
                confessions[index],

            index,
        };

    };


    const previousCard =
        getConfession(-1);


    const currentCard =
        getConfession(0);


    const nextCard =
        getConfession(1);


    // =========================================================
    // CARD RENDERER
    // =========================================================

    const renderCard = (
        item,
        position
    ) => {

        if (!item) {
            return null;
        }


        const {
            confession,
            index,
        } = item;


        return (

            <article
                key={`
                    ${confession._id || index}
                    -
                    ${activeIndex}
                    -
                    ${position}
                `}
                className={`
                    confession-card
                    confession-card-${position}
                    confession-card-${direction}
                `}
            >

                {/* =============================================
                    DECORATIVE QUOTE
                ============================================= */}

                <span
                    className="confession-quote-mark"
                    aria-hidden="true"
                >
                    “
                </span>


                {/* =============================================
                    CONTENT
                ============================================= */}

                <div className="confession-content">

                    <p className="confession-quote">

                        {confession.content}

                    </p>


                    <span className="confession-author">

                        {confession.isAnonymous
                            ? "Anonymous"
                            : (
                                confession.author ||
                                "Anonymous"
                            )
                        }

                    </span>

                </div>

            </article>

        );

    };


    // =========================================================
    // EMPTY STATE
    // =========================================================

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


    // =========================================================
    // ERROR STATE
    // =========================================================

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

                            <HiArrowPath
                                aria-hidden="true"
                            />

                            Try again

                        </button>

                    </div>

                </div>

            </section>

        );

    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <section
            className="confession-section"
            id="confessions"
            onMouseEnter={() =>
                setIsPaused(true)
            }
            onMouseLeave={() =>
                setIsPaused(false)
            }
        >

            <div className="confession-inner">

                {/* =================================================
                    HEADING
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
                    CAROUSEL
                ================================================= */}

                {loading ? (

                    <div className="confession-loading">

                        <div className="confession-loading-card" />

                        <p>
                            Gathering the confusion...
                        </p>

                    </div>

                ) : (

                    <div
                        className="confession-carousel"
                        onTouchStart={
                            handleTouchStart
                        }
                        onTouchMove={
                            handleTouchMove
                        }
                        onTouchEnd={
                            handleTouchEnd
                        }
                    >

                        {/* =========================================
                            PREVIOUS BUTTON
                        ========================================= */}

                        <button
                            type="button"
                            className="confession-nav confession-nav-previous"
                            onClick={
                                handlePrevious
                            }
                            aria-label="Previous confession"
                        >

                            <HiChevronLeft
                                aria-hidden="true"
                            />

                        </button>


                        {/* =========================================
                            CARDS
                        ========================================= */}

                        <div
                            className={`
                                confession-track
                                confession-track-${direction}
                            `}
                            key={activeIndex}
                        >

                            {renderCard(
                                previousCard,
                                "previous"
                            )}

                            {renderCard(
                                currentCard,
                                "active"
                            )}

                            {renderCard(
                                nextCard,
                                "next"
                            )}

                        </div>


                        {/* =========================================
                            NEXT BUTTON
                        ========================================= */}

                        <button
                            type="button"
                            className="confession-nav confession-nav-next"
                            onClick={
                                handleNext
                            }
                            aria-label="Next confession"
                        >

                            <HiChevronRight
                                aria-hidden="true"
                            />

                        </button>

                    </div>

                )}

            </div>

        </section>

    );

};


export default ConfessionCarousel;