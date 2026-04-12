
import { db } from './firebase';
console.log("قاعدة البيانات متصلة:", db);

import { Suspense, useState } from "react";
import Login from "./pages/Login";
import "./App.css";

// 1. تم دمج الاستيراد في سطر واحد لحل مشكلة التكرار
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import Website from "./pages/Website";
import Properties from "./pages/Properties/Properties";
import Agencies from "./pages/Agencies/Agencies";
// 2. تأكدي أن مسار الملف صحيح حسب مجلداتك
import Services from './pages/Services/Services'; 
import Notaries from "./pages/Notaries/Notaries";
import Maintenance from "./pages/Maintenance/Maintenance";
import Furniture from "./pages/Furniture/Furniture";
import Moving from "./pages/Moving/Moving";
import About from './pages/About/About';
import InvestmentTools from './components/InvestmentTools/InvestmentTools';
import Favorites from './pages/Favourites/Favourites';
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
 
import UserDetailContext from "./context/UserDetailContext";
import Bookings from "./pages/Bookings/Bookings";
import Favourites from "./pages/Favourites/Favourites";
import { MantineProvider } from '@mantine/core';
import AddProperty from "./pages/AddProperty/AddProperty";
import AuthModal from "./components/AuthModal/AuthModal";
import { AuthProvider } from "./context/AuthContext"; 
import Blog from './pages/Blog/Blog';
import BlogCard from './components/BlogCard/BlogCard';
import PropertyDetails from "./pages/PropertyDetails/PropertyDetails";

 
 
 

function MainHomePage() {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <Website />
      <InvestmentTools />
    </div>
  );
}
function App() {
  const queryClient = new QueryClient();

  const [userDetails, setUserDetails] = useState({
    favourites: [],
    bookings: [],
  });

  return (
    <AuthProvider> 
     <MantineProvider theme={{ dir: 'rtl' }}> 
      <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <div dir="rtl"> 
              <Suspense fallback={<div>جاري التحميل...</div>}>
                <Routes>
                  {/* المسارات التي بداخلها Layout يظهر فيها الهيدر والفوتر */}
                  <Route element={<Layout />}>
                    <Route path="/InvestmentTools" element={<InvestmentTools />}/>
                    <Route path="/" element={<Website />} />
                     
                     
                    <Route path="/properties" element={<Properties />} />
                    <Route path="/property/:id" element={<PropertyDetails />} />
                     
                     
                    <Route path="/add-property" element={<AddProperty />} />
                    <Route path="/agencies" element={<Agencies />} /> 
                    <Route path="/bookings" element={<Bookings />} />
                    <Route path="/favourites" element={<Favourites />} />
                    
                     
                    <Route path="/Services" element={<Services />} />
                    <Route path="/notaries" element={<Notaries />} />
                    <Route path="/maintenance" element={<Maintenance />} />
                    <Route path="/furniture" element={<Furniture />} />
                    <Route path="/moving" element={<Moving />} />
                    <Route path="/About" element={<About />} />
                    <Route path="/Blog"  element={<Blog />}/>
                    <Route path="/Blog/:id" element={<Blog />} /> 
                    <Route path="/favorites" element={<Favorites />} />

                    
                  </Route>
                  
                  {/* المسارات التي لا تحتوي على Layout (مثل تسجيل الدخول) */}
                  <Route path="/login" element={<Login />} />
                </Routes>
              </Suspense>
            </div>
          </BrowserRouter>
          <ToastContainer />
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
      </UserDetailContext.Provider>
     </MantineProvider>
    </AuthProvider>
  );
}

export default App;