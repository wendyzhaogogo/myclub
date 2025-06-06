import React, { useEffect, useState, useRef } from "react";
import * as PIXI from "pixi.js";
import { PhraseListTableMeta } from "../../config/gameTexts";
import { openWindow as newOpenWindow } from "../../utils/env";
import { useTranslation } from "react-i18next";

interface TextBlock {
  char: string;
  id: number;
}

interface ChineseCharacterGame2DProps {
  phraseListTableMeta: PhraseListTableMeta;
}

class ChineseCharacterGame {
  private app: PIXI.Application;
  private container: HTMLDivElement;
  private blockSize: number = 0;
  private spacing: number = 0;
  private startX: number = 0;
  private startY: number = 0;
  private readonly MARGIN = 20;
  private readonly SPACING_RATIO = 0.15;
  private readonly SLOT_AREA_HEIGHT_RATIO = 0.2;
  private readonly SLOT_COUNT = 6;
  private slots: PIXI.Container[] = [];
  private textBlocks: PIXI.Container[] = [];
  private columns: number = 0;
  private rows: number = 0;
  private slotContents: (PIXI.Container | null)[] = [];
  private matchedPhrases: string[] = [];
  private phraseListTableMeta: PhraseListTableMeta;
  private gameId: string;
  private t: ReturnType<typeof useTranslation>["t"];

  constructor(
    container: HTMLDivElement,
    phraseListTableMeta: PhraseListTableMeta,
    t: ReturnType<typeof useTranslation>["t"]
  ) {
    this.container = container;
    this.app = new PIXI.Application();
    this.phraseListTableMeta = phraseListTableMeta;
    this.gameId = this.phraseListTableMeta.list[0]?.id.toString() || "1";
    this.t = t;
  }

  private calculateDimensions() {
    // 使用容器的实际尺寸
    const maxWidth = this.container.clientWidth;
    const maxHeight = this.container.clientHeight;

    // 计算底部槽区域的高度
    const slotAreaHeight = Math.floor(maxHeight * this.SLOT_AREA_HEIGHT_RATIO);

    // 计算文本块区域的可用空间（减去边距和底部槽区域）
    const availableWidth = maxWidth - 2 * this.MARGIN;
    const availableHeight = maxHeight - slotAreaHeight - 2 * this.MARGIN;

    // 计算所有字符的总数
    const totalBlocks = this.phraseListTableMeta.list.reduce(
      (sum, phrase) => sum + phrase.phrase.length,
      0
    );

    // 计算最佳的行列数，确保是n×n的正方形
    const squareSize = Math.ceil(Math.sqrt(totalBlocks));
    this.columns = squareSize;
    this.rows = squareSize;

    // 使用较小的边作为基准来计算块大小，防止溢出
    const minDimension = Math.min(availableWidth, availableHeight);
    const maxBlockSize = Math.floor(
      minDimension / (this.columns + (this.columns - 1) * this.SPACING_RATIO)
    );

    // 计算槽的最大可能大小
    const maxSlotWidth = Math.floor(
      (maxWidth - 2 * this.MARGIN) /
        (this.SLOT_COUNT + (this.SLOT_COUNT - 1) * this.SPACING_RATIO)
    );

    // 取较小的值确保是正方形，并且考虑底部槽区域
    this.blockSize = Math.min(maxBlockSize, maxSlotWidth);
    this.spacing = Math.floor(this.blockSize * this.SPACING_RATIO);

    // 计算文本块区域的总宽度和高度（应该是相等的）
    const totalSize =
      this.columns * this.blockSize + (this.columns - 1) * this.spacing;

    // 居中定位文本块区域，确保不会与底部槽区域重叠
    this.startX = Math.floor((maxWidth - totalSize) / 2);
    this.startY = Math.floor((availableHeight - totalSize) / 2);

    return {
      slotAreaHeight,
      maxWidth,
      maxHeight,
    };
  }

