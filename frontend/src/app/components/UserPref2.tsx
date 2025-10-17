"use client"
import React, { useState } from 'react'
import { GoPencil } from "react-icons/go";

const UserPref2 = () => {
    const dietOptions = ["Vegan", "Glutenfree", "Egg-free"]
    const excludedOptions = ["Nuts", "Oil", "Milk"]

    const [isEditing,setIsEditing] = useState(false) 
    const [selectedDiet,setSelectedDiet] = useState([])
    const [selectExclude,setSelectExcluded] = useState([]) 


    const toggleOption = (option, list, setList) => {
        setList(prev =>
          prev.includes(option)
            ? prev.filter(item => item !== option)
            : [...prev, option]
        );
    };   

  return (
    <div className='max-w-4xl mx-auto mt-10'>
        <hr className='border-t border-gray-300 my-4'/>
        <h1 className='text-gray-400 text-lg font-medium mb-6 flex items-center justify-center'>Recipe Preferences</h1>
        {/* Rest */}
            <div className='flex items-center justify-between mb-2'>
                <h1 className='tracking-wide text-rose-500'>Dietary Conditions</h1>
                <div className='flex items-center gap-2'>
                  <button onClick={() => setIsEditing(!isEditing)} className={`transition ${isEditing ? 'text-rose-600' : 'text-rose-400'}`}><GoPencil/></button>
                  {isEditing && <span className='text-sm text-amber-900 italic'>Editing...</span>}
                </div>
            </div>
            <div className='bg-rose-50 rounded-xl p-6 space-y-4'>
                <div>
                    <p className='text-black mb-2'>Diet</p>
                    <div className='flex flex-wrap gap-2'>
                        {dietOptions.map(option => (
                            <button key={option} onClick={() => isEditing && toggleOption(option, selectedDiet, setSelectedDiet)}
                                className={`px-3 py-1 space-x-2 rounded-lg text-sm font-medium transition ${
                                selectedDiet.includes(option)
                                    ? 'bg-rose-500 text-white'
                                    : 'bg-gray-200 text-gray-700'
                                } ${isEditing ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                      <p className='mb-2'>Excluded Ingredients</p>
                      <div className='flex flex-wrap gap-2'>
                        {excludedOptions.map(option2 => (
                            <button key={option2} onClick={() => isEditing && toggleOption(option2, selectExclude, setSelectExcluded)}
                                className={`px-3 py-1 space-x-2 rounded-lg text-sm font-medium transition ${
                                selectExclude.includes(option2)
                                    ? 'bg-rose-500 text-white'
                                    : 'bg-gray-200 text-gray-700'
                                } ${isEditing ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
                            >
                                {option2}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
    </div>
)
}



export default UserPref2        