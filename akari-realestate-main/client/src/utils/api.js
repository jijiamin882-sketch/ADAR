import { supabase } from "../supabaseClient";
import { toast } from "react-toastify";
import dayjs from "dayjs";

// --- 1. جلب كل العقارات ---
export const getAllProperties = async () => {
  try {
    const { data, error } = await supabase.from("properties").select("*");
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("خطأ في الاتصال بـ Supabase:", error);
    throw error;
  }
};

// --- 2. جلب عقار واحد ---
export const getProperty = async (id) => {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single(); // single() يجلب عنصر واحد فقط
    
    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

// --- 3. إنشاء مستخدم أو التحقق من وجوده ---
export const createUser = async (email) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    // إذا لم يكن المستخدم موجوداً، نقوم بإنشائه
    if (error && error.code === "PGRST116") {
      const { error: insertError } = await supabase
        .from("users")
        .insert([{ email, bookedVisits: [], favResidenciesID: [] }]);
      
      if (insertError) throw insertError;
    }
  } catch (error) {
    console.error("Error creating user in Supabase:", error);
  }
};

// --- 4. جلب المفضلات ---
export const getAllFav = async (email) => {
  try {
    if (!email) return [];
    const { data, error } = await supabase
      .from("users")
      .select("favResidenciesID")
      .eq("email", email)
      .single();
    
    return error ? [] : (data?.favResidenciesID || []);
  } catch (error) {
    return [];
  }
};

// --- 5. جلب الحجوزات ---
export const getAllBookings = async (email) => {
  try {
    if (!email) return [];
    const { data, error } = await supabase
      .from("users")
      .select("bookedVisits")
      .eq("email", email)
      .single();
    
    return error ? [] : (data?.bookedVisits || []);
  } catch (error) {
    return [];
  }
};

// --- 6. حجز زيارة ---
export const bookVisit = async (date, propertyId, email) => {
  try {
    // نجلب الحجوزات الحالية أولاً
    const { data: user } = await supabase
      .from("users")
      .select("bookedVisits")
      .eq("email", email)
      .single();

    const currentBookings = user?.bookedVisits || [];
    const newBooking = {
      id: propertyId,
      date: dayjs(date).format("DD/MM/YYYY"),
    };

    // نضيف الحجز الجديد للمصفوفة ونحدث الجدول
    const { error } = await supabase
      .from("users")
      .update({ bookedVisits: [...currentBookings, newBooking] })
      .eq("email", email);

    if (error) throw error;
    toast.success("Visit booked!");
  } catch (error) {
    throw error;
  }
};

// --- 7. إضافة/إزالة مفضلة ---
export const toFav = async (id, email) => {
  try {
    const { data: user } = await supabase
      .from("users")
      .select("favResidenciesID")
      .eq("email", email)
      .single();

    const currentFavs = user?.favResidenciesID || [];

    let updatedFavs;
    if (currentFavs.includes(id)) {
      updatedFavs = currentFavs.filter((favId) => favId !== id);
      toast.info("Removed from favorites");
    } else {
      updatedFavs = [...currentFavs, id];
      toast.success("Added to favorites");
    }

    const { error } = await supabase
      .from("users")
      .update({ favResidenciesID: updatedFavs })
      .eq("email", email);

    if (error) throw error;
  } catch (e) {
    throw e;
  }
};

// --- 8. إزالة حجز ---
export const removeBooking = async (id, email) => {
  try {
    const { data: user } = await supabase
      .from("users")
      .select("bookedVisits")
      .eq("email", email)
      .single();

    const currentBookings = user?.bookedVisits || [];
    
    // نحذف الحجز الذي طابقت قيمة id الخاصة به
    const updatedBookings = currentBookings.filter((booking) => booking.id !== id);

    const { error } = await supabase
      .from("users")
      .update({ bookedVisits: updatedBookings })
      .eq("email", email);

    if (error) throw error;
    toast.success("Booking removed successfully");
  } catch (error) {
    throw error;
  }
};

// --- 9. جلب الوكالات ---
export const getAllAgencies = async () => {
  try {
    const { data, error } = await supabase.from("agencies").select("*");
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("خطأ في جلب الوكالات:", error);
    throw error;
  }
};