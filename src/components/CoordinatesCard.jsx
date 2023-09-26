import React from "react";
import Input from "./Input";
import { v4 as uuid4 } from "uuid";
import PlayIcon from "../../public/assets/icons/PlayIcon";
import PauseIcon from "../../public/assets/icons/PauseIcon";
import UploadIcon from "../../public/assets/icons/UploadIcon";
import SpinnerIcon from "../../public/assets/icons/SpinnerIcon";

const CoordinatesCard = ({
  setNumberOfList,
  numberOfList,
  handleGetDirection,
  error,
  play,
  handlePlay,
  isButtonLoading,
  coords,
}) => {
  const handleAddMoreField = () => {
    setNumberOfList([...numberOfList, { id: uuid4(), coordinates: "" }]);
  };

  const handleDeleteField = (id) => {
    const newList = numberOfList.filter((item) => item.id !== id);
    setNumberOfList(newList);
  };

  const isListEmpty = numberOfList.filter((data) => Boolean(data.coordinates));

  return (
    <div className="relative z-50 gap-2 m-2 flex flex-col w-72 shadow-md rounded-md p-4 bg-white">
      {error && <div className="text-red-500">{error.message}</div>}
      <div className="flex justify-between mb-3">
        <label
          htmlFor="file"
          className="cursor-pointer text-sm text-white gap-1 flex py-1 px-2 bg-blue-500 rounded-md"
        >
          <input id="file" className="hidden" type="file" />
          Upload
          <UploadIcon width={18} height={18} />
        </label>
        <button
          onClick={handlePlay}
          className={`${
            isListEmpty.length < 2 ? "opacity-30 cursor-not-allowed" : ""
          }`}
          disabled={isListEmpty.length < 2 ? true : false}
        >
          {play ? (
            <PauseIcon width={24} height={24} />
          ) : (
            <PlayIcon width={24} height={24} />
          )}
        </button>
      </div>
      <div
        style={{ maxHeight: "80vh", overflow: "auto" }}
        className="gap-2 flex flex-col"
      >
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
      </div>
      <button
        onClick={handleAddMoreField}
        className="bg-black text-white rounded-md px-4 py-2 text-sm"
      >
        Add a coordinate
      </button>
      <button
        onClick={() => handleGetDirection(isListEmpty)}
        className={`flex gap-1 items-center justify-center bg-black text-white rounded-md px-4 py-2 text-sm ${
          isListEmpty.length < 2 ? "opacity-60 cursor-not-allowed" : ""
        }`}
        disabled={isListEmpty.length < 2 ? true : false}
      >
        {isButtonLoading && (
          <SpinnerIcon width={20} height={20} className="animate-spin" />
        )}
        <span>Get direction</span>
      </button>
    </div>
  );
};

export default CoordinatesCard;
