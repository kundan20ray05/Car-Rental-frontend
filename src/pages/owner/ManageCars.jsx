import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ManageCars = () => {
  const { isOwner, axios, formatCurrency, isSignedIn } = useAppContext();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fectchOwnerCars = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/owner/cars");
      console.log("✅ Owner cars fetched:", data);
      if (data.success) {
        setCars(data.cars);
      } else {
        console.error("❌ Error fetching cars:", data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ Car fetch error:", error);
      toast.error(error.message || "Failed to fetch cars");
    } finally {
      setLoading(false);
    }
  };
  const toggleAvailability = async (carId) => {
    try {
      const { data } = await axios.post("/api/owner/toggle-car", { carId });
      if (data.success) {
        toast.success(data.message);
        fectchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Toggle error:", error);
      toast.error(error.message || "Failed to toggle car availability");
    }
  };

  const deleteCar = async (carId) => {
    try {
      const confirm = window.confirm(
        "Are you sure your want to delete this car?",
      );
      if (!confirm) return null;

      const { data } = await axios.post("/api/owner/delete-car", { carId });
      if (data.success) {
        toast.success(data.message);
        fectchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete car");
    }
  };

  useEffect(() => {
    if (isOwner && isSignedIn) {
      fectchOwnerCars();
    }
  }, [isOwner, isSignedIn]);

  return (
    <div className="px-4 pt-10 md:px w-full">
      <Title
        title="Manage Cars"
        subTitle="View all listed cars, update their
      details, or remove them from the booking plateform."
      />

      <div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-500">
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium max-md:hidden">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car, index) => (
              <tr key={index} className="border-t border-borderColor">
                <td className="p-3 flex item-center gap-3">
                  <img
                    src={car.image}
                    alt=""
                    className="h-12 w-12 aspect-square rounded-md object-cover"
                  />
                  <div className="max-md:hidden">
                    <p className="font-medium">
                      {car.brand} {car.model}
                    </p>
                    <p className="text-xs text-gray-500">
                      {car.seating_capacity} . {car.transmission}
                    </p>
                  </div>
                </td>

                <td className="p-3 max-md:hidden">{car.category}</td>
                <td className="p-3">{formatCurrency(car.pricePerDay)}/day</td>

                <td className="p-3 max-md:hidden">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${car.isAvailable ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"}`}
                  >
                    {car.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </td>

                <td className="flex item-center p-3 gap-2">
                  <img
                    onClick={() => toggleAvailability(car._id)}
                    src={
                      car.isAvailable ? assets.eye_close_icon : assets.eye_icon
                    }
                    alt=""
                    className="cursor-pointer"
                    title={
                      car.isAvailable ? "Make Unavailable" : "Make Available"
                    }
                  />

                  <img
                    onClick={() => deleteCar(car._id)}
                    src={assets.delete_icon}
                    alt=""
                    className="cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCars;
