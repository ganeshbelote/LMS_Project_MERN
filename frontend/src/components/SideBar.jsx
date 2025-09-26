const Sidebar = () => {
  const friends = [
    { name: 'Andrew Meter', role: 'Software Developer', image: 'https://via.placeholder.com/40' },
    { name: 'Jeff Linkoln', role: 'Product Owner', image: 'https://via.placeholder.com/40' },
    { name: 'Sasha Melstone', role: 'HR Manager', image: 'https://via.placeholder.com/40' },
  ];

  return (
    <div className="bg-white w-64 p-4 rounded-lg shadow-lg h-full flex flex-col justify-between">
      <div>
        <div className="space-y-4">
          <h3 className="text-sm text-blue-600 font-medium">OVERVIEW</h3>
          <a href="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
            <span className="text-xl">🏠</span>
            <span>Dashboard</span>
          </a>
          <a href="/inbox" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
            <span className="text-xl">📥</span>
            <span>Inbox</span>
          </a>
          <a href="/lesson" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
            <span className="text-xl">📚</span>
            <span>Lesson</span>
          </a>
          <a href="/task" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
            <span className="text-xl">📋</span>
            <span>Task</span>
          </a>
          <a href="/group" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
            <span className="text-xl">👥</span>
            <span>Group</span>
          </a>
        </div>
        <div className="mt-6 space-y-4">
          <h3 className="text-sm text-blue-600 font-medium">FRIENDS</h3>
          {friends.map((friend, index) => (
            <div key={index} className="flex items-center space-x-2 text-gray-700">
              <img src={friend.image} alt={friend.name} className="w-8 h-8 rounded-full" />
              <div>
                <p className="text-sm">{friend.name}</p>
                <p className="text-xs text-gray-500">{friend.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-sm text-blue-600 font-medium">SETTINGS</h3>
        <a href="/settings" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
          <span className="text-xl">⚙️</span>
          <span>Settings</span>
        </a>
        <a href="/logout" className="flex items-center space-x-2 text-red-600 hover:text-red-800">
          <span className="text-xl">⏏️</span>
          <span>Logout</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;