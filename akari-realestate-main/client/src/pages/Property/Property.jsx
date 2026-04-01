import React, { useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { getProperty, removeBooking } from "../../utils/api";
import { PuffLoader } from "react-spinners";
import { AiFillHeart, AiFillStar } from "react-icons/ai"; // أضفنا أيقونة النجمة
import "./Property.css";

import { FaShower, FaFileContract } from "react-icons/fa"; // أضفنا أيقونة العقد
import { AiTwotoneCar } from "react-icons/ai";
import { MdLocationPin, MdMeetingRoom, MdVerifiedUser } from "react-icons/md";
import Map from "../../components/Map/Map";
import useAuthCheck from "../../hooks/useAuthCheck";
import { useAuth0 } from "@auth0/auth0-react";
import BookingModal from "../../components/BookingModal/BookingModal";
import UserDetailContext from "../../context/UserDetailContext.js";
import { Button } from "@mantine/core";
import { toast } from "react-toastify";
import Heart from "../../components/Heart/Heart";
import { useTranslation } from "react-i18next"; // مكتبة الترجمة

const Property = () => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const id = pathname.split("/").slice(-1)[0];
  
  const { data, isLoading, isError } = useQuery(["resd", id], () =>
    getProperty(id)
  );

  const [modalOpened, setModalOpened] = useState(false);
  const { validateLogin } = useAuthCheck();
  const { user } = useAuth0();

  const {
    userDetails: { token, bookings },
    setUserDetails,
  } = useContext(UserDetailContext);

  const { mutate: cancelBooking, isLoading: cancelling } = useMutation({
    mutationFn: () => removeBooking(id, user?.email, token),
    onSuccess: () => {
      setUserDetails((prev) => ({
        ...prev,
        bookings: prev.bookings.filter((booking) => booking?.id !== id),
      }));
      toast.success(t("booking_cancelled"), { position: "bottom-right" });
    },
  });

  if (isLoading) {
    return (
      <div className="wrapper">
        <div className="flexCenter paddings" style={{height: "60vh"}}>
          <PuffLoader color="#e9ae5d" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="wrapper">
        <div className="flexCenter paddings">
          <span>{t("error_fetching")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="flexColStart paddings innerWidth property-container">
        
        {/* زر الإعجاب */}
        <div className="like">
          <Heart id={id}/>
        </div>

        {/* صورة العقار */}
     {/* صورة العقار المصححة */}
<img 
  /* استخدمنا data?.image لأن البيانات في هذه الصفحة مخزنة في متغير data */
  src={`/images/${data?.image?.trim()}`} 
  alt={data?.title} 
  className="property-image" /* أضفنا كلاس للتحكم في الحجم من CSS */
  style={{ 
    width: "100%", 
    height: "400px", /* زيادة الطول لأننا في الصفحة الكاملة */
    objectFit: "cover", 
    borderRadius: "20px",
    marginTop: "1rem" 
  }}
  onError={(e) => {
    console.log("محاولة المسار البديل لـ:", data?.image);
    if (!e.target.dataset.tried) {
      e.target.dataset.tried = "true";
      e.target.src = `/${data?.image?.trim()}`;
    } else {
      e.target.src = "https://via.placeholder.com/800x400?text=Image+Not+Found";
    }
  }}
/>

        <div className="flexCenter property-details">
          
          {/* القسم الأيسر: التفاصيل */}
          <div className="flexColStart left">
            
            {/* الرأس: العنوان، السعر، والتقييم */}
            <div className="flexStart head" style={{width: "100%", justifyContent: "space-between"}}>
              <div className="flexColStart">
                <span className="primaryText">{data?.title}</span>
                <div className="flexStart rating" style={{gap: "5px", color: "#ffd700"}}>
                  <AiFillStar size={20} />
                  <AiFillStar size={20} />
                  <AiFillStar size={20} />
                  <AiFillStar size={20} />
                  <span className="secondaryText">(4.8 {t("reviews")})</span>
                </div>
              </div>
              <span className="orangeText" style={{ fontSize: "1.8rem", fontWeight: "bold" }}>
                {data?.price} DA
              </span>
            </div>

            {/* المرافق (Bathrooms, Parking, Rooms) */}
            <div className="flexStart facilities">
              <div className="flexStart facility">
                <FaShower size={20} color="#1F3E72" />
                <span>{data?.facilities?.bathrooms} {t("bathrooms")}</span>
              </div>
              <div className="flexStart facility">
                <AiTwotoneCar size={20} color="#1F3E72" />
                <span>{data?.facilities.parkings} {t("parking")}</span>
              </div>
              <div className="flexStart facility">
                <MdMeetingRoom size={20} color="#1F3E72" />
                <span>{data?.facilities.bedrooms} {t("rooms")}</span>
              </div>
            </div>

            {/* الوصف */}
            <span className="secondaryText" style={{ textAlign: "justify", marginTop: "1rem" }}>
              {data?.description}
            </span>

            {/* قسم الوضعية القانونية (جديد) */}
            <div className="flexColStart legal-section" style={{marginTop: "2rem", width: "100%"}}>
              <span className="primaryText" style={{fontSize: "1.3rem"}}>{t("legal_status")}</span>
              <div className="flexStart" style={{gap: "1rem", marginTop: "10px"}}>
                <div className="flexStart legal-badge">
                   <MdVerifiedUser color="#28a745" />
                   <span>{t("livret_foncier")}</span>
                </div>
                <div className="flexStart legal-badge">
                   <FaFileContract color="#28a745" />
                   <span>{t("acte_notarie")}</span>
                </div>
              </div>
            </div>

            {/* الموقع الجغرافي */}
            <div className="flexStart address-box" style={{ gap: "1rem", marginTop: "2rem" }}>
              <MdLocationPin size={25} color="#e9ae5d" />
              <span className="secondaryText">
                {data?.address}, {data?.city}, {data?.country}
              </span>
            </div>

            {/* أزرار الحجز */}
            <div className="booking-actions" style={{width: "100%", marginTop: "2rem"}}>
              {bookings?.map((booking) => booking.id).includes(id) ? (
                <>
                  <Button
                    variant="outline"
                    w={"100%"}
                    color="red"
                    onClick={() => cancelBooking()}
                    disabled={cancelling}
                  >
                    <span>{t("cancel_booking")}</span>
                  </Button>
                  <span className="secondaryText" style={{marginTop: "10px", display: "block", textAlign: "center"}}>
                    {t("booked_date")} {bookings?.filter((booking) => booking?.id === id)[0].date}
                  </span>
                </>
              ) : (
                <button
                  className="button"
                  style={{width: "100%"}}
                  onClick={() => {
                    validateLogin() && setModalOpened(true);
                  }}
                >
                  {t("book_visit")}
                </button>
              )}
            </div>

            <BookingModal
              opened={modalOpened}
              setOpened={setModalOpened}
              propertyId={id}
              email={user?.email}
            />
          </div>

          {/* القسم الأيمن: الخريطة */}
          <div className="map">
            <Map
              address={data?.address}
              city={data?.city}
              country={data?.country}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Property;