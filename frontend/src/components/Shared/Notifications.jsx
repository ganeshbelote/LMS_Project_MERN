const Notifications = () => {
  return (
    <div className='wrapper px-4 pb-2 h-full'>
      {[...new Array(15).fill(1)].map((el, indx) => (
        <div
          key={indx}
          className='mt-2 p-4 border-[0.5px] border-gray-500 rounded-md flex gap-2'
        >
          <div className='profile h-fit w-fit rounded-xl bg-gray-500 p-2 text-center text-white'>
            GB
          </div>
          <div className='content'>
            <h2 className="font-semibold">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis,
              qui?
            </h2>
            <p className="text-sm text-gray-700">1hrs ago</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Notifications
