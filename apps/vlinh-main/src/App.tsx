import React from 'react';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import NavbarLayout from "./components/layouts/NavbarLayout";
import GameLayout from "./components/layouts/GameLayout";
import Home from "./pages/Home";
import Resources from "./pages/Resources";
import MyResources from "./pages/MyResources";
import Games from "./pages/Games";
import HanziMatch2D from "./pages/games/HanziMatch2D";
import HanziMatch2DList from "./pages/games/HanziMatch2DList";
import HanziMatch3D from "./pages/games/HanziMatch3D";
import PhrasesLearning from './pages/PhrasesLearning';
import { getBasePath } from './utils/env';

const App: React.FC = () => {
  return (
    <Router basename={getBasePath()}>
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
            <NavbarLayout>
              <HanziMatch2DList />
            </NavbarLayout>
          }
        />
        <Route
          path="/games/hanzi-match-2d/:id"
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
        <Route path="/phrases-learning/:id" element={<PhrasesLearning />} />
      </Routes>
    </Router>
  );
};

export default App;
