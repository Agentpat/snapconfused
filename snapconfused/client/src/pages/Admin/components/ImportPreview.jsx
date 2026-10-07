import {
    HiCheck,
    HiMiniXMark,
} from "react-icons/hi2";

import "./ImportPreview.css";

const ImportPreview = ({
    confessions = [],
    selectedIndexes = [],
    onToggle,
    onToggleAll,
}) => {
    const selectedSet = new Set(selectedIndexes);

    const allSelected =
        confessions.length > 0 &&
        selectedIndexes.length === confessions.length;

    const selectedCount = selectedIndexes.length;

    return (
        <div className="admin-import-preview">
            <div className="admin-import-preview-header">
                <div>
                    <span className="admin-import-preview-eyebrow">
                        Preview
                    </span>

                    <h3>
                        {confessions.length} confession
                        {confessions.length === 1 ? "" : "s"} found
                    </h3>

                    <p>
                        Select the confessions you want to add.
                    </p>
                </div>

                <div className="admin-import-selected-count">
                    <strong>{selectedCount}</strong>

                    <span>
                        selected
                    </span>
                </div>
            </div>

            <div className="admin-import-select-bar">
                <label className="admin-import-select-all">
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={onToggleAll}
                    />

                    <span className="admin-import-checkbox">
                        <HiCheck />
                    </span>

                    <span>
                        {allSelected
                            ? "Deselect all"
                            : "Select all"}
                    </span>
                </label>

                <span>
                    {selectedCount} of {confessions.length}
                </span>
            </div>

            <div className="admin-import-preview-list">
                {confessions.map((confession, index) => {
                    const isSelected =
                        selectedSet.has(index);

                    return (
                        <article
                            className={`admin-import-item ${
                                isSelected
                                    ? "is-selected"
                                    : ""
                            }`}
                            key={`${index}-${confession.content}`}
                        >
                            <button
                                type="button"
                                className="admin-import-item-select"
                                onClick={() =>
                                    onToggle(index)
                                }
                                aria-label={
                                    isSelected
                                        ? "Deselect confession"
                                        : "Select confession"
                                }
                            >
                                <span>
                                    {isSelected && (
                                        <HiCheck />
                                    )}
                                </span>
                            </button>

                            <div className="admin-import-item-number">
                                {String(index + 1).padStart(2, "0")}
                            </div>

                            <div className="admin-import-item-content">
                                <p>
                                    {confession.content}
                                </p>

                                <div className="admin-import-item-meta">
                                    <span>
                                        {confession.isAnonymous
                                            ? "Anonymous"
                                            : confession.author ||
                                              "Anonymous"}
                                    </span>

                                    <span>
                                        {confession.isAnonymous
                                            ? "Anonymous post"
                                            : "Named post"}
                                    </span>
                                </div>
                            </div>

                            {!isSelected && (
                                <div className="admin-import-item-state">
                                    <HiMiniXMark />
                                </div>
                            )}
                        </article>
                    );
                })}
            </div>
        </div>
    );
};

export default ImportPreview;