import "./Hero.css";

import {
    HiArrowRight,
    HiOutlineChatBubbleLeftEllipsis,
} from "react-icons/hi2";

import { useNavigate } from "react-router-dom";

import ghostPhone from "../../assets/images/hero/snapconfused-ghost-phone.png";
import floatingSnap from "../../assets/images/decorative/snapconfused-floating-snap.png";


const Hero = () => {

    const navigate = useNavigate();


    const handleConfess = () => {
        navigate("/confessions");
    };


    const handleHallOfShame = () => {
        navigate("/hall-of-shame");
    };


    return (
        <section className="hero">

            {/* =====================================================
                BACKGROUND SNAPCHAT DECORATIONS
            ===================================================== */}

            <div className="hero-entrance hero-entrance-snap hero-entrance-snap-left">
                <img
                    src={floatingSnap}
                    alt=""
                    aria-hidden="true"
                    className="hero-floating-snap hero-floating-snap-left"
                />
            </div>


            <div className="hero-entrance hero-entrance-snap hero-entrance-snap-right">
                <img
                    src={floatingSnap}
                    alt=""
                    aria-hidden="true"
                    className="hero-floating-snap hero-floating-snap-right"
                />
            </div>


            <div className="hero-entrance hero-entrance-snap hero-entrance-snap-bottom">
                <img
                    src={floatingSnap}
                    alt=""
                    aria-hidden="true"
                    className="hero-floating-snap hero-floating-snap-bottom"
                />
            </div>


            <div className="hero-inner">

                {/* =================================================
                    LEFT CONTENT
                ================================================= */}

                <div className="hero-content">

                    <h1 className="hero-title">

                        <span className="hero-title-line hero-title-line-one">
                            We all pretend
                        </span>

                        <span className="hero-title-line hero-title-line-two">
                            we know how
                        </span>

                        <span className="hero-title-line hero-title-line-three">

                            <span className="hero-highlight hero-highlight-snap">
                                Snapchat
                            </span>{" "}
                            works.

                        </span>

                    </h1>


                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    <div className="hero-entrance hero-entrance-description">

                        <p className="hero-description">

                            A safe place for people who don’t really get

                            <br className="desktop-break" />

                            Snapchat... but act like they do.

                        </p>

                    </div>


                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="hero-entrance hero-entrance-actions">

                        <div className="hero-actions">

                            <button
                                type="button"
                                className="hero-primary-button"
                                onClick={handleConfess}
                            >

                                <span>
                                    I'm confused too
                                </span>

                                <HiArrowRight
                                    aria-hidden="true"
                                />

                            </button>


                            <button
                                type="button"
                                className="hero-secondary-button"
                                onClick={handleHallOfShame}
                            >

                                <span>
                                    Laugh at others
                                </span>

                                <HiOutlineChatBubbleLeftEllipsis
                                    aria-hidden="true"
                                />

                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        SOCIAL PROOF
                    ================================================= */}

                    <div className="hero-entrance hero-entrance-proof">

                        <div className="hero-proof">

                            <div
                                className="hero-avatars"
                                aria-hidden="true"
                            >

                                <div className="hero-avatar avatar-one">
                                    A
                                </div>

                                <div className="hero-avatar avatar-two">
                                    B
                                </div>

                                <div className="hero-avatar avatar-three">
                                    C
                                </div>

                                <div className="hero-avatar avatar-four">
                                    D
                                </div>

                            </div>

                            <span>
                                12,834+ people silently suffering
                            </span>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    RIGHT VISUAL
                ================================================= */}

                <div className="hero-visual">


                    {/* =================================================
                        TOP MESSAGE
                    ================================================= */}

                    <div className="hero-message-position hero-message-position-top">

                        <div className="hero-message-entrance">

                            <div className="hero-message hero-message-top">

                                <strong>
                                    Wait... the message
                                    <br />
                                    disappeared again? 😳
                                </strong>

                                <span>
                                    2h ago
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        STREAK MESSAGE
                    ================================================= */}

                    <div className="hero-message-position hero-message-position-streak">

                        <div className="hero-message-entrance">

                            <div className="hero-message hero-message-streak">

                                <strong>
                                    What is a streak?!
                                </strong>

                                <span>
                                    🔥🔥🔥
                                </span>

                                <small>
                                    1h ago
                                </small>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        MAIN GHOST
                    ================================================= */}

                    <div className="hero-ghost-entrance">

                        <img
                            src={ghostPhone}
                            alt="Confused Snapchat ghost"
                            className="hero-ghost"
                        />

                    </div>


                    {/* =================================================
                        CAMERA MESSAGE
                    ================================================= */}

                    <div className="hero-message-position hero-message-position-camera">

                        <div className="hero-message-entrance">

                            <div className="hero-message hero-message-camera">

                                <strong>
                                    I opened the camera
                                    <br />
                                    on accident again...
                                </strong>

                                <span>
                                    3h ago
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        DOG MESSAGE
                    ================================================= */}

                    <div className="hero-message-position hero-message-position-dog">

                        <div className="hero-message-entrance">

                            <div className="hero-message hero-message-dog">

                                <strong>
                                    Why do they have
                                    <br />
                                    my face as a dog? 🐶
                                </strong>

                                <span>
                                    5h ago
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
};


export default Hero;