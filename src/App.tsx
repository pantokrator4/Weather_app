import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { deleteFromFavAC, getWeatherAC } from "./model/weather-reduser";
import { coords } from "./coordsData/coordsData";
import { loadingImage, infoImage } from "./assets";
import { infoText } from "./infoText/infoText";

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
      data.map(d => dispatch(getWeatherAC({weatherRes: d, id: d.name})))
    })
    .catch(() => alert(infoText.alertInfo))
    .finally(() => setLoading(false))
  }, []);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const cityValue = e.currentTarget.value.toLowerCase()
    setCity(cityValue)
    }
    

    const onClickHandler = () => {
      if (Object.keys(coords).includes(city)) {
        const isCityExit = Boolean(weatherMain.find(e => e.id === city))
        if (!isCityExit) {
          setLoading(true)
          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coords[city].lat}&lon=${coords[city].lon}&appid=${API_KEY}`)
          .then((res) => res.json())
          .then((data) => dispatch(getWeatherAC({ weatherRes: data, id: city })))
          .catch(() => alert(infoText.alertInfo))
          .finally(() => { 
            setLoading(false) 
            setCity('')
          })
        } else {
          alert(`You already added ${city.toUpperCase()} in fav list :)`)
          setCity('')
        }
      } else {
          alert(`Unfortunetly, ${city.toUpperCase()} not added yet, come back later!`)
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

  return (
    <>
    <img className="infoImage" src={ infoImage } title={infoText.demoInfo}/>
    <h3>Find city</h3>
      <input type="text" className="searchInput" value={city} onChange={onChangeHandler}  onKeyDown={onKeyDownHandler}/>
      <button onClick={onClickHandler}>+</button>
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