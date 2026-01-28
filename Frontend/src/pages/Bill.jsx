import React from "react";

const Bill = () => {
  return (
    <div
      dir="ltr"
      className="h-[340px] w-[850px] flex flex-col justify-start items-end border py-4 pl-5 pr-10"
    >
      <div className="w-full h-12 bg-blue-700 relative rounded-br-full">
        <p className="text-gray-100 text-left text-4xl pl-5 py-2  font-bold">
          HPELA
        </p>
        <p className="absolute top-3 text-gray-100 font-bold text-lg left-[150px]">
          PREMIERE ENGLISH LANGUAGE ACADEMY
        </p>
        <div className="bg-white h-12 w-28 flex items-center justify-center absolute right-20 top-0 z-10">
          LOGO
        </div>
      </div>
      <div className="flex items-center w-full gap-x-10">
        <div className="w-[250px] relative h-12 bg-blue-700 overflow-visible rounded-br-full">
          <div className="bg-white rounded-full absolute left-10  text-left pl-5 text-blue-700 font-semibold  w-[250px]  mt-2 p-1">
            REGISTERATION BILL
          </div>
        </div>
        <div>
          <p>
            <span className="font-bold text-blue-700">Date:</span>
            <span>----------------</span>
          </p>
        </div>
        <div>
          <p>
            <span className="font-bold text-blue-700">NO:</span>
            <span>----------------</span>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 relative  px-10 w-full mt-3 ">
        <div className=" space-y-1">
          <p>
            <span className="font-bold text-blue-700 text-sm">Name:</span>
            <span>------------------</span>
          </p>
          <p>
            <span className="font-bold text-blue-700 text-sm">Class:</span>
            <span>------------------</span>
          </p>
          <p>
            <span className="font-bold text-blue-700 text-sm">Fee:</span>
            <span>------------------</span>
          </p>
          <p>
            <span className="font-bold text-blue-700 text-sm">Instructor:</span>
            <span>------------------</span>
          </p>
        </div>
        <div className=" space-y-1">
          <p>
            <span className="font-bold text-blue-700 text-sm">F/Name:</span>
            <span>------------------</span>
          </p>
          <p>
            <span className="font-bold text-blue-700 text-sm">Time:</span>
            <span>------------------</span>
          </p>
          <p>
            <span className="font-bold text-blue-700 text-sm">R.Amount:</span>
            <span>------------------</span>
          </p>
        </div>
        <div className="absolute bottom-0 right-0">
          <p>
            <span className="font-bold text-blue-700 text-sm">Signature:</span>
            <span>------------------</span>
          </p>
        </div>
      </div>
      <div className="h-full p-2 mt-2 w-full flex gap-x-5  bg-blue-700">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-100">
            <span>Address 1:</span>
            <span>
              Shah-e-d Mazari Road,Pol-e-Khoshk,Station,Resalat Street
            </span>
          </p>
          <p className="text-xs font-semibold text-gray-100">
            <span>Address 1:</span>
            <span>
              Shah-e-d Mazari Road,Pol-e-Khoshk,Station,Resalat Street
            </span>
          </p>
          <p className="text-xs font-semibold text-gray-100">
            <span>Address 1:</span>
            <span>
              Shah-e-d Mazari Road,Pol-e-Khoshk,Station,Resalat Street
            </span>
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-100">
            <span>Phone:</span>
            <span>0772387935 - 0700234856-122343355</span>
          </p>
          <div className="bg-gray-100  py-1 flex items-center justify-center rounded-lg px-3 mt-4">
            <p className="text-xs font-semibold text-blue-800">
              <span>Note:</span>
              <span>The amount recived is not refundabale</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bill;
