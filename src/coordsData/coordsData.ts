export const coords: Record<string, cordsValuesType> = {
  batumi: {lat: "41.65", lon: "41.64"},
  moscow: {lat: "55.75", lon: "37.62"},
  minsk: {lat: "53.90", lon: "27.57"},
  'staryoskol': {lat: "51.29", lon: "37.84"},
  'newyork': {lat: "40.71", lon: "-74.01"},
}

type cordsValuesType = {
  lat: string
  lon: string
}

// TESTS DATA
// export const fakeData = [
//   {id:"1", name: "Moscow", clouds: 'sunny', temp: 20},
//   {id:"2", name: "Tbilisi", clouds: 'sunny', temp: 20},
//   {id:"3", name: "Istanbul", clouds: 'cloudy', temp: 26},
//   {id:"4", name: "Batumi", clouds: 'rainy', temp: 19},
// ]