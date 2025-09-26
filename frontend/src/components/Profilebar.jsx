const Profilebar = () => {
  const mentors = [
    { name: 'Killiam Roosevelt', role: 'Software Developer', image: 'https://via.placeholder.com/40' },
    { name: 'Teodor Maskevich', role: 'Product Owner', image: 'https://via.placeholder.com/40' },
    { name: 'Andrew Kooler', role: 'Frontend Developer', image: 'https://via.placeholder.com/40' },
    { name: 'Adam Chekish', role: 'Backend Developer', image: 'https://via.placeholder.com/40' },
    { name: 'Anton Peterson', role: 'Software Developer', image: 'https://via.placeholder.com/40' },
    { name: 'Matew Jackson', role: 'Product Designer', image: 'https://via.placeholder.com/40' },
  ];

  return (
    <div className="bg-white w-64 p-4 rounded-lg shadow-lg h-full flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold text-blue-600 mb-4">Your Profile</h3>
        <div className="flex items-center mb-4">
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="w-12 h-12 rounded-full mr-2"
          />
          <div>
            <p className="text-sm font-medium text-gray-700">Good Morning Alex</p>
            <p className="text-xs text-gray-500">Continue Your Journey And Achieve Your Target</p>
          </div>
        </div>
        <div className="flex justify-around mb-4">
          <span className="text-xl">📅</span>
          <span className="text-xl">📧</span>
          <span className="text-xl">👤</span>
        </div>
        <div className="mb-4">
          <div className="flex space-x-2">
            <div className="w-4 h-4 bg-blue-100"></div>
            <div className="w-4 h-4 bg-blue-300"></div>
            <div className="w-8 h-4 bg-blue-500"></div>
            <div className="w-6 h-4 bg-blue-700"></div>
            <div className="w-4 h-4 bg-blue-900"></div>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-blue-600 mb-4">Your Mentor</h3>
        {mentors.map((mentor, index) => (
          <div key={index} className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <img src={mentor.image} alt={mentor.name} className="w-8 h-8 rounded-full" />
              <div>
                <p className="text-sm text-gray-700">{mentor.name}</p>
                <p className="text-xs text-gray-500">{mentor.role}</p>
              </div>
            </div>
            <button className="bg-blue-600 text-white text-xs py-1 px-2 rounded">Follow</button>
          </div>
        ))}
        <a href="/mentors" className="mt-2 inline-block text-blue-600 text-sm hover:underline">See All</a>
      </div>
    </div>
  );
};

export default Profilebar;