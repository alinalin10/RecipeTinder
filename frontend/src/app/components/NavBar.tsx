import Link from "next/link";
import "./NavBar.css";
import Image from "next/image";

export default function NavBar() {
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
        <Link href="/about">About</Link>
        <Link href="/make-recipe">Share Recipes</Link>
        <Link href="/recipes">My Recipes</Link>
        <Link href="/login">Login</Link>
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

