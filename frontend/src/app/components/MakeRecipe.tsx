'use client';
import React from 'react'
import { useState, useRef, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useMakeRecipe } from '../../hooks/useMakeRecipe'
import { useAuthContext } from '../../hooks/useAuthContext'

const MakeRecipe = () => {
  const  [title, setTitle] = useState('')
  const  [course, setCourse] = useState('')
  const  [servings, setServings] = useState('')
  const  [description, setDescription] = useState('')
  const  [prepTime, setPrepTime] = useState(0)
  const  [cookTime, setCookTime] = useState(0)
  const  [calories, setCalories] = useState("")
  const  [cuisine, setCuisine] = useState("")
  const  [difficulty, setDifficulty] = useState(0)
  const  [steps, setSteps] = useState<string[]>([])
  const  [ingredients, setIngredients] = useState<string[]>([])
  const  [newIngredient, setNewIngredient] = useState("")
  const  [newStep, setNewStep] = useState("")
  const [date, setDate] = useState(new Date());
  const  [image, setImage] = useState<string | null>(null)

  const { makerecipe, error, isLoading, success, clearError } = useMakeRecipe()
  const { user } = useAuthContext();
  const router = useRouter();

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
      router.push('/signup');
      return;
    }

    const time = date.toLocaleString('default', { month: 'long' }) + " " + date.getDate() + ", " + date.getFullYear();

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
      time,
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
      time,
      image
    );

    alert("Recipe submitted!\n\n" + JSON.stringify(payload, null, 2));

    // Reset form fields
    setTitle("");
    setCourse("");
    setServings("");
    setDescription("");
    setPrepTime(0);
    setCookTime(0);
    setCalories("");
    setCuisine("");
    setDifficulty(0);
    setSteps([]);
    setNewStep("");
    setIngredients([]);
    setNewIngredient("");
    setImage(null);
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-rose-50 to-white text-neutral-900'>
      <div className='mx-auto max-w-6xl px-4 py-12'>
        <div className='mb-8'>
          <h1 className='text-5xl font-extrabold tracking-tight text-gray-900'>Share Your Recipe</h1>
          <p className='mt-2 text-lg text-gray-600'>Share your culinary creation with the community</p>
        </div>

        <form onSubmit={handleSubmit} className='mt-8 grid grid-cols-1 gap-8 md:grid-cols-[1fr_400px]'>
          {/* Left Column - Form Fields */}
          <div className='space-y-6'>
            {/* Basic Information Card */}
            <div className='rounded-2xl bg-white p-6 shadow-lg border border-gray-100'>
              <h2 className='text-xl font-bold text-gray-900 mb-5 flex items-center gap-2'>
                <span className='text-2xl'>📝</span> Basic Information
              </h2>
              <div className='space-y-4'>
                <div>
                  <label className="mb-2 block font-semibold text-sm text-gray-700">Recipe Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='e.g., Chocolate Chip Cookies'
                    required
                    className='w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100'
                  />
                </div>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <div>
                    <label className='mb-2 block text-sm font-semibold text-gray-700'>Course *</label>
                    <input
                      type="text"
                      value={course}
                      onChange={(e)=> setCourse(e.target.value)}
                      placeholder='Breakfast/Lunch/Dinner'
                      required
                      className='w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100'
                    />
                  </div>
                  <div>
                    <label className='mb-2 block text-sm font-semibold text-gray-700'>Serving Size *</label>
                    <input
                      type="text"
                      value={servings}
                      onChange={(e) => setServings(e.target.value)}
                      placeholder="e.g., 4 servings"
                      required
                      className='w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100'
                    />
                  </div>
                </div>
                <div>
                  <label className='mb-2 block text-sm font-semibold text-gray-700'>Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder='A delicious and easy recipe that everyone will love...'
                    rows={3}
                    className='w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100'
                  />
                </div>
              </div>
            </div>

            {/* Details Card */}
            <div className='rounded-2xl bg-white p-6 shadow-lg border border-gray-100'>
              <h2 className='text-xl font-bold text-gray-900 mb-5 flex items-center gap-2'>
                <span className='text-2xl'>⏱️</span> Details
              </h2>
              <div className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
                <div>
                  <label className='mb-3 block text-sm font-semibold text-gray-700'>Prep Time</label>
                  <div className='flex items-center gap-2'>
                    <div className='flex items-center rounded-lg border-2 border-gray-200 bg-white shadow-sm'>
                      <button
                        type='button'
                        onClick={()=> setPrepTime(Math.max(0, prepTime - 5))}
                        className='px-3 py-2 text-lg font-semibold text-gray-600 hover:bg-gray-100 transition'
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={prepTime}
                        onChange={(e) => setPrepTime(Number(e.target.value))}
                        className='w-16 bg-white p-2 text-center text-sm font-medium'
                      />
                      <button
                        type='button'
                        onClick={()=> setPrepTime(prepTime + 5)}
                        className='px-3 py-2 text-lg font-semibold text-gray-600 hover:bg-gray-100 transition'
                      >
                        +
                      </button>
                    </div>
                    <span className='text-sm text-gray-500 font-medium'>min</span>
                  </div>
                </div>
                <div>
                  <label className='mb-3 block text-sm font-semibold text-gray-700'>Cook Time</label>
                  <div className='flex items-center gap-2'>
                    <div className='flex items-center rounded-lg border-2 border-gray-200 bg-white shadow-sm'>
                      <button
                        type='button'
                        onClick={()=> setCookTime(Math.max(0, cookTime - 5))}
                        className='px-3 py-2 text-lg font-semibold text-gray-600 hover:bg-gray-100 transition'
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={cookTime}
                        onChange={(e) => setCookTime(Number(e.target.value))}
                        className='w-16 bg-white p-2 text-center text-sm font-medium'
                      />
                      <button
                        type="button"
                        onClick={()=> setCookTime(cookTime + 5)}
                        className='px-3 py-2 text-lg font-semibold text-gray-600 hover:bg-gray-100 transition'
                      >
                        +
                      </button>
                    </div>
                    <span className='text-sm text-gray-500 font-medium'>min</span>
                  </div>
                </div>
                <div>
                  <label className='mb-3 block text-sm font-semibold text-gray-700'>Difficulty</label>
                  <div className='flex items-center gap-2'>
                    <div className='flex items-center rounded-lg border-2 border-gray-200 bg-white shadow-sm'>
                      <button
                        type='button'
                        onClick={()=> setDifficulty(Math.min(5, Math.max(1, difficulty - 1)))}
                        className='px-3 py-2 text-lg font-semibold text-gray-600 hover:bg-gray-100 transition'
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={difficulty}
                        onChange={(e) => setDifficulty(Number(e.target.value))}
                        className='w-16 bg-white p-2 text-center text-sm font-medium'
                        min="1"
                        max="5"
                      />
                      <button
                        type='button'
                        onClick={()=> setDifficulty(Math.min(5, Math.max(1, difficulty + 1)))}
                        className='px-3 py-2 text-lg font-semibold text-gray-600 hover:bg-gray-100 transition'
                      >
                        +
                      </button>
                    </div>
                    <span className='text-sm text-gray-500 font-medium'>/5</span>
                  </div>
                </div>
              </div>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4'>
                <div>
                  <label className='block mb-2 text-sm font-semibold text-gray-700'>Calories</label>
                  <input
                    type="text"
                    value={calories}
                    onChange={(e)=> setCalories(e.target.value)}
                    placeholder='e.g., 350 kcal'
                    className='w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100'
                  />
                </div>
                <div>
                  <label className='block mb-2 text-sm font-semibold text-gray-700'>Cuisine</label>
                  <input
                    type="text"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    placeholder='e.g., Italian, Mexican'
                    className='w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100'
                  />
                </div>
              </div>
            </div>

            {/* Ingredients Card */}
            <div className='rounded-2xl bg-white p-6 shadow-lg border border-gray-100'>
              <h2 className='text-xl font-bold text-gray-900 mb-5 flex items-center gap-2'>
                <span className='text-2xl'>🥕</span> Ingredients
              </h2>
              <div className='space-y-3'>
                {ingredients.map((ing,i) =>(
                  <div
                    key={i}
                    className='flex items-center justify-between rounded-lg border-2 border-gray-100 bg-gray-50 px-4 py-3 text-sm hover:border-rose-200 transition'
                  >
                    <span className='truncate font-medium text-gray-700'>{ing}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(i)}
                      className='ml-3 rounded-lg px-3 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 transition'
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className='flex gap-2 mt-4'>
                  <input
                    type="text"
                    className='flex-1 rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100'
                    placeholder='e.g., 2 cups flour'
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIngredient())}
                  />
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className='flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition bg-rose-500 hover:bg-rose-600 shadow-md hover:shadow-lg'
                  >
                    <span className='text-lg'>+</span> Add
                  </button>
                </div>
              </div>
            </div>

            {/* Instructions Card */}
            <div className='rounded-2xl bg-white p-6 shadow-lg border border-gray-100'>
              <h2 className='text-xl font-bold text-gray-900 mb-5 flex items-center gap-2'>
                <span className='text-2xl'>📖</span> Instructions
              </h2>
              <div className='space-y-3'>
                {steps.map((inst,j) =>(
                  <div
                    key={j}
                    className='flex items-start gap-3 rounded-lg border-2 border-gray-100 bg-gray-50 px-4 py-3 text-sm hover:border-rose-200 transition'
                  >
                    <span className='flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-bold'>{j + 1}</span>
                    <span className='flex-1 font-medium text-gray-700'>{inst}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(j)}
                      className='ml-3 rounded-lg px-3 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 transition'
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className='flex gap-2 mt-4'>
                  <textarea
                    className='flex-1 rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100'
                    placeholder='Describe the step...'
                    value={newStep}
                    onChange={(e) => setNewStep(e.target.value)}
                    rows={2}
                  />
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className='flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition bg-rose-500 hover:bg-rose-600 shadow-md hover:shadow-lg self-start'
                  >
                    <span className='text-lg'>+</span> Add
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className='pt-2'>
              <button
                type="submit"
                disabled={isLoading}
                className='w-full rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4 text-base font-bold text-white shadow-lg transition hover:from-rose-600 hover:to-pink-600 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isLoading ? 'Posting...' : '🎉 Share Recipe'}
              </button>
            </div>
          </div>

          {/* Right Column - Image Upload */}
          <div className='md:sticky md:top-6 h-fit'>
            <div className='rounded-2xl bg-white p-6 shadow-lg border border-gray-100'>
              <h2 className='text-xl font-bold text-gray-900 mb-4 flex items-center gap-2'>
                <span className='text-2xl'>📸</span> Recipe Photo
              </h2>
              <div
                className='relative flex h-96 w-full cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 text-center transition hover:border-rose-400 hover:bg-rose-50'
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  onDropFile(e.dataTransfer.files)
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                {image ? (
                  <div className='relative w-full h-full group'>
                    <img src={image} alt="recipe" className='h-full w-full rounded-2xl object-cover'/>
                    <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition rounded-2xl flex items-center justify-center'>
                      <span className='text-white font-semibold opacity-0 group-hover:opacity-100 transition'>Click to change</span>
                    </div>
                  </div>
                ) : (
                  <div className='p-8'>
                    <div className='mx-auto w-24 h-24 mb-4 text-gray-300'>
                      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className='text-base font-semibold text-gray-700 mb-1'>Upload Recipe Photo</p>
                    <p className='text-sm text-gray-500'>Drag & drop or click to browse</p>
                    <p className='text-xs text-gray-400 mt-2'>PNG, JPG up to 10MB</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} accept='image/*' className='hidden' onChange={(e) => onDropFile(e.target.files)}/>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MakeRecipe
