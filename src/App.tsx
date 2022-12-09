import React, { useState } from "react";
import "./App.css";

interface Shape {
  name: string;
  className: string;
}

interface Point {
  id: number;
  shapeIndex: number;
  size: number;
  x: number;
  y: number;
}

let id = 0; // idk if its a good solution, but works :)

const SHAPES: Shape[] = [
  {
    name: "Circle",
    className: "circle",
  },
  {
    name: "Square",
    className: "square",
  },
  {
    name: "Triangle",
    className: "triangle",
  },
];

function App() {
  const [points, setPoints] = useState<Point[]>([]);
  const [pointSize, setPointSize] = useState<number>(10);

  const click = ({ clientX, clientY }: React.MouseEvent) => {
    setPoints((pts) => [
      ...pts,
      {
        id: ++id,
        shapeIndex: selectedShape,
        size: pointSize,
        x: clientX,
        y: clientY,
      },
    ]);
  };

  const [selectedShape, setSelectedShape] = useState<number>(0);
  const [hoverShape, setHoverShape] = useState<string | undefined>(undefined);

  return (
    <div className="app">
      <div className="canvas" onClick={click}>
        {points.map(({ id, shapeIndex, size, x, y }) => {
          const offset = size / 2;
          const [left, top] = [x - offset, y - offset];
          return (
            <div
              key={id}
              style={{
                position: "absolute",
                left,
                top,
                width: size,
                height: size,
                backgroundColor: "red",
              }}
              className={SHAPES[shapeIndex].className}
            ></div>
          );
        })}
      </div>
      <div className="menu">
        <ul className="shapes">
          {SHAPES.map(({ name, className }, index) => {
            return (
              <li
                key={name}
                className={
                  selectedShape === index ? "shape shape-active" : "shape"
                }
                onClick={() => {
                  setSelectedShape(index);
                }}
                onMouseOver={() => setHoverShape(name)}
                onMouseOut={() => setHoverShape(undefined)}
              >
                {hoverShape === name && <div id="shape-hover">{name}</div>}
                <div className={className}></div>
              </li>
            );
          })}
        </ul>
        <div className="slider">
          <input
            type="range"
            min="10"
            max="50"
            value={pointSize}
            step="1"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPointSize(Number(event.currentTarget.value));
            }}
          />
          <h3>{pointSize} px</h3>
        </div>
        <div className="clear" onClick={() => setPoints([])}>
          Clear
        </div>
      </div>
    </div>
  );
}

export default App;
