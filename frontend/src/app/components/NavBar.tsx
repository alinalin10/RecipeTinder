"use client"
import Link from "next/link";
import "./NavBar.css";
import Image from "next/image";
import { useAuthContext } from '../../hooks/useAuthContext'
import { useLogout } from '../../hooks/useLogout'
import { useRouter } from 'next/navigation'

export default function NavBar() {
  const { user } = useAuthContext()
  const { logout } = useLogout()
  const router = useRouter()
  const handleLogout = () => {
    logout()
    router.push('/login')
  }
  return (
    <nav>
     {/* Left Logo */}
     <Link href="/" className="logo">
       <img src="/recipeTinderLogo.png" alt="App Logo" className="logo-img" />
       <span>RecipeTinder</span>
     </Link>


     {/* Links */}
    <div className="nav-right">
    <div className="nav-actions"></div>
      <div className="links">
        {/* <Link href="/about">About</Link> */}
        <Link href="/make-recipe">Share Recipes</Link>
        <Link href="/myrecipes">My Recipes</Link>
        {!user ? (
          <Link href="/login">Login</Link>
        ) : (
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        )}
      </div>

     {/* Sign up / User */}
       <Link href="/signup" className="signup-btn">Sign Up</Link>
       <Link href="/user-pref">
        <img src="/UserImage.png" alt="User Profile" className="profile-icon" />
       </Link>
     </div>
    
   </nav>

   
 
     
  );
}

