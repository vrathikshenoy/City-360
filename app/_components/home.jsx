"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from 'next/link';
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Cyl from './Cyl';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { CardBody, CardContainer, CardItem } from "../../components/ui/3d-card";

const Home = () => {
  return (
    <>
      <div className="min-h-[90vh] bg-blue-900 flex flex-col p-0 m-0"> {/* Reduced height from 100vh to 90vh */}
        
        {/* Hero Section */}
        <section className="bg-blue-950 text-white py-16 flex-grow flex items-center justify-center w-full"> {/* Reduced padding */}
          <div className="w-full text-center px-4">
            <div className="w-full md:w-3/4 h-[60vh] mx-auto flex justify-center items-center overflow-hidden mb-8"> {/* Reduced height */}
              <Canvas style={{ height: '100%', width: '100%' }} camera={{ fov: 35 }}>
                <OrbitControls />
                <ambientLight />
                <Cyl />
                <EffectComposer>
                  <Bloom
                    mipmapBlur
                    intensity={12.0}
                    luminanceSmoothing={0.1}
                    luminanceThreshold={0}
                  />
                </EffectComposer>
              </Canvas>
            </div>
            <h1 className="text-6xl font-extrabold mb-6">Welcome to City-360</h1>
            <p className="text-xl mb-8">
              Empowering smart cities with modern infrastructure and cutting-edge technology.
            </p>
            <a
              href="#features"
              className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-full font-semibold hover:bg-yellow-500 transition"
            >
              Explore Features
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-blue-900 w-full"> {/* Reduced padding */}
          <div className="w-full text-center px-4">
            <h2 className="text-4xl font-bold mb-8 text-white">Our Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <Link href="/waste">
                <CardContainer className="inter-var">
                  <CardBody className="bg-blue-800 relative group/card hover:shadow-2xl hover:shadow-blue-500/[0.2] border border-blue-600 w-auto sm:w-[30rem] h-auto rounded-xl p-6">
                    <CardItem translateZ="50" className="text-xl font-bold text-white">
                      Waste Management
                    </CardItem>
                    <CardItem as="p" translateZ="60" className="text-blue-200 text-sm max-w-sm mt-2">
                      Proper waste management is a cornerstone of sustainable living, turning today's trash into tomorrow's treasure.
                    </CardItem>
                    <CardItem translateZ="100" className="w-full mt-4">
                      <Image
                        src="https://www.conserve-energy-future.com/wp-content/uploads/2014/04/waste-disposal-management-landfills-garbage.jpg"
                        height="1000"
                        width="1000"
                        className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                        alt="Plastic Waste Management"
                      />
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </Link>
              <Link href="/spots">
                <CardContainer className="inter-var">
                  <CardBody className="bg-blue-800 relative group/card hover:shadow-2xl hover:shadow-blue-500/[0.2] border border-blue-600 w-auto sm:w-[30rem] h-auto rounded-xl p-6">
                    <CardItem translateZ="50" className="text-xl font-bold text-white">
                      Tourism
                    </CardItem>
                    <CardItem as="p" translateZ="60" className="text-blue-200 text-sm max-w-sm mt-2">
                      Enhancing tourism with smart solutions for a more immersive and efficient travel experience.
                    </CardItem>
                    <CardItem translateZ="100" className="w-full mt-4">
                      <Image
                        src="https://static.india.com/wp-content/uploads/2022/12/travel-trends.jpg"
                        height="1000"
                        width="1000"
                        className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                        alt="Tourism"
                      />
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </Link>
              
              <Link href="/bus-tracking">
                <CardContainer className="inter-var">
                  <CardBody className="bg-blue-800 relative group/card hover:shadow-2xl hover:shadow-blue-500/[0.2] border border-blue-600 w-auto sm:w-[30rem] h-auto rounded-xl p-6">
                    <CardItem translateZ="50" className="text-xl font-bold text-white">
                      Transportation Management
                    </CardItem>
                    <CardItem as="p" translateZ="60" className="text-blue-200 text-sm max-w-sm mt-2">
                      Real-time bus tracking ensures efficiency, reduces wait times, and enhances commuter convenience.
                    </CardItem>
                    <CardItem translateZ="100" className="w-full mt-4">
                      <Image
                        src="https://assets.thehansindia.com/hansindia-bucket/gps_tracking-buses_5099.jpg"
                        height="1000"
                        width="1000"
                        className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                        alt="Bus Tracking"
                      />
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </Link>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="bg-gray-200 py-16 w-full"> {/* Reduced padding */}
          <div className="w-full text-center px-4">
            <h2 className="text-4xl font-bold mb-8">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-white p-6 shadow-lg rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Real-Time Data Monitoring</h3>
                <p>
                  Access real-time data about city infrastructure, including water, traffic, and more.
                </p>
              </div>
              <div className="bg-white p-6 shadow-lg rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Sustainable Urban Planning</h3>
                <p>
                  Plan for sustainable growth with smart planning tools and data insights.
                </p>
              </div>
              <div className="bg-white p-6 shadow-lg rounded-lg">
                <h3 className="text-xl font-semibold mb-4">IoT-Driven Solutions</h3>
                <p>
                  Use IoT technology to integrate city services for better management.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-blue-900 text-white py-6 w-full">
          <div className="w-full text-center">
            <p>&copy; 2024 City-360. All rights reserved.</p>
            <div className="flex justify-center mt-4">
              <a href="#" className="text-yellow-400 hover:text-yellow-500 mx-2">Facebook</a>
              <a href="#" className="text-yellow-400 hover:text-yellow-500 mx-2">Twitter</a>
              <a href="#" className="text-yellow-400 hover:text-yellow-500 mx-2">LinkedIn</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
