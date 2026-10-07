import {
  useState,
} from "react";

import {
  HiCheck,
  HiXMark,
} from "react-icons/hi2";

import "./CreateConfessionModal.css";

const CreateConfessionModal = ({
  onSubmit,
  onClose,
  submitting = false,
}) => {
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return;
    }

    await onSubmit({
      content: trimmedContent,
      author: isAnonymous
        ? "Anonymous"
        : author.trim() || "Anonymous",
      isAnonymous,
    });
  };

  return (
    <div
      className="admin-modal-backdrop"
      onMouseDown={onClose}
    >
      <div
        className="admin-create-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="admin-create-header">
          <div>
            <span className="admin-create-eyebrow">
              Content
            </span>

            <h2>New confession</h2>

            <p>
              Add a confession directly to your content library.
            </p>
          </div>

          <button
            type="button"
            className="admin-create-close"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
          >
            <HiXMark />
          </button>
        </div>

        <form
          className="admin-create-form"
          onSubmit={handleSubmit}
        >
          <div className="admin-create-field">
            <label htmlFor="confession-content">
              Confession
            </label>

            <textarea
              id="confession-content"
              value={content}
              onChange={(event) =>
                setContent(event.target.value)
              }
              placeholder="Write the confession..."
              maxLength={500}
              rows={6}
              required
              autoFocus
            />

            <div className="admin-create-field-footer">
              <span>
                Keep it real. Keep it anonymous.
              </span>

              <small>
                {content.length}/500
              </small>
            </div>
          </div>

          <div className="admin-create-grid">
            <div className="admin-create-field">
              <label htmlFor="confession-author">
                Name
              </label>

              <input
                id="confession-author"
                type="text"
                value={author}
                onChange={(event) =>
                  setAuthor(event.target.value)
                }
                placeholder="Anonymous"
                maxLength={50}
                disabled={isAnonymous}
              />
            </div>

            <div className="admin-create-checkbox-field">
              <label
                htmlFor="confession-anonymous"
                className="admin-create-checkbox"
              >
                <input
                  id="confession-anonymous"
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(event) =>
                    setIsAnonymous(
                      event.target.checked,
                    )
                  }
                />

                <span className="admin-create-checkbox-box">
                  <HiCheck />
                </span>

                <span>
                  Post anonymously
                </span>
              </label>
            </div>
          </div>

          <div className="admin-create-notice">
            <strong>Ready to publish</strong>

            <span>
              This confession will be added directly to
              the content system.
            </span>
          </div>

          <div className="admin-create-actions">
            <button
              type="button"
              className="admin-create-cancel"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-create-submit"
              disabled={
                submitting ||
                !content.trim()
              }
            >
              {submitting ? (
                <>
                  <span className="admin-create-button-spinner" />
                  Creating...
                </>
              ) : (
                <>
                  <HiCheck />
                  Create confession
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateConfessionModal;