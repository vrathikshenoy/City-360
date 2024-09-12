"use client"
import React from 'react'
import { grid } from 'ldrs'
grid.register()
function loading() {
  return (

<l-grid
  size="60"
  speed="1.5" 
  color="black" 
></l-grid>
  )
}

export default loading