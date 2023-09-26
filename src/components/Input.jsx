import React from "react";
import CloseIcon from "../../public/assets/icons/CloseIcon";

const Input = ({
  item,
  setNumberOfList,
  numberOfList,
  numberOfListLength,
  handleDeleteField,
}) => {
  const handleChange = (e) => {
    const updatedList = numberOfList.map((data) => {
      return data.id === item.id
        ? { ...data, coordinates: e.target.value }
        : data;
    });

    setNumberOfList(updatedList);
  };

  // const error = item.coordinates
  //   .split(",")
  //   .map((item) => +item)
  //   .some((data) => data > 90);

  return (
    <label className="w-full flex items-center relative divide-x">
      <input
        className="px-4 py-2 border border-gray-200 rounded-md w-full text-gray-600 placeholder:text-gray-400 placeholder:font-light placeholder:text-sm"
        type="text"
        placeholder="Enter lng, lat"
        value={item.coordinates}
        onChange={handleChange}
      />
      {/* {error && <div>Error</div>} */}
      {numberOfListLength > 2 ? (
        <button
          onClick={() => handleDeleteField(item.id)}
          className="z-10 w-9 absolute right-0 pl-1 h-full text-gray-500"
        >
          <CloseIcon width={24} height={24} />
        </button>
      ) : null}
    </label>
  );
};

export default Input;
