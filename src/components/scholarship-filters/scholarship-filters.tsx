import { useState, useEffect, useRef, useCallback } from "react";
import type { Scholarship } from "../../types/scholarship";
import styles from "./scholarship-filters.module.css";
import filterIcon from "/filter-icon.svg";
import openIcon from "/open.svg";
import closeIcon from "/close.svg";
import notChecked from "/notChecked.svg";
import checked from "/checked.svg";

interface ExpandingFilterProps {
  scholarships: Scholarship[];
  onFilterChange: (filtered: Scholarship[]) => void;
  onExpandChange?: (expanded: boolean) => void;
  onSearchResultsClose?: () => void;
}

export const ScholarshipFilters: React.FC<ExpandingFilterProps> = ({
  scholarships,
  onFilterChange,
  onExpandChange,
  onSearchResultsClose,
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
    "Тип стипендии": {
      values: ["Государственная", "Негосударственная"],
      state: scholarshipType,
      setter: setScholarshipType,
    },
    "Уровень обучения": {
      values: ["Бакалавриат", "Специалитет", "Магистратура", "Аспирантура"],
      state: educationLevel,
      setter: setEducationLevel,
    },
    "Форма обучения": {
      values: ["Очная", "Очно-заочная", "Заочная"],
      state: studyForm,
      setter: setStudyForm,
    },
    "Институт / подразделение": {
      values: [
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
      state: institute,
      setter: setInstitute,
    },
    Курс: {
      values: ["1", "2", "3", "4", "5", "6", "Любой курс"],
      state: course,
      setter: setCourse,
    },
    "Тип достижений": {
      values: [
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
      state: achievements,
      setter: setAchievements,
    },
    "Размер выплаты": {
      values: [
        "До 5 000 ₽",
        "5 000 – 10 000 ₽",
        "10 000 – 20 000 ₽",
        "20 000 – 30 000 ₽",
        "Более 30 000 ₽",
      ],
      state: paymentAmount,
      setter: setPaymentAmount,
    },
    Периодичность: {
      values: ["Ежемесячная", "Единоразовая", "За семестр", "За год"],
      state: paymentFrequency,
      setter: setPaymentFrequency,
    },
    Длительность: {
      values: [
        "≤ 3 месяцев",
        "6 месяцев",
        "10 месяцев",
        "12 месяцев",
        "Зависит от решения комиссии",
      ],
      state: paymentDuration,
      setter: setPaymentDuration,
    },
  };

  const toggleExpand = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    if (!newExpanded) {
      setExpandedFilter(null);
    }
    onExpandChange?.(newExpanded);

    // Закрываем результаты поиска при открытии/закрытии фильтров
    if (newExpanded) {
      onSearchResultsClose?.();
    }
  };

  const toggleFilter = (filterName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFilter(expandedFilter === filterName ? null : filterName);
  };

  const handleCheckboxChange = (
    filterName: keyof typeof filterOptions,
    value: string,
    checked: boolean,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.stopPropagation();
    const setter = filterOptions[filterName].setter;
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
      const match = amount.match(/(\d+[\s\d]*)/);
      if (match) {
        const numStr = match[1].replace(/\s/g, "");
        return parseInt(numStr, 10);
      }

      const rangeMatch = amount.match(/(\d+)[-\s]+(\d+)/);
      if (rangeMatch) {
        return parseInt(rangeMatch[1], 10);
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
      return;
    }

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

        if (course.includes("Любой курс")) {
          return scholarship.course?.includes("Любой курс");
        }

        return course.some((c) =>
          scholarship.course?.some((schCourse) => {
            if (schCourse === c) return true;

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

  const clearAllFilters = (e: React.MouseEvent) => {
    e.stopPropagation();
    Object.values(filterOptions).forEach((option) => {
      option.setter([]);
    });
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    const handleClickOutsideComponent = (event: MouseEvent) => {
      const filterContainer = document.querySelector(
        `.${styles.filterContainer}`
      );
      if (filterContainer && !filterContainer.contains(event.target as Node)) {
        setIsExpanded(false);
        onExpandChange?.(false); // Сообщаем об изменении
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutsideComponent);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideComponent);
    };
  }, [isExpanded, onExpandChange]);

  // Функция для рендеринга фильтра
  const renderFilterSection = (filterName: keyof typeof filterOptions) => {
    const option = filterOptions[filterName];
    const isExpandedSection = expandedFilter === filterName;

    return (
      <div key={filterName} className={styles.filterSection}>
        <div
          className={styles.filterSectionHeader}
          onClick={(e) => toggleFilter(filterName, e)}
        >
          <img
            src={isExpandedSection ? openIcon : closeIcon}
            alt={isExpandedSection ? "open-icon" : "close-icon"}
            className={styles.filterArrow}
          />
          <span>{filterName}</span>
        </div>
        {isExpandedSection && (
          <div className={styles.filterOptions}>
            {option.values.map((value) => {
              const isChecked = option.state.includes(value);
              return (
                <label
                  key={value}
                  className={styles.filterOption}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={styles.customCheckbox}>
                    <img
                      src={isChecked ? checked : notChecked}
                      alt={isChecked ? "checked" : "not checked"}
                      className={styles.checkboxIcon}
                    />
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) =>
                        handleCheckboxChange(
                          filterName,
                          value,
                          e.target.checked,
                          e
                        )
                      }
                      className={styles.hiddenCheckbox}
                    />
                  </div>
                  <span
                    className={
                      isChecked ? styles.checkedText : styles.uncheckedText
                    }
                  >
                    {value}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    );
  };

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
              Очистить
            </button>
          </div>

          <div className={styles.filtersList}>
            {Object.keys(filterOptions).map((filterName) =>
              renderFilterSection(filterName as keyof typeof filterOptions)
            )}
          </div>
        </div>
      )}
    </div>
  );
};
