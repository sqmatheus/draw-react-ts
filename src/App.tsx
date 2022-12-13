import React, { useState } from "react";
import { Shape, ShapeType } from "./Shape";
import "./App.css";

interface IShape {
  name: string;
  shapeType: ShapeType;
}

interface Vec2 {
  x: number;
  y: number;
}

interface Point {
  shapeIndex: number;
  size: number;
  color: string;
  position: Vec2;
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

const App = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [pointSize, setPointSize] = useState<number>(10);
  const [selectedColor, setSelectedColor] = useState<string>("#ffffff");
  const [selectedShape, setSelectedShape] = useState<number>(0);
  const [hoverShape, setHoverShape] = useState<string | undefined>(undefined);
  const [preview, setPreview] = useState<Vec2 | undefined>(undefined);

  const calculatePosition = (
    clientX: number,
    clientY: number,
    { offsetLeft, offsetTop }: HTMLDivElement
  ): Vec2 => {
    const { scrollX, scrollY } = window;
    const offset = pointSize / 2;
    return {
      x: clientX - (-scrollX + offsetLeft) - offset,
      y: clientY - (-scrollY + offsetTop) - offset,
    };
  };

  const hanldeCanvas = ({
    clientX,
    clientY,
    currentTarget,
  }: React.MouseEvent<HTMLDivElement>) => {
    setPoints((pts) => [
      ...pts,
      {
        shapeIndex: selectedShape,
        size: pointSize,
        color: selectedColor,
        position: calculatePosition(clientX, clientY, currentTarget),
      },
    ]);
  };

  const handlePreview = ({
    clientX,
    clientY,
    currentTarget,
  }: React.MouseEvent<HTMLDivElement>) => {
    setPreview(calculatePosition(clientX, clientY, currentTarget));
  };

  const handleSlider = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPointSize(Number(event.currentTarget.value));
  };

  const handleColorPicker = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(event.currentTarget.value);
  };

  return (
    <div className="app">
      <div
        className="canvas"
        onClick={hanldeCanvas}
        onMouseMove={handlePreview}
        onMouseOut={() => setPreview(undefined)}
      >
        {points.map(({ shapeIndex, size, position, color }, index) => {
          const { x, y } = position;
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
        {preview && (
          <Shape
            key={-1}
            style={{
              opacity: 0.8,
            }}
            size={pointSize}
            positionX={preview.x}
            positionY={preview.y}
            color={selectedColor}
            type={SHAPES[selectedShape].shapeType}
          />
        )}
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
              onChange={handleSlider}
            />
            <h3>{pointSize} px</h3>
          </div>
          <div className="color-picker">
            <input
              type="color"
              id="head"
              name="head"
              value={selectedColor}
              onChange={handleColorPicker}
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
};

export default App;
