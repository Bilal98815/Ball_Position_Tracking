import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const ThreeDGraph = ({ data }) => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer, controls;

    const initThreeJS = () => {
      // Scene
      scene = new THREE.Scene();

      // Camera
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 10);

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controlsRef.current = controls;

      // Axes Helper (optional)
      const axesHelper = new THREE.AxesHelper(5);
      scene.add(axesHelper);

      // Points
      const points = data.map(({ longitude, latitude, altitude }) => {
        return new THREE.Vector3(longitude, latitude, altitude);
      });

      // Geometry for points
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      // Material for points
      const material = new THREE.PointsMaterial({ color: 0x00ff00 });

      // Create points cloud
      const pointCloud = new THREE.Points(geometry, material);
      scene.add(pointCloud);

      // Lines (edges)
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update(); // Update controls in animation loop
        renderer.render(scene, camera);
      };

      animate();
    };

    initThreeJS();

    // Clean up Three.js resources
    return () => {
      if (rendererRef.current) {
        rendererRef.current.forceContextLoss();
        rendererRef.current.domElement.remove();
      }

      if (controlsRef.current) {
        controlsRef.current.dispose(); // Dispose controls resources if needed
        controlsRef.current = null; // Reset controls reference
      }
    };
  }, [data]);

  return <div ref={mountRef} />;
};

export default ThreeDGraph;
