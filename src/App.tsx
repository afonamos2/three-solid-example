import { Accessor, createSignal, JSX, Setter } from 'solid-js';
import * as THREE from 'three';
import { Scene } from './Scene';
import './App.css';

type AXIS = "X" | "Y" | "Z";

function App() {

  const [cannonDir, setCannonDir] = createSignal(new THREE.Vector3(3, 1, -4));
  const [cannonPos, setCannonPos] = createSignal(new THREE.Vector3(0, 0, 0));

  function handleCannonDirChange(e: Event & { currentTarget: HTMLInputElement }, axis: AXIS) {
    handleVectorInput(setCannonDir, parseFloat(e.currentTarget.value), axis);
  }

  function handleCannonPosChange(e: Event & { currentTarget: HTMLInputElement }, axis: AXIS) {
    handleVectorInput(setCannonPos, parseFloat(e.currentTarget.value), axis);
  }

  function handleVectorInput(setter: Setter<THREE.Vector3>, newValue: number, axis: AXIS) {
    switch (axis) {
      case "X":
        setter((prev) => new THREE.Vector3(newValue, prev.y, prev.z));
        break;
      case "Y":
        setter((prev) => new THREE.Vector3(prev.x, newValue, prev.z))
        break;
      case "Z":
        setter((prev) => new THREE.Vector3(prev.x, prev.y, newValue))
        break;
    }
  } 

  const vectorInput = (
      label: string, 
      inputTarget: (e: Event & { currentTarget: HTMLInputElement }, axis: AXIS) => void,
      accessor: Accessor<THREE.Vector3>,
      axis: AXIS,
      min: number = -10,
      max: number = 10,
      step: number = 0.1,
    ): JSX.Element => {
    return (
      <label for="cannon-dir">{label}
        <input
          type="range"
          min={min}
          max={max}
          value={axis === "X" ? accessor().x : axis === "Y" ? accessor().y : accessor().z}
          step={step}
          onInput={(e) => inputTarget(e, axis)}
        ></input>
      </label>
    )
  }

  return (
    <div class='App'>
      <Scene
        cameraPos={new THREE.Vector3(0, 0, 150)}
        lightPos={new THREE.Vector3(150, 150, 150)}
        cannonDir={cannonDir()}
        cannonPos={cannonPos()}
      />
      <div class='controls-wrapper'>
        {vectorInput("Cannon X Direction", handleCannonDirChange, cannonDir, "X")}
        {vectorInput("Cannon Y Direction", handleCannonDirChange, cannonDir, "Y")}
        {vectorInput("Cannon Z Direction", handleCannonDirChange, cannonDir, "Z")}
        {vectorInput("Cannon X Position", handleCannonPosChange, cannonPos, "X", -200, 200, 1)}
        {vectorInput("Cannon Y Position", handleCannonPosChange, cannonPos, "Y", -100, 100, 1)}
        {vectorInput("Cannon Z Position", handleCannonPosChange, cannonPos, "Z", -50, 50, 1)}
      </div>
    </div>
  );
}

export default App;