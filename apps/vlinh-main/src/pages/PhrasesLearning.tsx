import { phraseListTable } from "../config/gameTexts";
import React from "react";
import { useParams } from "react-router-dom";

const PhrasesLearning: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Get the word library based on ID
  const gameIdNum = parseInt(id || "1");
  const phraseList = phraseListTable.find(item => item.id === gameIdNum)?.list || phraseListTable[0].list;

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="mb-12 text-4xl font-bold text-center text-indigo-800">
          学习词组 - Level {gameIdNum}
        </h1>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {phraseList.map((item) => (
            <div
              key={item.phrase}
              className="p-6 transition-all duration-300 transform bg-white shadow-lg rounded-xl hover:shadow-xl hover:-translate-y-1"
            >
              <div className="mb-4 text-3xl font-bold text-center text-indigo-900">
                {item.phrase}
              </div>
              <div className="mb-4 text-xl text-center text-gray-600">
                {item.pinyin}
              </div>
              <div className="py-2 text-xl font-semibold text-center text-indigo-600 rounded-lg bg-indigo-50">
                {item.vietnamese}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhrasesLearning;
