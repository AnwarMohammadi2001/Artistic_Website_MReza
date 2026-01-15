import React from "react";

const Bill = () => {
  return (
    <div className="h-[250px] w-[850px] flex flex-col justify-start items-end border py-4 pl-5 pr-10">
      <div className="w-full h-12 bg-blue-700 rounded-br-full"></div>
      <div className="w-[250px] relative h-12 bg-blue-700 overflow-visible rounded-br-full">
        <div className="bg-white rounded-full absolute left-10  text-left pl-5 text-blue-700 font-semibold  w-[250px]  mt-2 p-1">
          REGISTERATION BILL
        </div>
      </div>
    </div>
  );
};

export default Bill;
