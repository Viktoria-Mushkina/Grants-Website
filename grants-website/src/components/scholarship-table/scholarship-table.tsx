import type { Scholarship } from "../../types/scholarship";
import styles from "./scholarship-table.module.css";

interface ScholarshipTableProps {
  scholarships: Scholarship[];
}

export const ScholarshipTable: React.FC<ScholarshipTableProps> = ({
  scholarships,
}) => {
  return (
    <div className={styles.tableContainer}>
      <div className={styles.table}>
        {scholarships.map((scholarship) => (
          <div key={scholarship.id} className={styles.row}>
            <div className={styles.cell}>{scholarship.name}</div>
            <div className={styles.cell}>{scholarship.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
