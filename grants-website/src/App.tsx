import { ScholarshipTable } from "./components/scholarship-table";
import { scholarshipsData } from "./data/scholarshipsData";
import { Recommendations } from "./components/recommendations";
import { ScholarshipSearch } from "./components/scholarship-search";
import type { Scholarship } from "./types/scholarship";
import { useState } from "react";
import bgImage from "/bg-image.png";
import "./App.css";

const recommendedScholarships = scholarshipsData.slice(0, 9);
function App() {
  const [filteredScholarships, setFilteredScholarships] =
    useState<Scholarship[]>(scholarshipsData);
  const [searchActive, setSearchActive] = useState(false);
  // Обработчик выбора стипендии из поиска
  const handleSelectScholarship = (scholarship: Scholarship) => {
    // Можно добавить скролл к выбранной стипендии в таблице
    setFilteredScholarships([scholarship]);
    setSearchActive(true);
  };

  // Сброс фильтрации
  const handleResetFilter = () => {
    setFilteredScholarships(scholarshipsData);
    setSearchActive(false);
  };
  return (
    <div className="app">
      <div className="backgroundImage">
        <img src={bgImage} alt="background" />
      </div>
      <main className="app-main">
        <Recommendations scholarships={recommendedScholarships} />
        <ScholarshipSearch
          scholarships={scholarshipsData}
          onSelect={handleSelectScholarship}
        />
        <ScholarshipTable scholarships={scholarshipsData} />
      </main>
    </div>
  );
}

export default App;
