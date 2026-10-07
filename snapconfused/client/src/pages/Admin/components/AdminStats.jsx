import {
    HiCalendarDays,
    HiCheckCircle,
    HiClock,
    HiSparkles,
} from "react-icons/hi2";
import "./AdminStats.css";

const AdminStats = ({ totals }) => {
    const stats = [
        {
            key: "all",
            label: "All",
            value: totals.all,
            icon: null,
        },
        {
            key: "published",
            label: "Published",
            value: totals.published,
            icon: <HiCheckCircle />,
        },
        {
            key: "scheduled",
            label: "Scheduled",
            value: totals.scheduled,
            icon: <HiCalendarDays />,
        },
        {
            key: "unpublished",
            label: "Unpublished",
            value: totals.unpublished,
            icon: <HiClock />,
        },
        {
            key: "featured",
            label: "Featured",
            value: totals.featured,
            icon: <HiSparkles />,
        },
    ];

    return (
        <section className="admin-stats">
            {stats.map((stat) => (
                <div
                    className="admin-stat"
                    key={stat.key}
                >
                    <div className="admin-stat-top">
                        <span>{stat.label}</span>

                        {stat.icon && (
                            <span className="admin-stat-icon">
                                {stat.icon}
                            </span>
                        )}
                    </div>

                    <strong>{stat.value}</strong>
                </div>
            ))}
        </section>
    );
};

export default AdminStats;