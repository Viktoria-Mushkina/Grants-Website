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
      <table className={styles.table}>
        <tbody>
          {scholarships.map((scholarship) => (
            <tr key={scholarship.id} className={styles.row}>
              <td className={styles.cell}>{scholarship.name}</td>
              <td className={styles.cell}>{scholarship.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
