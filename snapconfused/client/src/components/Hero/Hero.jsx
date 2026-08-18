import "./Hero.css";

import {
    HiArrowRight,
    HiOutlineChatBubbleLeftEllipsis,
} from "react-icons/hi2";

import ghostPhone from "../../assets/images/hero/snapconfused-ghost-phone.png";
import floatingSnap from "../../assets/images/decorative/snapconfused-floating-snap.png";

const Hero = () => {
    return (
        <section className="hero">

            {/* =====================================================
                BACKGROUND SNAPCHAT DECORATIONS
            ===================================================== */}

            <img
                src={floatingSnap}
                alt=""
                aria-hidden="true"
                className="hero-floating-snap hero-floating-snap-left"
            />

            <img
                src={floatingSnap}
                alt=""
                aria-hidden="true"
                className="hero-floating-snap hero-floating-snap-right"
            />

            <img
                src={floatingSnap}
                alt=""
                aria-hidden="true"
                className="hero-floating-snap hero-floating-snap-bottom"
            />


            <div className="hero-inner">

                {/* =================================================
                    LEFT CONTENT
                ================================================= */}

                <div className="hero-content">

                    <h1 className="hero-title">
                        We all pretend
                        <br />

                        we know how
                        <br />

                        <span className="hero-highlight hero-highlight-snap">
                            Snapchat
                        </span>{" "}
                        works.
                    </h1>


                    <p className="hero-description">
                        A safe place for people who don’t really get
                        <br className="desktop-break" />
                        Snapchat... but act like they do.
                    </p>


                    <div className="hero-actions">

                        <button
                            type="button"
                            className="hero-primary-button"
                        >
                            <span>
                                I'm confused too
                            </span>

                            <HiArrowRight aria-hidden="true" />
                        </button>


                        <button
                            type="button"
                            className="hero-secondary-button"
                        >
                            <span>
                                Laugh at others
                            </span>

                            <HiOutlineChatBubbleLeftEllipsis
                                aria-hidden="true"
                            />
                        </button>

                    </div>


                    {/* SOCIAL PROOF */}

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


                {/* =================================================
                    RIGHT VISUAL
                ================================================= */}

                <div className="hero-visual">

                    {/* TOP MESSAGE */}

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


                    {/* STREAK MESSAGE */}

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


                    {/* MAIN GHOST */}

                    <img
                        src={ghostPhone}
                        alt="Confused Snapchat ghost"
                        className="hero-ghost"
                    />


                    {/* CAMERA MESSAGE */}

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


                    {/* DOG MESSAGE */}

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

        </section>
    );
};

export default Hero;