import { useState } from "react";

import {
    HiArrowRight,
    HiChevronDown,
    HiOutlineCamera,
    HiOutlineFire,
    HiOutlineChatBubbleLeftEllipsis,
    HiOutlineEye,
} from "react-icons/hi2";

import "./Struggles.css";

import ConfessionCarousel from "../../components/ConfessionCarousel/ConfessionCarousel";


/* =========================================================
   EDUCATIONAL STRUGGLES
========================================================= */

const struggles = [
    {
        id: 1,
        number: "01",
        icon: HiOutlineChatBubbleLeftEllipsis,

        question:
            "Why did the message disappear?",

        short:
            "Because Snapchat apparently hates receipts.",

        answer:
            "Snaps and chats can disappear after they've been viewed, depending on the conversation settings. So if you were looking for that message five minutes later... you're probably not going to find it.",
    },

    {
        id: 2,
        number: "02",
        icon: HiOutlineFire,

        question:
            "What is a streak?",

        short:
            "Two people repeatedly sending each other Snaps.",

        answer:
            "A Snapstreak happens when you and another person send Snaps back and forth regularly. The 🔥 means you're officially maintaining one. The number tells you how long you've kept it going.",
    },

    {
        id: 3,
        number: "03",
        icon: HiOutlineEye,

        question:
            "What is a Story?",

        short:
            "A collection of Snaps people can watch.",

        answer:
            "A Story is where Snaps can be shared for other people to view. Unlike a private Snap sent directly to one person, a Story is designed to be watched by the people you've chosen to share it with.",
    },

    {
        id: 4,
        number: "04",
        icon: HiOutlineCamera,

        question:
            "Why did I open the camera?",

        short:
            "Because Snapchat really wants you to take a picture.",

        answer:
            "The Snapchat camera is basically the front door of the app. Open Snapchat and you're immediately looking at a camera. Yes, that means accidental selfies are practically part of the experience.",
    },
];


/* =========================================================
   COMPONENT
========================================================= */

const Struggles = () => {

    const [activeId, setActiveId] =
        useState(null);


    /* =========================================================
       ACCORDION
    ========================================================= */

    const toggleStruggle = (id) => {

        setActiveId(
            (current) =>
                current === id
                    ? null
                    : id
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

                        <HiArrowRight
                            aria-hidden="true"
                        />

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


                    {/* =================================================
                        SECTION HEADING
                    ================================================= */}

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


                    {/* =================================================
                        ACCORDION
                    ================================================= */}

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
                                        key={
                                            struggle.id
                                        }
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
                                            aria-controls={`
                                                struggle-answer-${struggle.id}
                                            `}
                                        >

                                            <div
                                                className="struggle-number"
                                                aria-hidden="true"
                                            >
                                                {
                                                    struggle.number
                                                }
                                            </div>


                                            <div
                                                className="struggle-icon"
                                                aria-hidden="true"
                                            >

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


                                            <div
                                                className="struggle-arrow"
                                                aria-hidden="true"
                                            >

                                                <HiChevronDown />

                                            </div>

                                        </button>


                                        <div
                                            id={`
                                                struggle-answer-${struggle.id}
                                            `}
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
                LIVE COMMUNITY CONFESSIONS
            ================================================= */}

            <ConfessionCarousel />


            {/* =================================================
                CONFUSED SECTION
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


                    <div
                        className="struggles-confused-card"
                        aria-label="Confused Snapchat message"
                    >

                        <div
                            className="struggles-card-face"
                            aria-hidden="true"
                        >
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

                        <HiArrowRight
                            aria-hidden="true"
                        />

                    </a>

                </div>

            </section>

        </main>

    );

};


export default Struggles;