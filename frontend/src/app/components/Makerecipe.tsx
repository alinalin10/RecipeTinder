'use client';
import React from 'react'
import { useState, useRef } from 'react'
const Makerecipe = () => {
  const  [title, setTitle] = useState('')
  const  [course, setCourse] = useState('')
  const  [cuisine, setCuisine] = useState('')
  const  [servings, setServings] = useState('')
  const  [description, setDescription] = useState('')
  const  [prepTime, setPrepTime] = useState(0)
  const  [cookTime, setCookTime] = useState(0)
  const  [difficulty, setDifficulty] = useState(0)
  const  [calories, setCalories] = useState("")
  const  [steps, setSteps] = useState('')
  const  [ingredients, setIngredients] = useState<string[]>([])
  const  [newIngredient, setNewIngredient] = useState("")
  const  [image, setImage] = useState<string | null>(null)
  const courseOptions = [
    {id:1, dish:"main course"},
    {id:2, dish:"side dish"},
    {id:3, dish:"dessert"},
    {id:4, dish:"appetizer"},
    {id:5, dish:"salad"},
    {id:6, dish:"bread"},
    {id:7, dish:"breakfast"},
    {id:8, dish:"soup"},
    {id:9, dish:"beverage"},
    {id:10, dish:"sauce"},
    {id:11, dish:"marinade"},
    {id:12, dish:"fingerfood"},
    {id:13, dish:"snack"},
    {id:14, dish:"drink"},
  ]
  const cuisineOptions = [
  { id: 1, cuisine: "African" },
  { id: 2, cuisine: "Asian" },
  { id: 3, cuisine: "American" },
  { id: 4, cuisine: "British" },
  { id: 5, cuisine: "Cajun" },
  { id: 6, cuisine: "Caribbean" },
  { id: 7, cuisine: "Chinese" },
  { id: 8, cuisine: "Eastern European" },
  { id: 9, cuisine: "European" },
  { id: 10, cuisine: "French" },
  { id: 11, cuisine: "German" },
  { id: 12, cuisine: "Greek" },
  { id: 13, cuisine: "Indian" },
  { id: 14, cuisine: "Irish" },
  { id: 15, cuisine: "Italian" },
  { id: 16, cuisine: "Japanese" },
  { id: 17, cuisine: "Jewish" },
  { id: 18, cuisine: "Korean" },
  { id: 19, cuisine: "Latin American" },
  { id: 20, cuisine: "Mediterranean" },
  { id: 21, cuisine: "Mexican" },
  { id: 22, cuisine: "Middle Eastern" },
  { id: 23, cuisine: "Nordic" },
  { id: 24, cuisine: "Southern" },
  { id: 25, cuisine: "Spanish" },
  { id: 26, cuisine: "Thai" },
  { id: 27, cuisine: "Vietnamese" },
];

  const [isOpen,setIsOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null);

  // const 

  function onDropFile(files: FileList | null) {
    if (!files || !files[0]) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => setImage(String(e.target?.result));
    reader.readAsDataURL(file);
  }
  function handleAddIngredient(){
    const trimmed = newIngredient.trim();
    if (!trimmed) return;
    setIngredients((prev) => [...prev, trimmed])
    setNewIngredient("")
  }
  function handleRemoveIngredient(i: number) {
    setIngredients((prev) => prev.filter((_, idx) => idx !== i))
  }
   function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      title,
      course,
      servings,
      description,
      prepTime,
      cookTime,
      calories,
      difficulty,
      ingredients,
      steps: steps
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      image,
    };
    alert("Recipe submitted!\n\n" + JSON.stringify(payload, null, 2));
  }
  return (
    <div className='min-h-screen bg-white text-neutral-900'>
      <div className='mx-auto max-w-6xl px-4 py-10'>
        <h1 className='text-4xl font-extrabold tracking-tight'>Share your Recipe</h1>
        <form className='mt-8 grid grid-cols-1 gap-8 md:grid-cols-[1fr_360px]'>
          {/* left */}
          <div className='space-y-6'>
            <div>
              <label className="mb-2 block font-semibold text-sm">Recipe Title</label>
              <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Jollof Rice' required className='w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-gray-400'/>
            </div>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div>
                <label className='mb-2 block text-sm font-semibold'>Course</label>
                <select
                value={course}
                required
                onChange={(e) => setCourse(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-gray-400 appearance-none"
              >
                <option value="">Click to select Course</option>
                {courseOptions.map((option) => (
                  <option key={option.id} value={option.dish} >
                    {option.dish}
                  </option>
                ))}
              </select>
                {/* <input type="text" value={course} onChange={(e)=> setCourse(e.target.value)} placeholder='Lunch/Dinner' required className='w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-gray-400'/> */}
              </div>
              <div>
                <label className='mb-2 block text-sm font-semibold'>Serving Size</label>
                <input required type="text" onInput={(e) => {e.target.value = e.target.value.replace(/[^0-9]/g, ""); setServings(e.target.value);}} value={servings} onChange={(e) => setServings(e.target.value)} placeholder = "2 servings" required className='w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-gray-400'/>
              </div>
            </div>
            <div>
              <label className='mb-2 block text-sm font-semibold'>Description</label>
              <input required type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Delicious and healthy meal option when you are short on time' className='w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-gray-400'/>
            </div>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
              <div>
                <label className='mb-2 block text-sm font-semibold'>Prep Time</label>
                <div className='flex items-center gap-2'>
                  <div className='flex items-center rounded-xl border border-neutral-200 bg-white shadow-sm '>
                      <button type='button' onClick={()=> setPrepTime(Math.max(prepTime - 1,0))} className='px-3 py-2 text-sm'>-</button>
                      <input required value={prepTime} placeholder='' onChange={(e) => setPrepTime(Math.max(Number(e.target.value),0))} className='w-16 bg-white p-2 text-center text-sm'/>
                      <button type='button' onClick={()=> setPrepTime(prepTime + 1)} className='px-3 py-2 text-sm'>+</button>
                  </div>
                  <span className='text-sm text-neutral-500 sm:hidden lg:block'>minutes</span>
                </div>
              </div>
              <div>
                <label className='mb-2 block text-sm font-semibold'>Cooking Time</label>
                <div className='flex items-center gap-2'>
                  <div className='flex items-center rounded-xl border border-neutral-200 bg-white shadow-sm '>
                      <button type='button' className='px-3 py-2 text-sm' onClick={()=> setCookTime(Math.max(cookTime - 1,0))}>-</button>
                      <input required value={cookTime} placeholder='' onChange={(e) => setCookTime(Number(e.target.value))} className='w-16  bg-white p-2 text-center text-sm'/>
                      <button type="button" onClick={()=> setCookTime(cookTime + 1)} className='px-3 py-2 text-sm'>+</button>
                  </div>
                  <span className='text-sm text-neutral-500 sm:hidden lg:block'>minutes</span>
                </div>
              </div>
              <div>
                <div>
                <label className='mb-2 block text-sm font-semibold'>Difficulty</label>
                <div className='flex items-center gap-2'>
                  <div className='flex items-center rounded-xl border border-neutral-200 bg-white shadow-sm '>
                      <button type='button' className='px-3 py-2 text-sm' onClick={()=> setDifficulty(Math.max(difficulty - 1,0))}>-</button>
                      <input required value={difficulty} placeholder='' onChange={(e) => setDifficulty(Number(e.target.value))} className='w-16  bg-white p-2 text-center text-sm'/>
                      <button type="button" onClick={()=> setDifficulty(Math.min(difficulty + 1,5))} className='px-3 py-2 text-sm'>+</button>
                  </div>
                  <span className='text-sm text-neutral-500'></span>
                </div>
              </div>
              </div>
            </div>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div>
                <label className='block mb-2 text-sm font-semibold'>Calories</label>
                <input required type="text" value={calories} onChange={(e)=> setCalories(e.target.value)} onInput={(e) => {e.target.value = e.target.value.replace(/[^0-9]/g, ""); setCalories(e.target.value);}} placeholder='350 kcal' className='w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-gray-400'/>
              </div>
              {/* <div>
                <label>Difficulty</label>
                <input required type="text" value={difficulty} onChange={(e) => setDifficult(e.target.value)} placeholder='Easy/Medium/Hard' className='w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-gray-400'/>
              </div> */}
              <div>
                <label className='mb-2 block text-sm font-semibold'>Course</label>
                <select
                value={course}
                required
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-gray-400 appearance-none"
              >
                <option value="">Click to select Cuisine</option>
                {cuisineOptions.map((option) => (
                  <option key={option.id} value={option.cuisine} >
                    {option.cuisine}
                  </option>
                ))}
              </select>
                {/* <input type="text" value={course} onChange={(e)=> setCourse(e.target.value)} placeholder='Lunch/Dinner' required className='w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-gray-400'/> */}
              </div>
            </div>
            <div>
              <label className='mb-2 block text-sm font-semibold'>Ingredients and Measurement</label>
              <div className='space-y-2'>
                {ingredients.map((ing,i) =>(
                  <div 
                  key = {i}
                  className='flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm'
                  >
                  <span className='truncate'>{ing}</span>
                  <button type="button" onClick={() => handleRemoveIngredient(i)} className='ml-3 rounded-lg px-2 py-1 text-xs text-neutral-500 hover:bg-neutral-100'>Remove</button>
                  </div>
                ))}
                <div className='flex-gap-2'>
                  <input required type="text" className='w-full flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-rose-400' placeholder='Add Ingredient' value={newIngredient} onChange={(e) => setNewIngredient(e.target.value)}/>
                  <button type="button" onClick={handleAddIngredient} className='mt-3 items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition bg-red-400 hover:border-rose-500 hover:cursor-pointer'>
                    <span className='text-lg'>+</span> Add Ingredient
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label className='mb-2 block text-sm font-semibold'>Instructions</label>
              <textarea className='h-80 w-full resize-none rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm leading-6 shadow-sm outine-none focus:ring-2 focus:ring-gray-400' placeholder='Step by Step (One per line)' value={steps} onChange={(e) => setSteps(e.target.value)}/>
            </div>
            <div className='pt-2'>
              <button type="submit" className='w-full rounded-xl bg-rose-400 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-500'>Post</button>
            </div>
          </div>
          <div>
            <div
            className='sticky top-6 flex h-80 w-full cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-100/70 text-center'
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              onDropFile(e.dataTransfer.files)
            }}
            onClick={() => fileInputRef.current?.click()}
            >
            {image ? (
              <img src={image} alt="recipe" className='h-full w-full rounded-2xl object-cover'/>
            ):(<div>
              <div className='px-6'>
                <div>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
                    <path d="M19 3H5a2 2 0 00-2 2v14l4-4h12a2 2 0 002-2V5a2 2 0 00-2-2z" />
                  </svg>
                </div>
                <p className='text-sm font-semibold'>Drop or Upload Image</p>
                <p className='mt-1 text-xs text-neutral-500'>Up to 5MB</p>
              </div>
            </div>
          )}
          <input required type="file" ref={fileInputRef} accept='image/*' className='hidden' onChange={(e) => (e.target.files)}/>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Makerecipe
