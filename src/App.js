import logo from "./logo.svg";
import "./App.css";
import { Helmet } from "react-helmet";
import MapPage from "./map";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* load the map componenet */}
        <MapPage />
      </header>
    </div>
  );
}

export default App;
