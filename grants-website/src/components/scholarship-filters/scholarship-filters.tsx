import { useState, useEffect, useRef, useCallback } from "react";
import type { Scholarship } from "../../types/scholarship";
import styles from "./scholarship-filters.module.css";
import filterIcon from "/filter-icon.svg";

interface ExpandingFilterProps {
  scholarships: Scholarship[];
  onFilterChange: (filtered: Scholarship[]) => void;
}

export const ScholarshipFilters: React.FC<ExpandingFilterProps> = ({
  scholarships,
  onFilterChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);

  // Значения фильтров
  const [scholarshipType, setScholarshipType] = useState<string[]>([]);
  const [educationLevel, setEducationLevel] = useState<string[]>([]);
  const [studyForm, setStudyForm] = useState<string[]>([]);
  const [institute, setInstitute] = useState<string[]>([]);
  const [course, setCourse] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [paymentAmount, setPaymentAmount] = useState<string[]>([]);
  const [paymentFrequency, setPaymentFrequency] = useState<string[]>([]);
  const [paymentDuration, setPaymentDuration] = useState<string[]>([]);

  // Используем ref для хранения предыдущих отфильтрованных данных
  const prevFilteredRef = useRef<Scholarship[]>(scholarships);
  const prevFilterValuesRef = useRef({
    scholarshipType: [] as string[],
    educationLevel: [] as string[],
    studyForm: [] as string[],
    institute: [] as string[],
    course: [] as string[],
    achievements: [] as string[],
    paymentAmount: [] as string[],
    paymentFrequency: [] as string[],
    paymentDuration: [] as string[],
  });

  // Опции для фильтров
  const filterOptions = {
    scholarshipType: [
      "Государственная",
      "Негосударственная (именная)",
      "Президентская / Правительственная",
      "Корпоративная",
      "Социальная",
      "Материальная помощь",
      "Программы поддержки / льготы",
    ],

    educationLevel: [
      "Абитуриент",
      "Бакалавриат",
      "Специалитет",
      "Магистратура",
      "Аспирантура",
    ],

    studyForm: ["Очная", "Очно-заочная", "Заочная"],

    institute: [
      "ИКН",
      "ИНМиН",
      "Горный институт",
      "ИФКИ",
      "ИЭУ",
      "БиоИнж",
      "ИБО",
      "ЭкоТех",
      "Для всех институтов",
    ],

    course: ["1", "2", "3", "4", "5", "6"],

    achievements: [
      "Учебные",
      "Научные",
      "Проектные",
      "Общественная деятельность",
      "Волонтерство",
      "Спортивные",
      "Олимпиады",
      "Публикации",
      "Патенты",
      "Гранты",
      "Амбассадорство",
      "Цифровое волонтерство",
    ],

    paymentAmount: [
      "До 5 000 ₽",
      "5 000 – 10 000 ₽",
      "10 000 – 20 000 ₽",
      "20 000 – 30 000 ₽",
      "30 000 ₽",
    ],

    paymentFrequency: ["Ежемесячная", "Единоразовая", "За семестр", "За год"],

    paymentDuration: [
      "≤ 3 месяцев",
      "6 месяцев",
      "10 месяцев",
      "12 месяцев",
      "Зависит от решения комиссии",
    ],
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setExpandedFilter(null);
    }
  };

  const toggleFilter = (filterName: string) => {
    setExpandedFilter(expandedFilter === filterName ? null : filterName);
  };

  const handleCheckboxChange = (
    filterName: string,
    value: string,
    checked: boolean
  ) => {
    const setters: {
      [key: string]: React.Dispatch<React.SetStateAction<string[]>>;
    } = {
      "Тип стипендии": setScholarshipType,
      "Уровень обучения": setEducationLevel,
      "Форма обучения": setStudyForm,
      "Институт / подразделение МИСИС": setInstitute,
      Курс: setCourse,
      "Тип достижений": setAchievements,
      "Размер выплаты": setPaymentAmount,
      Периодичность: setPaymentFrequency,
      Длительность: setPaymentDuration,
    };

    const setter = setters[filterName];
    if (setter) {
      setter((prev) =>
        checked ? [...prev, value] : prev.filter((v) => v !== value)
      );
    }
  };

  // Функция фильтрации с проверкой изменений
  const applyFilters = useCallback(() => {
    if (!isExpanded) return;

    // Проверяем, изменились ли значения фильтров
    const currentFilterValues = {
      scholarshipType,
      educationLevel,
      studyForm,
      institute,
      course,
      achievements,
      paymentAmount,
      paymentFrequency,
      paymentDuration,
    };

    const filtersChanged =
      JSON.stringify(currentFilterValues) !==
      JSON.stringify(prevFilterValuesRef.current);

    if (
      !filtersChanged &&
      prevFilteredRef.current.length === scholarships.length
    ) {
      // Фильтры не изменились, пропускаем повторную фильтрацию
      return;
    }

    // Сохраняем текущие значения фильтров
    prevFilterValuesRef.current = currentFilterValues;

    let filtered = [...scholarships];

    if (scholarshipType.length > 0) {
      filtered = filtered.filter((scholarship) => {
        const type = scholarship.type || "";
        return scholarshipType.some((filterType) => {
          if (filterType === "Государственная")
            return type === "Государственная";
          if (filterType === "Негосударственная (именная)")
            return type === "Негосударственная";
          if (filterType === "Президентская / Правительственная") {
            return (
              scholarship.category?.includes("Президентские") ||
              scholarship.category?.includes("Правительственные")
            );
          }
          if (filterType === "Корпоративная")
            return scholarship.category?.includes("ЭкоТех");
          if (filterType === "Социальная")
            return scholarship.name.includes("социальн");
          return false;
        });
      });
    }

    if (educationLevel.length > 0) {
      filtered = filtered.filter((scholarship) => {
        if (!scholarship.educationLevel) return false;
        return educationLevel.some((level) =>
          scholarship.educationLevel?.some((scholarshipLevel) =>
            scholarshipLevel.toLowerCase().includes(level.toLowerCase())
          )
        );
      });
    }

    if (studyForm.length > 0) {
      filtered = filtered.filter((scholarship) => {
        if (!scholarship.studyForm) return false;
        return studyForm.some((form) =>
          scholarship.studyForm?.some((scholarshipForm) =>
            scholarshipForm.toLowerCase().includes(form.toLowerCase())
          )
        );
      });
    }

    if (institute.length > 0 && !institute.includes("Для всех институтов")) {
      filtered = filtered.filter((scholarship) => {
        const scholarshipCategory = scholarship.category || "";
        return institute.some((inst) => scholarshipCategory.includes(inst));
      });
    }

    if (course.length > 0) {
      filtered = filtered.filter((scholarship) => {
        if (!scholarship.course) return false;
        return course.some((c) => scholarship.course?.includes(c));
      });
    }

    if (paymentAmount.length > 0) {
      filtered = filtered.filter((scholarship) => {
        const amount = scholarship.paymentAmount || "";
        return paymentAmount.some((range) => {
          if (range === "До 5 000 ₽") {
            const match = amount.match(/(\d+)/);
            if (match) {
              const num = parseInt(match[1].replace(/\s/g, ""));
              return num < 5000;
            }
          }
          if (range === "5 000 – 10 000 ₽") {
            const match = amount.match(/(\d+)/);
            if (match) {
              const num = parseInt(match[1].replace(/\s/g, ""));
              return num >= 5000 && num <= 10000;
            }
          }
          if (range === "10 000 – 20 000 ₽") {
            const match = amount.match(/(\d+)/);
            if (match) {
              const num = parseInt(match[1].replace(/\s/g, ""));
              return num >= 10000 && num <= 20000;
            }
          }
          if (range === "20 000 – 30 000 ₽") {
            const match = amount.match(/(\d+)/);
            if (match) {
              const num = parseInt(match[1].replace(/\s/g, ""));
              return num >= 20000 && num <= 30000;
            }
          }
          if (range === "30 000 ₽") {
            const match = amount.match(/(\d+)/);
            if (match) {
              const num = parseInt(match[1].replace(/\s/g, ""));
              return num >= 30000;
            }
          }
          return false;
        });
      });
    }

    if (paymentFrequency.length > 0) {
      filtered = filtered.filter((scholarship) => {
        const frequency = scholarship.paymentFrequency || "";
        return paymentFrequency.some((freq) =>
          frequency.toLowerCase().includes(freq.toLowerCase())
        );
      });
    }

    if (paymentDuration.length > 0) {
      filtered = filtered.filter((scholarship) => {
        const duration = scholarship.paymentDuration || "";
        return paymentDuration.some((dur) =>
          duration.toLowerCase().includes(dur.toLowerCase())
        );
      });
    }

    // Проверяем, изменился ли результат фильтрации
    const filteredChanged =
      JSON.stringify(filtered) !== JSON.stringify(prevFilteredRef.current);

    if (filteredChanged) {
      prevFilteredRef.current = filtered;
      onFilterChange(filtered);
    }
  }, [
    isExpanded,
    scholarships,
    scholarshipType,
    educationLevel,
    studyForm,
    institute,
    course,
    achievements,
    paymentAmount,
    paymentFrequency,
    paymentDuration,
    onFilterChange,
  ]);

  // Используем setTimeout для отложенного вызова фильтрации
  useEffect(() => {
    if (!isExpanded) return;

    const timer = setTimeout(() => {
      applyFilters();
    }, 50); // Небольшая задержка для предотвращения частых обновлений

    return () => clearTimeout(timer);
  }, [
    applyFilters,
    isExpanded,
    // Не включаем другие зависимости - они уже в applyFilters
  ]);

  const clearAllFilters = () => {
    setScholarshipType([]);
    setEducationLevel([]);
    setStudyForm([]);
    setInstitute([]);
    setCourse([]);
    setAchievements([]);
    setPaymentAmount([]);
    setPaymentFrequency([]);
    setPaymentDuration([]);
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Добавляем обработчик клика вне компонента
  useEffect(() => {
    const handleClickOutsideComponent = (event: MouseEvent) => {
      const filterContainer = document.querySelector(
        `.${styles.filterContainer}`
      );
      if (filterContainer && !filterContainer.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutsideComponent);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideComponent);
    };
  }, [isExpanded]);

  return (
    <div
      className={`${styles.filterContainer} ${
        isExpanded ? styles.expanded : ""
      }`}
      onClick={handleClickOutside}
    >
      <button className={styles.filterToggle} onClick={toggleExpand}>
        <img src={filterIcon} alt="filter-icon" />
        {isExpanded && <span className={styles.closeIcon}>✕</span>}
      </button>

      {isExpanded && (
        <div className={styles.filterContent}>
          <div className={styles.filterHeader}>
            <h3>Фильтры</h3>
            <button onClick={clearAllFilters} className={styles.clearButton}>
              Очистить все
            </button>
          </div>

          <div className={styles.filtersList}>
            {/* Тип стипендии */}
            <div className={styles.filterSection}>
              <div
                className={styles.filterSectionHeader}
                onClick={() => toggleFilter("Тип стипендии")}
              >
                <span>Тип стипендии</span>
                <span className={styles.arrow}>
                  {expandedFilter === "Тип стипендии" ? "▼" : "▶"}
                </span>
              </div>
              {expandedFilter === "Тип стипендии" && (
                <div className={styles.filterOptions}>
                  {filterOptions.scholarshipType.map((option) => (
                    <label key={option} className={styles.filterOption}>
                      <input
                        type="checkbox"
                        checked={scholarshipType.includes(option)}
                        onChange={(e) =>
                          handleCheckboxChange(
                            "Тип стипендии",
                            option,
                            e.target.checked
                          )
                        }
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Уровень обучения */}
            <div className={styles.filterSection}>
              <div
                className={styles.filterSectionHeader}
                onClick={() => toggleFilter("Уровень обучения")}
              >
                <span>Уровень обучения</span>
                <span className={styles.arrow}>
                  {expandedFilter === "Уровень обучения" ? "▼" : "▶"}
                </span>
              </div>
              {expandedFilter === "Уровень обучения" && (
                <div className={styles.filterOptions}>
                  {filterOptions.educationLevel.map((option) => (
                    <label key={option} className={styles.filterOption}>
                      <input
                        type="checkbox"
                        checked={educationLevel.includes(option)}
                        onChange={(e) =>
                          handleCheckboxChange(
                            "Уровень обучения",
                            option,
                            e.target.checked
                          )
                        }
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Форма обучения */}
            <div className={styles.filterSection}>
              <div
                className={styles.filterSectionHeader}
                onClick={() => toggleFilter("Форма обучения")}
              >
                <span>Форма обучения</span>
                <span className={styles.arrow}>
                  {expandedFilter === "Форма обучения" ? "▼" : "▶"}
                </span>
              </div>
              {expandedFilter === "Форма обучения" && (
                <div className={styles.filterOptions}>
                  {filterOptions.studyForm.map((option) => (
                    <label key={option} className={styles.filterOption}>
                      <input
                        type="checkbox"
                        checked={studyForm.includes(option)}
                        onChange={(e) =>
                          handleCheckboxChange(
                            "Форма обучения",
                            option,
                            e.target.checked
                          )
                        }
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Институт */}
            <div className={styles.filterSection}>
              <div
                className={styles.filterSectionHeader}
                onClick={() => toggleFilter("Институт / подразделение МИСИС")}
              >
                <span>Институт / подразделение МИСИС</span>
                <span className={styles.arrow}>
                  {expandedFilter === "Институт / подразделение МИСИС"
                    ? "▼"
                    : "▶"}
                </span>
              </div>
              {expandedFilter === "Институт / подразделение МИСИС" && (
                <div className={styles.filterOptions}>
                  {filterOptions.institute.map((option) => (
                    <label key={option} className={styles.filterOption}>
                      <input
                        type="checkbox"
                        checked={institute.includes(option)}
                        onChange={(e) =>
                          handleCheckboxChange(
                            "Институт / подразделение МИСИС",
                            option,
                            e.target.checked
                          )
                        }
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Курс */}
            <div className={styles.filterSection}>
              <div
                className={styles.filterSectionHeader}
                onClick={() => toggleFilter("Курс")}
              >
                <span>Курс</span>
                <span className={styles.arrow}>
                  {expandedFilter === "Курс" ? "▼" : "▶"}
                </span>
              </div>
              {expandedFilter === "Курс" && (
                <div className={styles.filterOptions}>
                  {filterOptions.course.map((option) => (
                    <label key={option} className={styles.filterOption}>
                      <input
                        type="checkbox"
                        checked={course.includes(option)}
                        onChange={(e) =>
                          handleCheckboxChange("Курс", option, e.target.checked)
                        }
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Размер выплаты */}
            <div className={styles.filterSection}>
              <div
                className={styles.filterSectionHeader}
                onClick={() => toggleFilter("Размер выплаты")}
              >
                <span>Размер выплаты</span>
                <span className={styles.arrow}>
                  {expandedFilter === "Размер выплаты" ? "▼" : "▶"}
                </span>
              </div>
              {expandedFilter === "Размер выплаты" && (
                <div className={styles.filterOptions}>
                  {filterOptions.paymentAmount.map((option) => (
                    <label key={option} className={styles.filterOption}>
                      <input
                        type="checkbox"
                        checked={paymentAmount.includes(option)}
                        onChange={(e) =>
                          handleCheckboxChange(
                            "Размер выплаты",
                            option,
                            e.target.checked
                          )
                        }
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.activeFilters}>
            {scholarshipType.length > 0 && (
              <span className={styles.activeFilterTag}>
                Тип: {scholarshipType.length}
              </span>
            )}
            {educationLevel.length > 0 && (
              <span className={styles.activeFilterTag}>
                Уровень: {educationLevel.length}
              </span>
            )}
            {studyForm.length > 0 && (
              <span className={styles.activeFilterTag}>
                Форма: {studyForm.length}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
