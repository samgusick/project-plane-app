import logo from "./logo.svg";
import "./App.css";
import { Helmet } from "react-helmet";
import MapPage from "./components/MapPage";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <script src="https://cdn.jsdelivr.net/gh/bbecquet/Leaflet.RotatedMarker/leaflet.rotatedMarker.js"></script>
        <MapPage />
      </header>
    </div>
  );
}

export default App;
