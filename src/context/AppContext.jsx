
import { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_BASE_URL?.trim() || 'http://localhost:3000'
axios.defaults.baseURL = baseURL

const currency = import.meta.env.VITE_CURRENCY?.trim() || '₹'
const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR'
})

const formatCurrency = (value) => {
  const amount = Number(value || 0)
  return currencyFormatter.format(Number.isNaN(amount) ? 0 : amount)
}

export const AppContext = createContext();

export const AppProvider = ({children})=>{

    const navigate = useNavigate()

    const [token, setToken] = useState(null)
    const [user, setUser] = useState(null)
    const [isOwner, setIsOwner] = useState(false)
    const [showLogin, setShowLogin] = useState(false)
    const [pickupDate, setPickupDate] = useState('')
    const [returnDate, setReturnDate] = useState('')

    const [cars, setCars] = useState([])

    // Function to check if user is logged in

   const fetchUser = async ()=>{
    try {
       const { data } =  await axios.get('/api/user/data')
       if(data.success){
        setUser(data.user)
        setIsOwner(data.user.role === 'owner')
       } else {
        navigate('/')
       }
    } catch (error) {
        toast.error(error.message)
    }
   }
      
   // Function to fetch all cars from the server

   const fetchCars = async ()=>{
    try {
     const { data } =   await axios.get('/api/user/cars')
     data.success ? setCars(data.cars) : toast.error(data.message)
    } catch (error) {
         toast.error(error.message)
    }
   }
     
   // Function to log out the user
   const logout = ()=>{
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    setIsOwner(false)
    axios.defaults.headers.common['Authorization'] = ''
    toast.success('You have been logged out')
   }

   const loginUser = async (email, password) => {
    try {
      const { data } = await axios.post('/api/user/login', { email, password })
      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        return { success: true }
      }
      return { success: false, message: data.message }
    } catch (error) {
      return { success: false, message: error?.response?.data?.message || error.message }
    }
   }

   const registerUser = async (name, email, password) => {
    try {
      const { data } = await axios.post('/api/user/register', { name, email, password })
      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        return { success: true }
      }
      return { success: false, message: data.message }
    } catch (error) {
      return { success: false, message: error?.response?.data?.message || error.message }
    }
   }


   // useEffect to retrieve the token from localStorage
   useEffect(()=>{
    const token = localStorage.getItem('token')
    setToken(token)
    fetchCars()
   }, [])

   // userEffect to fetch user data when token is available

    useEffect(()=>{
   if(token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
   }
   }, [token])
   


const value ={
  navigate, currency, formatCurrency, axios, user, setUser, token, setToken, isOwner, setIsOwner, 
  fetchUser, loginUser, registerUser, showLogin, setShowLogin, logout, fetchCars, cars, setCars, pickupDate, setPickupDate, returnDate, setReturnDate
}

    return( 
    <AppContext.Provider value={value}>
       {children}
    </AppContext.Provider>)
}
export const useAppContext = () => {
  return useContext(AppContext)
}
