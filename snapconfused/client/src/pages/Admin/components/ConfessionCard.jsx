import {
  HiCalendarDays,
  HiCheck,
  HiClock,
  HiSparkles,
  HiTrash,
} from "react-icons/hi2";
import "./ConfessionCard.css";


const formatDate = (value) => {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const getPublicationLabel = (status) => {
  if (status === "published") return "Published";
  if (status === "scheduled") return "Scheduled";
  return "Unpublished";
};

const ConfessionCard = ({
  confession,
  index,
  onPublish,
  onSchedule,
  onFeature,
  onUnfeature,
  onDelete,
}) => {
  const isPublished =
    confession.publicationStatus === "published";

  const isScheduled =
    confession.publicationStatus === "scheduled";

  const publicationDate = isPublished
    ? confession.publishedAt
    : confession.scheduledFor;

  return (
    <article className="admin-confession">
      <div className="admin-confession-number">
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="admin-confession-body">
        <div className="admin-confession-top">
          <div className="admin-confession-badges">
            <span
              className={`admin-status admin-status-${confession.publicationStatus}`}
            >
              {isPublished && <HiCheck />}
              {isScheduled && <HiCalendarDays />}
              {!isPublished &&
                !isScheduled && <HiClock />}

              {getPublicationLabel(
                confession.publicationStatus,
              )}
            </span>

            {confession.featured && (
              <span className="admin-featured">
                <HiSparkles />
                Featured
              </span>
            )}

            <span
              className={`admin-source admin-source-${confession.source}`}
            >
              {confession.source === "admin"
                ? "Admin"
                : "User"}
            </span>
          </div>

          <span className="admin-confession-date">
            {formatDate(
              confession.createdAt,
            )}
          </span>
        </div>

        <p className="admin-confession-content">
          {confession.content}
        </p>

        <div className="admin-confession-meta">
          <span>
            <strong>By</strong>{" "}
            {confession.isAnonymous
              ? "Anonymous"
              : confession.author ||
              "Anonymous"}
          </span>

          {publicationDate && (
            <span>
              <strong>
                {isScheduled
                  ? "Scheduled"
                  : "Published"}
              </strong>{" "}
              {formatDate(publicationDate)}
            </span>
          )}
        </div>

        <div className="admin-confession-actions">
          {!isPublished && (
            <button
              type="button"
              className="admin-action admin-action-publish"
              onClick={() =>
                onPublish(confession)
              }
            >
              <HiCheck />
              Publish
            </button>
          )}

          {!isPublished && (
            <button
              type="button"
              className="admin-action admin-action-schedule"
              onClick={() =>
                onSchedule(confession)
              }
            >
              <HiCalendarDays />
              {isScheduled
                ? "Reschedule"
                : "Schedule"}
            </button>
          )}

          <button
            type="button"
            className={`admin-action ${confession.featured
                ? "admin-action-unfeature"
                : "admin-action-feature"
              }`}
            onClick={() =>
              confession.featured
                ? onUnfeature(confession)
                : onFeature(confession)
            }
          >
            <HiSparkles />

            {confession.featured
              ? "Unfeature"
              : "Feature"}
          </button>

          <button
            type="button"
            className="admin-action admin-action-delete"
            onClick={() =>
              onDelete(confession)
            }
          >
            <HiTrash />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
};

export default ConfessionCard;