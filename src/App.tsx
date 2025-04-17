import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { deleteFromFavAC, getWeatherAC } from "./model/weather-reduser";
import { coords } from "./coordsData/coordsData";
import { infoText } from "./infoText/infoText";
import loadingImage from './assets/loading2.png'
import infoImage from './assets/info.png'
import weatherImage from '../public/Circle-icons-weather.svg.png'

const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)
  const weatherMain = useAppSelector((state) => state.main);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setLoading(true)
    const newYork = fetch(`https://api.openweathermap.org/data/2.5/weather?lat=40.71&lon=-74.01&appid=${API_KEY}`)
    const batumi = fetch(`https://api.openweathermap.org/data/2.5/weather?lat=41.65&lon=41.64&appid=${API_KEY}`)
    Promise.all([newYork, batumi])
    .then(res => Promise.all(res.map(r => r.json())))
    .then(data => {
      data.map(d => dispatch(getWeatherAC({weatherRes: d, id: d.name.replace(/\s/g, '').trim()})))
    })
    .catch(() => alert(infoText.alertInfo))
    .finally(() => setLoading(false))
  }, []);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const cityValue = e.currentTarget.value
    setCity(cityValue)
    }
    

    const onClickHandler = () => {
      const trimmedCity = city.replace(/\s/g, '').trim().toLowerCase()
      if (Object.keys(coords).includes(trimmedCity)) {
        const isCityExit = Boolean(weatherMain.find(e => e.id === trimmedCity))
        if (!isCityExit) {
          setLoading(true)
          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coords[trimmedCity].lat}&lon=${coords[trimmedCity].lon}&appid=${API_KEY}`)
          .then((res) => res.json())
          .then((data) => dispatch(getWeatherAC({ weatherRes: data, id: trimmedCity })))
          .catch(() => alert(infoText.alertInfo))
          .finally(() => { 
            setLoading(false) 
            setCity('')
          })
        } else {
          alert(`You already added ${trimmedCity.toUpperCase()} in fav list :)`)
          setCity('')
        }
      } else {
          alert(`Unfortunetly, ${trimmedCity.toUpperCase()} not added yet, come back later!`)
          setCity('')
      }
    }

    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onClickHandler()
      }
    }

    const deleteFromFav = (cardID: string) => {
      dispatch(deleteFromFavAC({id: cardID}))
    }

    const onInfoClickHandler = () => {
      alert(infoText.demoInfo)
    }

  return (
    <>
      <img className="infoImage" src={ infoImage } title={infoText.demoInfo} onClick={onInfoClickHandler}/>
      <img className="weatherImage" src={weatherImage}/>
      <h3>Find city</h3>
      <div className="inputAndButtonWrapper">
      <input type="text" className="searchInput" value={city} onChange={onChangeHandler}  onKeyDown={onKeyDownHandler}/>
      <button onClick={onClickHandler}>+</button>
      </div>
      <h3>Favorite cities</h3>
      <div className="favCardsWrapper">
        { loading 
        ? <div className='loadingWrapper'><img className="loadingImage" src={loadingImage}/>Loading...</div>
        : weatherMain.length > 0 
        ? weatherMain.map((card) => (
        <article key={card.id} className="favCards">
          <div>{card.name}</div>
          <div>{card.temp} °C</div>
          <div>{card.clouds}</div>
          <span className="close-btn" onClick={() => deleteFromFav(card.id)}>x</span>
        </article>
      )) : 
      <div>Your fav list is empty...</div>  
      }
      </div>
    </>
  );
}

export default App;