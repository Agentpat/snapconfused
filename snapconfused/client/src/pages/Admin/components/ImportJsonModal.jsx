import {
  useMemo,
  useRef,
  useState,
} from "react";

import {
  HiArrowUpTray,
  HiCheck,
  HiDocumentText,
  HiXMark,
} from "react-icons/hi2";
import "./ImportJsonModal.css";
import ImportPreview from "./ImportPreview";

const MAX_IMPORTS = 500;

const cleanString = (value) => {
  if (
    typeof value !== "string" &&
    typeof value !== "number"
  ) {
    return "";
  }

  return String(value).trim();
};

const normalizeItem = (item) => {
  if (typeof item === "string") {
    const content = item.trim();

    if (!content) return null;

    return {
      content,
      author: "Anonymous",
      isAnonymous: true,
    };
  }

  if (!item || typeof item !== "object") {
    return null;
  }

  const content =
    cleanString(item.content) ||
    cleanString(item.confession) ||
    cleanString(item.text) ||
    cleanString(item.message);

  if (!content) return null;

  const suppliedAnonymous =
    typeof item.isAnonymous === "boolean"
      ? item.isAnonymous
      : null;

  const suppliedAuthor =
    cleanString(item.author) ||
    cleanString(item.name);

  const isAnonymous =
    suppliedAnonymous !== null
      ? suppliedAnonymous
      : !suppliedAuthor ||
      suppliedAuthor.toLowerCase() ===
      "anonymous";

  return {
    content,
    author: isAnonymous
      ? "Anonymous"
      : suppliedAuthor,
    isAnonymous,
  };
};

const parseJson = (value) => {
  let parsed;

  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error(
      "The selected file is not valid JSON.",
    );
  }

  let items = parsed;

  if (
    parsed &&
    typeof parsed === "object" &&
    !Array.isArray(parsed)
  ) {
    if (Array.isArray(parsed.confessions)) {
      items = parsed.confessions;
    } else if (Array.isArray(parsed.data)) {
      items = parsed.data;
    } else if (Array.isArray(parsed.items)) {
      items = parsed.items;
    } else {
      items = [parsed];
    }
  }

  if (!Array.isArray(items)) {
    throw new Error(
      "The JSON must contain a confession list or a confession object.",
    );
  }

  const normalized = items
    .map(normalizeItem)
    .filter(Boolean)
    .slice(0, MAX_IMPORTS);

  if (!normalized.length) {
    throw new Error(
      "No valid confessions were found in the JSON file.",
    );
  }

  return normalized;
};

