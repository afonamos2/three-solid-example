import * as THREE from 'three';
import { Accessor, createSignal, JSX, Setter } from 'solid-js';
import { Scene, SceneObject} from './Scene';
import './App.css';

type AXIS = "X" | "Y" | "Z";

function App() {
  const [directionalLight, setDirectionalLight] = createSignal(new THREE.Vector3(0, 1, 0));
  const [cannonDir, setCannonDir] = createSignal(new THREE.Vector3(3, 1, -4));
  const [cannonPos, setCannonPos] = createSignal(new THREE.Vector3(0, 0, 0));

  const [object, SetObject] = createSignal<SceneObject>({
    name: "Wireframe Cube",
    mesh: new THREE.Mesh(
      new THREE.BoxGeometry(15, 15, 15),
      new THREE.MeshStandardMaterial({color: 'green',  wireframe: true}),),
    pos: new THREE.Vector3(25, 25, 25),
    dir: new THREE.Vector3(0, 0, 0),
  });

  function handleObjectDirChange(setter: Setter<SceneObject>, value: number, axis: AXIS) {
    setter((prev) => ({
      ...prev,
      dir: new THREE.Vector3(
        axis === "X" ? value : prev.dir.x,
        axis === "Y" ? value : prev.dir.y,
        axis === "Z" ? value : prev.dir.z,
      ),
    }));
  }

  function handleObjectPosChange(setter: Setter<SceneObject>, value: number, axis: AXIS) {
    setter((prev) => ({
      ...prev,
      pos: new THREE.Vector3(
        axis === "X" ? value : prev.pos.x,
        axis === "Y" ? value : prev.pos.y,
        axis === "Z" ? value : prev.pos.z,
      ),
    }));
  }

  function handleObjectMeshChange(setter: Setter<SceneObject>, mesh: THREE.Mesh) {
    setter((prev) => ({
      ...prev, mesh
    }));
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

  function objectInput(
    accessor: Accessor<SceneObject>,
    setter: Setter<SceneObject>,
    min: number = -100,
    max: number = 100,
    step: number = 0.1,
  ) {
    return (
      <div class='controls-group'>
        <h4>{accessor().name}</h4>
        {slideInput("X", () => {return accessor().pos.x}, (newValue) => {handleObjectPosChange(setter, newValue, "X")}, min, max, step)}
        {slideInput("Y", () => {return accessor().pos.y}, (newValue) => {handleObjectPosChange(setter, newValue, "Y")}, min, max, step)}
        {slideInput("Z", () => {return accessor().pos.z}, (newValue) => {handleObjectPosChange(setter, newValue, "Z")}, min, max, step)}
        {slideInput("X", () => {return accessor().dir.x}, (newValue) => {handleObjectDirChange(setter, newValue, "X")}, 0, 180, 1)}
        {slideInput("Y", () => {return accessor().dir.y}, (newValue) => {handleObjectDirChange(setter, newValue, "Y")}, 0, 180, 1)}
        {slideInput("Z", () => {return accessor().dir.z}, (newValue) => {handleObjectDirChange(setter, newValue, "Z")}, 0, 180, 1)}
      </div>
    )
  }

  function vectorInput(
    label: string, 
    accessor: Accessor<THREE.Vector3>,
    setter: Setter<THREE.Vector3>,
    min: number = -10,
    max: number = 10,
    step: number = 0.1,
  ) {
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
      min: number = -100,
      max: number = 100,
      step: number = 1,
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
        staticObject={[object()]}
      />
      <div class='controls-wrapper'>
        {vectorInput("Directional Light", directionalLight, setDirectionalLight, -1, 1, 0.1)}
        {vectorInput("Cannon Direction", cannonDir, setCannonDir)}
        {vectorInput("Cannon Position", cannonPos, setCannonPos, -250, 250, 1)}
        {objectInput(object, SetObject)}
      </div>
    </div>
  );
}

export default App;