"use client"

import React, { useEffect } from 'react'
import { grid } from 'ldrs'

function Loading() {
  useEffect(() => {
    grid.register()
  }, [])

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center">
        <l-grid
          size="60"
          speed="1.5" 
          color="black" 
        ></l-grid>
        <p className="mt-4 text-lg font-semibold text-gray-700">Loading...</p>
      </div>
    </div>
  )
}

export default Loading