const ImportJsonModal = ({
  onClose,
  onImport,
}) => {
  const inputRef = useRef(null);

  const [items, setItems] = useState([]);
  const [selected, setSelected] =
    useState(new Set());

  const [publicationStatus, setPublicationStatus] =
    useState("unpublished");

  const [scheduledFor, setScheduledFor] =
    useState("");

  const [fileName, setFileName] =
    useState("");

  const [error, setError] = useState("");
  const [importing, setImporting] =
    useState(false);

  const selectedItems = useMemo(
    () =>
      items.filter((_, index) =>
        selected.has(index),
      ),
    [items, selected],
  );

  const handleFile = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setFileName(file.name);

    try {
      const text = await file.text();
      const parsed = parseJson(text);

      setItems(parsed);

      setSelected(
        new Set(
          parsed.map(
            (_, index) => index,
          ),
        ),
      );
    } catch (err) {
      setItems([]);
      setSelected(new Set());

      setError(
        err?.message ||
        "Unable to read this JSON file.",
      );
    }

    event.target.value = "";
  };

  const toggleItem = (index) => {
    setSelected((current) => {
      const next = new Set(current);

      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }

      return next;
    });
  };

  const selectAll = () => {
    setSelected(
      new Set(
        items.map(
          (_, index) => index,
        ),
      ),
    );
  };

  const clearSelection = () => {
    setSelected(new Set());
  };

  const handleImport = async () => {
    if (!selectedItems.length) {
      setError(
        "Select at least one confession.",
      );
      return;
    }

    if (
      publicationStatus === "scheduled" &&
      !scheduledFor
    ) {
      setError(
        "Choose a schedule date and time.",
      );
      return;
    }

    if (publicationStatus === "scheduled") {
      const date = new Date(
        scheduledFor,
      );

      if (
        Number.isNaN(date.getTime()) ||
        date <= new Date()
      ) {
        setError(
          "Schedule time must be in the future.",
        );
        return;
      }
    }

    setError("");
    setImporting(true);

    try {
      await onImport({
        confessions: selectedItems,
        publicationStatus,
        scheduledFor:
          publicationStatus === "scheduled"
            ? new Date(
              scheduledFor,
            ).toISOString()
            : null,
      });
    } catch (err) {
      setError(
        err?.message ||
        "Failed to import confessions.",
      );
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="admin-modal-backdrop">
      <div className="admin-modal admin-import-modal">
        <div className="admin-modal-header">
          <div>
            <span className="admin-eyebrow">
              Content Studio
            </span>

            <h2>Import confessions</h2>
          </div>

          <button
            type="button"
            className="admin-modal-close"
            onClick={onClose}
          >
            <HiXMark />
          </button>
        </div>

        <div className="admin-import-dropzone">
          <HiDocumentText />

          <div>
            <strong>
              {fileName ||
                "Choose a JSON file"}
            </strong>

            <span>
              JSON arrays, confession
              objects, or a
              <code>confessions</code>{" "}
              wrapper are supported.
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              inputRef.current?.click()
            }
          >
            <HiArrowUpTray />
            Choose file
          </button>

          <input
            ref={inputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFile}
            hidden
          />
        </div>

        {error && (
          <div className="admin-form-error">
            {error}
          </div>
        )}

        {items.length > 0 && (
          <>
            <div className="admin-import-summary">
              <div>
                <strong>
                  {selected.size}
                </strong>

                <span>
                  {" "}
                  of {items.length}{" "}
                  selected
                </span>
              </div>

              <div>
                <button
                  type="button"
                  onClick={selectAll}
                >
                  Select all
                </button>

                <button
                  type="button"
                  onClick={
                    clearSelection
                  }
                >
                  Clear
                </button>
              </div>
            </div>

            <ImportPreview
              items={items}
              selected={selected}
              onToggle={toggleItem}
            />

            <fieldset className="admin-fieldset">
              <legend>
                Publication
              </legend>

              <div className="admin-publication-options">
                {[
                  {
                    value: "unpublished",
                    label: "Unpublished",
                    description:
                      "Import without publishing.",
                  },
                  {
                    value: "published",
                    label: "Publish now",
                    description:
                      "Make all selected confessions live immediately.",
                  },
                  {
                    value: "scheduled",
                    label: "Schedule",
                    description:
                      "Publish all selected confessions at one time.",
                  },
                ].map((option) => (
                  <button
                    type="button"
                    key={
                      option.value
                    }
                    className={
                      publicationStatus ===
                        option.value
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      setPublicationStatus(
                        option.value,
                      )
                    }
                  >
                    <strong>
                      {
                        option.label
                      }
                    </strong>

                    <span>
                      {
                        option.description
                      }
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            {publicationStatus ===
              "scheduled" && (
                <label className="admin-field">
                  <span>
                    Schedule date & time
                  </span>

                  <input
                    type="datetime-local"
                    value={
                      scheduledFor
                    }
                    onChange={(event) =>
                      setScheduledFor(
                        event.target
                          .value,
                      )
                    }
                  />
                </label>
              )}
          </>
        )}

        <div className="admin-modal-footer">
          <button
            type="button"
            className="admin-button-secondary"
            onClick={onClose}
            disabled={importing}
          >
            Cancel
          </button>

          <button
            type="button"
            className="admin-button-primary"
            onClick={handleImport}
            disabled={
              importing ||
              !selectedItems.length
            }
          >
            {importing ? (
              "Importing..."
            ) : (
              <>
                <HiCheck />
                Import{" "}
                {selectedItems.length || ""}
              </>

            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportJsonModal;