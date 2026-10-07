import {
  useEffect,
  useState,
} from "react";

import {
  HiCalendarDays,
  HiCheck,
  HiXMark,
} from "react-icons/hi2";

import "./ScheduleConfessionModal.css";

const ScheduleConfessionModal = ({
  confession,
  onSubmit,
  onClose,
  submitting = false,
}) => {
  const [scheduledFor, setScheduledFor] = useState("");

  useEffect(() => {
    if (confession?.scheduledFor) {
      const date = new Date(confession.scheduledFor);

      if (!Number.isNaN(date.getTime())) {
        const offset =
          date.getTimezoneOffset() * 60000;

        const localDate = new Date(
          date.getTime() - offset,
        );

        setScheduledFor(
          localDate
            .toISOString()
            .slice(0, 16),
        );

        return;
      }
    }

    setScheduledFor("");
  }, [confession]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!scheduledFor) {
      return;
    }

    const selectedDate = new Date(scheduledFor);

    if (
      Number.isNaN(selectedDate.getTime()) ||
      selectedDate.getTime() <= Date.now()
    ) {
      return;
    }

    await onSubmit(selectedDate.toISOString());
  };

  const minimumDate = (() => {
    const date = new Date(
      Date.now() + 5 * 60 * 1000,
    );

    const offset =
      date.getTimezoneOffset() * 60000;

    return new Date(
      date.getTime() - offset,
    )
      .toISOString()
      .slice(0, 16);
  })();

  return (
    <div
      className="admin-modal-backdrop"
      onMouseDown={onClose}
    >
      <div
        className="admin-schedule-modal"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="admin-schedule-header">
          <div className="admin-schedule-heading">
            <div className="admin-schedule-icon">
              <HiCalendarDays />
            </div>

            <div>
              <span className="admin-schedule-eyebrow">
                Publication
              </span>

              <h2>
                {confession?.publicationStatus ===
                  "scheduled"
                  ? "Reschedule confession"
                  : "Schedule confession"}
              </h2>
            </div>
          </div>

          <button
            type="button"
            className="admin-schedule-close"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
          >
            <HiXMark />
          </button>
        </div>

        <div className="admin-schedule-content">
          <div className="admin-schedule-preview">
            <span>Confession</span>

            <p>
              {confession?.content ||
                "No confession selected."}
            </p>
          </div>

          <form
            className="admin-schedule-form"
            onSubmit={handleSubmit}
          >
            <div className="admin-schedule-field">
              <label htmlFor="scheduled-for">
                Publish date & time
              </label>

              <div className="admin-schedule-input-wrap">
                <HiCalendarDays />

                <input
                  id="scheduled-for"
                  type="datetime-local"
                  value={scheduledFor}
                  min={minimumDate}
                  onChange={(event) =>
                    setScheduledFor(
                      event.target.value,
                    )
                  }
                  required
                />
              </div>

              <small>
                Choose a future date and time for this
                confession to be published.
              </small>
            </div>

            <div className="admin-schedule-notice">
              <div className="admin-schedule-notice-dot" />

              <div>
                <strong>
                  Scheduled publication
                </strong>

                <span>
                  The confession will remain hidden until
                  its scheduled publication time.
                </span>
              </div>
            </div>

            <div className="admin-schedule-actions">
              <button
                type="button"
                className="admin-schedule-cancel"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="admin-schedule-submit"
                disabled={
                  submitting ||
                  !scheduledFor
                }
              >
                {submitting ? (
                  <>
                    <span className="admin-schedule-spinner" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <HiCheck />
                    Schedule
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleConfessionModal;