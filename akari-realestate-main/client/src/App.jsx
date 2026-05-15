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
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import Dashboard from "./pages/Dashboard/Dashboard"; 
import DashboardMessages from "./pages/Dashboard/DashboardMessages.jsx";
import Settings from "./pages/Dashboard/Settings";
import PricingPlans from "./components/PricingPlans/PricingPlans.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// ✅ تم تصحيح مسار الاستيراد (كان يحتوي src/pages مكررة بالخطأ)
import DashboardMyProperties from "./pages/Dashboard/src/pages/Dashboard/DashboardMyProperties.jsx";
import DashboardMyServices from "./pages/Dashboard/DashboardMyServices.jsx";
import DashboardUsers from "./pages/Dashboard/DashboardUsers.jsx";
import DashboardModeration from "./pages/Dashboard/DashboardModeration.jsx";


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
                <Suspense fallback={<div style={{textAlign:'center', padding:'50px', color:'#fff'}}>جاري التحميل...</div>}>
                  <Routes>
                    
                    {/* ========================================== */}
                    {/* المسارات العامة (بدون هيدر وفوتر) */}
                    {/* ========================================== */}
                    <Route path="/login" element={<Login />} />

                    {/* ========================================== */}
                    {/* المسارات التي يظهر فيها الهيدر والفوتر */}
                    {/* ========================================== */}
                    <Route element={<Layout />}>
                      
                      <Route path="/" element={<Website />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:id" element={<BlogDetail />} />
                      <Route path="/properties" element={<Properties />} />
                      <Route path="/property/:id" element={<PropertyDetails />} />
                      <Route path="/bookings" element={<Bookings />} />
                      <Route path="/favorites" element={<Favorites />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/notaries" element={<Notaries />} />
                      <Route path="/maintenance" element={<Maintenance />} />
                      <Route path="/furniture" element={<Furniture />} />
                      <Route path="/moving" element={<Moving />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/InvestmentTools" element={<InvestmentTools />} />
                      <Route path="/AiChat" element={<AiChat />} />
                      <Route path="/pricingPlans" element={<PricingPlans />} />
                      <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />

                      {/* ========================================== */}
                      {/* مسارات محمية (تحتاج تسجيل دخول ودور محدد) */}
                      {/* ========================================== */}

                      {/* إضافة عقار: Admin + مالك عقار فقط */}
                      <Route 
                        path="/AddProperty" 
                        element={
                          <ProtectedRoute allowedRoles={["admin", "owner"]}>
                            <AddProperty />
                          </ProtectedRoute>
                        } 
                      />

                      {/* إضافة خدمة: Admin + مقدم خدمة فقط */}
                      <Route 
                        path="/AddService" 
                        element={
                          <ProtectedRoute allowedRoles={["admin", "provider"]}>
                            <AddService />
                          </ProtectedRoute>
                        } 
                      />

                      {/* ========================================== */}
                      {/* لوحة التحكم: كل الأدوار مسموحة */}
                      {/* ========================================== */}
                      <Route 
                        path="/dashboard" 
                        element={
                          <ProtectedRoute allowedRoles={["admin", "owner", "provider", "user"]}>
                            <Dashboard />
                          </ProtectedRoute>
                        }
                      >
                        {/* الرسائل: Admin + مالك عقار + مقدم خدمة */}
                        <Route 
                          path="messages" 
                          element={
                            <ProtectedRoute allowedRoles={["admin", "owner", "provider"]}>
                              <DashboardMessages />
                            </ProtectedRoute>
                          } 
                        />
                        
                        {/* الإعدادات: الكل */}
                        <Route path="settings" element={<Settings />} />

                        {/* إدارة العقارات (mine): Admin + مالك عقار */}
                        <Route 
                          path="my-properties" 
                          element={
                            <ProtectedRoute allowedRoles={["admin", "owner"]}>
                              <DashboardMyProperties />
                            </ProtectedRoute>
                          } 
                        />

                        {/* إدارة الخدمات (mine): Admin + مقدم خدمة */}
                        <Route 
                          path="my-services" 
                          element={
                            <ProtectedRoute allowedRoles={["admin", "provider"]}>
                              <DashboardMyServices />
                            </ProtectedRoute>
                          } 
                        />
                                                {/* بانتظار الموافقة: Admin فقط */}
                        <Route 
                          path="moderation" 
                          element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                              <DashboardModeration />
                            </ProtectedRoute>
                          } 
                        />
                        {/* إدارة المستخدمين: Admin فقط */}
                                                 {/* إدارة المستخدمين: Admin فقط */}
                        <Route 
                          path="users" 
                          element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                              <DashboardUsers />
                            </ProtectedRoute>
                          } 
                        />
                      </Route>

                    </Route>
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