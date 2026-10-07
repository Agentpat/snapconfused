import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Navigate,
    useNavigate,
} from "react-router-dom";

import AdminHeader from "./components/AdminHeader";
import AdminStats from "./components/AdminStats";
import AdminToolbar from "./components/AdminToolbar";
import ConfessionList from "./components/ConfessionList";
import CreateConfessionModal from "./components/CreateConfessionModal";
import ScheduleConfessionModal from "./components/ScheduleConfessionModal";
import ImportJsonModal from "./components/ImportJsonModal";

import "./admin.css";

const API_URL = import.meta.env.VITE_API_URL;
const TOKEN_KEY = "snapconfused_admin_token";

const Admin = () => {
    const navigate = useNavigate();

    const token = localStorage.getItem(TOKEN_KEY);

    const [confessions, setConfessions] = useState([]);

    const [totals, setTotals] = useState({
        all: 0,
        published: 0,
        scheduled: 0,
        unpublished: 0,
        featured: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const [showCreateModal, setShowCreateModal] =
        useState(false);

    const [showScheduleModal, setShowScheduleModal] =
        useState(false);

    const [showImportModal, setShowImportModal] =
        useState(false);

    const [selectedConfession, setSelectedConfession] =
        useState(null);

    const authHeaders = useMemo(
        () => ({
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        }),
        [token],
    );

    const fetchConfessions = useCallback(async () => {
        if (!token) return;

        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `${API_URL}/admin/confessions`,
                {
                    headers: authHeaders,
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    "Failed to load confessions.",
                );
            }

            const confessionList =
                data?.confessions || [];

            setConfessions(confessionList);

            setTotals({
                all:
                    data?.totals?.all ??
                    data?.total ??
                    confessionList.length,

                published:
                    data?.totals?.published ??
                    confessionList.filter(
                        (item) =>
                            item.publicationStatus ===
                            "published",
                    ).length,

                scheduled:
                    data?.totals?.scheduled ??
                    confessionList.filter(
                        (item) =>
                            item.publicationStatus ===
                            "scheduled",
                    ).length,

                unpublished:
                    data?.totals?.unpublished ??
                    confessionList.filter(
                        (item) =>
                            item.publicationStatus ===
                            "unpublished",
                    ).length,

                featured:
                    data?.totals?.featured ??
                    confessionList.filter(
                        (item) => item.featured,
                    ).length,
            });
        } catch (err) {
            setError(
                err?.message ||
                "Something went wrong while loading confessions.",
            );
        } finally {
            setLoading(false);
        }
    }, [authHeaders, token]);

    useEffect(() => {
        fetchConfessions();
    }, [fetchConfessions]);

    const handleLogout = () => {
        localStorage.removeItem(TOKEN_KEY);

        navigate("/admin/login", {
            replace: true,
        });
    };

    const handleCreate = async (form) => {
        const response = await fetch(
            `${API_URL}/admin/confessions`,
            {
                method: "POST",
                headers: authHeaders,
                body: JSON.stringify({
                    content: form.content,
                    author: form.isAnonymous
                        ? "Anonymous"
                        : form.author,
                    isAnonymous: form.isAnonymous,
                    publicationStatus:
                        form.publicationMode,
                    scheduledFor:
                        form.publicationMode ===
                            "scheduled"
                            ? form.scheduledFor
                            : null,
                }),
            },
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data?.message ||
                "Failed to create confession.",
            );
        }

        setShowCreateModal(false);

        await fetchConfessions();
    };

    const handlePublish = async (confession) => {
        setError("");

        try {
            const response = await fetch(
                `${API_URL}/admin/confessions/${confession._id}/publish`,
                {
                    method: "PATCH",
                    headers: authHeaders,
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    "Failed to publish confession.",
                );
            }

            await fetchConfessions();
        } catch (err) {
            setError(
                err?.message ||
                "Failed to publish confession.",
            );
        }
    };

    const openScheduleModal = (confession) => {
        setSelectedConfession(confession);
        setShowScheduleModal(true);
    };

    const closeScheduleModal = () => {
        setSelectedConfession(null);
        setShowScheduleModal(false);
    };

    const handleSchedule = async (scheduledFor) => {
        if (!selectedConfession) return;

        const response = await fetch(
            `${API_URL}/admin/confessions/${selectedConfession._id}/schedule`,
            {
                method: "PATCH",
                headers: authHeaders,
                body: JSON.stringify({
                    scheduledFor,
                }),
            },
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data?.message ||
                "Failed to schedule confession.",
            );
        }

        closeScheduleModal();

        await fetchConfessions();
    };

    const handleFeature = async (confession) => {
        setError("");

        try {
            const response = await fetch(
                `${API_URL}/admin/confessions/${confession._id}/feature`,
                {
                    method: "PATCH",
                    headers: authHeaders,
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    "Failed to feature confession.",
                );
            }

            await fetchConfessions();
        } catch (err) {
            setError(
                err?.message ||
                "Failed to feature confession.",
            );
        }
    };

    const handleUnfeature = async (confession) => {
        setError("");

        try {
            const response = await fetch(
                `${API_URL}/admin/confessions/${confession._id}/unfeature`,
                {
                    method: "PATCH",
                    headers: authHeaders,
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    "Failed to remove featured status.",
                );
            }

            await fetchConfessions();
        } catch (err) {
            setError(
                err?.message ||
                "Failed to remove featured status.",
            );
        }
    };

    const handleDelete = async (confession) => {
        const confirmed = window.confirm(
            "Delete this confession permanently?",
        );

        if (!confirmed) return;

        setError("");

        try {
            const response = await fetch(
                `${API_URL}/admin/confessions/${confession._id}`,
                {
                    method: "DELETE",
                    headers: authHeaders,
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    "Failed to delete confession.",
                );
            }

            await fetchConfessions();
        } catch (err) {
            setError(
                err?.message ||
                "Failed to delete confession.",
            );
        }
    };

    const handleImport = async ({
        confessions: importedConfessions,
        publicationStatus,
        scheduledFor,
    }) => {
        const response = await fetch(
            `${API_URL}/admin/confessions/bulk`,
            {
                method: "POST",
                headers: authHeaders,
                body: JSON.stringify({
                    confessions: importedConfessions,
                    publicationStatus,
                    scheduledFor:
                        publicationStatus ===
                            "scheduled"
                            ? scheduledFor
                            : null,
                }),
            },
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data?.message ||
                "Failed to import confessions.",
            );
        }

        setShowImportModal(false);

        await fetchConfessions();
    };

    const filteredConfessions = useMemo(() => {
        const normalizedSearch = search
            .trim()
            .toLowerCase();

        return confessions.filter((confession) => {
            const content =
                confession.content?.toLowerCase() ||
                "";

            const author =
                confession.author?.toLowerCase() ||
                "";

            const matchesSearch =
                !normalizedSearch ||
                content.includes(normalizedSearch) ||
                author.includes(normalizedSearch);

            if (!matchesSearch) {
                return false;
            }

            if (filter === "published") {
                return (
                    confession.publicationStatus ===
                    "published"
                );
            }

            if (filter === "scheduled") {
                return (
                    confession.publicationStatus ===
                    "scheduled"
                );
            }

            if (filter === "unpublished") {
                return (
                    confession.publicationStatus ===
                    "unpublished"
                );
            }

            if (filter === "featured") {
                return confession.featured === true;
            }

            if (filter === "user") {
                return confession.source === "user";
            }

            if (filter === "admin") {
                return confession.source === "admin";
            }

            return true;
        });
    }, [confessions, filter, search]);

    if (!token) {
        return (
            <Navigate
                to="/admin/login"
                replace
            />
        );
    }

    return (
        <div className="admin-page">
            <AdminHeader
                onRefresh={fetchConfessions}
                onCreate={() =>
                    setShowCreateModal(true)
                }
                onImport={() =>
                    setShowImportModal(true)
                }
                onLogout={handleLogout}
                loading={loading}
            />

            <main className="admin-main">
                <div className="admin-main-inner">
                    <AdminStats totals={totals} />

                    <AdminToolbar
                        search={search}
                        setSearch={setSearch}
                        filter={filter}
                        setFilter={setFilter}
                        totals={totals}
                    />

                    {error && (
                        <div className="admin-error">
                            <span>{error}</span>

                            <button
                                type="button"
                                onClick={() =>
                                    setError("")
                                }
                                aria-label="Dismiss error"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    <ConfessionList
                        confessions={
                            filteredConfessions
                        }
                        loading={loading}
                        onPublish={handlePublish}
                        onSchedule={
                            openScheduleModal
                        }
                        onFeature={handleFeature}
                        onUnfeature={
                            handleUnfeature
                        }
                        onDelete={handleDelete}
                    />
                </div>
            </main>

            {showCreateModal && (
                <CreateConfessionModal
                    onClose={() =>
                        setShowCreateModal(false)
                    }
                    onSubmit={handleCreate}
                />
            )}

            {showScheduleModal &&
                selectedConfession && (
                    <ScheduleConfessionModal
                        confession={
                            selectedConfession
                        }
                        onClose={
                            closeScheduleModal
                        }
                        onSubmit={handleSchedule}
                    />
                )}

            {showImportModal && (
                <ImportJsonModal
                    onClose={() =>
                        setShowImportModal(false)
                    }
                    onImport={handleImport}
                />
            )}
        </div>
    );
};

export default Admin;