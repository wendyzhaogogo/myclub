import React, { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { DropShadowFilter } from '@pixi/filter-drop-shadow';
import { gameTexts } from "../../config/gameTexts";

interface TextBlock {
  id: number;
  char: string;
  x: number;
  y: number;
  width: number;
  height: number;
  originalX: number;
  originalY: number;
  isInSlot: boolean;
  slotIndex?: number;
  container: PIXI.Container;
}

interface Slot {
  x: number;
  y: number;
  width: number;
  height: number;
  occupied: boolean;
  char?: string;
  container: PIXI.Container;
}

interface GameState {
  textBlocks: TextBlock[];
  slots: Slot[];
  dimensions: {
    width: number;
    height: number;
    margin: number;
    blockSize: number;
    spacing: number;
  };
}

const ChineseCharacterGame2D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);

  // Initialize PixiJS application
  useEffect(() => {
    if (!containerRef.current) return;

    const app = new PIXI.Application();
    app.init({
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      background: 0xffffff,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      resizeTo: containerRef.current,
    }).then(() => {
      if (!containerRef.current) return;

      appRef.current = app;
      containerRef.current.appendChild(app.canvas);

      // Initialize game state after app is ready
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      setGameState(initializeGameState(width, height));

      // 添加调试信息
      console.log('PixiJS Application initialized:', {
        width: app.screen.width,
        height: app.screen.height,
        resolution: app.renderer.resolution
      });
    });

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true, true);
        appRef.current = null;
      }
    };
  }, []);

  // Render game elements
  useEffect(() => {
    if (!gameState || !appRef.current) return;

    const app = appRef.current;
    app.stage.removeChildren();

    // 添加调试信息
    console.log('Rendering game elements:', {
      stageWidth: app.screen.width,
      stageHeight: app.screen.height,
      textBlocks: gameState.textBlocks.length,
      slots: gameState.slots.length
    });

    // Create text blocks
    gameState.textBlocks.forEach(block => {
      const container = block.container;
      app.stage.addChild(container);

      // Create block background
      const background = new PIXI.Graphics();
      background.fill(0xf8f8f8);
      background.roundRect(0, 0, block.width, block.height, 8);
      background.fill();
      container.addChild(background);

      // Add highlight
      const highlight = new PIXI.Graphics();
      highlight.stroke({ width: 1, color: 0x000000, alpha: 1 });
      highlight.roundRect(2, 2, block.width - 4, block.height - 4, 6);
      container.addChild(highlight);

      // Add text
      const text = new PIXI.BitmapText({
        text: block.char,
        style: {
          fontFamily: 'Arial',
          fontSize: block.width * 0.4,
          fill: 0x000000,
          align: 'center',
        }
      });
      text.anchor.set(0.5);
      text.x = block.width / 2;
      text.y = block.height / 2;
      container.addChild(text);

      // 添加调试信息
      console.log('Block:', {
        char: block.char,
        x: block.x,
        y: block.y,
        width: block.width,
        height: block.height,
        textX: text.x,
        textY: text.y,
        containerX: container.x,
        containerY: container.y
      });

      // Add shadow filter
      const shadowFilter = new DropShadowFilter({
        distance: 2,
        blur: 3,
        alpha: 0.2,
        color: new PIXI.Color(0x000000).toNumber(),
      }) as unknown as PIXI.Filter;
      container.filters = [shadowFilter];

      // Make interactive
      container.interactive = true;
      container.cursor = 'pointer';
      container.on('pointerdown', () => handleBlockClick(block.id));

      // Position container
      container.x = block.x;
      container.y = block.y;
    });

    // Create slots
    gameState.slots.forEach(slot => {
      const container = slot.container;
      app.stage.addChild(container);

      // Create slot background
      const background = new PIXI.Graphics();
      background.fill(0xf0f0f0);
      background.stroke({ width: 2, color: 0x999999 });
      background.roundRect(0, 0, slot.width, slot.height, 8);
      background.fill();
      container.addChild(background);

      // Position container
      container.x = slot.x;
      container.y = slot.y;
    });
  }, [gameState]);

  // Update game state when window resizes
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !appRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      setGameState(initializeGameState(width, height));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize game state
  const initializeGameState = (width: number, height: number): GameState => {
    const margin = 20;
    const bottomAreaHeight = height * 0.2;
    const topAreaHeight = height - bottomAreaHeight - margin * 2;
    const maxBlockWidth = (width - margin * 2 - 4 * 20) / 5;
    const maxBlockHeight = (topAreaHeight - 4 * 20) / 5;
    const blockSize = Math.min(maxBlockWidth, maxBlockHeight) / 2;
    const spacing = 20;

    // Calculate positions for text blocks
    const textBlocks = gameTexts.map((text, index) => {
      const row = Math.floor(index / 5);
      const col = index % 5;
      const startX = (width - (5 * blockSize + 4 * spacing)) / 2;
      const startY = 0;
      return {
        id: text.id,
        char: text.char,
        x: startX + col * (blockSize + spacing),
        y: startY + row * (blockSize + spacing),
        width: blockSize,
        height: blockSize,
        originalX: startX + col * (blockSize + spacing),
        originalY: startY + row * (blockSize + spacing),
        isInSlot: false,
        container: new PIXI.Container(),
      };
    });

    // Calculate positions for slots
    const slotWidth = blockSize;
    const slotHeight = blockSize;
    const slotSpacing = 20;
    const slotStartX = margin;
    const slotStartY = height - bottomAreaHeight - margin;

    const slots = Array(5).fill(0).map((_, i) => ({
      x: slotStartX + i * (slotWidth + slotSpacing),
      y: slotStartY,
      width: slotWidth,
      height: slotHeight,
      occupied: false,
      container: new PIXI.Container(),
    }));

    return {
      textBlocks,
      slots,
      dimensions: {
        width,
        height,
        margin,
        blockSize,
        spacing,
      },
    };
  };

  const handleBlockClick = (blockId: number) => {
    if (!gameState || !appRef.current) return;

    const block = gameState.textBlocks.find(b => b.id === blockId);
    if (!block) return;

    if (block.isInSlot) {
      // Return block to original position
      const updatedBlocks = gameState.textBlocks.map(b =>
        b.id === blockId
          ? { ...b, x: b.originalX, y: b.originalY, isInSlot: false, slotIndex: undefined }
          : b
      );

      // Clear slot
      const updatedSlots = gameState.slots.map((slot, index) =>
        index === block.slotIndex ? { ...slot, occupied: false, char: undefined } : slot
      );

      // Animate return
      const container = block.container;
      const targetX = block.originalX;
      const targetY = block.originalY;
      const startX = container.x;
      const startY = container.y;

      const ticker = new PIXI.Ticker();
      let progress = 0;
      const duration = 30; // frames

      ticker.add(() => {
        progress++;
        const t = progress / duration;
        const easeT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOutQuad

        container.x = startX + (targetX - startX) * easeT;
        container.y = startY + (targetY - startY) * easeT;

        if (progress >= duration) {
          ticker.destroy();
          setGameState({
            ...gameState,
            textBlocks: updatedBlocks,
            slots: updatedSlots,
          });
        }
      });
      ticker.start();
    } else {
      // Find first available slot
      const availableSlotIndex = gameState.slots.findIndex(slot => !slot.occupied);
      if (availableSlotIndex === -1) return;

      const slot = gameState.slots[availableSlotIndex];
      
      // Move block to slot
      const updatedBlocks = gameState.textBlocks.map(b =>
        b.id === blockId
          ? { ...b, x: slot.x, y: slot.y, isInSlot: true, slotIndex: availableSlotIndex }
          : b
      );

      // Update slot
      const updatedSlots = gameState.slots.map((s, index) =>
        index === availableSlotIndex ? { ...s, occupied: true, char: block.char } : s
      );

      // Create explosion effect
      const explosion = new PIXI.Container();
      appRef.current.stage.addChild(explosion);
      explosion.x = block.container.x;
      explosion.y = block.container.y;

      // Explosion background
      const explosionBg = new PIXI.Graphics();
      explosionBg.fill(0xff6b6b);
      explosionBg.roundRect(-block.width/2, -block.height/2, block.width, block.height, 8);
      explosionBg.fill();
      explosion.addChild(explosionBg);

      // Explosion text
      const explosionText = new PIXI.BitmapText({
        text: block.char,
        style: {
          fontFamily: 'ZhouZiSongTi',
          fontSize: block.width * 0.4,
          fill: 0xff6b6b,
          align: 'center',
        }
      });
      explosionText.anchor.set(0.5);
      explosion.addChild(explosionText);

      // Animate explosion
      const explosionTicker = new PIXI.Ticker();
      let scale = 1;
      let alpha = 0;

      explosionTicker.add(() => {
        scale += 0.02;
        alpha += 0.05;
        if (alpha > 1) alpha = 1;
        
        explosion.scale.set(scale);
        explosion.alpha = alpha;

        if (scale >= 1.5) {
          explosionTicker.destroy();
          explosion.destroy();

          // Animate movement to slot
          const container = block.container;
          const targetX = slot.x;
          const targetY = slot.y;
          const startX = container.x;
          const startY = container.y;

          const moveTicker = new PIXI.Ticker();
          let progress = 0;
          const duration = 30; // frames

          moveTicker.add(() => {
            progress++;
            const t = progress / duration;
            const easeT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOutQuad

            container.x = startX + (targetX - startX) * easeT;
            container.y = startY + (targetY - startY) * easeT;

            if (progress >= duration) {
              moveTicker.destroy();
              setGameState({
                ...gameState,
                textBlocks: updatedBlocks,
                slots: updatedSlots,
              });
            }
          });
          moveTicker.start();
        }
      });
      explosionTicker.start();
    }
  };

  return (
    <div className="relative w-full h-full p-[20px] box-border">
      <div 
        ref={containerRef} 
        className="relative w-full h-full overflow-hidden bg-gray-100"
        style={{ minHeight: '500px' }}
      />
    </div>
  );
};

export default ChineseCharacterGame2D;