  private createSlots(
    slotAreaHeight: number,
    maxWidth: number,
    maxHeight: number
  ) {
    if (!this.app.stage) return;

    this.slots = [];
    this.slotContents = new Array(this.SLOT_COUNT).fill(null);

    // 计算槽的总宽度，确保不会超出容器宽度
    const slotTotalWidth =
      this.SLOT_COUNT * this.blockSize + (this.SLOT_COUNT - 1) * this.spacing;
    const slotStartX = Math.floor((maxWidth - slotTotalWidth) / 2);

    // 计算槽的垂直位置，确保在底部区域内
    const slotY =
      maxHeight -
      slotAreaHeight +
      Math.floor((slotAreaHeight - this.blockSize) / 2);

    for (let i = 0; i < this.SLOT_COUNT; i++) {
      const container = new PIXI.Container();
      this.app.stage.addChild(container);

      const background = new PIXI.Graphics();
      background.fill({ color: 0xf0f0f0 });
      background.stroke({ width: 2, color: 0xcccccc });
      background.roundRect(0, 0, this.blockSize, this.blockSize, 4);
      background.fill();
      container.addChild(background);

      // 设置槽的位置，确保在底部区域内
      container.x = slotStartX + i * (this.blockSize + this.spacing);
      container.y = slotY;

      this.slots.push(container);
    }
  }

  private checkPhraseMatch() {
    if (!this.app.stage) return;

    // 获取当前槽中的所有字符
    const currentPhrase = this.slotContents
      .filter((block): block is PIXI.Container => block !== null)
      .map((block) => {
        const textElement = block.children[2] as PIXI.BitmapText;
        return textElement.text;
      })
      .join("");

    // 检查是否匹配任何词组
    for (const phraseItem of this.phraseListTableMeta.list) {
      const phrase = phraseItem.phrase;
      if (this.matchedPhrases.includes(phrase)) continue; // 跳过已匹配的词组

      const index = currentPhrase.indexOf(phrase);
      if (index !== -1) {
        // 找到匹配的词组，获取匹配的文字块
        const matchedBlocks = this.slotContents
          .slice(index, index + phrase.length)
          .filter((block): block is PIXI.Container => block !== null);

        if (matchedBlocks.length === phrase.length) {
          // 播放消失动画
          this.animatePhraseDisappearance(matchedBlocks);
          this.matchedPhrases.push(phrase);

          // 检查游戏是否结束
          if (
            this.matchedPhrases.length === this.phraseListTableMeta.list.length
          ) {
            this.showCompletionScreen();
          }
          break;
        }
      }
    }
  }

  private animatePhraseDisappearance(matchedBlocks: PIXI.Container[]) {
    // 创建爆炸效果
    matchedBlocks.forEach((block) => {
      this.createExplosionEffect(block);
    });

    // 动画：文字块逐渐消失
    const startTime = performance.now();
    const duration = 500;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      matchedBlocks.forEach((block) => {
        block.alpha = 1 - progress;
        block.scale.set(1 + progress * 0.5);
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // 动画完成后移除文字块
        matchedBlocks.forEach((block) => {
          this.app.stage?.removeChild(block);
        });

        // 更新槽状态，将匹配的块设为 null
        this.slotContents = this.slotContents.map((block) =>
          block && matchedBlocks.includes(block) ? null : block
        );

        // 立即重新排列槽中的文本块
        const newSlotContents: (PIXI.Container | null)[] = [];
        let currentIndex = 0;

        // 将非空的文本块移到前面
        for (let i = 0; i < this.slotContents.length; i++) {
          if (this.slotContents[i]) {
            newSlotContents[currentIndex] = this.slotContents[i];
            currentIndex++;
          }
        }

        // 填充剩余位置为 null
        while (currentIndex < this.slotContents.length) {
          newSlotContents[currentIndex] = null;
          currentIndex++;
        }

        // 更新槽内容和位置
        this.slotContents = newSlotContents;

        // 重新排列所有文本块的位置
        this.slotContents.forEach((block, index) => {
          if (block) {
            const targetSlot = this.slots[index];
            this.animateToSlot(block, targetSlot);
          }
        });
      }
    };

    requestAnimationFrame(animate);
  }

