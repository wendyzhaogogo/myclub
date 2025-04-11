import React from "react";
import { useParams } from "react-router-dom";
import ChineseCharacterGame2D from "../../components/games/ChineseCharacterGame2D";
import { phraseListTable } from "../../config/gameTexts";

const HanziMatch2D: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const gameId = parseInt(id || "0");
  const phrases =
    phraseListTable.find((item) => item.id === gameId)?.list ||
    phraseListTable[0].list;

  return <ChineseCharacterGame2D phrases={phrases} />;
};

export default HanziMatch2D;
