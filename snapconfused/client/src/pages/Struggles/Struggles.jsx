import { useEffect, useState } from "react";

import {
    HiArrowRight,
    HiChevronDown,
    HiOutlineCamera,
    HiOutlineFire,
    HiOutlineChatBubbleLeftEllipsis,
    HiOutlineEye,
    HiArrowPath,
} from "react-icons/hi2";

import "./Struggles.css";


const API_URL =
    import.meta.env.VITE_API_URL;


const struggles = [
    {
        id: 1,
        number: "01",
        icon: HiOutlineChatBubbleLeftEllipsis,
        question: "Why did the message disappear?",
        short: "Because Snapchat apparently hates receipts.",
        answer:
            "Snaps and chats can disappear after they've been viewed, depending on the conversation settings. So if you were looking for that message five minutes later... you're probably not going to find it.",
    },
    {
        id: 2,
        number: "02",
        icon: HiOutlineFire,
        question: "What is a streak?",
        short: "Two people repeatedly sending each other Snaps.",
        answer:
            "A Snapstreak happens when you and another person send Snaps back and forth regularly. The 🔥 means you're officially maintaining one. The number tells you how long you've kept it going.",
    },
    {
        id: 3,
        number: "03",
        icon: HiOutlineEye,
        question: "What is a Story?",
        short: "A collection of Snaps people can watch.",
        answer:
            "A Story is where Snaps can be shared for other people to view. Unlike a private Snap sent directly to one person, a Story is designed to be watched by the people you've chosen to share it with.",
    },
    {
        id: 4,
        number: "04",
        icon: HiOutlineCamera,
        question: "Why did I open the camera?",
        short: "Because Snapchat really wants you to take a picture.",
        answer:
            "The Snapchat camera is basically the front door of the app. Open Snapchat and you're immediately looking at a camera. Yes, that means accidental selfies are practically part of the experience.",
    },
];


