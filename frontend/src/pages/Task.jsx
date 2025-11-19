import { motion } from "framer-motion"
import Profilebar from "../components/Layout/Profilebar"
import Sidebar from "../components/Layout/Sidebar"
import Navbar from "../components/Shared/Navbar"

const Task = () => {
  return (
    <div className='min-h-screen lg:px-4 w-full overflow-x-hidden bg-gray-100 flex items-center flex-col'>
      <div className='w-full flex flex-1 justify-between'>
        {/* Left Sidebar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='hidden lg:block w-64'
        >
          <Sidebar />
        </motion.div>
        {/* Main Content */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='flex-1 flex flex-col justify-between'
        >
          <div className='w-full flex justify-center'>
            <Navbar isAuthenticated={true} user={{ name : 'Ganesh'}}/>
          </div>
          <div className="px-4 pb-2 h-full">
            <div className="task p-4 w-fit border-[0.5px] border-gray-500 rounded-md">
                <p className="w-fit text-sm p-2 border-[0.5px] border-gray-500 rounded-4xl">7:00 AM</p>
                <h2 className="text-2xl font-bold">To do Homework</h2>
                <button className="mt-2 px-2 pt-1 pb-1.5 text-white font-semibold bg-blue-500 rounded-md" type="button">Submit now</button>
            </div>
          </div>
        </motion.main>
        {/* Right Sidebar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='hidden lg:block w-64'
        >
          <Profilebar />
        </motion.div>
      </div>
    </div>
  )
}

export default Task