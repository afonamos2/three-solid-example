import * as THREE from 'three';
import { Accessor, createSignal, JSX, Setter } from 'solid-js';
import { Scene } from './Scene';
import './App.css';

type AXIS = "X" | "Y" | "Z";

function App() {

  const [cannonDir, setCannonDir] = createSignal(new THREE.Vector3(3, 1, -4));
  const [cannonPos, setCannonPos] = createSignal(new THREE.Vector3(0, 0, 0));

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
      accessor: Accessor<THREE.Vector3>,
      setter: Setter<THREE.Vector3>,
      axis: AXIS,
      min: number = -10,
      max: number = 10,
      step: number = 0.1,
    ): JSX.Element => {
    return (
      <label class="vector-input">{label}
        <input
          type="range"
          min={min}
          max={max}
          value={axis === "X" ? accessor().x : axis === "Y" ? accessor().y : accessor().z}
          step={step}
          onInput={(e) => handleVectorInput(setter, e.target.valueAsNumber, axis)}
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
        <div class='controls-group'>
          <h4>Cannon Direction</h4>
          {vectorInput("X", cannonDir, setCannonDir, "X")}
          {vectorInput("Y", cannonDir, setCannonDir, "Y")}
          {vectorInput("Z", cannonDir, setCannonDir, "Z")}
        </div>
        <div class='controls-group'>
          <h4>Cannon Position</h4>
          {vectorInput("X", cannonPos, setCannonPos, "X", -200, 200, 1)}
          {vectorInput("Y", cannonPos, setCannonPos, "Y", -100, 100, 1)}
          {vectorInput("Z", cannonPos, setCannonPos, "Z", -50, 50, 1)}
        </div>
      </div>
    </div>
  );
}

export default App;