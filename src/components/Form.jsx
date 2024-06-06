/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import Button from "./Button";
import BackButton from "./BackButton";
import Message from "../components/Message";
import Spinner from "../components/Spinner";

import styles from "./Form.module.css";
import useUrlPosition from "../hooks/useUrlPosition";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CitiesContext } from "../contexts/CitiesContext";
import useCitiesContext from "../hooks/useCitiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  console.log(countryCode);
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";
function Form() {
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [lat, lng] = useUrlPosition();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const [geocodingError, setIsGeocodingError] = useState("");
  const { createCity, isLoading } = useCitiesContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!lat || !lng) {
      // Handle the case when lat and lng are not available
      setCityName(""); // Reset to default value or any other appropriate handling
      setCountry("");
      // Other necessary state resets
      return;
    }

    async function fetchCityData() {
      try {
        setIsLoadingGeocoding(true);
        setIsGeocodingError("");
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();
        // console.log(data.countryCode);
        if (!data)
          throw new Error("That doesnt seem to be a city,click somewhere else");

        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
      } catch (error) {
        // jjnkj
        setIsGeocodingError(error.message);
      } finally {
        setIsLoadingGeocoding(false);
      }
    }
    fetchCityData();
  }, [lat, lng]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };
    // console.log(newCity);
    await createCity(newCity);
    navigate("/app/cities");
  }

  if (isLoadingGeocoding) return <Spinner />;
  if (!lat && !lng)
    return <Message message="Start by click anywhere on map"></Message>;

  if (geocodingError) return <Message message={geocodingError}></Message>;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker
          id="date"
          onChange={(date) => {
            setDate(date);
          }}
          selected={date}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
        {/* <button>&larr; Back</button> */}
      </div>
    </form>
  );
}

export default Form;
