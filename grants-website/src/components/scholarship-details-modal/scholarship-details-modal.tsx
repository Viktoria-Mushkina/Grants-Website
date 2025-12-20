import type { Scholarship } from "../../types/scholarship";
import styles from "./scholarship-details-modal.module.css";

interface ScholarshipDetailsModalProps {
  scholarship: Scholarship;
  onClose: () => void;
}

export const ScholarshipDetailsModal: React.FC<
  ScholarshipDetailsModalProps
> = ({ scholarship, onClose }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.detailsGrid}>
            {/* Блок 1 */}
            <div className={styles.detailCard}>
              <div className={styles.description}>
                <h2 className={styles.title}>{scholarship.name}</h2>
                <p>
                  {scholarship.description ||
                    "Описание стипендиальной программы"}
                </p>
              </div>
              <strong className={styles.paymentAmount}>
                {scholarship.paymentAmount || "Не указано"}
              </strong>
            </div>

            {/* Блок 2 */}
            <div className={styles.detailCard}>
              <div className={styles.detailItem}>
                <h4>Тип стипендии</h4>
                <div className={styles.item}>
                  <div className={styles.arrayItem}>
                    {scholarship.type || "Не указано"}
                  </div>
                </div>
              </div>
              <div className={styles.detailItem}>
                <h4>Периодичность выплат</h4>
                <div className={styles.item}>
                  <div className={styles.arrayItem}>
                    {scholarship.paymentFrequency || "Не указано"}
                  </div>
                </div>
              </div>
              <div className={styles.detailItem}>
                <h4>Продолжительность</h4>
                <div className={styles.item}>
                  <div className={styles.arrayItem}>
                    {scholarship.paymentDuration || "Не указано"}
                  </div>
                </div>
              </div>
            </div>

            {/* Блок 3 */}
            <div className={styles.detailCard}>
              <div className={styles.detailItem}>
                <h4>Уровень обучения</h4>
                <div className={styles.item}>
                  {scholarship.educationLevel &&
                  scholarship.educationLevel.length > 0 ? (
                    scholarship.educationLevel.map((level, index) => (
                      <div key={index} className={styles.arrayItem}>
                        {level}
                      </div>
                    ))
                  ) : (
                    <div className={styles.arrayItem}>Не указано</div>
                  )}
                </div>
              </div>
              <div className={styles.detailItem}>
                <h4>Курс</h4>
                <div className={styles.item}>
                  {scholarship.course && scholarship.course.length > 0 ? (
                    scholarship.course.map((course, index) => (
                      <div key={index} className={styles.circleItem}>
                        {course}
                      </div>
                    ))
                  ) : (
                    <div className={styles.arrayItem}>Не указано</div>
                  )}
                </div>
              </div>
              <div className={styles.detailItem}>
                <h4>Направление подготовки</h4>
                <div className={styles.item}>
                  {scholarship.department &&
                  scholarship.department.length > 0 ? (
                    scholarship.department.map((dept, index) => (
                      <div key={index} className={styles.arrayItem}>
                        {dept}
                      </div>
                    ))
                  ) : (
                    <div className={styles.arrayItem}>Не указано</div>
                  )}
                </div>
              </div>
              <div className={styles.detailItem}>
                <h4>Форма обучения</h4>
                <div className={styles.item}>
                  {scholarship.studyForm && scholarship.studyForm.length > 0 ? (
                    scholarship.studyForm.map((form, index) => (
                      <div key={index} className={styles.arrayItem}>
                        {form}
                      </div>
                    ))
                  ) : (
                    <div className={styles.arrayItem}>Не указано</div>
                  )}
                </div>
              </div>
            </div>

            {/* Блок 4 */}
            <div className={styles.detailCard}>
              {scholarship.contacts?.name && (
                <div className={styles.detailItem}>
                  <h4>Контактное лицо</h4>
                  <div>{scholarship.contacts.name}</div>
                  {scholarship.contacts?.position && (
                    <div className={styles.position}>
                      {scholarship.contacts.position}
                    </div>
                  )}
                </div>
              )}

              {scholarship.contacts?.email && (
                <div className={styles.detailItem}>
                  <h4>Email</h4>
                  <div className={styles.arrayItem}>
                    <a
                      href={`mailto:${scholarship.contacts.email}`}
                      className={styles.emailLink}
                    >
                      {scholarship.contacts.email}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Блок 5 */}
            <div className={styles.detailCard}>
              <div>
                <h4>Требования к кандидатам</h4>
                {scholarship.requirements?.minGrade && (
                  <div className={styles.detailItem}>
                    <span>Минимальный балл: </span>
                    <strong>{scholarship.requirements.minGrade}</strong>
                  </div>
                )}
                {scholarship.requirements?.noDebts && (
                  <div className={styles.detailItem}>
                    <span>Не иметь задолжности</span>
                  </div>
                )}
              </div>
              {scholarship.requirements?.achievements && (
                <div>
                  <div className={styles.achievements}>
                    <h4>Достижения:</h4>
                    <ol className={styles.procedureList}>
                      {scholarship.requirements.achievements.map(
                        (achievement, index) => (
                          <li key={index}>{achievement}</li>
                        )
                      )}
                    </ol>
                  </div>
                </div>
              )}
              <div className={styles.procedure}>
                <h4>Процедура получения</h4>
                {scholarship.procedure && scholarship.procedure.length > 0 ? (
                  <ol className={styles.procedureList}>
                    {scholarship.procedure.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                ) : (
                  <p>Информация о процедуре не указана</p>
                )}
              </div>
            </div>
          </div>

          {scholarship.detailsUrl && (
            <div className={styles.detailsButtonContainer}>
              <a
                href={scholarship.detailsUrl}
                target="_blank"
                className={styles.detailsButton}
              >
                Узнать подробнее
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
