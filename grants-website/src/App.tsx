import { ScholarshipTable } from "./components/scholarship-table";
import { scholarshipsData } from "./data/scholarshipsData";
import { Recommendations } from "./components/recommendations";
import bgImage from "/bg-image.png";
import "./App.css";

const recommendedScholarships = scholarshipsData.slice(0, 9);
function App() {
  return (
    <div className="app">
      <div className="backgroundImage">
        <img src={bgImage} alt="background" />
      </div>
      <main className="app-main">
        <Recommendations scholarships={recommendedScholarships} />
        <ScholarshipTable scholarships={scholarshipsData} />
      </main>
    </div>
  );
}

export default App;
