import React, { useState } from "react";
import { assets } from "../assets/assets";
import LocationPicker from "./LocationPicker";
import { useAppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "motion/react";

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } =
    useAppContext();

  const handleSearch = (e) => {
    e.preventDefault();
    setIsFormOpen(false);
    navigate(
      "/cars?pickupLocation=" +
        pickupLocation +
        "&pickupDate=" +
        pickupDate +
        "&returnDate=" +
        returnDate,
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="h-screen flex flex-col items-center 
    justify-center gap-14 bg-light text-center"
    >
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-4xl md:text-5xl font-semibold"
      >
        {" "}
        Luxury cars on Rent
      </motion.h1>

      {/* Trigger card — replaces the cramped inline form */}
      <motion.button
        type="button"
        onClick={() => setIsFormOpen(true)}
        initial={{ scale: 0.95, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center justify-center gap-3 px-8 py-4
         rounded-full w-full max-w-80 md:max-w-xl
          bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]
          cursor-pointer text-gray-600 hover:text-gray-800
          border border-borderColor"
      >
        <img src={assets.search_icon} alt="" className="w-5 h-5" />
        <span className="text-base md:text-lg">
          Search for car availability
        </span>
      </motion.button>

      {/* Modal form */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsFormOpen(false)}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          >
            <motion.form
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSearch}
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-md
               md:max-w-lg p-6 md:p-8 flex flex-col gap-6 text-left"
            >
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                aria-label="Close"
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700
                 cursor-pointer text-xl leading-none"
              >
                ✕
              </button>

              <div>
                <h2 className="text-xl md:text-2xl font-semibold">
                  Find your car
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Enter your pickup details to check availability
                </p>
              </div>

              <div className="flex flex-col gap-5">
                <LocationPicker
                  location={pickupLocation}
                  setLocation={setPickupLocation}
                  label="Pickup Location"
                />

                <div className="flex flex-col sm:flex-row gap-5">
                  <div className="flex flex-col items-start gap-2 flex-1">
                    <label htmlFor="pickup-date" className="text-sm text-gray-600">
                      Pick-up Date
                    </label>
                    <input
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      type="date"
                      id="pickup-date"
                      min={new Date().toISOString().split("T")[0]}
                      className="text-sm text-gray-700 border border-borderColor
                       rounded-md px-3 py-2 w-full"
                      required
                    />
                  </div>

                  <div className="flex flex-col items-start gap-2 flex-1">
                    <label htmlFor="return-date" className="text-sm text-gray-600">
                      Return Date
                    </label>
                    <input
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      type="date"
                      id="return-date"
                      min={pickupDate || new Date().toISOString().split("T")[0]}
                      className="text-sm text-gray-700 border border-borderColor
                       rounded-md px-3 py-2 w-full"
                      required
                    />
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3
                 bg-primary hover:bg-primary-dull text-white rounded-full
                 cursor-pointer font-medium"
              >
                <img
                  src={assets.search_icon}
                  alt=""
                  className="brightness-300 w-4 h-4"
                />
                Search
              </motion.button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.img
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        src={assets.main_car}
        alt="car"
        className="max-h-74"
      />
    </motion.div>
  );
};

export default Hero;