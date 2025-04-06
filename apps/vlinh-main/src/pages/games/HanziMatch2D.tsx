import React from "react";
import ChineseCharacterGame2D from "../../components/games/ChineseCharacterGame2D";

const HanziMatch2D: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">汉字匹配游戏</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <ChineseCharacterGame2D />
      </div>
    </div>
  );
};

export default HanziMatch2D;
