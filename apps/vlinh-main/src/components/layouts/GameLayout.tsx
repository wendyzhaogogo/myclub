import React from "react";

interface GameLayoutProps {
  children: React.ReactNode;
}

const GameLayout: React.FC<GameLayoutProps> = ({ children }) => {
  return <div className="relative w-screen h-screen">{children}</div>;
};

export default GameLayout;
