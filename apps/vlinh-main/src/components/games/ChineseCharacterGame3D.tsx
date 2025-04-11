import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { gameTexts } from "../../config/gameTexts";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface TextBlock {
  id: number;
  char: string;
  mesh: THREE.Group;
  boxMesh: THREE.Mesh;
  borderMesh: THREE.Mesh;
  originalPosition: THREE.Vector3;
  originalRotation: THREE.Euler;
}

const ChineseCharacterGame3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const textBlocksRef = useRef<TextBlock[]>([]);
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // 初始化场景
    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    // 初始化正交相机
    const aspect =
      canvasRef.current.clientWidth / canvasRef.current.clientHeight;
    const camera = new THREE.OrthographicCamera(
      -aspect * 20,
      aspect * 20,
      25,
      -20,
      0.1,
      1000
    );
    camera.position.z = 20;
    cameraRef.current = camera;

    // 添加轨道控制器
    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 2;
    controlsRef.current = controls;

    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(
      canvasRef.current.clientWidth,
      canvasRef.current.clientHeight
    );
    rendererRef.current = renderer;

    // 添加灯光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const textBlocks: TextBlock[] = [];
    const gridSize = 5; // 5x5 网格
    const blockSize = 4; // 方块大小
    const spacing = blockSize * 1.2; // 方块之间的间距

    // 创建文字几何体
    const loader = new FontLoader();
    loader.load("/fonts/ZhouZiSongTi_Regular.json", (font) => {
      // 创建文字框区域的容器
      const containerWidth = gridSize * spacing;
      const containerHeight = gridSize * spacing;
      const containerGeometry = new THREE.BoxGeometry(
        containerWidth,
        containerHeight,
        0.1
      );
      const containerMaterial = new THREE.MeshPhongMaterial({
        color: 0xf0f0f0, // 浅灰色
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
      });
      const containerMesh = new THREE.Mesh(
        containerGeometry,
        containerMaterial
      );
      containerMesh.position.set(0, 0, -0.3); // 居中显示
      scene.add(containerMesh);

      gameTexts.forEach((text, index) => {
        // 计算网格位置
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;

        // 计算实际位置，考虑容器范围
        const startX = -containerWidth / 2 + spacing / 2; // 从容器左侧开始
        const startY = containerHeight / 2 - spacing / 2; // 从容器顶部开始
        const position = {
          x: startX + col * spacing,
          y: startY - row * spacing,
        };

        // 创建文字几何体
        const textGeometry = new TextGeometry(text.char, {
          font: font,
          size: 1.0,
          depth: 0.2,
          curveSegments: 16,
          bevelEnabled: true,
          bevelThickness: 0.08,
          bevelSize: 0.04,
          bevelSegments: 3,
        });

        // 计算文本中心偏移
        textGeometry.computeBoundingBox();
        const textWidth =
          textGeometry.boundingBox!.max.x - textGeometry.boundingBox!.min.x;
        const textHeight =
          textGeometry.boundingBox!.max.y - textGeometry.boundingBox!.min.y;
        const centerOffsetX = -textWidth / 2;
        const centerOffsetY =
          -textHeight / 2 +
          (textGeometry.boundingBox!.max.y - textGeometry.boundingBox!.min.y) *
            0.2;

        // 创建文字材质
        const textMaterial = new THREE.MeshPhongMaterial({
          color: 0x000000,
          specular: 0x666666,
          shininess: 80,
          emissive: 0x333333,
        });

        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.x = centerOffsetX;
        textMesh.position.y = centerOffsetY;
        textMesh.position.z = 0.6;

        // 创建背景方块
        const boxSize = 3.125;
        const boxGeometry = new THREE.BoxGeometry(boxSize, boxSize, 0.3);
        const boxMaterial = new THREE.MeshPhongMaterial({
          color: 0xf0e6d2,
          specular: 0x888888,
          shininess: 30,
          emissive: 0x000000,
          flatShading: true,
        });

        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        boxMesh.position.z = 0.1;

        // 创建边框
        const borderSize = boxSize + 0.1;
        const borderGeometry = new THREE.BoxGeometry(
          borderSize,
          borderSize,
          0.35
        );
        const borderMaterial = new THREE.MeshPhongMaterial({
          color: 0x8b7355,
          specular: 0x444444,
          shininess: 20,
          flatShading: true,
        });

        const borderMesh = new THREE.Mesh(borderGeometry, borderMaterial);
        borderMesh.position.z = 0.05;

        // 添加凹凸贴图效果
        const noiseTexture = new THREE.TextureLoader().load(
          "/textures/noise.png"
        );
        noiseTexture.wrapS = THREE.RepeatWrapping;
        noiseTexture.wrapT = THREE.RepeatWrapping;
        noiseTexture.repeat.set(2, 2);
        boxMaterial.bumpMap = noiseTexture;
        boxMaterial.bumpScale = 0.1;

        // 创建组
        const group = new THREE.Group();
        group.add(borderMesh);
        group.add(boxMesh);
        group.add(textMesh);

        // 设置渲染顺序
        textMesh.renderOrder = 3;
        boxMesh.renderOrder = 2;
        borderMesh.renderOrder = 1;

        // 设置位置
        group.position.x = position.x;
        group.position.y = position.y;
        group.position.z = 0;

        // 添加随机旋转
        group.rotation.x = (Math.random() - 0.5) * 0.2;
        group.rotation.y = (Math.random() - 0.5) * 0.2;

        // 添加阴影效果
        boxMesh.castShadow = true;
        boxMesh.receiveShadow = true;
        borderMesh.castShadow = true;
        borderMesh.receiveShadow = true;

        scene.add(group);

        textBlocks.push({
          id: text.id,
          char: text.char,
          mesh: group,
          boxMesh: boxMesh,
          borderMesh: borderMesh,
          originalPosition: group.position.clone(),
          originalRotation: group.rotation.clone(),
        });
      });

      textBlocksRef.current = textBlocks;
    });

    // 动画循环
    const animate = () => {
      if (!renderer || !scene || !camera) return;
      requestAnimationFrame(animate);

      // 更新控制器
      if (controlsRef.current) {
        controlsRef.current.update();
      }

      renderer.render(scene, camera);
    };
    animate();

    // 处理窗口大小变化
    const handleResize = () => {
      if (!canvasRef.current || !camera || !renderer) return;

      const aspect =
        canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      camera.left = -aspect * 20;
      camera.right = aspect * 20;
      camera.top = 25;
      camera.bottom = -20;
      camera.updateProjectionMatrix();

      // 更新底部槽容器的位置
      const slotContainer = camera.children[0] as THREE.Mesh;
      if (slotContainer) {
        slotContainer.position.x = aspect * 15; // 调整x位置
      }

      renderer.setSize(
        canvasRef.current.clientWidth,
        canvasRef.current.clientHeight
      );
    };

    window.addEventListener("resize", handleResize);

    // 清理函数
    return () => {
      if (renderer) {
        renderer.dispose();
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      if (canvasRef.current) {
        canvasRef.current.removeEventListener("click", handleClick);
      }
      window.removeEventListener("resize", handleResize);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, []);

  const handleClick = (event: MouseEvent) => {
    if (!canvasRef.current || !cameraRef.current || !sceneRef.current) return;

    // 计算鼠标在画布上的相对位置
    const rect = canvasRef.current.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, cameraRef.current);
    const intersects = raycaster.intersectObjects(
      sceneRef.current.children || []
    );

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      const clickedGroup = clickedObject.parent;

      if (clickedGroup instanceof THREE.Group) {
        const clickedBlock = textBlocksRef.current.find(
          (block) => block.mesh === clickedGroup
        );

        if (clickedBlock) {
          // 打印点击的文字
          console.log("Clicked character:", clickedBlock.char);

          // 记录原始旋转角度
          const originalRotation = clickedBlock.mesh.rotation.x;
          const duration = 800; // 动画持续时间
          const startTime = Date.now();

          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // 使用正弦函数实现平滑的来回翻转
            const angle = Math.sin(progress * Math.PI) * Math.PI;
            clickedBlock.mesh.rotation.x = originalRotation + angle;

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              // 确保最终回到原始角度
              clickedBlock.mesh.rotation.x = originalRotation;
            }
          };

          animate();
        }
      }
    }
  };

  // 添加点击事件监听器
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.addEventListener("click", handleClick);
      return () => {
        canvasRef.current?.removeEventListener("click", handleClick);
      };
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default ChineseCharacterGame3D;
