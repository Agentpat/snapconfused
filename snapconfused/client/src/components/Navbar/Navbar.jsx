import { useEffect, useState } from "react";

import {
    HiArrowUpRight,
    HiBars3,
    HiXMark,
} from "react-icons/hi2";

import {
    NavLink,
} from "react-router-dom";

import "./Navbar.css";

import snapconfusedLogo from "../../assets/images/branding/snapconfused-logo.png";

import ConfessionSubmission from "../ConfessionSubmission/ConfessionSubmission";


const Navbar = () => {

    const [showConfessionForm, setShowConfessionForm] =
        useState(false);

    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);


    /* =========================================================
       CLOSE MOBILE MENU
    ========================================================= */

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };


    /* =========================================================
       OPEN CONFESSION FORM
    ========================================================= */

    const handleSharePain = () => {
        closeMobileMenu();

        setShowConfessionForm(true);
    };


    /* =========================================================
       ESCAPE KEY
    ========================================================= */

    useEffect(() => {

        const handleKeyDown = (event) => {

            if (
                event.key === "Escape" &&
                mobileMenuOpen
            ) {
                closeMobileMenu();
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

    }, [mobileMenuOpen]);


    /* =========================================================
       PREVENT PAGE SCROLL WHEN MENU IS OPEN
    ========================================================= */

    useEffect(() => {

        if (mobileMenuOpen) {

            document.body.classList.add(
                "mobile-menu-open"
            );

        } else {

            document.body.classList.remove(
                "mobile-menu-open"
            );

        }


        return () => {

            document.body.classList.remove(
                "mobile-menu-open"
            );

        };

    }, [mobileMenuOpen]);


    /* =========================================================
       NAV LINK CLASS
    ========================================================= */

    const navLinkClass = ({ isActive }) =>
        `nav-link ${isActive ? "active" : ""}`;


    const mobileNavLinkClass = ({ isActive }) =>
        `mobile-nav-link ${isActive ? "active" : ""
        }`;


    return (
        <>

            {/* =====================================================
                DESKTOP / MAIN NAVBAR
            ===================================================== */}

            <header className="navbar">

                <div className="navbar-inner">


                    {/* =================================================
                        BRAND
                    ================================================= */}

                    <NavLink
                        to="/"
                        className="brand"
                        aria-label="SnapConfused home"
                        onClick={closeMobileMenu}
                    >

                        <img
                            src={snapconfusedLogo}
                            alt="SnapConfused"
                            className="brand-logo"
                        />

                        <span className="brand-name">
                            SnapConfused<span>.</span>
                        </span>

                    </NavLink>


                    {/* =================================================
                        DESKTOP NAVIGATION
                    ================================================= */}

                    <nav
                        className="nav-links"
                        aria-label="Main navigation"
                    >

                        <NavLink
                            to="/"
                            end
                            className={navLinkClass}
                        >
                            Home
                        </NavLink>


                        <NavLink
                            to="/struggles"
                            className={navLinkClass}
                        >
                            The Struggles
                        </NavLink>


                        <NavLink
                            to="/hall-of-shame"
                            className={navLinkClass}
                        >
                            Hall of Shame
                        </NavLink>


                        <NavLink
                            to="/confessions"
                            className={navLinkClass}
                        >
                            Confessions
                        </NavLink>

                    </nav>


                    {/* =================================================
                        DESKTOP SHARE BUTTON
                    ================================================= */}

                    <button
                        type="button"
                        className="share-button"
                        onClick={handleSharePain}
                    >

                        <span>
                            Share the pain
                        </span>

                        <HiArrowUpRight
                            aria-hidden="true"
                        />

                    </button>


                    {/* =================================================
                        MOBILE MENU BUTTON
                    ================================================= */}

                    <button
                        type="button"
                        className={`
                            mobile-menu-toggle
                            ${mobileMenuOpen
                                ? "is-open"
                                : ""
                            }
                        `}
                        onClick={() =>
                            setMobileMenuOpen(
                                (current) => !current
                            )
                        }
                        aria-label={
                            mobileMenuOpen
                                ? "Close navigation menu"
                                : "Open navigation menu"
                        }
                        aria-expanded={
                            mobileMenuOpen
                        }
                        aria-controls="mobile-navigation"
                    >

                        {mobileMenuOpen ? (
                            <HiXMark
                                aria-hidden="true"
                            />
                        ) : (
                            <HiBars3
                                aria-hidden="true"
                            />
                        )}

                    </button>

                </div>

            </header>


            {/* =====================================================
                MOBILE NAVIGATION
            ===================================================== */}

            <div
                className={`
                    mobile-navigation-overlay
                    ${mobileMenuOpen
                        ? "is-open"
                        : ""
                    }
                `}
                onMouseDown={closeMobileMenu}
                aria-hidden={!mobileMenuOpen}
            >

                <aside
                    id="mobile-navigation"
                    className={`
                        mobile-navigation
                        ${mobileMenuOpen
                            ? "is-open"
                            : ""
                        }
                    `}
                    onMouseDown={(event) =>
                        event.stopPropagation()
                    }
                >

                    {/* =================================================
                        MOBILE MENU HEADER
                    ================================================= */}

                    <div className="mobile-navigation-header">

                        <span>
                            Navigate
                        </span>

                        <button
                            type="button"
                            onClick={closeMobileMenu}
                            aria-label="Close navigation"
                        >
                            <HiXMark
                                aria-hidden="true"
                            />
                        </button>

                    </div>


                    {/* =================================================
                        MOBILE LINKS
                    ================================================= */}

                    <nav
                        className="mobile-nav-links"
                        aria-label="Mobile navigation"
                    >

                        <NavLink
                            to="/"
                            end
                            className={mobileNavLinkClass}
                            onClick={closeMobileMenu}
                        >
                            <span className="mobile-nav-number">
                                01
                            </span>

                            <span>
                                Home
                            </span>
                        </NavLink>


                        <NavLink
                            to="/struggles"
                            className={mobileNavLinkClass}
                            onClick={closeMobileMenu}
                        >
                            <span className="mobile-nav-number">
                                02
                            </span>

                            <span>
                                The Struggles
                            </span>
                        </NavLink>


                        <NavLink
                            to="/hall-of-shame"
                            className={mobileNavLinkClass}
                            onClick={closeMobileMenu}
                        >
                            <span className="mobile-nav-number">
                                03
                            </span>

                            <span>
                                Hall of Shame
                            </span>
                        </NavLink>


                        <NavLink
                            to="/confessions"
                            className={mobileNavLinkClass}
                            onClick={closeMobileMenu}
                        >
                            <span className="mobile-nav-number">
                                04
                            </span>

                            <span>
                                Confessions
                            </span>
                        </NavLink>

                    </nav>


                    {/* =================================================
                        MOBILE SHARE CTA
                    ================================================= */}

                    <div className="mobile-navigation-footer">

                        <span>
                            Got a Snapchat struggle?
                        </span>

                        <button
                            type="button"
                            onClick={handleSharePain}
                        >

                            <span>
                                Share the pain
                            </span>

                            <HiArrowUpRight
                                aria-hidden="true"
                            />

                        </button>

                    </div>

                </aside>

            </div>


            {/* =====================================================
                CONFESSION MODAL
            ===================================================== */}

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