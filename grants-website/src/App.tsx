import { ScholarshipTable } from "./components/scholarship-table";
import { scholarshipsData } from "./data/scholarshipsData";
import bgImage from "/bg-image.png";
import "./App.css";

function App() {
  return (
    <div className="app">
      <div className="backgroundImage">
        <img src={bgImage} alt="background" />
      </div>
      <main className="app-main">
        <ScholarshipTable scholarships={scholarshipsData} />
      </main>
    </div>
  );
}

export default App;
