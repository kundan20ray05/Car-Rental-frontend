import React, { useState, useEffect } from "react";
import Title from "../components/Title";
import CarCard from "../components/CarCard";
import { assets } from "../assets/assets";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "motion/react";

const Cars = () => {
  // Getting search params from url
  const [searchParams] = useSearchParams();
  const pickupLocation = searchParams.get("pickupLocation");
  const pickupDate = searchParams.get("pickupDate");
  const returnDate = searchParams.get("returnDate");

  const { cars, axios } = useAppContext();

  const [input, setInput] = useState("");

  const isSearchData = pickupLocation && pickupDate && returnDate;
  const [filteredCars, setFilteredCars] = useState([]);

  const applyFilter = async () => {
    if (!input.trim()) {
      setFilteredCars(cars);
      return null;
    }

    const searchText = input.toLowerCase();
    const filtered = cars.filter((car) => {
      return (
        car.brand.toLowerCase().includes(input.toLocaleLowerCase()) ||
        car.model.toLowerCase().includes(input.toLocaleLowerCase()) ||
        car.category.toLowerCase().includes(input.toLocaleLowerCase()) ||
        car.transmission.toLowerCase().includes(input.toLocaleLowerCase())
      );
    });

    setFilteredCars(filtered);
  };

  const searchCarsAvailablity = async () => {
    try {
      console.log("🔍 Searching availability for:", {
        pickupLocation,
        pickupDate,
        returnDate,
      });
      const { data } = await axios.post("/api/bookings/check-availability", {
        location: pickupLocation,
        pickupDate,
        returnDate,
      });
      if (data.success) {
        console.log("✅ Available cars found:", data.availableCars.length);
        setFilteredCars(data.availableCars);
        if (data.availableCars.length === 0) {
          toast.error("No cars available for selected dates and location");
        }
        return null;
      } else {
        toast.error(data.message || "Failed to search cars");
      }
    } catch (error) {
      console.error("❌ Search error:", error);
      toast.error("Error searching cars: " + error.message);
    }
  };
  useEffect(() => {
    if (isSearchData) {
      console.log("📍 Search data detected, calling availability check");
      searchCarsAvailablity();
    }
  }, [pickupLocation, pickupDate, returnDate]);

  useEffect(() => {
    cars.length > 0 && !isSearchData && applyFilter();
  }, [input, cars]);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center py-20 bg-light max-md:px-4"
      >
        <Title
          title="Available Cars"
          subTitle="Browse our selection of premium 
        vehicles available for your next adventure"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow"
        >
          <img src={assets.search_icon} alt="" className="w-4.5 h-4.5 ml-2" />

          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Search by make model, or features"
            className="w-full h-full outline-none text-gray-500"
          />

          <img src={assets.filter_icon} alt="" className="w-4.5 h-4.5 ml-2" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10"
      >
        <p className="text-gray-500 xl:px:20 max-w-7xl mx-auto">
          Showing
          {filteredCars.length} Cars
        </p>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4
        xl:px-20 max-w-7xl mx-auto"
        >
          {filteredCars.map((car, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              key={index}
            >
              <CarCard car={car} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Cars;
