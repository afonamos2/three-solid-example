import * as THREE from 'three';
import { Accessor, createSignal, JSX, Setter } from 'solid-js';
import { Scene } from './Scene';
import './App.css';

type AXIS = "X" | "Y" | "Z";

function App() {
  const [directionalLight, setDirectionalLight] = createSignal(new THREE.Vector3(0, 1, 0));
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
    min: number = -10,
    max: number = 10,
    step: number = 0.1,
  ) => {
    return (
      <div class='controls-group'>
        <h4>{label}</h4>
        {slideInput("X", () => {return accessor().x}, (newValue) => {handleVectorInput(setter, newValue, "X")}, min, max, step)}
        {slideInput("Y", () => {return accessor().y}, (newValue) => {handleVectorInput(setter, newValue, "Y")}, min, max, step)}
        {slideInput("Z", () => {return accessor().z}, (newValue) => {handleVectorInput(setter, newValue, "Z")}, min, max, step)}
      </div>
    );
  }

  const slideInput = (
      label: string, 
      value: () => number | number,
      onInput: (newValue: number) => void,
      min: number = -10,
      max: number = 10,
      step: number = 0.1,
    ): JSX.Element => {
    return (
      <label class="slide-input">{label}
        <input
          type="range"
          min={min}
          max={max}
          value={value()}
          step={step}
          onInput={(e) => onInput(e.currentTarget.valueAsNumber)}
        ></input>
        <div>{value()}</div>
      </label>
    )
  }

  return (
    <div class='App'>
      <Scene
        cameraPos={new THREE.Vector3(0, 0, 150)}
        directionalLight={directionalLight()}
        cannonDir={cannonDir()}
        cannonPos={cannonPos()}
      />
      <div class='controls-wrapper'>
        {vectorInput("Directional Light", directionalLight, setDirectionalLight, -1, 1, 0.1)}
        {vectorInput("Cannon Direction", cannonDir, setCannonDir)}
        {vectorInput("Cannon Position", cannonPos, setCannonPos, -250, 250, 1)}
      </div>
    </div>
  );
}

export default App;