  private animateToSlot(
    block: PIXI.Container,
    slot: PIXI.Container,
    onComplete?: () => void
  ) {
    const startX = block.x;
    const startY = block.y;
    const endX = slot.x;
    const endY = slot.y;
    const duration = 1000;
    const startTime = performance.now();

    // 禁用所有文本块的交互性
    this.textBlocks.forEach((block) => {
      block.interactive = false;
      block.cursor = "default";
    });

    // 将文字块移到最上层
    if (this.app.stage) {
      this.app.stage.removeChild(block);
      this.app.stage.addChild(block);
    }

    // 立即更新槽位状态，防止其他文本块移动到同一个槽位
    const slotIndex = this.slots.indexOf(slot);
    this.slotContents[slotIndex] = block;

    // 标记文本块为已放置状态
    (block as any).isPlaced = true;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 使用弹性缓动函数
      const easeProgress = this.easeOutElastic(progress);

      block.x = startX + (endX - startX) * easeProgress;
      block.y = startY + (endY - startY) * easeProgress;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // 动画完成后，只重新启用未放置的文本块的交互性
        this.textBlocks.forEach((block) => {
          if (!(block as any).isPlaced) {
            block.interactive = true;
            block.cursor = "pointer";
          }
        });

        // 检查是否形成词组
        this.checkPhraseMatch();

        // 调用完成回调
        if (onComplete) {
          onComplete();
        }
      }
    };

    requestAnimationFrame(animate);
  }

  private easeOutElastic(x: number): number {
    const c4 = (2 * Math.PI) / 3;
    return x === 0
      ? 0
      : x === 1
        ? 1
        : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
  }

  private createExplosionEffect(block: PIXI.Container) {
    if (!this.app.stage) return;

    const particles: PIXI.Graphics[] = [];
    const particleCount = 12;
    const particleSize = this.blockSize / 8;
    const colors = [0xffd700, 0xffa500, 0xff4500];

    // 创建粒子
    for (let i = 0; i < particleCount; i++) {
      const particle = new PIXI.Graphics();
      const color = colors[Math.floor(Math.random() * colors.length)];
      particle.fill({ color });
      particle.circle(0, 0, particleSize);
      particle.fill();

      // 设置粒子的初始位置
      particle.x = block.x + this.blockSize / 2;
      particle.y = block.y + this.blockSize / 2;

      // 计算粒子的运动方向
      const angle = (i / particleCount) * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      this.app.stage.addChild(particle);
      particles.push(particle);

      // 动画粒子
      const startTime = performance.now();
      const duration = 500;

      const animateParticle = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // 更新粒子位置
        particle.x += vx;
        particle.y += vy;

        // 更新粒子大小和透明度
        const scale = 1 - progress;
        particle.scale.set(scale);
        particle.alpha = 1 - progress;

        if (progress < 1) {
          requestAnimationFrame(animateParticle);
        } else {
          this.app.stage?.removeChild(particle);
        }
      };

      requestAnimationFrame(animateParticle);
    }
  }

  private createTextBlocks() {
    if (!this.app.stage) {
      console.error("Stage not initialized");
      return;
    }

    this.textBlocks = [];

    const gameTextsInBlocks: TextBlock[] = this.phraseListTableMeta.list
      .map((item) => item.phrase.split(""))
      .flat()
      .map((char, index) => ({
        char,
        id: index,
      }));

    // 打乱文本块顺序
    const shuffledTexts = [...gameTextsInBlocks];
    for (let i = shuffledTexts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledTexts[i], shuffledTexts[j]] = [
        shuffledTexts[j],
        shuffledTexts[i],
      ];
    }

    // 创建一个包含所有可能位置的数组
    const totalPositions = this.columns * this.rows;
    const positions = Array.from({ length: totalPositions }, (_, i) => i);

    // 随机选择要留空的位置
    const emptyPositions = new Set<number>();
    while (emptyPositions.size < totalPositions - shuffledTexts.length) {
      const randomIndex = Math.floor(Math.random() * positions.length);
      emptyPositions.add(positions[randomIndex]);
      positions.splice(randomIndex, 1);
    }

    // 创建文本块，跳过留空的位置
    let textIndex = 0;
    for (let i = 0; i < totalPositions; i++) {
      if (emptyPositions.has(i)) {
        continue; // 跳过留空的位置
      }

      const row = Math.floor(i / this.columns);
      const col = i % this.columns;
      const text = shuffledTexts[textIndex++];

      const container = new PIXI.Container();
      this.app.stage.addChild(container);

      const background = new PIXI.Graphics();
      background.fill({ color: this.getCardColor(i) });
      background.roundRect(0, 0, this.blockSize, this.blockSize, 4);
      background.fill();
      container.addChild(background);

      const border = new PIXI.Graphics();
      border.stroke({ width: 1, color: 0xffffff, alpha: 0.8 });
      border.roundRect(1, 1, this.blockSize - 2, this.blockSize - 2, 3);
      container.addChild(border);

      // 计算合适的字体大小
      const fontSize = Math.floor(this.blockSize * 0.4);
      const textElement = new PIXI.BitmapText({
        text: text.char,
        style: {
          fontFamily: "Arial",
          fontSize: fontSize,
          fill: 0x000000,
          align: "center",
          fontWeight: "bold",
        },
      });
      textElement.anchor.set(0.5);
      textElement.x = this.blockSize / 2;
      textElement.y = this.blockSize / 2;
      container.addChild(textElement);

      container.x = this.startX + col * (this.blockSize + this.spacing);
      container.y = this.startY + row * (this.blockSize + this.spacing);

      // 初始化文本块为未放置状态
      (container as any).isPlaced = false;
      container.interactive = true;
      container.cursor = "pointer";

      container.on("pointerdown", () => {
        // 如果文本块已经放置，则忽略点击
        if ((container as any).isPlaced) {
          return;
        }

        // 找到第一个空槽的位置
        const emptySlotIndex = this.slotContents.findIndex(
          (slot) => slot === null
        );
        if (emptySlotIndex !== -1) {
          const targetSlot = this.slots[emptySlotIndex];
          this.animateToSlot(container, targetSlot);
        }
      });

      this.textBlocks.push(container);
    }
  }

  private async showCompletionScreen() {
    if (!this.app.stage) return;

    // 创建半透明背景
    const background = new PIXI.Graphics();
    background.fill({ color: 0x000000, alpha: 0.7 });
    background.rect(
      0,
      0,
      this.container.clientWidth,
      this.container.clientHeight
    );
    background.fill();
    this.app.stage.addChild(background);

    try {
      // 加载大拇指图标
      const thumbsUpTexture = await PIXI.Assets.load(
        "https://cdn-icons-png.flaticon.com/512/2583/2583344.png"
      );
      const thumbsUp = PIXI.Sprite.from(thumbsUpTexture);
      thumbsUp.anchor.set(0.5);
      thumbsUp.scale.set(0.5); // 调整大小
      thumbsUp.x = this.container.clientWidth / 2;
      thumbsUp.y = this.container.clientHeight / 3;
      this.app.stage.addChild(thumbsUp);

      // 添加一些动画效果
      const startTime = performance.now();
      const animate = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.sin(elapsed / 500) * 0.1; // 轻微的上下浮动
        thumbsUp.scale.set(0.5 + progress);
      };
      this.app.ticker.add(animate);
    } catch (error) {
      console.error("Failed to load thumbs up image:", error);
    }

    // 创建恭喜文字
    const congratsText = new PIXI.BitmapText({
      text: this.t("games.hanziMatch2D.congratulations", {
        name: this.phraseListTableMeta.name,
      }),
      style: {
        fontFamily: "Arial",
        fontSize: 48,
        fill: 0xffffff,
        align: "center",
        fontWeight: "bold",
      },
    });
    congratsText.anchor.set(0.5);
    congratsText.x = this.container.clientWidth / 2;
    congratsText.y = this.container.clientHeight / 2;
    this.app.stage.addChild(congratsText);

    // 创建学习按钮
    const button = new PIXI.Container();
    const buttonBackground = new PIXI.Graphics();
    buttonBackground.fill({ color: 0x4caf50 });
    buttonBackground.roundRect(0, 0, 250, 50, 10);
    buttonBackground.fill();
    button.addChild(buttonBackground);

    const buttonText = new PIXI.BitmapText({
      text: this.t("games.hanziMatch2D.learnWords"),
      style: {
        fontFamily: "Arial",
        fontSize: 20,
        fill: 0xffffff,
        align: "center",
      },
    });
    buttonText.anchor.set(0.5);
    buttonText.x = 125;
    buttonText.y = 25;
    button.addChild(buttonText);

    button.x = (this.container.clientWidth - 250) / 2;
    button.y = (this.container.clientHeight * 2) / 3;
    button.interactive = true;
    button.cursor = "pointer";

    button.on("pointerdown", () => {
      newOpenWindow(`/phrases-learning/${this.gameId}`);
    });

    this.app.stage.addChild(button);
  }

  // @ts-ignore - resetGame is used in handleResize
  private resetGame() {
    if (!this.app.stage) return;

    // 清除所有元素
    this.app.stage.removeChildren();

    // 重置游戏状态
    this.matchedPhrases = [];
    this.slotContents = new Array(this.SLOT_COUNT).fill(null);

    // 重新创建游戏元素
    const { slotAreaHeight, maxWidth, maxHeight } = this.calculateDimensions();
    this.createTextBlocks();
    this.createSlots(slotAreaHeight, maxWidth, maxHeight);
  }

  async init() {
    try {
      await this.app.init({
        width: this.container.clientWidth,
        height: this.container.clientHeight,
        background: 0xffffff,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        resizeTo: this.container,
      });

      await new Promise((resolve) => requestAnimationFrame(resolve));

      if (!this.app.canvas) {
        throw new Error("Failed to initialize PIXI canvas");
      }

      Object.assign(this.app.canvas.style, {
        width: "100%",
        height: "100%",
        display: "block",
      });

      this.container.appendChild(this.app.canvas);

      if (!this.app.stage) {
        throw new Error("Failed to initialize PIXI stage");
      }

      const { slotAreaHeight, maxWidth, maxHeight } =
        this.calculateDimensions();
      this.createTextBlocks();
      this.createSlots(slotAreaHeight, maxWidth, maxHeight);

      const resizeObserver = new ResizeObserver(() => {
        this.handleResize();
      });
      resizeObserver.observe(this.container);

      (this as any).resizeObserver = resizeObserver;
    } catch (error) {
      console.error("Failed to initialize game:", error);
    }
  }

  private handleResize = () => {
    if (!this.app || !this.container) return;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.app.renderer.resize(width, height);
    const { slotAreaHeight, maxWidth, maxHeight } = this.calculateDimensions();

    if (this.app.stage) {
      this.app.stage.removeChildren();
    }

    // 重置游戏状态
    this.matchedPhrases = [];
    this.slotContents = new Array(this.SLOT_COUNT).fill(null);

    // 重新创建游戏元素
    this.createTextBlocks();
    this.createSlots(slotAreaHeight, maxWidth, maxHeight);
  };

  private getCardColor(index: number): number {
    const colors = [
      0xffd700, // 黄色
      0x90ee90, // 绿色
      0x87ceeb, // 蓝色
      0x9370db, // 紫色
      0x778899, // 灰色
      0xffb6c1, // 粉色
      0xdeb887, // 棕色
      0x32cd32, // 深绿色
      0x87cefa, // 浅蓝色
      0xd3d3d3, // 浅灰色
      0x98fb98, // 浅绿色
      0xffe4e1, // 浅粉色
    ];
    return colors[index % colors.length];
  }

  destroy() {
    if (this.app) {
      if ((this as any).resizeObserver) {
        (this as any).resizeObserver.disconnect();
      }
      this.app?.stage?.destroy(true);
    }
  }
}

const ChineseCharacterGame2D: React.FC<ChineseCharacterGame2DProps> = ({
  phraseListTableMeta,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let game: ChineseCharacterGame | null = null;

    const initGame = async () => {
      try {
        setIsLoading(true);
        game = new ChineseCharacterGame(container, phraseListTableMeta, t);
        await game.init();
      } catch (error) {
        console.error("Failed to initialize game:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initGame();

    return () => {
      if (game) {
        game.destroy();
        game = null;
      }
    };
  }, [phraseListTableMeta, t]);

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0" ref={containerRef} />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
            <p className="text-gray-600">{t("games.hanziMatch2D.loading")}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChineseCharacterGame2D;
