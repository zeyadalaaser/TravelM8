import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaUser, FaCompass, FaStore } from 'react-icons/fa'

export default function SignupGeneral() {
  const navigate = useNavigate()

  const handleButtonClick = (role) => {
    navigate(`/signup/${role}`)
  }

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } },
  }

  const roles = [
    { name: 'Tourist', icon: <FaUser />, path: 'signupTourist' },
    { name: 'Tour Guide', icon: <FaCompass />, path: 'signupTourguide' },
    { name: 'Seller', icon: <FaStore />, path: 'signupSeller' },
    { name: 'Adveriser', icon: <FaStore />, path: 'signupAdvertiser' },
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
      >
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Choose Your Role</h1>
        <div className="space-y-4">
          {roles.map((role) => (
            <motion.button
              key={role.path}
              onClick={() => handleButtonClick(role.path)}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="w-full py-3 px-4 bg-black text-white rounded-lg font-semibold text-lg flex items-center justify-center space-x-2 transition-colors duration-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              {role.icon} {/* Render the icon */}
              <span>{role.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
