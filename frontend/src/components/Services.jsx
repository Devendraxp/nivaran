import React from "react";

function Services() {
  return (
    <div className="flex flex-col justify-center items-start w-full h-full">
      <h1 className="mb-2 text-2xl">Services</h1>
      <div className="border w-full h-40 flex flex-row justify-around items-center ">
        <div className="border rounded-full h-24 w-24 flex items-center justify-center">
          <p>Service 1</p>
        </div>
        <div className="border rounded-full h-24 w-24 flex items-center justify-center">
          <p>Service 2</p>
        </div>
        <div className="border rounded-full h-24 w-24 flex items-center justify-center">
          <p>Service 3</p>
        </div>
      </div>
    </div>
  );
}

export default Services;
