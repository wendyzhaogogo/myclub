import React from "react";
import { useParams } from "react-router-dom";
import ChineseCharacterGame2D from "../../components/games/ChineseCharacterGame2D";
import { phraseListTable } from "../../config/gameTexts";

const HanziMatch2D: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const gameId = parseInt(id || "0");
  const meta =
    phraseListTable.find((item) => item.id === gameId) || phraseListTable[0];

  return <ChineseCharacterGame2D phraseListTableMeta={meta} />;
};

export default HanziMatch2D;
