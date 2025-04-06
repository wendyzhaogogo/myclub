import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ChineseCharacterGame3D from "../../components/games/ChineseCharacterGame3D";
interface Card {
  id: number;
  character: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const HanziMatch3D: React.FC = () => {
  return <ChineseCharacterGame3D />;
};

export default HanziMatch3D;
