import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import Wordle from './pages/Wordle';
import Scrambler from './pages/Scrambler';
import Home from './pages/Home';
import './App.scss';
// import Escape from './pages/Escape/Escape';
// import EscapeGame from './pages/Escape/EscapeGame';
import Picross from './pages/Picross';
import Qwirkle from './pages/Qwirkle';

const theme = {
  border: '1px solid #cdcdcd'
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <header className="App-header">
            <Link to="/" className="header-logo">
              <img src="/logo192.png" alt="Scoreboard Logo" />
              COREboard
            </Link>
            <div>
              <Link className="App-link" to="/wordle">Wordle</Link>
              <Link className="App-link" to="/scrambler">Scrambler</Link>
              {/* <Link className="App-link" to="/escape">Escape</Link> */}
              <Link className="App-link" to="/picross">Picross</Link>
              <Link className="App-link" to="/qwirkle">Qwirkle</Link>              
            </div>
          </header>
          <Routes>
            <Route path="/wordle" element={<Wordle />} />
            <Route path="/scrambler" element={<Scrambler />} />
            {/* <Route path="/escape" element={<Escape />} /> */}
            {/* <Route path="/escape/game" element={<EscapeGame />} /> */}
            <Route path="/picross" element={<Picross />} />
            <Route path="/qwirkle" element={<Qwirkle />} />
            <Route exact path="/" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
