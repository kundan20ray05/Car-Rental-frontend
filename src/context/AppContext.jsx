import { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/react";

const baseURL =
  import.meta.env.VITE_BASE_URL?.trim() || "http://localhost:3000";
axios.defaults.baseURL = baseURL;

const currency = import.meta.env.VITE_CURRENCY?.trim() || "₹";
const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return currencyFormatter.format(Number.isNaN(amount) ? 0 : amount);
};

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const { user: clerkUser, isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();
  const getTokenRef = useRef(getToken);

  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cars, setCars] = useState([]);

  // Update getToken ref whenever it changes
  useEffect(() => {
    getTokenRef.current = getToken;
  }, [getToken]);

  // Setup axios interceptor once - don't recreate it
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      async (config) => {
        // Only add auth header if user is signed in
        if (typeof getTokenRef.current === "function") {
          try {
            const token = await getTokenRef.current();
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
          } catch (error) {
            console.error("Error getting token:", error);
            // If token retrieval fails, continue without it
          }
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Don't set up response interceptor repeatedly
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, []); // Empty dependency - set up once only

  // Separate effect for handling auth state changes
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      // Clear auth data on sign out
      setUser(null);
      setIsOwner(false);
    }
  }, [isSignedIn, isLoaded]);

  // Function to fetch user profile from backend
  const fetchUser = async (token) => {
    try {
      const { data } = await axios.get("/api/user/data", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user.role === "owner");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Function to fetch all cars from the server
  const fetchCars = async (token) => {
    try {
      const { data } = await axios.get("/api/user/cars", {
        headers: { Authorization: `Bearer ${token}` },
      });
      data.success ? setCars(data.cars) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Sync Clerk user with backend on sign in
  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser) {
      getToken().then((token) => {
        if (token) {
          fetchUser(token);
          fetchCars(token);
        }
      });
    } else if (isLoaded && !isSignedIn) {
      // Clear user data on sign out
      setUser(null);
      setIsOwner(false);
    }
  }, [isSignedIn, isLoaded, clerkUser, getToken]);

  const value = {
    navigate,
    currency,
    formatCurrency,
    axios,
    user,
    setUser,
    isOwner,
    setIsOwner,
    fetchUser,
    showLogin: false,
    setShowLogin: () => {},
    fetchCars,
    cars,
    setCars,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    isSignedIn,
    clerkUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export const useAppContext = () => {
  return useContext(AppContext);
};
