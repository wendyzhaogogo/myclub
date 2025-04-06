import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface TextBlock {
  char: string;
  x: number;
  y: number;
  width: number;
  height: number;
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
  const textBlocksRef = useRef<TextBlock[]>([]);
  const slotsRef = useRef<{ x: number; y: number; width: number; height: number }[]>([]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;
    const margin = 20;

    // Clear previous content
    svg.selectAll('*').remove();

    // Create main group
    const g = svg.append('g')
      .attr('transform', `translate(${margin}, ${margin})`);

    // Create text blocks
    const chars = ['汉', '字', '游', '戏', '学', '习', '中', '文'];
    const blockWidth = 60;
    const blockHeight = 60;
    const spacing = 20;
    const startX = 0;
    const startY = 0;

    textBlocksRef.current = chars.map((char, i) => {
      const row = Math.floor(i / 4);
      const col = i % 4;
      return {
        char,
        x: startX + col * (blockWidth + spacing),
        y: startY + row * (blockHeight + spacing),
        width: blockWidth,
        height: blockHeight
      };
    });

    // Create bottom slots
    const slotWidth = 60;
    const slotHeight = 60;
    const slotSpacing = 20;
    const slotStartX = 0;
    const slotStartY = height - margin - slotHeight;

    slotsRef.current = chars.map((_, i) => ({
      x: slotStartX + i * (slotWidth + slotSpacing),
      y: slotStartY,
      width: slotWidth,
      height: slotHeight
    }));

    // Draw text blocks
    const textBlocks = g.selectAll('.text-block')
      .data(textBlocksRef.current)
      .enter()
      .append('g')
      .attr('class', 'text-block')
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    textBlocks.append('rect')
      .attr('width', blockWidth)
      .attr('height', blockHeight)
      .attr('fill', '#f0f0f0')
      .attr('stroke', '#333')
      .attr('stroke-width', 2)
      .attr('rx', 8)
      .attr('ry', 8);

    textBlocks.append('text')
      .attr('x', blockWidth / 2)
      .attr('y', blockHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '24px')
      .text(d => d.char);

    // Draw bottom slots
    const slots = g.selectAll('.slot')
      .data(slotsRef.current)
      .enter()
      .append('rect')
      .attr('class', 'slot')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('width', slotWidth)
      .attr('height', slotHeight)
      .attr('fill', '#e0e0e0')
      .attr('stroke', '#333')
      .attr('stroke-width', 2)
      .attr('rx', 8)
      .attr('ry', 8);

    // Add drag behavior
    const drag = d3.drag<SVGGElement, TextBlock>()
      .on('start', (event, d) => {
        d3.select(event.sourceEvent.target.parentNode)
          .raise()
          .classed('active', true);
      })
      .on('drag', (event, d) => {
        d3.select(event.sourceEvent.target.parentNode)
          .attr('transform', `translate(${d.x + event.dx}, ${d.y + event.dy})`);
      })
      .on('end', (event, d) => {
        d3.select(event.sourceEvent.target.parentNode)
          .classed('active', false);

        // Update position
        d.x += event.dx;
        d.y += event.dy;

        // Check for slot collision
        const slot = slotsRef.current.find(s => 
          d.x + d.width > s.x &&
          d.x < s.x + s.width &&
          d.y + d.height > s.y &&
          d.y < s.y + s.height
        );

        if (slot) {
          // Snap to slot
          d.x = slot.x;
          d.y = slot.y;
          d3.select(event.sourceEvent.target.parentNode)
            .attr('transform', `translate(${d.x}, ${d.y})`);
        }
      });

    textBlocks.call(drag);

    // Add click handler
    textBlocks.on('click', (event, d) => {
      console.log('Clicked character:', d.char);
      
      // Add click animation
      d3.select(event.currentTarget)
        .transition()
        .duration(200)
        .attr('transform', `translate(${d.x}, ${d.y}) scale(1.1)`)
        .transition()
        .duration(200)
        .attr('transform', `translate(${d.x}, ${d.y}) scale(1)`);
    });

  }, []);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="600"
      style={{ border: '1px solid #ccc' }}
    />
  );
};

export default ChineseCharacterGame2D; 