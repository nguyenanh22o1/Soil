import React from 'react'
import MealCard from '../MealCard/MealCard'

const DailyMealPlan = ({ dayNumber, meals }) => {
  // Layout for the meal plan
  return (
    <div className='my-4'>
      <h3 className='mb-3'>Day {dayNumber}</h3>
      <div className='row'>
        {meals.breakfast && (
          <div className='col-md-4'>
            <MealCard
              mealType='Breakfast'
              recipeDetail={meals.breakfast}
            />
          </div>
        )}
        {meals.lunch && (
          <div className='col-md-4'>
            <MealCard
              mealType='Lunch'
              recipeDetail={meals.lunch}
            />
          </div>
        )}
        {meals.dinner && (
          <div className='col-md-4'>
            <MealCard
              mealType='Dinner'
              recipeDetail={meals.dinner}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default DailyMealPlan
