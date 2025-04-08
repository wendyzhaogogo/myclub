import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
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
}

interface Slot {
  x: number;
  y: number;
  width: number;
  height: number;
  occupied: boolean;
  char?: string;
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

/**
 * 汉字游戏2D
 * 一个交互式的2D汉字学习游戏
 *
 * 中文说明：
 * 通过2D技术展示汉字，提供交互式学习体验，
 * 支持拖拽和点击操作，让汉字学习更加生动有趣。
 *
 * English Description:
 * A 2D Chinese character learning game that provides an interactive experience.
 * Features drag-and-drop and click interactions,
 * making Chinese character learning more engaging and fun.
 *
 * 日本語の説明：
 * 2D技術を使用した漢字学習ゲーム。
 * ドラッグ＆ドロップとクリック操作をサポートし、
 * インタラクティブな学習体験を提供します。
 *
 * 特点：
 * - 2D文字展示，清晰直观
 * - 拖拽交互，自由移动文字
 * - 点击效果，文字翻转动画
 * - 文字块可放入底部槽位
 * - 流畅的动画效果
 * - 自适应布局，支持不同屏幕尺寸
 */
const ChineseCharacterGame2D: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);

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

  // Update game state when window resizes
  useEffect(() => {
    const handleResize = () => {
      if (!svgRef.current) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      setGameState(initializeGameState(width, height));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle block movement
  const moveBlockToSlot = (blockId: number, slotIndex: number) => {
    setGameState((prev) => {
      if (!prev) return prev;
      const newTextBlocks = [...prev.textBlocks];
      const newSlots = [...prev.slots];
      const block = newTextBlocks.find((b) => b.id === blockId);
      const slot = newSlots[slotIndex];

      if (block && !slot.occupied) {
        // Update block position and state
        block.x = slot.x;
        block.y = slot.y;
        block.isInSlot = true;
        block.slotIndex = slotIndex;
        
        // Update slot state
        slot.occupied = true;
        slot.char = block.char;

        // Animate the movement
        const svg = d3.select(svgRef.current);
        const textBlock = svg.select(`.text-block[data-id="${blockId}"]`);
        const slotElement = svg.select(`.slot:nth-child(${slotIndex + 1})`);
        
        if (!textBlock.empty()) {
          // Create path for movement
          const path = svg.append("path")
            .attr("class", "movement-path")
            .attr("fill", "none")
            .attr("stroke", "#4CAF50")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "5,5")
            .style("opacity", 0);

          // Calculate path with null checks
          const transform = textBlock.attr("transform");
          if (!transform) return prev;
          
          const startXMatch = transform.match(/translate\(([^,]+),/);
          const startYMatch = transform.match(/,([^)]+)\)/);
          
          if (!startXMatch || !startYMatch) return prev;
          
          const startX = Number(startXMatch[1]);
          const startY = Number(startYMatch[1]);
          const endX = slot.x;
          const endY = slot.y;

          // Create curved path with more pronounced curve
          const controlPointY = Math.min(startY, endY) - 150; // Higher control point for more pronounced curve
          const pathData = `M${startX},${startY} Q${(startX + endX) / 2},${controlPointY} ${endX},${endY}`;
          path.attr("d", pathData);

          // Animate path with longer duration
          path
            .transition()
            .duration(500)
            .style("opacity", 0.8)
            .transition()
            .duration(1000)
            .style("opacity", 0)
            .remove();

          // Explosion effect at current position
          const explosionGroup = svg.append("g")
            .attr("class", "explosion-effect")
            .attr("transform", textBlock.attr("transform"));

          // Explosion background
          explosionGroup
            .append("rect")
            .attr("class", "explosion-background")
            .attr("width", block.width)
            .attr("height", block.height)
            .attr("rx", 8)
            .attr("ry", 8)
            .attr("fill", "#ff6b6b")
            .style("opacity", 0)
            .transition()
            .duration(300)
            .attr("width", block.width * 1.5)
            .attr("height", block.height * 1.5)
            .attr("x", -block.width * 0.25)
            .attr("y", -block.height * 0.25)
            .style("opacity", 1)
            .transition()
            .duration(200)
            .style("opacity", 0)
            .remove();

          // Explosion text
          explosionGroup
            .append("text")
            .attr("class", "explosion-text")
            .attr("x", block.width / 2)
            .attr("y", block.height / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("font-size", `${block.width * 0.4}px`)
            .attr("font-family", "ZhouZiSongTi, serif")
            .attr("fill", "#ff6b6b")
            .text(block.char)
            .style("opacity", 0)
            .transition()
            .duration(300)
            .attr("font-size", `${block.width * 0.6}px`)
            .style("opacity", 1)
            .transition()
            .duration(200)
            .style("opacity", 0)
            .remove();

          // Move to slot with bounce effect
          textBlock
            .transition()
            .duration(1000)
            .ease(d3.easeBounceOut)
            .attrTween("transform", function() {
              return function(t) {
                // Calculate position along the path
                const x = d3.interpolateNumber(startX, endX)(t);
                const y = d3.interpolateNumber(startY, endY)(t);
                // Add some vertical offset for the bounce effect
                const bounceOffset = Math.sin(t * Math.PI) * 50;
                return `translate(${x},${y - bounceOffset})`;
              };
            })
            .on("end", () => {
              // Insertion effect
              const insertionGroup = svg.append("g")
                .attr("class", "insertion-effect")
                .attr("transform", `translate(${slot.x}, ${slot.y})`);

              // Create insertion highlight
              insertionGroup
                .append("rect")
                .attr("class", "insertion-highlight")
                .attr("width", block.width)
                .attr("height", block.height)
                .attr("rx", 8)
                .attr("ry", 8)
                .attr("fill", "none")
                .attr("stroke", "#4CAF50")
                .attr("stroke-width", 3)
                .style("opacity", 0)
                .transition()
                .duration(300)
                .style("opacity", 1)
                .transition()
                .duration(300)
                .style("opacity", 0)
                .remove();

              // Create insertion pulse
              insertionGroup
                .append("rect")
                .attr("class", "insertion-pulse")
                .attr("width", block.width)
                .attr("height", block.height)
                .attr("rx", 8)
                .attr("ry", 8)
                .attr("fill", "none")
                .attr("stroke", "#4CAF50")
                .attr("stroke-width", 2)
                .style("opacity", 0)
                .transition()
                .duration(300)
                .attr("width", block.width * 1.2)
                .attr("height", block.height * 1.2)
                .attr("x", -block.width * 0.1)
                .attr("y", -block.height * 0.1)
                .style("opacity", 0.5)
                .transition()
                .duration(300)
                .style("opacity", 0)
                .remove();

              // Update slot text after animation
              slotElement
                .select(".slot-text")
                .text(block.char)
                .style("opacity", 0)
                .transition()
                .duration(300)
                .style("opacity", 1);
            });
        }
      }

      return { ...prev, textBlocks: newTextBlocks, slots: newSlots };
    });
  };

  const returnBlockToOriginal = (blockId: number) => {
    setGameState((prev) => {
      if (!prev) return prev;
      const newTextBlocks = [...prev.textBlocks];
      const newSlots = [...prev.slots];
      const block = newTextBlocks.find((b) => b.id === blockId);

      if (block && block.isInSlot) {
        // Update block position and state
        block.x = block.originalX;
        block.y = block.originalY;
        block.isInSlot = false;
        if (block.slotIndex !== undefined) {
          newSlots[block.slotIndex].occupied = false;
          newSlots[block.slotIndex].char = undefined;
          
          // Clear slot text
          const svg = d3.select(svgRef.current);
          const slotElement = svg.select(`.slot:nth-child(${block.slotIndex + 1})`);
          slotElement
            .select(".slot-text")
            .text("");
        }
        block.slotIndex = undefined;

        // Animate the return
        const svg = d3.select(svgRef.current);
        const textBlock = svg.select(`.text-block[data-id="${blockId}"]`);
        
        if (!textBlock.empty()) {
          textBlock
            .transition()
            .duration(500)
            .attr("transform", `translate(${block.originalX}, ${block.originalY})`);
        }
      }

      return { ...prev, textBlocks: newTextBlocks, slots: newSlots };
    });
  };

  // Render game elements
  useEffect(() => {
    if (!svgRef.current || !gameState) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Create main group
    const g = svg
      .append("g")
      .attr("transform", `translate(${gameState.dimensions.margin}, ${gameState.dimensions.margin})`);

    // Add background with gradient
    const gradient = g.append("defs")
      .append("linearGradient")
      .attr("id", "block-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#f8f8f8");

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#e8e8e8");

    // Add shadow filter
    const filter = g.append("defs")
      .append("filter")
      .attr("id", "block-shadow")
      .attr("x", "-20%")
      .attr("y", "-20%")
      .attr("width", "140%")
      .attr("height", "140%");

    filter.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 3)
      .attr("result", "blur");

    filter.append("feOffset")
      .attr("in", "blur")
      .attr("dx", 2)
      .attr("dy", 2)
      .attr("result", "offsetBlur");

    filter.append("feComposite")
      .attr("in", "SourceGraphic")
      .attr("in2", "offsetBlur")
      .attr("operator", "over");

    // Create text blocks
    const textBlocks = g
      .selectAll(".text-block")
      .data(gameState.textBlocks)
      .enter()
      .append("g")
      .attr("class", "text-block")
      .attr("data-id", (d) => d.id)  // Add data-id for selection
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`);

    // Create block background
    textBlocks
      .append("rect")
      .attr("class", "block-background")
      .attr("width", (d) => d.width)
      .attr("height", (d) => d.height)
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("fill", "url(#block-gradient)")
      .attr("stroke", "#999")
      .attr("stroke-width", 2)
      .style("filter", "url(#block-shadow)");

    // Add inner highlight
    textBlocks
      .append("rect")
      .attr("class", "block-highlight")
      .attr("width", (d) => d.width - 4)
      .attr("height", (d) => d.height - 4)
      .attr("rx", 6)
      .attr("ry", 6)
      .attr("x", 2)
      .attr("y", 2)
      .attr("fill", "none")
      .attr("stroke", "rgba(255,255,255,0.5)")
      .attr("stroke-width", 1);

    // Add text with better styling
    textBlocks
      .append("text")
      .attr("class", "block-text")
      .attr("x", (d) => d.width / 2)
      .attr("y", (d) => d.height / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", (d) => `${d.width * 0.4}px`)
      .attr("font-family", "ZhouZiSongTi, serif")
      .attr("fill", "#333")
      .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.1)")
      .text((d) => d.char);

    // Add hover effect
    textBlocks
      .on("mouseover", function() {
        d3.select(this)
          .select(".block-background")
          .transition()
          .duration(200)
          .attr("fill", "#e0e0e0");
      })
      .on("mouseout", function() {
        d3.select(this)
          .select(".block-background")
          .transition()
          .duration(200)
          .attr("fill", "url(#block-gradient)");
      });

    // Add click handler
    textBlocks.on("click", (event, d) => {
      event.preventDefault();
      event.stopPropagation();

      if (d.isInSlot) {
        returnBlockToOriginal(d.id);
      } else {
        const emptySlotIndex = gameState.slots.findIndex((slot) => !slot.occupied);
        if (emptySlotIndex !== -1) {
          moveBlockToSlot(d.id, emptySlotIndex);
        }
      }
    });

    // Create slots
    const slots = g
      .selectAll(".slot")
      .data(gameState.slots)
      .enter()
      .append("g")
      .attr("class", "slot")
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`);

    // Add slot background
    slots
      .append("rect")
      .attr("class", "slot-background")
      .attr("width", (d) => d.width)
      .attr("height", (d) => d.height)
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("fill", "#f0f0f0")
      .attr("stroke", "#999")
      .attr("stroke-width", 2);

    // Add slot text
    slots
      .append("text")
      .attr("class", "slot-text")
      .attr("x", (d) => d.width / 2)
      .attr("y", (d) => d.height / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", (d) => `${d.width * 0.4}px`)
      .attr("font-family", "ZhouZiSongTi, serif")
      .attr("fill", "#333")
      .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.1)")
      .text((d) => d.char || "");

  }, [gameState]);

  return (
    <div className="relative w-full h-full p-[20px] box-border">
      <div className="relative w-full h-full overflow-hidden">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default ChineseCharacterGame2D;
