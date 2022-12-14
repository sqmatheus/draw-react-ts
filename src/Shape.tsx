import React from "react";
import "./Shape.css";

export enum ShapeType {
  CIRCLE = "circle",
  SQUARE = "square",
  TRIANGLE = "triangle",
}

interface ShapeProps {
  size: number;
  type: ShapeType;
  style?: React.CSSProperties;
  color?: string;
  positionX?: number;
  positionY?: number;
}

export const Shape = (props: ShapeProps) => {
  const style: React.CSSProperties = {
    ...props.style,
    width: props.size,
    height: props.size,
    backgroundColor: props.color ?? "red",
  };

  return props.positionX && props.positionY ? (
    <div
      className={props.type}
      style={{
        ...style,
        position: "absolute",
        left: props.positionX,
        top: props.positionY,
      }}
    ></div>
  ) : (
    <div className={props.type} style={style}></div>
  );
};
