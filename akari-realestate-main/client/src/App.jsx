import { createClient } from "@supabase/supabase-js";
import { Suspense, useState } from "react";
import Login from "./pages/Login";
import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import Website from "./pages/Website";
import Properties from "./pages/Properties/Properties";
import Services from './pages/Services/Services'; 
import AddService from './pages/AddService/AddService';
import Notaries from "./pages/Notaries/Notaries";
import Maintenance from "./pages/Maintenance/Maintenance";
import Furniture from "./pages/Furniture/Furniture";
import Moving from "./pages/Moving/Moving";
import About from './pages/About/About';
import InvestmentTools from './components/InvestmentTools/InvestmentTools';
import Favorites from "./pages/Favorites/Favorites";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
 
import UserDetailContext from "./context/UserDetailContext";
import Bookings from "./pages/Bookings/Bookings";
import { MantineProvider } from '@mantine/core';
import AddProperty from "./pages/AddProperty/AddProperty";
import { AuthContextProvider } from './context/AuthContext'; 
import Blog from './pages/Blog/Blog';
import PropertyDetails from "./pages/PropertyDetails/PropertyDetails";
import AiChat from './pages/AiChat/AiChat';
import BlogDetail from './pages/BlogDetail/BlogDetail';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import Dashboard from "./pages/Dashboard/Dashboard"; 
import DashboardMessages from "./pages/Dashboard/DashboardMessages.jsx";
import Settings from "./pages/Dashboard/Settings";

function App() {

  const queryClient = new QueryClient();

  const [userDetails, setUserDetails] = useState({
    favorites: [],
    bookings: [],
  });
   
  return (
   
    <AuthContextProvider> 
     <MantineProvider theme={{ dir: 'rtl' }}> 
      <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <div dir="rtl"> 
              <Suspense fallback={<div>جاري التحميل...</div>}>
                <Routes>
                  {/* المسارات التي بداخلها Layout يظهر فيها الهيدر والفوتر */}
                  <Route element={<Layout />}>
                    
                    {/* الرئيسية */}
                    <Route path="/" element={<Website />} />
                    
                    {/* المدونة: تم توحيد المسارات */}
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:id" element={<BlogDetail />} />
                    
                    {/* العقارات */}
                    <Route path="/properties" element={<Properties />} />
                    <Route path="/property/:id" element={<PropertyDetails />} />
                    <Route path="/Addproperty" element={<AddProperty />}/>
                    
                    {/* المستخدم */}
                    <Route path="/bookings" element={<Bookings />} />
                    <Route path="/favorites" element={<Favorites/>} />
                    
                    {/* الخدمات والمعلومات */}
                    <Route path="/services" element={<Services />} />
                    <Route path="/AddService" element={<AddService />}/>
                    <Route path="/notaries" element={<Notaries />} />
                    <Route path="/maintenance" element={<Maintenance />} />
                    <Route path="/furniture" element={<Furniture />} />
                    <Route path="/moving" element={<Moving />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/InvestmentTools" element={<InvestmentTools />}/>
                    <Route path="/AiChat" element={<AiChat />} />
                    

                    <Route path="/dashboard" element={<Dashboard />}>
                      <Route path="messages" element={<DashboardMessages />} />
                      <Route path="settings" element={<Settings />} />
                    </Route>
                    {/* سياسة الخصوصية */}
                    <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
                  </Route>
                  
                  {/* المسارات التي لا تحتوي على Layout (مثل تسجيل الدخول) */}
                  <Route path="/login" element={<Login />} />
                  
                </Routes>
              </Suspense>
            </div>
          </BrowserRouter>
          <ToastContainer />
        </QueryClientProvider>
      </UserDetailContext.Provider>
     </MantineProvider>
    </AuthContextProvider>
  );
}

export default App;