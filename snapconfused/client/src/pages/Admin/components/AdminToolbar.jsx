import {
    HiMagnifyingGlass,
} from "react-icons/hi2";
import "./AdminToolbar.css";

const AdminToolbar = ({
    search,
    setSearch,
    filter,
    setFilter,
    totals,
}) => {
    const filters = [
        {
            key: "all",
            label: "All",
            count: totals.all,
        },
        {
            key: "published",
            label: "Published",
            count: totals.published,
        },
        {
            key: "scheduled",
            label: "Scheduled",
            count: totals.scheduled,
        },
        {
            key: "unpublished",
            label: "Unpublished",
            count: totals.unpublished,
        },
        {
            key: "featured",
            label: "Featured",
            count: totals.featured,
        },
        {
            key: "user",
            label: "User",
        },
        {
            key: "admin",
            label: "Admin",
        },
    ];

    return (
        <section className="admin-toolbar">
            <div className="admin-toolbar-top">
                <div className="admin-section-heading">
                    <div>
                        <span className="admin-eyebrow">
                            Content
                        </span>

                        <h1>Confessions</h1>
                    </div>
                </div>

                <label className="admin-search">
                    <HiMagnifyingGlass />

                    <input
                        type="search"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search confessions..."
                    />
                </label>
            </div>

            <div className="admin-filters">
                {filters.map((item) => (
                    <button
                        type="button"
                        key={item.key}
                        className={
                            filter === item.key
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setFilter(item.key)
                        }
                    >
                        <span>{item.label}</span>

                        {typeof item.count === "number" && (
                            <small>{item.count}</small>
                        )}
                    </button>
                ))}
            </div>
        </section>
    );
};

export default AdminToolbar;