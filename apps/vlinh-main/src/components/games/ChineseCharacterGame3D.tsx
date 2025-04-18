import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GameText } from "../../config/gameTexts";

interface ChineseCharacterGame3DProps {
  gameTexts: GameText[];
}

class ChineseCharacterGame3DManager {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private container: HTMLDivElement;
  private controls: OrbitControls;
  private textBlocks: THREE.Mesh[] = [];
  private gameTexts: GameText[];
  private sphereRadius: number = 5;
  private explodingBlocks: Set<THREE.Mesh> = new Set();

  constructor(container: HTMLDivElement, gameTexts: GameText[]) {
    this.container = container;
    this.gameTexts = gameTexts;

    // 创建场景
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);

    // 创建相机
    this.camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 20);

    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    // 添加轨道控制器
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 15;
    this.controls.maxDistance = 25;
    this.controls.enableZoom = true;
    this.controls.enablePan = false;
    this.controls.target.set(0, 0, 0);
    
    // 设置旋转方式
    this.controls.rotateSpeed = -1.0;
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN
    };
    this.controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN
    };

    // 添加环境光和平行光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 0, 1);
    this.scene.add(directionalLight);

    // 创建半透明球体
    const sphereGeometry = new THREE.SphereGeometry(this.sphereRadius, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    this.scene.add(sphere);

    // 创建球面网格
    this.createSphereGrid();

    // 添加点击事件监听
    this.container.addEventListener('click', this.handleClick.bind(this));
  }

  private createSphereGrid() {
    const totalBlocks = this.gameTexts.length;
    const phi = Math.PI * (3 - Math.sqrt(5)); // 黄金角度

    for (let i = 0; i < totalBlocks; i++) {
      const y = 1 - (i / (totalBlocks - 1)) * 2; // y 从 1 到 -1
      const radius = Math.sqrt(1 - y * y); // 半径在 xz 平面上

      const theta = phi * i; // 黄金角度旋转

      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      // 创建文本块（带厚度）
      const geometry = new THREE.BoxGeometry(1, 1, 0.2); // 添加厚度
      const material = new THREE.MeshPhongMaterial({
        color: 0xffffff, // 白色背景
        transparent: true,
        opacity: 0.9,
      });
      const block = new THREE.Mesh(geometry, material);

      // 设置位置
      block.position.set(
        x * this.sphereRadius,
        y * this.sphereRadius,
        z * this.sphereRadius
      );

      // 让文本块面向球心
      block.lookAt(0, 0, 0);
      // 然后旋转180度，让文本面向外侧
      block.rotateY(Math.PI);

      // 创建文本
      const text = this.gameTexts[i].char;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = 256;
        canvas.height = 256;
        context.fillStyle = "white"; // 白色背景
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = "bold 100px Arial";
        context.fillStyle = "black"; // 黑色文字
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        const textMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
        });
        const textGeometry = new THREE.PlaneGeometry(0.8, 0.8);
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.z = 0.11; // 将文字放在前面
        block.add(textMesh);
      }

      this.scene.add(block);
      this.textBlocks.push(block);
    }
  }

  private handleClick(event: MouseEvent) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // 计算鼠标在归一化设备坐标中的位置
    mouse.x = (event.clientX / this.container.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / this.container.clientHeight) * 2 + 1;

    // 更新射线
    raycaster.setFromCamera(mouse, this.camera);

    // 计算射线与物体的交点
    const intersects = raycaster.intersectObjects(this.textBlocks);

    if (intersects.length > 0) {
      const clickedBlock = intersects[0].object as THREE.Mesh;
      if (!this.explodingBlocks.has(clickedBlock)) {
        this.explodeBlock(clickedBlock);
      }
    }
  }

  private explodeBlock(block: THREE.Mesh) {
    this.explodingBlocks.add(block);
    const originalPosition = block.position.clone();
    const originalRotation = block.rotation.clone();
    
    // 创建碎片
    const fragmentCount = 50; // 增加碎片数量
    const fragments: THREE.Mesh[] = [];
    
    // 创建碎片材质
    const fragmentMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff, // 白色碎片
      transparent: true,
      opacity: 0.9,
    });

    // 创建碎片几何体
    for (let i = 0; i < fragmentCount; i++) {
      const size = 0.03 + Math.random() * 0.03; // 更小的碎片
      const fragmentGeometry = new THREE.BoxGeometry(size, size, size);
      const fragment = new THREE.Mesh(fragmentGeometry, fragmentMaterial.clone());
      
      // 设置碎片位置为文本块位置
      fragment.position.copy(block.position);
      fragment.rotation.copy(block.rotation);
      
      // 设置碎片旋转速度（原地旋转）
      fragment.userData.rotationSpeed = new THREE.Vector3(
        (Math.random() - 0.5) * 0.3, // 更慢的旋转
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3
      );
      
      // 设置碎片缩放速度
      fragment.userData.scaleSpeed = 0.98 + Math.random() * 0.01; // 更慢的缩放
      fragment.scale.set(1, 1, 1);
      
      // 将碎片添加到场景中
      this.scene.add(fragment);
      fragments.push(fragment);
    }

    // 隐藏原始块
    block.visible = false;

    let opacity = 1;
    const animate = () => {
      if (opacity <= 0) {
        this.explodingBlocks.delete(block);
        block.visible = true;
        block.position.copy(originalPosition);
        block.rotation.copy(originalRotation);
        
        // 移除所有碎片
        fragments.forEach(fragment => {
          this.scene.remove(fragment);
        });
        
        return;
      }

      // 更新碎片旋转和缩放
      fragments.forEach(fragment => {
        // 更新旋转
        fragment.rotation.x += fragment.userData.rotationSpeed.x;
        fragment.rotation.y += fragment.userData.rotationSpeed.y;
        fragment.rotation.z += fragment.userData.rotationSpeed.z;
        
        // 更新缩放
        fragment.scale.multiplyScalar(fragment.userData.scaleSpeed);
        
        // 更新透明度
        if (fragment.material instanceof THREE.Material) {
          (fragment.material as THREE.MeshPhongMaterial).opacity = opacity;
        }
      });

      opacity -= 0.01; // 更慢的消失速度
      requestAnimationFrame(animate);
    };

    animate();
  }

  public animate() {
    requestAnimationFrame(() => this.animate());

    // 更新控制器
    this.controls.update();

    // 渲染场景
    this.renderer.render(this.scene, this.camera);
  }

  public handleResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  public destroy() {
    this.container.removeChild(this.renderer.domElement);
    this.renderer.dispose();
  }
}

const ChineseCharacterGame3D: React.FC<ChineseCharacterGame3DProps> = ({
  gameTexts,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<ChineseCharacterGame3DManager | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    gameRef.current = new ChineseCharacterGame3DManager(container, gameTexts);

    const handleResize = () => {
      gameRef.current?.handleResize();
    };

    window.addEventListener("resize", handleResize);

    gameRef.current.animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      gameRef.current?.destroy();
    };
  }, [gameTexts]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", position: "relative" }}
    />
  );
};

export default ChineseCharacterGame3D;
