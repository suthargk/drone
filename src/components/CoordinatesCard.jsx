import React from "react";
import Input from "./Input";
import { v4 as uuid4 } from "uuid";

const CoordinatesCard = ({
  setNumberOfList,
  numberOfList,
  handleGetDirection,
  error,
}) => {
  const handleAddMoreField = () => {
    setNumberOfList([...numberOfList, { id: uuid4(), coordinates: "" }]);
  };

  const handleDeleteField = (id) => {
    const newList = numberOfList.filter((item) => item.id !== id);
    setNumberOfList(newList);
  };

  return (
    <div className="relative gap-2 z-50 m-2 flex flex-col w-72 shadow-md rounded-md p-4 bg-white">
      {error && <div className="text-red-500">{error.message}</div>}
      {numberOfList.map((item) => {
        return (
          <Input
            key={item.id}
            item={item}
            numberOfListLength={numberOfList.length}
            handleDeleteField={handleDeleteField}
            setNumberOfList={setNumberOfList}
            numberOfList={numberOfList}
          />
        );
      })}
      <button
        onClick={handleAddMoreField}
        className="bg-black text-white rounded-md px-4 py-2 text-sm"
      >
        Add a coordinate
      </button>
      <button
        onClick={handleGetDirection}
        className="bg-black text-white rounded-md px-4 py-2 text-sm"
      >
        Get direction
      </button>
    </div>
  );
};

export default CoordinatesCard;
