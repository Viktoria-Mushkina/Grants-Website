import { useState, useRef, useEffect } from "react";
import type { Scholarship } from "../../types/scholarship";
import styles from "./scholarship-search.module.css";
import filterIcon from "/filter-icon.svg";

interface ScholarshipSearchProps {
  scholarships: Scholarship[];
  onSelect?: (scholarship: Scholarship) => void;
}

export const ScholarshipSearch: React.FC<ScholarshipSearchProps> = ({
  scholarships,
  onSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredScholarships, setFilteredScholarships] = useState<
    Scholarship[]
  >([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Фильтрация стипендий по поисковому запросу
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredScholarships([]);
      setIsDropdownOpen(false);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = scholarships
      .filter((scholarship) => scholarship.name.toLowerCase().includes(term))
      .slice(0, 5);

    setFilteredScholarships(filtered);
    setIsDropdownOpen(filtered.length > 0);
    setSelectedIndex(-1);
  }, [searchTerm, scholarships]);

  // Обработчик изменения ввода
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Обработчик выбора стипендии
  const handleSelectScholarship = (scholarship: Scholarship) => {
    setSearchTerm(scholarship.name);
    setIsDropdownOpen(false);
    onSelect?.(scholarship);
    inputRef.current?.blur();
  };

  // Обработчик нажатия клавиш
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredScholarships.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredScholarships.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && filteredScholarships[selectedIndex]) {
          handleSelectScholarship(filteredScholarships[selectedIndex]);
        }
        break;
      case "Escape":
        setIsDropdownOpen(false);
        break;
    }
  };

  // Клик вне компонента закрывает dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.searchContainer} ref={dropdownRef}>
      <div className={styles.container}>
        <div className={styles.searchInputWrapper}>
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (filteredScholarships.length > 0) {
                setIsDropdownOpen(true);
              }
            }}
            placeholder="Поиск стипендий..."
            className={styles.searchInput}
          />
          {isDropdownOpen && filteredScholarships.length > 0 && (
            <div className={styles.dropdown}>
              <ul className={styles.resultsList}>
                {filteredScholarships.map((scholarship, index) => (
                  <li
                    key={scholarship.id}
                    className={`${styles.resultItem} ${
                      index === selectedIndex ? styles.selected : ""
                    }`}
                    onClick={() => handleSelectScholarship(scholarship)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className={styles.resultContent}>
                      <h4 className={styles.scholarshipName}>
                        {scholarship.name}
                      </h4>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {searchTerm && filteredScholarships.length === 0 && (
            <div className={styles.noResults}>
              <p>Стипендии не найдены. Попробуйте другой запрос.</p>
            </div>
          )}
        </div>
      </div>
      <button className={styles.filterBtn}>
        <img src={filterIcon} alt="filter-icon" />
      </button>
    </div>
  );
};
