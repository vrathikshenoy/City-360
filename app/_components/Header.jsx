"use client"
import { Button } from '@/components/ui/button'
import { SignOutButton, UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Menu, X } from 'react-feather' // Using react-feather for icons
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function Header() {
  const path = usePathname();
  const { user, isSignedIn } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    console.log(path)
  }, [path])

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gray-800 backdrop-blur-md shadow-md"> {/* Glassmorphism effect */}
      <div className="container mx-auto flex justify-between items-center p-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4">
          <Image src={'/Designer.png'} width={50} height={50} alt='logo' />
          <span className="font-bold text-lg hidden md:inline text-white">City-360</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-10 items-center">
          {["/", "/heatmap", "/calendar", "/feedback","/virtual-guide"].map((href, index) => (
            <Link key={index} href={href}>
              <li className={`hover:text-yellow-400 font-semibold text-lg cursor-pointer ${path === href ? 'text-yellow-400' : 'text-gray-100'}`}>
                {href === '/' ? 'Home' : href.slice(1).charAt(0).toUpperCase() + href.slice(2)}
              </li>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-white">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Right Side - User Profile */}
        <div className='flex gap-4 items-center'>
          {isSignedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Image src={user?.imageUrl} width={35} height={35} alt='user profile' className='rounded-full cursor-pointer' />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={'/user'}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={'/user#/my-listing'}>My Listing</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SignOutButton afterSignOutUrl="/">Logout</SignOutButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href={'/sign-in'}>
              <Button variant="outline" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Login</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/30 backdrop-blur-md shadow-md border-t">
          <nav className="flex flex-col p-4">
            {["/", "/heatmap", "/calander", "/feedback"].map((href, index) => (
              <Link key={index} href={href} className={`py-2 font-semibold text-lg ${path === href ? 'text-yellow-400' : 'text-white'}`}>
                {href === '/' ? 'Home' : href.slice(1).charAt(0).toUpperCase() + href.slice(2)}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header;
