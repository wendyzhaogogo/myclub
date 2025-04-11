import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { openWindow } from '../utils/env';
import gamePreview from '../assets/images/hanzi-match-3d-preview.svg';

const Games: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const games = [
    {
      id: "hanzi-match-2d",
      title: t("games.hanziMatch2D.title"),
      description: t("games.hanziMatch2D.description"),
      path: "/games/hanzi-match-2d",
      image: gamePreview
    },
    {
      id: "hanzi-match-3d",
      title: t("games.hanziMatch3D.title"),
      description: t("games.hanziMatch3D.description"),
      path: "/games/hanzi-match-3d",
      image: gamePreview
    },
  ];

  const handleGameClick = (gameId: string) => {
    if (gameId === "hanzi-match-2d") {
      navigate("/games/hanzi-match-2d");
    } else {
      openWindow(`/games/${gameId}`);
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">{t("games.title")}</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => handleGameClick(game.id)}
            className="p-6 transition-shadow bg-white rounded-lg shadow-lg cursor-pointer hover:shadow-xl"
          >
            <div className="mb-4 overflow-hidden rounded-lg">
              <img 
                src={game.image} 
                alt={game.title}
                className="object-cover w-full h-48 transition-transform duration-300 hover:scale-105"
              />
            </div>
            <h2 className="mb-2 text-xl font-semibold">{game.title}</h2>
            <p className="text-gray-600">{game.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Games;
