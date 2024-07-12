import React, { useState, useEffect, useCallback } from 'react'
import { Tab, Tabs, Form } from 'react-bootstrap'
import './DietPlannerForm.css'

// Component for selecting meal filters based on meal type
const MealFilters = ({ mealType, setMealFilters }) => {
  const [selectedFilters, setSelectedFilters] = useState([])

  // Memooized function to handle adding or removing filters
  const handleFilterClick = useCallback((filter) => {
    setSelectedFilters((prevFilters) => {
      // toggle filter from the list
      if (prevFilters.includes(filter)) {
        // remove filter if already included
        return prevFilters.filter((f) => f !== filter)
      } else {
        // add filter if not included
        return [...prevFilters, filter]
      }
    })
  }, [])

  // Effect to update meal filters when selectedFilters or mealType changes
  useEffect(() => {
    // call parent component function to update filters
    setMealFilters(mealType, selectedFilters)
  }, [mealType, selectedFilters, setMealFilters])

  const mealOptions = [
    'drinks', 'egg', 'biscuits and cookies', 'bread', 'pancake', 'cereals',
    'desserts', 'pizza', 'pasta', 'salad', 'seafood', 'sandwiches', 'pastry',
    'soup', 'alcohol and cocktail', 'pies and tarts', 'ice cream and custard', 'side dish',
    'preps', 'sweets', 'occasions', 'main course', 'starter',
    'condiments and sauces', 'preserve'
  ]

  return (
    <div className='meal-filters d-flex flex-wrap'>
      {mealOptions.map((option) => (
        <div key={option} className='p-2'>
          <button
            type='button'
            className={`btn ${
              selectedFilters.includes(option) ? 'btn-success' : 'btn-outline-secondary'
            } mb-2`}
            onClick={() => handleFilterClick(option)}
          >
            {option}
          </button>
        </div>
      ))}
    </div>
  )
}

// Main component for the diet planner form
const DietPlannerForm = ({ setSize, setDietaryPreferences, onSubmit }) => {
  const [loading, setLoading] = useState(false)
  const [days, setDays] = useState('')

  // function to update dietary preferences based on meal type and selected filters
  const updateMealFilters = useCallback((mealType, filters) => {
    setDietaryPreferences((prevFilters) => ({ ...prevFilters, [mealType]: filters }))
  }, [setDietaryPreferences])

  // handle form submission
  const handleSubmit = (event) => {
    event.preventDefault()
    setLoading(true)

    // Check if any filters are empty and set defaults
    setDietaryPreferences((prevPreferences) => {
      const defaultMealOptions = [
        'drinks', 'egg', 'biscuits and cookies', 'bread', 'pancake', 'cereals',
        'desserts', 'pizza', 'pasta', 'salad', 'seafood', 'sandwiches', 'pastry',
        'soup', 'alcohol and cocktail', 'pies and tarts', 'ice cream and custard', 'side dish',
        'preps', 'sweets', 'occasions', 'main course', 'starter',
        'condiments and sauces', 'preserve'
      ]

      const newPreferences = { ...prevPreferences }
      if (prevPreferences.breakfast.length === 0) {
        newPreferences.breakfast = defaultMealOptions
      }
      if (prevPreferences.lunch.length === 0) {
        newPreferences.lunch = defaultMealOptions
      }
      if (prevPreferences.dinner.length === 0) {
        newPreferences.dinner = defaultMealOptions
      }
      return newPreferences
    })

    // setSize(days);
    // onSubmit will call fetchMealPlan in DietPlanner
    onSubmit(days, () => setLoading(false))
  }

  return (
    <>
      <div className='container'>
        <div className='row diet-planner-form rounded-4 p-3 shadow' style={{ backgroundColor: '#ffff' }}>
          <Tabs defaultActiveKey='breakfast' id='meal-type-tabs'>
            <Tab eventKey='breakfast' title='Breakfast'>
              <MealFilters mealType='breakfast' setMealFilters={updateMealFilters} />
            </Tab>
            <Tab eventKey='lunch' title='Lunch'>
              <MealFilters mealType='lunch' setMealFilters={updateMealFilters} />
            </Tab>
            <Tab eventKey='dinner' title='Dinner'>
              <MealFilters mealType='dinner' setMealFilters={updateMealFilters} />
            </Tab>
          </Tabs>
          <Form onSubmit={handleSubmit} className='my-4'>
            <div className='form-group'>
              <label htmlFor='mealPlanDays'>Number of days for the meal plan:</label>
              <input
                type='number'
                className='form-control'
                id='mealPlanDays'
                value={days}
                onChange={(e) => setDays(e.target.value)}
                min='1'
                max='7'
                required
              />
            </div>
            <button type='submit' className='btn btn-primary m-2' disabled={loading}>
              {loading ? 'Loading...' : 'Generate Meal Plan'}
            </button>
          </Form>
        </div>
      </div>
    </>
  )
}

export default DietPlannerForm
