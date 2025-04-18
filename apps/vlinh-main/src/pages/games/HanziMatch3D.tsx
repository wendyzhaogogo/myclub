import React from "react";
import ChineseCharacterGame3D from "../../components/games/ChineseCharacterGame3D";
import { gameTexts } from "../../config/gameTexts";
const HanziMatch3D: React.FC = () => {
  return <ChineseCharacterGame3D gameTexts={gameTexts} />;
};

export default HanziMatch3D;
