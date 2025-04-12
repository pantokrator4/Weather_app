import { createAction, createReducer } from "@reduxjs/toolkit"

const initialState: Record<string, MainStateType[]> = {
  main: [],
}

export const getWeatherAC = createAction<{weatherRes: any, id: string}>('weather/getWeather')
export const deleteFromFavAC = createAction<{id: string}>('weather/deleteFromFav')

export const weatherReducer = createReducer(initialState, builder => {
  builder
  .addCase(getWeatherAC, (state, action) => {
      state.main.push({
        id: action.payload.id,
        name: action.payload.weatherRes.name, 
        clouds: action.payload.weatherRes.weather[0].description , 
        temp: Math.round(action.payload.weatherRes.main.temp - 273.15)
      })
  })
  .addCase(deleteFromFavAC, (state, action) => {
    const index = state.main.findIndex(e => e.id === action.payload.id)
    if (index !== -1) {
      state.main.splice(index, 1)
    }
  })
})

export type MainStateType = {
  id: string
  name: string
  clouds: string
  temp: number
}

