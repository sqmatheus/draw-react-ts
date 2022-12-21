import React, { useState } from "react";
import { Shape, ShapeType } from "./Shape";
import "./App.css";
import Canvas from "./Canvas";

interface IShape {
  name: string;
  shapeType: ShapeType;
}

export interface Vec2 {
  x: number;
  y: number;
}

export interface Point {
  shapeIndex: number;
  size: number;
  color: string;
  position: Vec2;
}

export const SHAPES: IShape[] = [
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

export const calculatePosition = (
  clientX: number,
  clientY: number,
  pointSize: number,
  { offsetLeft, offsetTop }: HTMLDivElement
): Vec2 => {
  const { scrollX, scrollY } = window;
  const offset = pointSize / 2;
  return {
    x: clientX - (-scrollX + offsetLeft) - offset,
    y: clientY - (-scrollY + offsetTop) - offset,
  };
};

const App = () => {
  const [pointSize, setPointSize] = useState<number>(10);
  const [selectedColor, setSelectedColor] = useState<string>("#ffffff");
  const [selectedShape, setSelectedShape] = useState<number>(0);
  const [hoverShape, setHoverShape] = useState<string | undefined>(undefined);
  const [points, setPoints] = useState<Point[]>([]);
  const [undoHistory, setUndoHistory] = useState<Point[]>([]);

  const handleSlider = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPointSize(Number(event.currentTarget.value));
  };

  const handleColorPicker = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(event.currentTarget.value);
  };

  const handleUndo = () => {
    const newPoints = [...points];
    const undo = newPoints.pop();
    if (undo) {
      setPoints(newPoints);
      setUndoHistory([...undoHistory, undo]);
    }
  };

  const handleRedo = () => {
    const newUndoHistory = [...undoHistory];
    const redo = newUndoHistory.pop();
    if (redo) {
      setUndoHistory(newUndoHistory);
      setPoints([...points, redo]);
    }
  };

  return (
    <div className="app">
      <Canvas
        pointSize={pointSize}
        selectedColor={selectedColor}
        selectedShape={selectedShape}
        points={points}
        setPoints={setPoints}
      />
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
        <div className="actions">
          <button
            className="undo"
            disabled={points.length === 0}
            onClick={handleUndo}
          >
            Undo
          </button>
          <button
            className="redo"
            disabled={undoHistory.length === 0}
            onClick={handleRedo}
          >
            Redo
          </button>
          <button
            className="clear"
            disabled={points.length === 0}
            onClick={() => setPoints([])}
          >
            Clear
          </button>
        </div>
      </div>
      <footer>
        made by{" "}
        <a href="https://github.com/sqmatheus" target="_blank" rel="noreferrer">
          sqmatheus
        </a>
      </footer>
    </div>
  );
};

export default App;
