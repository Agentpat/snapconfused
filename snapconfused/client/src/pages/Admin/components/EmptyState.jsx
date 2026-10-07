import {
  HiMagnifyingGlass,
} from "react-icons/hi2";

const EmptyState = () => {
  return (
    <div className="admin-empty">
      <div className="admin-empty-icon">
        <HiMagnifyingGlass />
      </div>

      <h3>No confessions found</h3>

      <p>
        There are no confessions matching
        the current search or filter.
      </p>
    </div>
  );
};

export default EmptyState;