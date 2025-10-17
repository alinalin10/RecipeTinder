"use client"
import React, { useState } from 'react'
import { GoPencil } from "react-icons/go";
import { IoMdCheckmark } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";

const UserPref = () => {
    const [image,setImage] = useState('/UserImage.png')
    const [isEditing, setIsEditing] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)

    const handleSave = () =>{
        setImage(preview)
        setPreview(null)
        setIsEditing(false)
    }
    const handleCancel = () =>{
        setPreview(null)
        setIsEditing(false)
    }
    const imageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const tempUrl = URL.createObjectURL(file)
            setPreview(tempUrl)
            setIsEditing(true)
        }
    }
  return (
    <div className='max-w-4xl mx-auto w-[80%] bg-white '>
        <div className='w-full p-6 flex justify-between items-center'>
            <div className='flex items-center space-x-8 mt-20'>
                <img className={`rounded-full w-40 h-40 p-4' ${!preview ? "bg-rose-100": ""} `} src={preview || image} alt="User" />

                <div>
                    <p className='text-rose-500 text-lg font-semibold py-3'>@username</p>
                    <p className='text-sm italic text-gray-600'>Joined October 3rd</p>
                </div>
            </div>
            {/* Right */}
                {isEditing ? (
                    <div className='flex items-center space-x-4'>
                        <button onClick={handleSave} className='cursor-pointer text-sm text-white bg-rose-400 px-3 py-2 rounded-full hover:bg-rose-500'>
                            <IoMdCheckmark size= {20}/>
                        </button>
                        <button onClick={handleCancel} className='cursor-pointer border border-gray-300 text-sm text-gray-700 bg-white px-3 py-2 rounded-full hover:bg-gray-100'>
                            <MdOutlineCancel size={20}/>
                        </button>
                    </div>
                        ) : (
                    <div>
                        <label htmlFor="imageUpload" className='text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:text-rose-900 bg-rose-300'>
                            <GoPencil/>
                        </label>
                        <input type="file" id="imageUpload" accept='image/*' className='hidden' onChange={imageChange}/>
                    </div>
                )}
        </div>
    </div>

  );
}



export default UserPref


// {isEditing ? (
//                         <div className='flex items-center space-x-4'>
//                             <input placeholder='Enter Username' value={tempUser} className='border border-gray-50 shadow-2xl rounded-full px-2 py-1 text-sm text-gray-900' onChange={(e)=> settempUser(e.target.value)}/>
//                             <button onClick={handleSave} className='cursor-pointer text-sm text-white bg-rose-400 px-2 py-2 rounded-full hover:bg-rose-500'><IoMdCheckmark color= 'white' size= {20} /></button>
//                             <button onClick={handleCancel} className='cursor-pointer hover:border hover:border-gray-500 text-sm text-white bg-white px-2 py-2 rounded-full hover:bg-white'><MdOutlineCancel color= 'black' size= {30} /></button>
//                         </div>
//                             ) : (
//                                 <>
//                                 <p className='text-rose-500 text-lg font-semibold py-3'>{username}</p>
//                                 <p className='text-sm italic text-gray-600'>Joined October 3rd</p>
//                                 </>
//                     )}