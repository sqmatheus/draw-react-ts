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

interface PointsData {
  points: Point[];
  undoHistory: Point[];
}

const App = () => {
  const [pointsData, setPointsData] = useState<PointsData>({
    points: [],
    undoHistory: [],
  });
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

  const handleCanvas = ({
    clientX,
    clientY,
    currentTarget,
  }: React.MouseEvent<HTMLDivElement>) => {
    setPointsData(({ points, undoHistory }) => {
      return {
        points: [
          ...points,
          {
            shapeIndex: selectedShape,
            size: pointSize,
            color: selectedColor,
            position: calculatePosition(clientX, clientY, currentTarget),
          },
        ],
        undoHistory,
      };
    });
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

  const handleUndo = () => {
    // TODO: make works after clear
    setPointsData(({ points, undoHistory }) => {
      const newPoints = [...points];
      const undo = newPoints.pop();
      if (undo) {
        const newUndoHistory = [...undoHistory, undo];
        return {
          points: newPoints,
          undoHistory: newUndoHistory,
        };
      }
      return {
        points,
        undoHistory,
      };
    });
  };

  const handleRedo = () => {
    setPointsData(({ points, undoHistory }) => {
      const newUndoHistory = [...undoHistory];
      const redo = newUndoHistory.pop();
      if (redo) {
        const newPoints = [...points, redo];
        return {
          points: newPoints,
          undoHistory: newUndoHistory,
        };
      }
      return {
        points,
        undoHistory,
      };
    });
  };

  return (
    <div className="app">
      <div
        className="canvas"
        onClick={handleCanvas}
        onMouseMove={handlePreview}
        onMouseOver={handlePreview}
        onMouseOut={() => setPreview(undefined)}
      >
        {pointsData.points.map(
          ({ shapeIndex, size, position, color }, index) => {
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
          }
        )}
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
        <div className="actions">
          <button
            className="undo"
            disabled={pointsData.points.length === 0}
            onClick={handleUndo}
          >
            Undo
          </button>
          <button
            className="redo"
            disabled={pointsData.undoHistory.length === 0}
            onClick={handleRedo}
          >
            Redo
          </button>
          <button
            className="clear"
            disabled={pointsData.points.length === 0}
            onClick={() =>
              setPointsData(({ undoHistory }) => {
                return {
                  points: [],
                  undoHistory,
                };
              })
            }
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
