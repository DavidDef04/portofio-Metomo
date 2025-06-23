import React from 'react'

const Footer = () => {
  return (
    <footer className="border-t border-gray-700 z-10">
        <div className="bg-[#121212] text-center text-white py-4">
          <p>© 2025 David Rene <span className="text-transparent font-bold bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">METOMO</span>. All rights reserved.</p>
        </div>
        <div className="bg-[#121212] text-center text-white py-4">
          <p>Built with Next.js and Tailwind CSS</p>
        </div>
      </footer>
  )
}

export default Footer