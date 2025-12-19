import { ScholarshipTable } from "./components/scholarship-table";
import { scholarshipsData } from "./data/scholarshipsData";
import { Recommendations } from "./components/recommendations";
import { ScholarshipSearch } from "./components/scholarship-search";
import { ScholarshipDetailsModal } from "./components/scholarship-details-modal";
import type { Scholarship } from "./types/scholarship";
import { useState } from "react";
import bgImage from "/bg-image.png";
import "./App.css";

const recommendedScholarships = scholarshipsData.slice(0, 9);

function App() {
  const [filteredScholarships, setFilteredScholarships] =
    useState<Scholarship[]>(scholarshipsData);
  const [searchActive, setSearchActive] = useState(false);
  const [selectedScholarship, setSelectedScholarship] =
    useState<Scholarship | null>(null);

  // Обработчик выбора стипендии из поиска
  const handleSelectScholarship = (scholarship: Scholarship) => {
    setFilteredScholarships([scholarship]);
    setSearchActive(true);
  };

  // Обработчик клика на стипендию в таблице
  const handleScholarshipClick = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship);
  };

  // Обработчик закрытия детальной информации
  const handleCloseDetails = () => {
    setSelectedScholarship(null);
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

        {selectedScholarship ? (
          <ScholarshipDetailsModal
            scholarship={selectedScholarship}
            onClose={handleCloseDetails}
          />
        ) : (
          <>
            {searchActive && (
              <div className="search-results-header">
                <h3>Результаты поиска</h3>
              </div>
            )}

            <ScholarshipTable
              scholarships={filteredScholarships}
              onRowClick={handleScholarshipClick}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
