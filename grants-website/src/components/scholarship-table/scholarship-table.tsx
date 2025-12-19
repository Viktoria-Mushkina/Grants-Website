import type { Scholarship } from "../../types/scholarship";
import styles from "./scholarship-table.module.css";

interface ScholarshipTableProps {
  scholarships: Scholarship[];
  onRowClick: (scholarship: Scholarship) => void;
}

export const ScholarshipTable: React.FC<ScholarshipTableProps> = ({
  scholarships,
  onRowClick,
}) => {
  return (
    <div className={styles.tableContainer}>
      <div className={styles.table}>
        {scholarships.map((scholarship) => (
          <div
            key={scholarship.id}
            className={styles.row}
            onClick={() => onRowClick(scholarship)}
          >
            <div className={styles.cell}>{scholarship.name}</div>
            <div className={styles.cell}>
              <span
                className={`${styles.typeBadge} ${
                  scholarship.type === "Государственная"
                    ? styles.state
                    : styles.nonState
                }`}
              >
                {scholarship.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
