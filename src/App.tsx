import React, { useState } from "react";
import { Shape, ShapeType } from "./Shape";
import "./App.css";

interface IShape {
  name: string;
  shapeType: ShapeType;
}

interface Point {
  shapeIndex: number;
  size: number;
  color: string;
  x: number;
  y: number;
}

const SHAPES: IShape[] = [
  {
    name: "Circle",
    shapeType: ShapeType.CIRCLE,
  },
  {
    name: "Square",
    shapeType: ShapeType.SQUARE,
  },
  {
    name: "Triangle",
    shapeType: ShapeType.TRIANGLE,
  },
];

function App() {
  const [points, setPoints] = useState<Point[]>([]);
  const [pointSize, setPointSize] = useState<number>(10);
  const [selectedColor, setSelectedColor] = useState<string>("#ffffff");
  const [selectedShape, setSelectedShape] = useState<number>(0);
  const [hoverShape, setHoverShape] = useState<string | undefined>(undefined);

  const click = ({
    clientX,
    clientY,
    currentTarget,
  }: React.MouseEvent<HTMLDivElement>) => {
    const { scrollX, scrollY } = window;

    const { offsetLeft, offsetTop } = currentTarget;

    const offset = pointSize / 2;

    const [x, y] = [
      clientX - (-scrollX + offsetLeft) - offset,
      clientY - (-scrollY + offsetTop) - offset,
    ];
    setPoints((pts) => [
      ...pts,
      {
        shapeIndex: selectedShape,
        size: pointSize,
        color: selectedColor,
        x,
        y,
      },
    ]);
  };

  return (
    <div className="app">
      <div className="canvas" onClick={click}>
        {points.map(({ shapeIndex, size, x, y, color }, index) => {
          return (
            <Shape
              key={index}
              size={size}
              positionX={x}
              positionY={y}
              color={color}
              type={SHAPES[shapeIndex].shapeType}
            />
          );
        })}
      </div>
      <div className="menu">
        <ul className="shapes">
          {SHAPES.map(({ name, shapeType }, index) => {
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
                <Shape size={20} type={shapeType} />
              </li>
            );
          })}
        </ul>
        <div className="config">
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
          <div className="color-picker">
            <input
              type="color"
              id="head"
              name="head"
              value={selectedColor}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setSelectedColor(event.currentTarget.value);
              }}
            />
            <h3>{selectedColor}</h3>
          </div>
        </div>
        <div className="clear" onClick={() => setPoints([])}>
          Clear
        </div>
      </div>
    </div>
  );
}

export default App;
