import React from "react";
import { openWindow } from "../../utils/env";
import { phraseListTable } from "../../config/gameTexts";
import { useTranslation } from "react-i18next";

const HanziMatch2DList: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">{t("games.hanziMatch2D.title")}</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {phraseListTable.map((item) => (
          <div
            key={item.id}
            onClick={() => openWindow(`/games/hanzi-match-2d/${item.id}`)}
            className="p-6 transition-shadow bg-white rounded-lg shadow-lg cursor-pointer hover:shadow-xl"
          >
            <h2 className="mb-2 text-xl font-semibold">
              {t("games.hanziMatch2D.vocabularySet", { name: item.name })}
            </h2>
            <p className="text-gray-600">
              {t("games.hanziMatch2D.vocabularyCount", { count: item.list.length })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HanziMatch2DList; 