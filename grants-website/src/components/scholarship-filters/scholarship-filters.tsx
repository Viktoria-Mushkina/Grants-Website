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
    scholarshipType: ["Государственная", "Негосударственная"],

    educationLevel: [
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

    course: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "Магистратура 1",
      "Магистратура 2",
      "Любой курс",
      "Любой курс магистратуры",
      "Любой курс аспирантуры",
    ],

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
      "Более 30 000 ₽",
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

  // Функция для преобразования paymentAmount в число
  const getPaymentAmountNumber = (
    amount: string | number | undefined
  ): number | null => {
    if (amount === undefined || amount === null) return null;

    if (typeof amount === "number") {
      return amount;
    }

    if (typeof amount === "string") {
      // Извлекаем первое число из строки
      const match = amount.match(/(\d+[\s\d]*)/);
      if (match) {
        // Убираем пробелы и преобразуем в число
        const numStr = match[1].replace(/\s/g, "");
        return parseInt(numStr, 10);
      }

      // Если есть диапазон (например, "25000-40000")
      const rangeMatch = amount.match(/(\d+)[-\s]+(\d+)/);
      if (rangeMatch) {
        return parseInt(rangeMatch[1], 10); // Берем нижнюю границу
      }
    }

    return null;
  };

  // Функция для проверки совпадения суммы
  const checkPaymentAmountRange = (
    amount: number | null,
    range: string
  ): boolean => {
    if (amount === null) return false;

    switch (range) {
      case "До 5 000 ₽":
        return amount < 5000;
      case "5 000 – 10 000 ₽":
        return amount >= 5000 && amount <= 10000;
      case "10 000 – 20 000 ₽":
        return amount >= 10000 && amount <= 20000;
      case "20 000 – 30 000 ₽":
        return amount >= 20000 && amount <= 30000;
      case "Более 30 000 ₽":
        return amount > 30000;
      default:
        return false;
    }
  };

  // Функция фильтрации
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

    // Фильтр по типу стипендии
    if (scholarshipType.length > 0) {
      filtered = filtered.filter((scholarship) =>
        scholarshipType.includes(scholarship.type)
      );
    }

    // Фильтр по уровню обучения
    if (educationLevel.length > 0) {
      filtered = filtered.filter((scholarship) => {
        if (!scholarship.educationLevel) return false;
        return educationLevel.some((level) =>
          scholarship.educationLevel?.includes(level)
        );
      });
    }

    // Фильтр по форме обучения
    if (studyForm.length > 0) {
      filtered = filtered.filter((scholarship) => {
        if (!scholarship.studyForm) return false;
        return studyForm.some((form) => scholarship.studyForm?.includes(form));
      });
    }

    // Фильтр по институту
    if (institute.length > 0) {
      filtered = filtered.filter((scholarship) => {
        if (!scholarship.department) return false;

        const isForAllInstitutes = scholarship.department?.includes(
          "Для всех институтов"
        );

        if (isForAllInstitutes) {
          return true;
        }
        const hasMatchingInstitute = institute.some((inst) =>
          scholarship.department?.includes(inst)
        );

        return hasMatchingInstitute;
      });
    }

    // Фильтр по курсу
    if (course.length > 0) {
      filtered = filtered.filter((scholarship) => {
        if (!scholarship.course) return false;

        // Проверяем, если выбран "Любой курс" и это присутствует
        if (course.includes("Любой курс")) {
          return scholarship.course?.includes("Любой курс");
        }

        // Проверяем точные совпадения курсов
        return course.some((c) =>
          scholarship.course?.some((schCourse) => {
            // Простое совпадение строк
            if (schCourse === c) return true;

            // Если в scholarship.course есть "Магистратура 1" или "Магистратура 2"
            if (
              c.startsWith("Магистратура") &&
              schCourse.startsWith("Магистратура")
            ) {
              return true;
            }

            // Для числовых курсов
            if (!isNaN(Number(c)) && !isNaN(Number(schCourse))) {
              return Number(schCourse) === Number(c);
            }

            return false;
          })
        );
      });
    }

    // Фильтр по типу достижений
    if (achievements.length > 0) {
      filtered = filtered.filter((scholarship) => {
        const scholarshipAchievements =
          scholarship.requirements?.achievements || [];
        return achievements.some((achievement) =>
          scholarshipAchievements.includes(achievement)
        );
      });
    }

    // Фильтр по размеру выплаты
    if (paymentAmount.length > 0) {
      filtered = filtered.filter((scholarship) => {
        const amount = getPaymentAmountNumber(scholarship.paymentAmount);
        return paymentAmount.some((range) =>
          checkPaymentAmountRange(amount, range)
        );
      });
    }

    // Фильтр по периодичности
    if (paymentFrequency.length > 0) {
      filtered = filtered.filter((scholarship) => {
        if (!scholarship.paymentFrequency) return false;
        return paymentFrequency.includes(scholarship.paymentFrequency);
      });
    }

    // Фильтр по длительности
    if (paymentDuration.length > 0) {
      filtered = filtered.filter((scholarship) => {
        if (!scholarship.paymentDuration) return false;
        return paymentDuration.includes(scholarship.paymentDuration);
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

  // Применяем фильтры при изменении
  useEffect(() => {
    if (!isExpanded) return;

    const timer = setTimeout(() => {
      applyFilters();
    }, 50);

    return () => clearTimeout(timer);
  }, [
    applyFilters,
    isExpanded,
    scholarshipType,
    educationLevel,
    studyForm,
    institute,
    course,
    achievements,
    paymentAmount,
    paymentFrequency,
    paymentDuration,
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

            {/* Тип достижений */}
            <div className={styles.filterSection}>
              <div
                className={styles.filterSectionHeader}
                onClick={() => toggleFilter("Тип достижений")}
              >
                <span>Тип достижений</span>
                <span className={styles.arrow}>
                  {expandedFilter === "Тип достижений" ? "▼" : "▶"}
                </span>
              </div>
              {expandedFilter === "Тип достижений" && (
                <div className={styles.filterOptions}>
                  {filterOptions.achievements.map((option) => (
                    <label key={option} className={styles.filterOption}>
                      <input
                        type="checkbox"
                        checked={achievements.includes(option)}
                        onChange={(e) =>
                          handleCheckboxChange(
                            "Тип достижений",
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

            {/* Периодичность */}
            <div className={styles.filterSection}>
              <div
                className={styles.filterSectionHeader}
                onClick={() => toggleFilter("Периодичность")}
              >
                <span>Периодичность</span>
                <span className={styles.arrow}>
                  {expandedFilter === "Периодичность" ? "▼" : "▶"}
                </span>
              </div>
              {expandedFilter === "Периодичность" && (
                <div className={styles.filterOptions}>
                  {filterOptions.paymentFrequency.map((option) => (
                    <label key={option} className={styles.filterOption}>
                      <input
                        type="checkbox"
                        checked={paymentFrequency.includes(option)}
                        onChange={(e) =>
                          handleCheckboxChange(
                            "Периодичность",
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

            {/* Длительность */}
            <div className={styles.filterSection}>
              <div
                className={styles.filterSectionHeader}
                onClick={() => toggleFilter("Длительность")}
              >
                <span>Длительность</span>
                <span className={styles.arrow}>
                  {expandedFilter === "Длительность" ? "▼" : "▶"}
                </span>
              </div>
              {expandedFilter === "Длительность" && (
                <div className={styles.filterOptions}>
                  {filterOptions.paymentDuration.map((option) => (
                    <label key={option} className={styles.filterOption}>
                      <input
                        type="checkbox"
                        checked={paymentDuration.includes(option)}
                        onChange={(e) =>
                          handleCheckboxChange(
                            "Длительность",
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
            {institute.length > 0 && (
              <span className={styles.activeFilterTag}>
                Институт: {institute.length}
              </span>
            )}
            {course.length > 0 && (
              <span className={styles.activeFilterTag}>
                Курс: {course.length}
              </span>
            )}
            {achievements.length > 0 && (
              <span className={styles.activeFilterTag}>
                Достижения: {achievements.length}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