const Struggles = () => {

    const [activeId, setActiveId] =
        useState(null);

    const [confessions, setConfessions] =
        useState([]);

    const [loadingConfessions, setLoadingConfessions] =
        useState(true);

    const [confessionError, setConfessionError] =
        useState("");


    /* =========================================================
       FETCH APPROVED COMMUNITY CONFESSIONS
    ========================================================= */

    const fetchApprovedConfessions = async () => {

        try {

            setLoadingConfessions(true);

            setConfessionError("");


            const response = await fetch(
                `${API_URL}/confessions/approved`
            );


            let data = {};

            try {
                data = await response.json();
            } catch {
                data = {};
            }


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to load community struggles."
                );

            }


            setConfessions(
                Array.isArray(data.confessions)
                    ? data.confessions
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load approved confessions:",
                error
            );


            setConfessionError(
                error.message ||
                "Something went wrong."
            );

        } finally {

            setLoadingConfessions(false);

        }

    };


    useEffect(() => {

        fetchApprovedConfessions();

    }, []);


    /* =========================================================
       ACCORDION
    ========================================================= */

    const toggleStruggle = (id) => {

        setActiveId((current) =>
            current === id
                ? null
                : id
        );

    };


    /* =========================================================
       HELPERS
    ========================================================= */

    const getAuthor = (confession) => {

        if (confession.isAnonymous) {
            return "Anonymous";
        }

        return (
            confession.author?.trim() ||
            "Anonymous"
        );

    };


    const getInitial = (confession) => {

        const author =
            getAuthor(confession);

        if (author === "Anonymous") {
            return "?";
        }

        return (
            author
                .charAt(0)
                .toUpperCase() ||
            "?"
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

        <main className="struggles-page">


            {/* =================================================
                HERO
            ================================================= */}

            <section className="struggles-hero">

                <div className="struggles-hero-inner">

                    <span className="struggles-eyebrow">
                        THE STRUGGLES
                    </span>


                    <h1>

                        So you don't
                        <br />

                        <span>
                            have to pretend.
                        </span>

                    </h1>


                    <p>

                        Snapchat has a lot of buttons,
                        disappearing messages and mysterious
                        emojis. Let's make sense of it.

                    </p>


                    <div className="struggles-scroll-hint">

                        <span>
                            Scroll to understand
                        </span>

                        <HiArrowRight />

                    </div>

                </div>


                <div
                    className="struggles-hero-circle"
                    aria-hidden="true"
                />

            </section>


            {/* =================================================
                EDUCATIONAL STRUGGLES
            ================================================= */}

            <section className="struggles-list-section">

                <div className="struggles-list-inner">


                    <div className="struggles-section-heading">

                        <div>

                            <span>
                                PLEASE EXPLAIN
                            </span>

                            <h2>

                                The things
                                <br />
                                nobody explained.

                            </h2>

                        </div>


                        <p>

                            Click anything you're confused
                            about. We promise not to judge.

                        </p>

                    </div>


                    <div className="struggles-list">

                        {struggles.map(
                            (struggle) => {

                                const Icon =
                                    struggle.icon;

                                const isActive =
                                    activeId ===
                                    struggle.id;


                                return (

                                    <article
                                        key={struggle.id}
                                        className={`
                                            struggle-item
                                            ${isActive
                                                ? "struggle-item-active"
                                                : ""
                                            }
                                        `}
                                    >

                                        <button
                                            type="button"
                                            className="struggle-trigger"
                                            onClick={() =>
                                                toggleStruggle(
                                                    struggle.id
                                                )
                                            }
                                            aria-expanded={
                                                isActive
                                            }
                                        >

                                            <div className="struggle-number">
                                                {
                                                    struggle.number
                                                }
                                            </div>


                                            <div className="struggle-icon">

                                                <Icon />

                                            </div>


                                            <div className="struggle-question">

                                                <h3>
                                                    {
                                                        struggle.question
                                                    }
                                                </h3>

                                                <span>
                                                    {
                                                        struggle.short
                                                    }
                                                </span>

                                            </div>


                                            <div className="struggle-arrow">

                                                <HiChevronDown />

                                            </div>

                                        </button>


                                        <div
                                            className={`
                                                struggle-answer
                                                ${isActive
                                                    ? "struggle-answer-open"
                                                    : ""
                                                }
                                            `}
                                        >

                                            <div className="struggle-answer-inner">

                                                <p>
                                                    {
                                                        struggle.answer
                                                    }
                                                </p>

                                            </div>

                                        </div>

                                    </article>

                                );

                            }
                        )}

                    </div>

                </div>

            </section>


            {/* =================================================
                REAL COMMUNITY STRUGGLES
            ================================================= */}

            <section className="community-struggles">

                <div className="community-struggles-inner">


                    <div className="community-heading">

                        <div>

                            <span>
                                REAL PEOPLE. REAL CONFUSION.
                            </span>

                            <h2>
                                You're definitely
                                <br />
                                not the only one.
                            </h2>

                        </div>


                        <p>

                            These are real confessions
                            from people who finally
                            admitted they were confused.

                        </p>

                    </div>


                    {/* LOADING */}

                    {loadingConfessions && (

                        <div className="community-state">

                            <div className="community-loader" />

                            <p>
                                Gathering the confusion...
                            </p>

                        </div>

                    )}


                    {/* ERROR */}

                    {!loadingConfessions &&
                        confessionError && (

                            <div className="community-state">

                                <div className="community-state-icon">
                                    😵‍💫
                                </div>

                                <h3>
                                    The confusion machine
                                    is taking a break.
                                </h3>

                                <button
                                    type="button"
                                    onClick={
                                        fetchApprovedConfessions
                                    }
                                >

                                    <HiArrowPath />

                                    Try again

                                </button>

                            </div>

                        )}


                    {/* EMPTY */}

                    {!loadingConfessions &&
                        !confessionError &&
                        confessions.length === 0 && (

                            <div className="community-state">

                                <div className="community-state-icon">
                                    👻
                                </div>

                                <h3>
                                    Nobody has confessed yet.
                                </h3>

                                <p>
                                    Be the first person to
                                    admit you're confused.
                                </p>

                            </div>

                        )}


                    {/* LIVE CONFESSIONS */}

                    {!loadingConfessions &&
                        !confessionError &&
                        confessions.length > 0 && (

                            <div className="community-grid">

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
                                                community-card
                                                community-card-${(index % 3) + 1
                                                }
                                            `}
                                        >

                                            <div className="community-card-top">

                                                <span>
                                                    REAL CONFESSION
                                                </span>

                                                <span>
                                                    #
                                                    {String(
                                                        index + 1
                                                    ).padStart(
                                                        2,
                                                        "0"
                                                    )}
                                                </span>

                                            </div>


                                            <div
                                                className="community-quote-mark"
                                                aria-hidden="true"
                                            >
                                                “
                                            </div>


                                            <p className="community-quote">

                                                {
                                                    confession.content
                                                }

                                            </p>


                                            <div className="community-author">

                                                <div className="community-avatar">

                                                    {
                                                        getInitial(
                                                            confession
                                                        )
                                                    }

                                                </div>


                                                <div>

                                                    <strong>

                                                        {
                                                            getAuthor(
                                                                confession
                                                            )
                                                        }

                                                    </strong>


                                                    {getDate(
                                                        confession
                                                    ) && (

                                                            <span>

                                                                {
                                                                    getDate(
                                                                        confession
                                                                    )
                                                                }

                                                            </span>

                                                        )}

                                                </div>

                                            </div>

                                        </article>

                                    )
                                )}

                            </div>

                        )}


                    {/* COMMUNITY CTA */}

                    <div className="community-bottom">

                        <p>
                            Got your own Snapchat struggle?
                        </p>


                        <a
                            href="/confessions"
                            className="community-share-button"
                        >

                            <span>
                                Share yours
                            </span>

                            <HiArrowRight />

                        </a>

                    </div>

                </div>

            </section>


            {/* =================================================
                CONFUSED CARD
            ================================================= */}

            <section className="struggles-confused">

                <div className="struggles-confused-inner">

                    <div className="struggles-confused-copy">

                        <span>
                            STILL LOST?
                        </span>

                        <h2>

                            It's okay.
                            <br />

                            <em>
                                We are too.
                            </em>

                        </h2>

                        <p>

                            Some things are easier to learn
                            when everyone admits they don't
                            understand them.

                        </p>

                    </div>


                    <div className="struggles-confused-card">

                        <div className="struggles-card-face">
                            😵‍💫
                        </div>

                        <div>

                            <strong>
                                PLEASE EXPLAIN THIS
                            </strong>

                            <span>
                                in normal human language.
                            </span>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                BOTTOM CTA
            ================================================= */}

            <section className="struggles-bottom-cta">

                <div className="struggles-bottom-inner">

                    <div>

                        <span>
                            READY TO ADMIT IT?
                        </span>

                        <h2>
                            Share your confusion.
                        </h2>

                    </div>


                    <a
                        href="/confessions"
                        className="struggles-cta-button"
                    >

                        <span>
                            Share the pain
                        </span>

                        <HiArrowRight />

                    </a>

                </div>

            </section>

        </main>

    );

};


export default Struggles;