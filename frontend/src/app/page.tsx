"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

export default function Home() {
  const [weather, setWeather] = useState("");

  useEffect(() => {
    // Call the local weather api from .NET 8
    fetch("http://localhost:5102/weatherforecast").then((res) => {
      res.json().then((data) => {
        const typedData = data as WeatherForecast[];
        console.log(typedData[0].temperatureF);
        setWeather(JSON.stringify(data));
      });
    });
  }, []);

  return <main className="flex min-h-screen flex-col items-center justify-between p-24">Weather Data: {weather}</main>;
}
