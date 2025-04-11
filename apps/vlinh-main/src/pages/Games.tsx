import React from "react";
import { useTranslation } from "react-i18next";
import { openWindow } from '../utils/path';

const Games: React.FC = () => {
  const { t } = useTranslation();

  const games = [
    {
      id: "hanzi-match-2d",
      title: t("games.hanziMatch2D.title"),
      description: t("games.hanziMatch2D.description"),
      path: "/games/hanzi-match-2d",
    },
    {
      id: "hanzi-match-3d",
      title: t("games.hanziMatch3D.title"),
      description: t("games.hanziMatch3D.description"),
      path: "/games/hanzi-match-3d",
    },
  ];

  const handleGameClick = (gameId: string) => {
    openWindow(`/games/${gameId}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("games.title")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => handleGameClick(game.id)}
            className="cursor-pointer p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{game.title}</h2>
            <p className="text-gray-600">{game.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Games;
