import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const ThreeDGraph = ({ data }) => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const pointsRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer, controls;

    const initThreeJS = () => {
      // Scene
      scene = new THREE.Scene();

      // Camera
      camera = new THREE.PerspectiveCamera(
        75,
        mountRef.current.clientWidth / mountRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 25);

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
      mountRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controlsRef.current = controls;

      // Axes Helper
      const axesHelper = new THREE.AxesHelper(5);
      scene.add(axesHelper);

      // Points
      if (data && data.length > 0) {
        const points = data.map(({ x, y, z }) => new THREE.Vector3(x, y, z));

        // Geometry for points
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        // Material for points
        const material = new THREE.PointsMaterial({ color: 0x00ff00 });

        // Create points cloud
        pointsRef.current = new THREE.Points(geometry, material);
        scene.add(pointsRef.current);

        // Lines (edges)
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
      }

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };

      animate();
    };

    initThreeJS();

    // Handling window resize
    const handleResize = () => {
      if (rendererRef.current && camera) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;

        rendererRef.current.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleaning up Three.js resources
    return () => {
      window.removeEventListener("resize", handleResize);

      if (rendererRef.current) {
        rendererRef.current.forceContextLoss();
        rendererRef.current.domElement.remove();
      }

      if (controlsRef.current) {
        controlsRef.current.dispose();
        controlsRef.current = null;
      }
    };
  }, [data]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
};

export default ThreeDGraph;
