import { useState } from "react";

import { HiArrowUpRight } from "react-icons/hi2";

import "./Navbar.css";

import snapconfusedLogo from "../../assets/images/branding/snapconfused-logo.png";

import ConfessionSubmission from "../ConfessionSubmission/ConfessionSubmission";


const Navbar = () => {

    const [showConfessionForm, setShowConfessionForm] =
        useState(false);


    return (
        <>
            <header className="navbar">

                <div className="navbar-inner">

                    {/* BRAND */}

                    <a
                        href="/"
                        className="brand"
                    >
                        <img
                            src={snapconfusedLogo}
                            alt="SnapConfused"
                            className="brand-logo"
                        />

                        <span className="brand-name">
                            SnapConfused<span>.</span>
                        </span>
                    </a>


                    {/* NAVIGATION */}

                    <nav className="nav-links">

                        <a
                            href="/"
                            className="nav-link active"
                        >
                            Home
                        </a>

                        <a
                            href="/struggles"
                            className="nav-link"
                        >
                            The Struggles
                        </a>

                        <a
                            href="/hall-of-shame"
                            className="nav-link"
                        >
                            Hall of Shame
                        </a>

                        <a
                            href="/confessions"
                            className="nav-link"
                        >
                            Confessions
                        </a>

                        <a
                            href="/about"
                            className="nav-link"
                        >
                            About
                        </a>

                    </nav>


                    {/* SHARE THE PAIN */}

                    <button
                        type="button"
                        className="share-button"
                        onClick={() =>
                            setShowConfessionForm(true)
                        }
                    >
                        <span>
                            Share the pain
                        </span>

                        <HiArrowUpRight />
                    </button>

                </div>

            </header>


            {/* CONFESSION MODAL */}

            {showConfessionForm && (
                <ConfessionSubmission
                    onClose={() =>
                        setShowConfessionForm(false)
                    }
                />
            )}

        </>
    );
};


export default Navbar;