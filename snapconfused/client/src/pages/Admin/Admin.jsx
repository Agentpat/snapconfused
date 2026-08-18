import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import {
    HiArrowRight,
    HiCheck,
    HiMagnifyingGlass,
    HiOutlineArrowRightOnRectangle,
    HiOutlineSparkles,
    HiOutlineTrash,
    HiXMark,
} from "react-icons/hi2";

import "./Admin.css";


const API_URL =
    import.meta.env.VITE_API_URL;


const TOKEN_KEY = "snapconfused_admin_token";

const Admin = () => {
    const navigate = useNavigate();

    const [confessions, setConfessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState("");
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const token = localStorage.getItem(TOKEN_KEY);


    /* =========================================================
       AUTH
    ========================================================= */

    const getAuthHeaders = () => {
        const currentToken =
            localStorage.getItem(TOKEN_KEY);

        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentToken}`,
        };
    };


    const handleUnauthorized = () => {
        localStorage.removeItem(TOKEN_KEY);

        navigate("/admin/login", {
            replace: true,
        });
    };


    const handleLogout = () => {
        localStorage.removeItem(TOKEN_KEY);

        navigate("/admin/login", {
            replace: true,
        });
    };


    /* =========================================================
       FETCH CONFESSIONS
    ========================================================= */

    const fetchConfessions = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/confessions`
            );

            const data = await response.json();

            if (response.status === 401) {
                handleUnauthorized();
                return;
            }

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to load confessions."
                );
            }

            setConfessions(
                data.confessions || []
            );
        } catch (error) {
            console.error(
                "Failed to load confessions:",
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


    useEffect(() => {
        if (token) {
            fetchConfessions();
        }
    }, [token]);


    /* =========================================================
       APPROVE
    ========================================================= */

    const approveConfession = async (id) => {
        try {
            setActionLoading(id);
            setError("");

            const response = await fetch(
                `${API_URL}/confessions/${id}/approve`,
                {
                    method: "PATCH",
                    headers: getAuthHeaders(),
                }
            );

            const data = await response.json();

            if (response.status === 401) {
                handleUnauthorized();
                return;
            }

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to approve confession."
                );
            }

            setConfessions((current) =>
                current.map((confession) =>
                    confession._id === id
                        ? {
                            ...confession,
                            status: "approved",
                        }
                        : confession
                )
            );
        } catch (error) {
            console.error(
                "Approval failed:",
                error
            );

            setError(
                error.message ||
                "Unable to approve confession."
            );
        } finally {
            setActionLoading("");
        }
    };


    /* =========================================================
       FEATURE
    ========================================================= */

    const featureConfession = async (id) => {
        try {
            setActionLoading(id);
            setError("");

            const response = await fetch(
                `${API_URL}/confessions/${id}/feature`,
                {
                    method: "PATCH",
                    headers: getAuthHeaders(),
                }
            );

            const data = await response.json();

            if (response.status === 401) {
                handleUnauthorized();
                return;
            }

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to feature confession."
                );
            }

            setConfessions((current) =>
                current.map((confession) =>
                    confession._id === id
                        ? {
                            ...confession,
                            featured: true,
                        }
                        : confession
                )
            );
        } catch (error) {
            console.error(
                "Feature failed:",
                error
            );

            setError(
                error.message ||
                "Unable to feature confession."
            );
        } finally {
            setActionLoading("");
        }
    };


    /* =========================================================
       UNFEATURE
    ========================================================= */

    const unfeatureConfession = async (id) => {
        try {
            setActionLoading(id);
            setError("");

            const response = await fetch(
                `${API_URL}/confessions/${id}/unfeature`,
                {
                    method: "PATCH",
                    headers: getAuthHeaders(),
                }
            );

            const data = await response.json();

            if (response.status === 401) {
                handleUnauthorized();
                return;
            }

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to unfeature confession."
                );
            }

            setConfessions((current) =>
                current.map((confession) =>
                    confession._id === id
                        ? {
                            ...confession,
                            featured: false,
                        }
                        : confession
                )
            );
        } catch (error) {
            console.error(
                "Unfeature failed:",
                error
            );

            setError(
                error.message ||
                "Unable to remove featured status."
            );
        } finally {
            setActionLoading("");
        }
    };


    /* =========================================================
       DELETE
    ========================================================= */

    const deleteConfession = async (id) => {
        const confirmed = window.confirm(
            "Delete this confession permanently?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setActionLoading(id);
            setError("");

            const response = await fetch(
                `${API_URL}/confessions/${id}`,
                {
                    method: "DELETE",
                    headers: getAuthHeaders(),
                }
            );

            const data = await response.json();

            if (response.status === 401) {
                handleUnauthorized();
                return;
            }

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to delete confession."
                );
            }

            setConfessions((current) =>
                current.filter(
                    (confession) =>
                        confession._id !== id
                )
            );
        } catch (error) {
            console.error(
                "Delete failed:",
                error
            );

            setError(
                error.message ||
                "Unable to delete confession."
            );
        } finally {
            setActionLoading("");
        }
    };


    /* =========================================================
       COUNTS
    ========================================================= */

    const pendingCount =
        confessions.filter(
            (item) =>
                item.status === "pending"
        ).length;

    const approvedCount =
        confessions.filter(
            (item) =>
                item.status === "approved"
        ).length;

    const featuredCount =
        confessions.filter(
            (item) =>
                item.featured === true
        ).length;


    /* =========================================================
       SEARCH + FILTER
    ========================================================= */

    const filteredConfessions = useMemo(() => {
        const normalizedSearch =
            search.trim().toLowerCase();

        return confessions.filter(
            (confession) => {

                const matchesFilter =
                    filter === "all"
                        ? true
                        : filter === "pending"
                            ? confession.status ===
                            "pending"
                            : filter === "approved"
                                ? confession.status ===
                                "approved"
                                : filter === "featured"
                                    ? confession.featured ===
                                    true
                                    : true;

                const matchesSearch =
                    !normalizedSearch ||
                    confession.content
                        ?.toLowerCase()
                        .includes(
                            normalizedSearch
                        ) ||
                    confession.author
                        ?.toLowerCase()
                        .includes(
                            normalizedSearch
                        );

                return (
                    matchesFilter &&
                    matchesSearch
                );
            }
        );
    }, [
        confessions,
        filter,
        search,
    ]);


    /* =========================================================
       PROTECT PAGE
    ========================================================= */

    if (!token) {
        return (
            <Navigate
                to="/admin/login"
                replace
            />
        );
    }


    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <main className="admin-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="admin-header">

                <div className="admin-header-inner">

                    <a
                        href="/"
                        className="admin-brand"
                    >

                        <div className="admin-brand-icon">
                            👻
                        </div>

                        <div>

                            <strong>
                                SnapConfused
                            </strong>

                            <span>
                                ADMIN
                            </span>

                        </div>

                    </a>


                    <button
                        type="button"
                        className="admin-logout"
                        onClick={handleLogout}
                    >

                        <HiOutlineArrowRightOnRectangle />

                        <span>
                            Logout
                        </span>

                    </button>

                </div>

            </header>


            {/* =================================================
                MAIN
            ================================================= */}

            <section className="admin-main">

                <div className="admin-main-inner">

                    {/* =================================================
                        INTRO
                    ================================================= */}

                    <div className="admin-intro">

                        <div>

                            <span>
                                CONFESSION CONTROL
                            </span>

                            <h1>
                                What's happening
                                <br />
                                in the confusion?
                            </h1>

                        </div>


                        <button
                            type="button"
                            className="admin-refresh"
                            onClick={fetchConfessions}
                            disabled={loading}
                        >

                            <span>
                                {loading
                                    ? "Refreshing..."
                                    : "Refresh"}
                            </span>

                            <HiArrowRight />

                        </button>

                    </div>


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <div className="admin-error">

                            <HiXMark />

                            <span>
                                {error}
                            </span>

                        </div>

                    )}


                    {/* =================================================
                        STATS
                    ================================================= */}

                    <div className="admin-stats">

                        <div className="admin-stat">

                            <span>
                                PENDING
                            </span>

                            <strong>
                                {pendingCount}
                            </strong>

                            <small>
                                Need your attention
                            </small>

                        </div>


                        <div className="admin-stat">

                            <span>
                                APPROVED
                            </span>

                            <strong>
                                {approvedCount}
                            </strong>

                            <small>
                                Live confessions
                            </small>

                        </div>


                        <div className="admin-stat">

                            <span>
                                FEATURED
                            </span>

                            <strong>
                                {featuredCount}
                            </strong>

                            <small>
                                Hall of Shame
                            </small>

                        </div>

                    </div>


                    {/* =================================================
                        TOOLBAR
                    ================================================= */}

                    <div className="admin-toolbar">

                        <div className="admin-section-heading">

                            <div>

                                <span>
                                    INBOX
                                </span>

                                <h2>
                                    Confessions
                                </h2>

                            </div>

                            <span>
                                {
                                    filteredConfessions.length
                                }{" "}
                                showing
                            </span>

                        </div>


                        <div className="admin-tools">

                            {/* SEARCH */}

                            <div className="admin-search">

                                <HiMagnifyingGlass />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search confessions..."
                                />

                                {search && (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSearch("")
                                        }
                                        aria-label="Clear search"
                                    >
                                        <HiXMark />
                                    </button>

                                )}

                            </div>


                            {/* FILTERS */}

                            <div className="admin-filters">

                                <button
                                    type="button"
                                    className={
                                        filter === "all"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        setFilter("all")
                                    }
                                >
                                    All
                                </button>


                                <button
                                    type="button"
                                    className={
                                        filter === "pending"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        setFilter("pending")
                                    }
                                >
                                    Pending

                                    <b>
                                        {pendingCount}
                                    </b>

                                </button>


                                <button
                                    type="button"
                                    className={
                                        filter === "approved"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        setFilter("approved")
                                    }
                                >
                                    Approved
                                </button>


                                <button
                                    type="button"
                                    className={
                                        filter === "featured"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        setFilter("featured")
                                    }
                                >
                                    Featured
                                </button>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        LOADING
                    ================================================= */}

                    {loading && (

                        <div className="admin-loading">

                            <div className="admin-loader" />

                            <p>
                                Gathering the evidence...
                            </p>

                        </div>

                    )}


                    {/* =================================================
                        EMPTY
                    ================================================= */}

                    {!loading &&
                        filteredConfessions.length ===
                        0 && (

                            <div className="admin-empty">

                                <div>
                                    👻
                                </div>

                                <h3>
                                    Nothing here.
                                </h3>

                                <p>
                                    Try another filter
                                    or search term.
                                </p>

                            </div>

                        )}


                    {/* =================================================
                        CONFESSION LIST
                    ================================================= */}

                    {!loading &&
                        filteredConfessions.length >
                        0 && (

                            <div className="admin-list">

                                {filteredConfessions.map(
                                    (confession) => {

                                        const isLoading =
                                            actionLoading ===
                                            confession._id;


                                        return (

                                            <article
                                                key={
                                                    confession._id
                                                }
                                                className="admin-confession"
                                            >

                                                {/* NUMBER */}

                                                <div className="admin-confession-number">

                                                    #
                                                    {confession._id.slice(
                                                        -4
                                                    )}

                                                </div>


                                                {/* BODY */}

                                                <div className="admin-confession-body">

                                                    <div className="admin-confession-meta">

                                                        <span
                                                            className={`admin-status admin-status-${confession.status}`}
                                                        >
                                                            {
                                                                confession.status
                                                            }
                                                        </span>


                                                        {confession.featured && (

                                                            <span className="admin-featured">

                                                                <HiOutlineSparkles />

                                                                Featured

                                                            </span>

                                                        )}

                                                    </div>


                                                    <p className="admin-confession-content">

                                                        “
                                                        {
                                                            confession.content
                                                        }
                                                        ”

                                                    </p>


                                                    <div className="admin-confession-author">

                                                        <div>

                                                            {confession.isAnonymous
                                                                ? "?"
                                                                : (
                                                                    confession.author
                                                                        ?.charAt(0)
                                                                        ?.toUpperCase() ||
                                                                    "?"
                                                                )}

                                                        </div>


                                                        <span>

                                                            {confession.isAnonymous
                                                                ? "Anonymous"
                                                                : confession.author}

                                                        </span>


                                                        <small>

                                                            {new Date(
                                                                confession.createdAt
                                                            ).toLocaleDateString()}

                                                        </small>

                                                    </div>

                                                </div>


                                                {/* ACTIONS */}

                                                <div className="admin-confession-actions">

                                                    {/* APPROVE */}

                                                    {confession.status ===
                                                        "pending" && (

                                                            <button
                                                                type="button"
                                                                className="admin-approve"
                                                                disabled={
                                                                    isLoading
                                                                }
                                                                onClick={() =>
                                                                    approveConfession(
                                                                        confession._id
                                                                    )
                                                                }
                                                            >

                                                                <HiCheck />

                                                                <span>
                                                                    {isLoading
                                                                        ? "Approving..."
                                                                        : "Approve"}
                                                                </span>

                                                            </button>

                                                        )}


                                                    {/* FEATURE */}

                                                    {confession.status ===
                                                        "approved" &&
                                                        !confession.featured && (

                                                            <button
                                                                type="button"
                                                                className="admin-feature"
                                                                disabled={
                                                                    isLoading
                                                                }
                                                                onClick={() =>
                                                                    featureConfession(
                                                                        confession._id
                                                                    )
                                                                }
                                                            >

                                                                <HiOutlineSparkles />

                                                                <span>
                                                                    {isLoading
                                                                        ? "Featuring..."
                                                                        : "Feature"}
                                                                </span>

                                                            </button>

                                                        )}


                                                    {/* UNFEATURE */}

                                                    {confession.featured && (

                                                        <button
                                                            type="button"
                                                            className="admin-unfeature"
                                                            disabled={
                                                                isLoading
                                                            }
                                                            onClick={() =>
                                                                unfeatureConfession(
                                                                    confession._id
                                                                )
                                                            }
                                                        >

                                                            <HiOutlineSparkles />

                                                            <span>
                                                                {isLoading
                                                                    ? "Removing..."
                                                                    : "Unfeature"}
                                                            </span>

                                                        </button>

                                                    )}


                                                    {/* DELETE */}

                                                    <button
                                                        type="button"
                                                        className="admin-delete"
                                                        disabled={
                                                            isLoading
                                                        }
                                                        onClick={() =>
                                                            deleteConfession(
                                                                confession._id
                                                            )
                                                        }
                                                        aria-label="Delete confession"
                                                    >

                                                        <HiOutlineTrash />

                                                        <span>
                                                            Delete
                                                        </span>

                                                    </button>

                                                </div>

                                            </article>

                                        );
                                    }
                                )}

                            </div>

                        )}

                </div>

            </section>

        </main>
    );
};

export default Admin;