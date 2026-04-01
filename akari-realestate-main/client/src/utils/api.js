import { db } from "../firebase"; // تأكدي من أن اسم الملف ومساره صحيح
import { ref, get, child, set, push } from "firebase/database";
import { toast } from "react-toastify";
import dayjs from "dayjs";

// --- 1. جلب كل العقارات ---
export const getAllProperties = async () => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `properties`));
    if (snapshot.exists()) {
      const data = snapshot.val();

      return Object.keys(data).map((key) => ({ id: key, ...data[key] }));
    }
    return [];
  } catch (error) {
    console.error("خطأ في الاتصال:", error);
    throw error;
  }
};

// --- 2. جلب عقار واحد ---
export const getProperty = async (id) => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `properties/${id}`));
    if (snapshot.exists()) return { id: snapshot.key, ...snapshot.val() };
    throw new Error("Property not found");
  } catch (error) {
    throw error;
  }
};

// --- 3. إنشاء مستخدم (التي تسببت في الخطأ الأخير) ---
export const createUser = async (email, token) => {
  try {
    const userEmailKey = email.replace(".", ",");
    const userRef = ref(db, `users/${userEmailKey}`);
    const snapshot = await get(userRef);
    
    if (!snapshot.exists()) {
      await set(userRef, { email, bookedVisits: [], favResidenciesID: [] });
    }
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

// --- 4. جلب المفضلات ---
export const getAllFav = async (email) => {
  try {
    if (!email) return [];
    const userEmailKey = email.replace(".", ",");
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `users/${userEmailKey}/favResidenciesID`));
    return snapshot.exists() ? Object.keys(snapshot.val()) : [];
  } catch (error) {
    return [];
  }
};

// --- 5. جلب الحجوزات ---
export const getAllBookings = async (email) => {
  try {
    if (!email) return [];
    const userEmailKey = email.replace(".", ",");
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `users/${userEmailKey}/bookedVisits`));
    return snapshot.exists() ? snapshot.val() : [];
  } catch (error) {
    return [];
  }
};

// --- 6. حجز زيارة ---
export const bookVisit = async (date, propertyId, email) => {
  try {
    const userEmailKey = email.replace(".", ",");
    const bookingRef = ref(db, `users/${userEmailKey}/bookedVisits`);
    await push(bookingRef, {
      id: propertyId,
      date: dayjs(date).format("DD/MM/YYYY"),
    });
    toast.success("Visit booked!");
  } catch (error) {
    throw error;
  }
};

// --- 7. إضافة/إزالة مفضلة ---
export const toFav = async (id, email) => {
  try {
    const userEmailKey = email.replace(".", ",");
    const favRef = ref(db, `users/${userEmailKey}/favResidenciesID/${id}`);
    const snapshot = await get(favRef);
    if (snapshot.exists()) {
      await set(favRef, null);
      toast.info("Removed from favorites");
    } else {
      await set(favRef, true);
      toast.success("Added to favorites");
    }
  } catch (e) {
    throw e;
  }
};

// --- 8. إزالة حجز ---
export const removeBooking = async (id, email) => {
    try {
        const userEmailKey = email.replace(".", ",");
        toast.info("Firebase removal logic triggered");
    } catch (error) {
        throw error;
    }
};
// في ملف src/utils/api.js

export const getAllAgencies = async () => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, "agencies")); 
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map((id) => ({
        id,
        ...data[id],
      }));
    }
    return [];
  } catch (error) {
    console.error("خطأ في جلب الوكالات:", error);
    throw error;
  }
};