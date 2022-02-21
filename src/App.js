import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Wordle from './pages/Wordle';
import Scrambler from './pages/Scrambler';
import Home from './pages/Home';
import './App.scss';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Link className="App-link" to="/wordle">Wordle</Link>
          <Link className="App-link" to="/scrambler">Scrambler</Link>
        </header>
        <Routes>
          <Route path="/wordle" element={<Wordle />} />
          <Route path="/scrambler" element={<Scrambler />} />
          <Route exact path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
