
const ProfileSection = () => {
  return (
    <div className="flex flex-col md:flex-row shadow-lg rounded-lg p-6">
      {/* Left Section - Profile Image */}
      <div className="md:w-1/3 flex justify-center md:justify-start">
        <img
          src="https://via.placeholder.com/150"
          alt="Profile"
          className="rounded-full w-32 h-32 md:w-48 md:h-48"
        />
      </div>

      {/* Right Section - Information */}
      <div className="md:w-2/3 mt-6 md:mt-0 md:ml-6 flex flex-col justify-start items-start">
        <h2 className="text-2xl font-bold text-gray-200"> Name : John Doe</h2>
        <p className="text-gray-600"> Username : @johndoe</p>
        <p className="mt-4 text-gray-800 text-start">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        
        <div className="mt-4 flex flex-col justify-start items-start">
          <p className="text-gray-600"><strong>Email:</strong> john.doe@example.com</p>
          <p className="text-gray-600"><strong>Phone:</strong> (123) 456-7890</p>
          <p className="text-gray-600"><strong>Address:</strong> 123 Main St, Anytown, USA</p>
          <p className="text-gray-600"><strong>Working Hours:</strong> 9 AM - 5 PM</p>
          <p className="text-gray-600"><strong>Experience:</strong> 10 years in software development</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;