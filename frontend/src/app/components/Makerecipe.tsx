'use client';
import React from 'react'
import { useState, useRef, FormEvent, useContext } from 'react'
import { useMakeRecipe } from '../../../hooks/useMakeRecipe'
import { AuthContext } from '../../../context/AuthContext'

const MakeRecipe = () => {
  const  [title, setTitle] = useState('')
  const  [course, setCourse] = useState('')
  const  [servings, setServings] = useState('')
  const  [description, setDescription] = useState('')
  const  [prepTime, setPrepTime] = useState(0)
  const  [cookTime, setCookTime] = useState(0)
  const  [calories, setCalories] = useState("")
  const  [cuisine, setCuisine] = useState("")
  const  [difficulty, setDifficulty] = useState('')
  const  [steps, setSteps] = useState<string[]>([])
  const  [ingredients, setIngredients] = useState<string[]>([])
  const  [newIngredient, setNewIngredient] = useState("")
  const  [newStep, setNewStep] = useState("")
  const  [image, setImage] = useState<string | null>(null)

  const { makerecipe, error, isLoading, success, clearError } = useMakeRecipe()
  const { user } = useContext(AuthContext);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
  function handleAddStep(){
    const trimmedS = newStep.trim();
    if (!trimmedS) return;
    setSteps((prev) => [...prev, trimmedS])
    setNewStep("")
  }
  function handleRemoveStep(j: number) {
    setSteps((prev) => prev.filter((_, idx) => idx !== j))
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to make a recipe.");
      return;
    }
    
    const payload = {
      title,
      user: user.username,
      course,
      servings,
      description,
      prepTime,
      cookTime,
      calories,
      cuisine,
      difficulty,
      ingredients,
      steps,
      image,
    };

    await makerecipe(
      title,
      user.username,
      course,
      servings,
      description,
      prepTime,
      cookTime,
      calories,
      cuisine,
      difficulty,
      steps,
      ingredients,
      image
    );

    alert("Recipe submitted!\n\n" + JSON.stringify(payload, null, 2));

    // Reset form fields here:
    setTitle("");
    setCourse("");
    setServings("");
    setDescription("");
    setPrepTime(0);
    setCookTime(0);
    setCalories("");
    setDifficulty("");
    setSteps([]);
    setNewStep("");
    setIngredients([]);
    setNewIngredient("");
    setImage(null);
  }
  return (
    <div className='min-h-screen bg-white text-neutral-900'>
      <div className='mx-auto max-w-6xl px-4 py-10'>
        <h1 className='text-4xl font-extrabold tracking-tight'>Share your Recipe</h1>
        
          <form onSubmit={ handleSubmit } className='mt-8 grid grid-cols-1 gap-8 md:grid-cols-[1fr_360px]'>
            {/* left */}
            <div className='space-y-6'>
              <div>
                <label className="mb-2 block font-semibold text-sm">Recipe Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Jollof Rice' required className='w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-gray-400'/>
              </div>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div>
                  <label className='mb-2 block text-sm font-semibold'>Course</label>
                  <input type="text" value={course} onChange={(e)=> setCourse(e.target.value)} placeholder='Lunch/Dinner' required className='w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-gray-400'/>
                </div>
                <div>
                  <label className='mb-2 block text-sm font-semibold'>Serving Size</label>
                  <input type="text" value={servings} onChange={(e) => setServings(e.target.value)} placeholder = "2 servings" required className='w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-gray-400'/>
                </div>
              </div>
              <div>
                <label className='mb-2 block text-sm font-semibold'>Description</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Delicious and healthy meal option when you are short on time' className='w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-gray-400'/>
              </div>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div>
                  <label className='mb-2 block text-sm font-semibold'>Prep Time</label>
                  <div className='flex items-center gap-2'>
                    <div className='flex items-center rounded-xl border border-neutral-200 bg-white shadow-sm '>
                        <button type='button' onClick={()=> setPrepTime(Math.max(0, prepTime - 1))} className='px-3 py-2 text-sm'>-</button>
                        <input type="number" value={prepTime} placeholder='' onChange={(e) => setPrepTime(Number(e.target.value))} className='w-16 bg-white p-2 text-center text-sm'/>
                        <button type='button' onClick={()=> setPrepTime(prepTime + 1)} className='px-3 py-2 text-sm'>+</button>
                    </div>
                    <span className='text-sm text-neutral-500'>minutes</span>
                  </div>
                </div>
                <div>
                  <label className='mb-2 block text-sm font-semibold'>Cooking Time</label>
                  <div className='flex items-center gap-2'>
                    <div className='flex items-center rounded-xl border border-neutral-200 bg-white shadow-sm '>
                        <button type='button' className='px-3 py-2 text-sm' onClick={()=> setCookTime(Math.max(0, cookTime - 1))}>-</button>
                        <input type="number" value={cookTime} placeholder='' onChange={(e) => setCookTime(Number(e.target.value))} className='w-16  bg-white p-2 text-center text-sm'/>
                        <button type="button" onClick={()=> setCookTime(cookTime + 1)} className='px-3 py-2 text-sm'>+</button>
                    </div>
                    <span className='text-sm text-neutral-500'>minutes</span>
                  </div>
                </div>
              </div>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div>
                  <label className='block mb-2 text-sm font-semibold'>Calories</label>
                  <input type="text" value={calories} onChange={(e)=> setCalories(e.target.value)} placeholder='350 kcal' className='w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-gray-400'/>
                </div>
                <div>
                  <label>Difficulty</label>
                  <input type="text" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} placeholder='Easy/Medium/Hard' className='w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-gray-400'/>
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
                    <input type="text" className='w-full flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-rose-400' placeholder='Add Ingredient' value={newIngredient} onChange={(e) => setNewIngredient(e.target.value)}/>
                    <button type="button" onClick={handleAddIngredient} className='mt-3 items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition bg-red-400 hover:border-rose-500 hover:cursor-pointer'>
                      <span className='text-lg'>+</span> Add Ingredient
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className='mb-2 block text-sm font-semibold'>Instructions</label>
                  <div className='space-y-2'>
                    {steps.map((inst,j) =>(
                      <div 
                      key = {j}
                      className='flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm'
                      >
                      <span className='truncate'>{inst}</span>
                      <button type="button" onClick={() => handleRemoveStep(j)} className='ml-3 rounded-lg px-2 py-1 text-xs text-neutral-500 hover:bg-neutral-100'>Remove</button>
                      </div>
                    ))}
                    <div className='flex-gap-2'>
                      <input type="text" className='w-full flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-rose-400' placeholder='Add Instruction' value={newStep} onChange={(e) => setNewStep(e.target.value)}/>
                      <button type="button" onClick={handleAddStep} className='mt-3 items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition bg-red-400 hover:border-rose-500 hover:cursor-pointer'>
                        <span className='text-lg'>+</span> Add Instruction
                      </button>
                    </div>
                  </div>
              </div>
              <div className='pt-2'>
                <button type="submit" className='w-full rounded-xl bg-rose-400 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-500'>Post</button>
              </div>
            </div>
            <div>
              <div
              className='sticky top-6 flex h-80 w-full cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-[#d9d9d9] text-center'
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
                <div>
                  <div>
                    <img src='/UploadImage.png' className="h-80">
                    </img>
                  </div>
                </div>
              </div>
            )}
            <input type="file" ref={fileInputRef} accept='image/*' className='hidden' onChange={(e) => onDropFile(e.target.files)}/>
              </div>
            </div>
          </form>
        
      </div>
    </div>
  )
}

export default MakeRecipe
