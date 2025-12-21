import { ScholarshipTable } from "./components/scholarship-table";
import { scholarshipsData } from "./data/scholarshipsData";
import { Recommendations } from "./components/recommendations";
import { ScholarshipSearch } from "./components/scholarship-search";
import { ScholarshipDetailsModal } from "./components/scholarship-details-modal";
import type { Scholarship } from "./types/scholarship";
import { useState } from "react";
import bgImage from "/bg-image.png";
import "./App.css";

const selectedScholarshipIds = [4, 7, 8, 10, 11, 12, 13, 14, 16];

function App() {
  const [filteredScholarships, setFilteredScholarships] =
    useState<Scholarship[]>(scholarshipsData);
  const [selectedScholarship, setSelectedScholarship] =
    useState<Scholarship | null>(null);

  const handleFilterChange = (filtered: Scholarship[]) => {
    setFilteredScholarships(filtered);
  };

  const handleSelectScholarship = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship);
  };

  const handleScholarshipClick = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship);
  };

  const handleRecommendationCardClick = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship);
  };

  const handleCloseDetails = () => {
    setSelectedScholarship(null);
  };

  const selectedScholarships = scholarshipsData.filter((scholarship) =>
    selectedScholarshipIds.includes(scholarship.id)
  );

  return (
    <div className="app">
      <div className="backgroundImage">
        <img src={bgImage} alt="background" />
      </div>
      <main className="app-main">
        <Recommendations
          scholarships={selectedScholarships}
          onCardClick={handleRecommendationCardClick}
        />

        <ScholarshipSearch
          scholarships={scholarshipsData}
          onSelect={handleSelectScholarship}
          onFilterChange={handleFilterChange}
        />

        {selectedScholarship && (
          <ScholarshipDetailsModal
            scholarship={selectedScholarship}
            onClose={handleCloseDetails}
          />
        )}
        <ScholarshipTable
          scholarships={filteredScholarships}
          onRowClick={handleScholarshipClick}
        />
      </main>
    </div>
  );
}

export default App;
