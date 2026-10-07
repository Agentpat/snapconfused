import {
    HiArrowPath,
    HiArrowRightOnRectangle,
    HiPlus,
    HiSquare3Stack3D,
} from "react-icons/hi2";
import "./AdminHeader.css";

const AdminHeader = ({
    onRefresh,
    onCreate,
    onImport,
    onLogout,
    loading,
}) => {
    return (
        <header className="admin-header">
            <div className="admin-header-inner">

                <div className="admin-brand">
                    <div className="admin-brand-mark">
                        <HiSquare3Stack3D />
                    </div>

                    <div className="admin-brand-copy">
                        <strong>SnapConfused</strong>
                        <span>Content Studio</span>
                    </div>
                </div>

                <div className="admin-header-actions">

                    <button
                        type="button"
                        className="admin-header-action admin-header-refresh"
                        onClick={onRefresh}
                        disabled={loading}
                        title="Refresh content"
                    >
                        <HiArrowPath
                            className={
                                loading
                                    ? "admin-spin"
                                    : ""
                            }
                        />

                        <span>Refresh</span>
                    </button>

                    <button
                        type="button"
                        className="admin-header-action admin-header-import"
                        onClick={onImport}
                    >
                        <HiSquare3Stack3D />

                        <span>Import JSON</span>
                    </button>

                    <button
                        type="button"
                        className="admin-header-create"
                        onClick={onCreate}
                    >
                        <HiPlus />

                        <span>New confession</span>
                    </button>

                    <div className="admin-header-divider" />

                    <button
                        type="button"
                        className="admin-logout"
                        onClick={onLogout}
                        title="Log out"
                        aria-label="Log out"
                    >
                        <HiArrowRightOnRectangle />
                    </button>

                </div>

            </div>
        </header>
    );
};

export default AdminHeader;