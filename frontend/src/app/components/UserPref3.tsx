"use client"
import React, { useState } from 'react'
import { GoPencil } from "react-icons/go";

const UserPref3 = () => {
    const cuisines = [  "Thai", "Japanese", "Mexican", "Nigerian",
  "Hawaiin", "Turkish", "Vietnamese", "Cuban",
  "Indian", "Chinese", "French", "Spanish",
  "Type", "Type", "Type", "Type", "Type", "Type", "Type", "Type"
];
    const [isEditing,setIsEditing] = useState(false) 
    const [selectedcuisine,setSelectedCuisine] = useState([])

    const toggleOption = (option, list, setList) => {
        setList(prev =>
          prev.includes(option)
            ? prev.filter(item => item !== option)
            : [...prev, option]
        );
    };  
    return (
        <div className='max-w-4xl mx-auto mt-10'>
            {/* Rest */}
                <div className='flex items-center justify-between mb-2'>
                    <h1 className='tracking-wide text-rose-500'>Cuisines</h1>
                    <div className='flex items-center gap-2'>
                      <button onClick={() => setIsEditing(!isEditing)} className={`transition ${isEditing ? 'text-rose-600' : 'text-rose-400'}`}><GoPencil/></button>
                      {isEditing && <span className='text-sm text-amber-900 italic'>Editing...</span>}
                    </div>
                </div>
                <div className='bg-rose-50 rounded-xl p-6 space-y-4'>
                    <div>
                        <p className='text-black mb-2'>Cuisine Choices</p>
                        <div className='flex flex-wrap gap-2'>
                            {cuisines.map(option3 => (
                                <button key={option3} onClick={() => isEditing && toggleOption(option3, selectedcuisine, setSelectedCuisine)}
                                    className={`px-3 py-1 space-x-2 rounded-lg text-sm font-medium transition ${
                                    selectedcuisine.includes(option3)
                                        ? 'bg-rose-500 text-white'
                                        : 'bg-gray-200 text-gray-700'
                                    } ${isEditing ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
                                >
                                    {option3}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
        </div>
    )
    }
export default UserPref3        