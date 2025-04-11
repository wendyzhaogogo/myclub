import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavbarLayout from "./components/layouts/NavbarLayout";
import GameLayout from "./components/layouts/GameLayout";
import Home from "./pages/Home";
import Resources from "./pages/Resources";
import MyResources from "./pages/MyResources";
import Games from "./pages/Games";
import HanziMatch2D from "./components/games/ChineseCharacterGame2D";
import HanziMatch3D from "./pages/games/HanziMatch3D";
import PhrasesLearning from './pages/PhrasesLearning';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <NavbarLayout>
              <Home />
            </NavbarLayout>
          }
        />
        <Route
          path="/resources"
          element={
            <NavbarLayout>
              <Resources />
            </NavbarLayout>
          }
        />
        <Route
          path="/my-resources"
          element={
            <NavbarLayout>
              <MyResources />
            </NavbarLayout>
          }
        />
        <Route
          path="/games"
          element={
            <NavbarLayout>
              <Games />
            </NavbarLayout>
          }
        />
        <Route
          path="/games/hanzi-match-2d"
          element={
            <GameLayout>
              <HanziMatch2D />
            </GameLayout>
          }
        />
        <Route
          path="/games/hanzi-match-3d"
          element={
            <GameLayout>
              <HanziMatch3D />
            </GameLayout>
          }
        />
        <Route path="/phrases-learning" element={<PhrasesLearning />} />
      </Routes>
    </Router>
  );
};

export default App;
