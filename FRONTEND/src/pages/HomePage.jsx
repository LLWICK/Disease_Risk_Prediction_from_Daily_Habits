import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [formData, setFormData] = useState({
    alcohol_consumption: 0,
    insurance: 0,
    pet_owner: 0,
    family_history: 0,
    caffeine_intake: 0,
    mental_health_support: 0,
    gender: 0,
    meals_per_day: 3,
    stress_level: 5,
    mental_health_score: 5,
    age: 30,
    insulin: 15,
    weight: 70,
    bmi: 24,
    income: 3000,
    heart_rate: 75,
    physical_activity: 3,
    blood_pressure: 120,
    daily_steps: 7000,
    height: 170,
    screen_time: 5,
    sugar_intake: 50,
    sleep_hours: 7,
    waist_size: 85,
    work_hours: 8,
    cholesterol: 180,
    daily_supplement_dosage: 5,
    calorie_intake: 2200,
    glucose: 100,
    water_intake: 2,
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/predict", formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Prediction failed. Check backend.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Health Prediction (CatBoost)</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white shadow-lg rounded-2xl p-6 w-full max-w-4xl"
      >
        {Object.keys(formData).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="capitalize text-sm font-medium mb-1">
              {key.replaceAll("_", " ")}
            </label>
            <input
              type="number"
              step="any"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>
        ))}

        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 px-4 rounded-lg mt-4 hover:bg-blue-700 transition"
        >
          Predict
        </button>
      </form>

      {result && (
        <div className="mt-6 p-6 bg-white shadow-md rounded-2xl w-full max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">Prediction Result</h2>
          <p className="text-lg">
            Condition:{" "}
            <span
              className={`font-semibold ${
                result.prediction === 1 ? "text-red-600" : "text-green-600"
              }`}
            >
              {result.prediction === 1 ? "Diseased" : "Healthy"}
            </span>
          </p>
          <p className="text-gray-600 mt-2">
            Probability: {(result.probability * 100).toFixed(2)}%
          </p>
        </div>
      )}
    </div>
  );
}
