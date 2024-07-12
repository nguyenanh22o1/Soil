import React, { useState, useEffect, useCallback } from 'react'
import DailyMealPlan from '../../components/DailyMealPlan/DailyMealPlan'
import HealthInfoPopUp from '../../components/HealthInfoPopUp/HealthInfoPopUp'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import DietPlannerForm from '../../components/DietPlannerForm/DietPlannerForm'
import img from '../../assets/images/cook.jpg'
import axios from 'axios'
import './DietPlanner.css'

const DietPlanner = () => {
  const [isOpenPersonalHealthForm, setisOpenPersonalHealthForm] = useState(true)
  const [isLogin, setIsLogin] = useState(false)

  const [dietaryPreferencesNotConst, setDietaryPreferencesNotConst] = useState([])
  const [dietaryPreferences, setDietaryPreferences] = useState({
    breakfast: [],
    lunch: [],
    dinner: []
  })

  const [calories, setCalories] = useState(0)
  const [protein, setProtein] = useState(0)
  const [carbs, setCarbs] = useState(0)
  const [fat, setFat] = useState(0)

  const [size, setSize] = useState('')
  const [mealPlan, setMealPlan] = useState(null)
  const [recipeDetails, setRecipeDetails] = useState({})

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))
    if (loggedInUser) {
      setIsLogin(true)
      setisOpenPersonalHealthForm(!loggedInUser.isSetupPersonalHealth)

      const { activityLevel, age, sex, weight, height, healthGoals, dietaryPreferences } = loggedInUser
      const activityLevelValue = activityLevelConverter(activityLevel)

      const calculatedCalories = calculateCalories(sex, age, weight, height, activityLevelValue, healthGoals)
      const { protein, carbs, fat } = calculateMacros(calculatedCalories, dietaryPreferences || [])

      if (dietaryPreferences && (dietaryPreferences.includes('high-protein') || dietaryPreferences.includes('low-carb'))) {
        const updatedDietaryPreferences = dietaryPreferences.filter(preference => preference !== 'high-protein' && preference !== 'low-carb')
        setDietaryPreferencesNotConst(updatedDietaryPreferences)
      } else {
        setDietaryPreferencesNotConst(dietaryPreferences || [])
      }

      setCalories(Math.round(calculatedCalories))
      setProtein(Math.round(protein))
      setCarbs(Math.round(carbs))
      setFat(Math.round(fat))
    }
  }, [])

  const fetchMealPlan = async (size) => {
    const requestBody = {
      size,
      plan: {
        accept: {
          all: [
            {
              health: dietaryPreferencesNotConst
            }
          ]
        },
        fit: {
          ENERC_KCAL: {
            min: Math.round(calories - 150),
            max: Math.round(calories + 150)
          },
          FAT: {
            min: Math.round(fat - 10),
            max: Math.round(fat + 10)
          },
          CHOCDF: {
            min: Math.round(carbs - 15),
            max: Math.round(carbs + 15)
          },
          PROCNT: {
            min: Math.round(protein - 10),
            max: Math.round(protein + 10)
          }
        },
        sections: {
          Breakfast: {
            accept: {
              all: [
                {
                  dish: dietaryPreferences.breakfast
                },
                {
                  meal: ['breakfast']
                }
              ]
            }
          },
          Lunch: {
            accept: {
              all: [
                {
                  dish: dietaryPreferences.lunch
                },
                {
                  meal: ['lunch/dinner']
                }
              ]
            }
          },
          Dinner: {
            accept: {
              all: [
                {
                  dish: dietaryPreferences.dinner
                },
                {
                  meal: ['lunch/dinner']
                }
              ]
            }
          }
        }
      }
    }

    const queryParams = new URLSearchParams({
      app_id: '8986bdbe',
      app_key: '159d33751a7bb53db02edc82682541a0'
    })

    try {
      const response = await fetch(`https://api.edamam.com/api/meal-planner/v1/8986bdbe/select?${queryParams}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Edamam-Account-User': 'nguyenanh81nt'
        },
        body: JSON.stringify(requestBody)
      })

      if (response.ok) {
        const data = await response.json()
        setMealPlan(data.selection)
      } else {
        const errorData = await response.json()
        console.error('Api fail', response.status, errorData)
      }
    } catch (error) {
      console.error('Api fail', error)
    }
  }

  const fetchRecipeDetails = async (recipeUri) => {
    try {
      const queryParams = new URLSearchParams({
        r: recipeUri,
        app_id: '8986bdbe',
        app_key: '159d33751a7bb53db02edc82682541a0'
      })

      const url = `https://api.edamam.com/search?${queryParams.toString()}`

      const response = await fetch(url, {
        headers: {
          'Edamam-Account-User': 'nguyenanh81nt'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setRecipeDetails((prevDetails) => ({
          ...prevDetails,
          [recipeUri]: data
        }))
      } else {
        console.error('get meal detail fail', response.status)
      }
    } catch (error) {
      console.error('get meal detail fail', error)
    }
  }

  useEffect(() => {
    if (mealPlan) {
      mealPlan.forEach((day) => {
        Object.values(day.sections).forEach((recipe) => {
          if (recipe && recipe.assigned) {
            fetchRecipeDetails(recipe.assigned)
          }
        })
      })
    }
  }, [mealPlan])

  const activityLevelConverter = (activityLevel) => {
    if (activityLevel === 'sedentary') {
      return 1.2
    } else if (activityLevel === 'moderately-active') {
      return 1.55
    } else if (activityLevel === 'very-active') {
      return 1.725
    }
  }

  const calculateCalories = (sex, age, weight, height, activityLevelValue, goal) => {
    let bmr
    if (sex === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else if (sex === 'female') {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }

    let calories

    if (goal === 'weight-loss') {
      calories = bmr * activityLevelValue - 350
    } else if (goal === 'gain-weight') {
      calories = bmr * activityLevelValue + 350
    } else {
      calories = bmr * activityLevelValue
    }

    return calories
  }

  const calculateMacros = (calories, dietaryPreference) => {
    let protein, carbs, fat

    if (dietaryPreference.includes('high-protein') && dietaryPreference.includes('low-carb')) {
      protein = (calories * 0.3) / 4
      carbs = (calories * 0.30) / 4
      fat = (calories * 0.30) / 9
    } else if (dietaryPreference.includes('high-protein')) {
      protein = (calories * 0.3) / 4
      carbs = (calories * 0.4) / 4
      fat = (calories * 0.20) / 9
    } else if (dietaryPreference.includes('low-carb')) {
      protein = (calories * 0.25) / 4
      carbs = (calories * 0.4) / 4
      fat = (calories * 0.25) / 9
    } else {
      protein = (calories * 0.2) / 4
      carbs = (calories * 0.5) / 4
      fat = (calories * 0.25) / 9
    }
    return { protein, carbs, fat }
  }

  const handleSizeChange = (event) => {
    setSize(event.target.value)
  }

  const handleSubmit = (days, onFetchComplete) => {
    fetchMealPlan(days).finally(onFetchComplete)
  }

  return (
    <>
      <NavigationBar />

      <div className='backgroundRectangle' />
      <div className='container p-5'>
        <div className='row justify-content-center'>
          <div className='col-md-9 text-start shadow p-4 diet-planner-info rounded-4' style={{ backgroundColor: '#ffff' }}>
            <img
              src={img}
              alt='cook'
              className='object-fit-cover img-fluid diet-planner-cook-image rounded-4 '
            />
            <h1>Welcome to Our Diet Planner Tool</h1>
            <p>Embark on a journey towards better health and nutrition with our intuitive Diet Planner. Here's how to get started:</p>
            <h4>1. Explore the Filters</h4>
            <p>You'll find an array of meal filters below the page. Choose from breakfast, lunch, and dinner options to tailor your meal plan to your taste. Click on each category to select your dietary preferences.</p>
            <h4>2. Customize Your Profile</h4>
            <p>For a personalized experience, ensure your health details are up-to-date by visiting your profile settings.<br />
              Update your personal health information to get meal recommendations that align with your health goals and dietary requirements.
            </p>
            <h4>3. Set Your Meal Plan Duration</h4>
            <p>Decide and enter how many days you'd like your meal plan to cover. You can plan up to a maximum of 7 days, keeping in line with the API's capabilities. <br />
            </p>
            <h4>4. Generate Your Meal Plan:</h4>
            <p>Once you've set your preferences and duration, click the "Generate Meal Plan" button. Our system will curate a meal plan tailored to your preferences and nutritional needs with recipes and detailed information.
            </p>
            <h4>5. Review Your Nutrition Information</h4>
            <p>After your meal plan is generated you'll also find a summary of your nutrition information, providing a quick glimpse into your daily calorie and macronutrient targets.
            </p>
          </div>
        </div>
      </div>
      <div className='container p-3'>
        <div className='row justify-content-center'>
          <div className='col-auto'>
            <DietPlannerForm
              setSize={setSize}
              setDietaryPreferences={setDietaryPreferences}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>

      {isOpenPersonalHealthForm && isLogin && (
        <HealthInfoPopUp
          onClose={() => setisOpenPersonalHealthForm(false)}
          onSave={() => setisOpenPersonalHealthForm(false)}
          message='We’d love to create the best experience for you! Could you provide a bit more information during the application?'
          backButton='Back to home page'
        />
      )}

      {mealPlan && recipeDetails ? (
        <div className='container p-5'>
          <div className='row justify-content-center'>
            <div className='col-8 shadow p-4 rounded-4'>
              {/* <div className='nutrition-info'>
                <h2>Nutrition Information</h2>
                <div className='nutrition-item'>
                  <span className='nutrition-label'>Calories: </span>
                  <span className='nutrition-value'>{calories}</span>
                </div>
                <div className='nutrition-item'>
                  <span className='nutrition-label'>Protein: </span>
                  <span className='nutrition-value'>{protein} g</span>
                </div>
                <div className='nutrition-item'>
                  <span className='nutrition-label'>Carbs: </span>
                  <span className='nutrition-value'>{carbs} g</span>
                </div>
                <div className='nutrition-item'>
                  <span className='nutrition-label'>Fat: </span>
                  <span className='nutrition-value'>{fat} g</span>
                </div>
              </div> */}
              <h2 className='my-4'>Meal Plan</h2>
              {mealPlan.map((day, index) => {
                const breakfastDetails = day.sections.Breakfast && recipeDetails[day.sections.Breakfast.assigned] ? recipeDetails[day.sections.Breakfast.assigned][0] : null
                const lunchDetails = day.sections.Lunch && recipeDetails[day.sections.Lunch.assigned] ? recipeDetails[day.sections.Lunch.assigned][0] : null
                const dinnerDetails = day.sections.Dinner && recipeDetails[day.sections.Dinner.assigned] ? recipeDetails[day.sections.Dinner.assigned][0] : null

                return (
                  <DailyMealPlan
                    key={index}
                    dayNumber={index + 1}
                    meals={{
                      breakfast: breakfastDetails,
                      lunch: lunchDetails,
                      dinner: dinnerDetails
                    }}
                  />
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        <p className='text-center'>No meal plan generated yet.</p>
      )}
    </>
  )
}

export default DietPlanner
