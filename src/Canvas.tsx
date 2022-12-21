import { useState } from "react";
import { calculatePosition, Point, SHAPES, Vec2 } from "./App";
import { Shape } from "./Shape";
import "./Canvas.css";

interface Props {
  pointSize: number;
  selectedShape: number;
  selectedColor: string;
  points: Point[];
  setPoints: React.Dispatch<React.SetStateAction<Point[]>>;
}

export default function Canvas({
  pointSize,
  selectedShape,
  selectedColor,
  points,
  setPoints,
}: Props) {
  const [preview, setPreview] = useState<Vec2 | undefined>(undefined);

  const handlePreview = ({
    clientX,
    clientY,
    currentTarget,
  }: React.MouseEvent<HTMLDivElement>) => {
    setPreview(calculatePosition(clientX, clientY, pointSize, currentTarget));
  };

  const handleCanvas = ({
    clientX,
    clientY,
    currentTarget,
  }: React.MouseEvent<HTMLDivElement>) => {
    setPoints((points) => {
      return [
        ...points,
        {
          shapeIndex: selectedShape,
          size: pointSize,
          color: selectedColor,
          position: calculatePosition(
            clientX,
            clientY,
            pointSize,
            currentTarget
          ),
        },
      ];
    });
  };

  return (
    <div
      className="canvas"
      onClick={handleCanvas}
      onMouseMove={handlePreview}
      onMouseOver={handlePreview}
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
  );
}
