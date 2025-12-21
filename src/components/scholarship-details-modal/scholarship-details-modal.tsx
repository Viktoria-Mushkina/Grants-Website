import { useEffect } from "react";
import type { Scholarship } from "../../types/scholarship";
import styles from "./scholarship-details-modal.module.css";

interface ScholarshipDetailsModalProps {
  scholarship: Scholarship;
  onClose: () => void;
}

export const ScholarshipDetailsModal: React.FC<
  ScholarshipDetailsModalProps
> = ({ scholarship, onClose }) => {
  useEffect(() => {
    document.body.classList.add("modal-open");

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);
  // Функция для форматирования суммы выплаты
  const formatPaymentAmount = (scholarship: Scholarship): string => {
    const amount = scholarship.paymentAmount;
    const frequency = scholarship.paymentFrequency;

    if (!amount) return "Не указано";

    // Если сумма - число
    if (typeof amount === "number") {
      // Форматируем число с пробелами для тысяч
      const formattedAmount = amount.toLocaleString("ru-RU");

      if (frequency) {
        return `₽ ${formattedAmount} / ${getFrequencyLabel(frequency)}`;
      }
      return `₽ ${formattedAmount}`;
    }

    // Если сумма - строка
    if (typeof amount === "string") {
      // Проверяем, содержит ли строка уже знак рубля
      if (amount.includes("₽")) {
        // Если уже есть знак рубля, добавляем частоту выплат если нужно
        if (frequency) {
          return `${amount} / ${getFrequencyLabel(frequency)}`;
        }
        return amount;
      }

      // Проверяем, является ли строка числом
      const numMatch = amount.match(/(\d+)/);
      if (numMatch) {
        const num = parseInt(numMatch[0].replace(/\s/g, ""));
        const formattedAmount = num.toLocaleString("ru-RU");

        if (frequency) {
          return `₽ ${formattedAmount} / ${getFrequencyLabel(frequency)}`;
        }
        return `₽ ${formattedAmount}`;
      }

      // Если это диапазон (например, "25000-40000")
      const rangeMatch = amount.match(/(\d+)[-\s]+(\d+)/);
      if (rangeMatch) {
        const startNum = parseInt(rangeMatch[1]);
        const endNum = parseInt(rangeMatch[2]);
        const formattedStart = startNum.toLocaleString("ru-RU");
        const formattedEnd = endNum.toLocaleString("ru-RU");

        if (frequency) {
          return `₽ ${formattedStart}-${formattedEnd} / ${getFrequencyLabel(
            frequency
          )}`;
        }
        return `₽ ${formattedStart}-${formattedEnd}`;
      }

      // Если это просто текст
      if (frequency) {
        return amount;
      }
      return amount;
    }

    return "Не указано";
  };

  // Функция для получения читаемой метки периодичности
  const getFrequencyLabel = (frequency: string): string => {
    switch (frequency) {
      case "Ежемесячная":
        return "месяц";
      case "Единоразовая":
        return "единожды";
      case "За семестр":
        return "семестр";
      case "За год":
        return "год";
      default:
        return frequency;
    }
  };
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
                {formatPaymentAmount(scholarship)}
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
