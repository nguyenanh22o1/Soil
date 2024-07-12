import React from 'react'
import './MealCard.css'

// Meal card layout
const MealCard = ({ mealType, recipeDetail }) => {
  const nutrients = recipeDetail.totalNutrients || {}
  const yieldAmount = recipeDetail.yield || 1

  return (
    <div className='meal-card bg-light border rounded shadow-sm'>
      <div className='bg-secondary text-white text-center p-2'>{mealType}</div>
      <div className='meal-card-image-container'>
        <img src={recipeDetail.image} className='img-fluid' alt={recipeDetail.label} />
      </div>
      <div className='d-flex flex-column justify-content-around p-2'>
        <h5 className='mt-2'>{recipeDetail.label}</h5>
        <p className='mb-1'>Servings: {Math.round(yieldAmount)}</p>
        <p className='mb-1'>Calories: {Math.round(recipeDetail.calories / yieldAmount)} kcal</p>
        <p className='mb-1'>Protein: {Math.round((nutrients.PROCNT?.quantity || 0) / yieldAmount)} g</p>
        <p className='mb-1'>Fat: {Math.round((nutrients.FAT?.quantity || 0) / yieldAmount)} g</p>
        <p className='mb-1'>Carbs: {Math.round((nutrients.CHOCDF?.quantity || 0) / yieldAmount)} g</p>
      </div>
    </div>
  )
}

export default MealCard
