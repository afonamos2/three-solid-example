import * as THREE from 'three';
import { createSignal, onCleanup, onMount } from "solid-js";

type SceneProps = {
  cameraPos: THREE.Vector3,
  lightPos: THREE.Vector3,
  cannonDir: THREE.Vector3,
  cannonPos: THREE.Vector3,
}

export function Scene(props: SceneProps) {

  const [renderer, setRenderer] = createSignal<THREE.WebGLRenderer>();

  onMount(() => {
    // Creating scene
    const scene = new THREE.Scene();

    // Setting up camera
    const aspectRatio = window.innerWidth / window.innerHeight;
    const camera = new THREE.PerspectiveCamera(80, aspectRatio, 0.1, 2000);
    camera.position.set(props.cameraPos.x, props.cameraPos.y, props.cameraPos.z);

    // Setting up light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(props.lightPos.x, props.lightPos.y, props.lightPos.z);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    // Setting up meshes
    const ball = new THREE.Mesh(new THREE.SphereGeometry(10, 10, 10), new THREE.MeshNormalMaterial());
    scene.add(ball);
    let ballVel = props.cannonDir.clone();
    ball.position.set(props.cannonPos.x, props.cannonPos.y, props.cannonPos.z);

    // Use your imagination on the cannon part
    const cannon = new THREE.Mesh(
      new THREE.SphereGeometry(15, 15, 15), 
      new THREE.MeshStandardMaterial({
        color: 'green',
        metalness: 0.5,
        roughness: 0.5,
        emissive: 'green',
        emissiveIntensity: 0.25,
    }));
    scene.add(cannon);
    cannon.position.set(props.cannonPos.x, props.cannonPos.y, props.cannonPos.z);


    // Setting up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xffffff);
    setRenderer(renderer);

    // HandlingWindowResizing
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    onWindowResize();
    window.addEventListener("resize", onWindowResize);

    let lastTime = 0;
    let frame = requestAnimationFrame(function renderLoop(timestamp: number) {
      const dt = () => (timestamp - lastTime) / 1_000;

      // Updating cannon position
      cannon.position.set(props.cannonPos.x, props.cannonPos.y, props.cannonPos.z);

      // Adding "gravity"
      ballVel.y += dt() * -1;

      // Applying velocity
      ball.position.x += ballVel.x;
      ball.position.y += ballVel.y;
      ball.position.z += ballVel.z;

      // Resetting ball if it goes out of bounds
      if (Math.abs(ball.position.y) > 500 || Math.abs(ball.position.x) > 1000 || Math.abs(ball.position.z) > 1000) {
        ballVel.set(props.cannonDir.x, props.cannonDir.y, props.cannonDir.z);
        ball.position.set(props.cannonPos.x, props.cannonPos.y, props.cannonPos.z);
      }

      // Rendering
      frame = requestAnimationFrame(renderLoop);
      renderer.render(scene, camera);
      lastTime = timestamp;
    });

    // Cleanup
    onCleanup(() => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onWindowResize);
    });
  });

  return <div class="three-scene-wrapper">{renderer()?.domElement}</div>;
}