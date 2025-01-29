import { useEffect, useState } from "react";
import axios from "axios";


const ProfileSection = () => {
  const [worker, setWorker] = useState({});
  useEffect(()=>{
     axios.get('/api/v1/worker/current-worker')
      .then((response)=>{
        console.log(response.data.data);
        setWorker(response.data.data);
      })
      .catch((error)=>{
        console.error(error);
      })

  },[])

  return (
    <div className="flex flex-col md:flex-row shadow-lg rounded-lg p-6">
      {/* Left Section - Profile Image */}
      <div className="md:w-1/3 flex justify-center md:justify-start">
        <img
          src={worker.profileImg || "https://via.placeholder.com/150"}
          alt="Profile"
          className="rounded-full w-32 h-32 md:w-48 md:h-48"
        />
      </div>

      {/* Right Section - Information */}
      <div className="md:w-2/3 mt-6 md:mt-0 md:ml-6 flex flex-col justify-start items-start">
        <h2 className="text-2xl font-bold text-gray-200"> Name : {worker.name}</h2>
        <p className="text-gray-600"> Username : @{worker.username}</p>
        <p className="mt-4 text-gray-800 text-start">{worker.description}</p>
        
        <div className="mt-4 flex flex-col justify-start items-start">
          <p className="text-gray-600"><strong>Email:</strong>{worker.email}</p>
          <p className="text-gray-600"><strong>Phone:</strong> {worker.phoneNo}</p>
          <p className="text-gray-600"><strong>Address:</strong> {worker.address || 'Address not available'}</p>
          <p className="text-gray-600"><strong>Working Hours:</strong>PM</p>
          <p className="text-gray-600"><strong>Experience:</strong>{worker.experience} years in software development</p>
          <p className="text-gray-600"><strong>Languages:</strong>    {worker.language && worker.language.length > 0
      ? worker.language.join(', ') 
      : 'No languages specified'}  </p>
            <p className="text-gray-600"><strong>Services:</strong>    {worker.services && worker.services.length > 0
      ? worker.services.join(', ') 
      : 'No services specified'}  </p>
        </div>
      </div>
    </div> 
  );
};

export default ProfileSection;