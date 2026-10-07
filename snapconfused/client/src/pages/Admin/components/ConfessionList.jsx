import ConfessionCard from "./ConfessionCard";
import EmptyState from "./EmptyState";
import "./ConfessionList.css";

const ConfessionList = ({
    confessions,
    loading,
    onPublish,
    onSchedule,
    onFeature,
    onUnfeature,
    onDelete,
}) => {
    if (loading) {
        return (
            <div className="admin-loading">
                <div className="admin-loader" />

                <span>Loading confessions...</span>
            </div>
        );
    }

    if (!confessions.length) {
        return <EmptyState />;
    }

    return (
        <section className="admin-list">
            {confessions.map((confession, index) => (
                <ConfessionCard
                    key={confession._id}
                    confession={confession}
                    index={index}
                    onPublish={onPublish}
                    onSchedule={onSchedule}
                    onFeature={onFeature}
                    onUnfeature={onUnfeature}
                    onDelete={onDelete}
                />
            ))}
        </section>
    );
};

export default ConfessionList;