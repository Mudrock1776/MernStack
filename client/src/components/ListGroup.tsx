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
    <>
      <h1>{heading}</h1>
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
          >
            {item}
            {children}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
