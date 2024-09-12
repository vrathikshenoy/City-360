import React from 'react'
import { useTexture } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import {useFrame } from '@react-three/fiber';



const Cyl = () => {
    let texture = useTexture('/image.png'); // Load texture inside the Canvas context
    let cyl=useRef(null);
    
    useFrame((state,delta)=>{
    cyl.current.rotation.y +=delta;
    })
  
    return (
      <group rotation={[0,1.4,0.6]}>
      <mesh ref={cyl}>
        <cylinderGeometry args={[1.5, 1.5, 1.5, 60, 60, true]} />
        <meshStandardMaterial map={texture} transparent  side={THREE.DoubleSide} />
      </mesh>
      </group>
    );
};

export default Cyl
