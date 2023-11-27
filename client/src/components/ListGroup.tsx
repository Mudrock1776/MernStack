import React, { useState } from "react";
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  items: string[];
  heading: string;
  selectedIndex: number;
  // (item: string) => void
  onSelectItem: (item: string, index: number) => void;
}

function ListGroup({
  children,
  items,
  heading,
  onSelectItem,
  selectedIndex,
}: Props) {
  // Hook
  const getMessage = () => {
    return items.length === 0 && <p>No item found</p>;
  };

  return (
    <div
      className="container"
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ color: "#1AFFD5" }}>{heading}</h2>
      {getMessage()}
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
            key={item}
            onClick={() => {
              onSelectItem(item, index);
            }}
            style={
              selectedIndex === index
                ? { color: "#FFFFFF" } // Color when selected
                : { color: "#000000" } // Color when not selected
            }
          >
            {item}
            {children}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListGroup;
