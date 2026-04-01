import { db } from './firebase';
console.log("قاعدة البيانات متصلة:", db);
import { Suspense, useState } from "react";
import Login from "./pages/Login";
import "./App.css";
import Layout from "./components/Layout/Layout";
import Website from "./pages/Website";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Properties from "./pages/Properties/Properties";
import Agencies from "./pages/Agencies/Agencies";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Property from "./pages/Property/Property";
import UserDetailContext from "./context/UserDetailContext";
import Bookings from "./pages/Bookings/Bookings";
import Favourites from "./pages/Favourites/Favourites";
// استيراد المكون الخاص بالتنسيق إذا كنتِ تستخدمين Mantine
import { MantineProvider } from '@mantine/core';
import AddProperty from "./pages/AddProperty/AddProperty";

function App() {
  const queryClient = new QueryClient();

  const [userDetails, setUserDetails] = useState({
    favourites: [],
    bookings: [],
    // حذفنا الـ token لأنه لا نحتاجه مع Firebase حالياً
  });

  return (
    // أضفنا MantineProvider هنا لضبط الاتجاه العربي RTL
    <MantineProvider theme={{ dir: 'rtl' }}> 
      <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            {/* أضفنا dir="rtl" هنا أيضاً لضمان تأثر كل النصوص */}
            <div dir="rtl"> 
              <Suspense fallback={<div>جاري التحميل...</div>}>
                <Routes>
                  <Route element={<Layout />}>
                    <Route path="/" element={<Website />} />
                    <Route path="/properties">
                      <Route index element={<Properties />} />
                      <Route path=":propertyId" element={<Property />} />
                    </Route>
                    <Route path="/add-property" element={<AddProperty />} />
                    <Route path="/agencies" element={<Agencies />} /> 
                    <Route path="/bookings" element={<Bookings />} />
                    <Route path="/favourites" element={<Favourites />} />
                    <Route path="/add-property" element={<AddProperty />} />
                  </Route>
                  {/* مسار تسجيل الدخول في مكانه الصحيح */}
                  <Route path="/login" element={<Login />} />
                </Routes>
              </Suspense>
            </div>
          </BrowserRouter>
          <ToastContainer />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </UserDetailContext.Provider>
    </MantineProvider>
  );
}

export default App;