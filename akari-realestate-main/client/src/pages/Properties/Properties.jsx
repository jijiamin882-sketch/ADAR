import React, { useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import useProperties from "../../hooks/useProperties";
import { PuffLoader } from "react-spinners";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import "./Properties.css";

const Properties = () => {
  const { data, isError, isLoading } = useProperties();
  
  const [filter, setFilter] = useState({
    city: "",
    area: "",
    type: "",
    price: ""
  });

  // منطق الفلترة المحدث
  const filteredProperties = data?.filter((property) => {
    // فلتر المدينة: يطابق القيمة المختارة (مثل djelfa) مع الحقل في القاعدة
    const matchCity = !filter.city || 
      property.city?.toLowerCase() === filter.city.toLowerCase();

    // فلتر الحي: يبحث عن اسم الحي داخل حقل العنوان (address)
    const matchArea = !filter.area || 
      property.address?.toLowerCase().includes(filter.area.toLowerCase());

    // فلتر النوع: (apartment, villa...)
    const matchType = !filter.type || 
      property.type?.toLowerCase() === filter.type.toLowerCase();

    // فلتر السعر
    const matchPrice = !filter.price || 
      (Number(property.price) <= Number(filter.price));

    return matchCity && matchArea && matchType && matchPrice;
  });

  if (isError) return <div className="wrapper flexCenter"><span>خطأ في الاتصال بالخادم</span></div>;
  if (isLoading) return <div className="wrapper flexCenter" style={{height: "60vh"}}><PuffLoader color="#ff40af" /></div>;

  return (
     
    <div className="wrapper">
       
      <div className="flexColCenter paddings innerWidth properties-container">
        
        <h2 className="primaryText" >العقارات المتاحة في ولاية الجلفة</h2>
        
        <SearchBar filter={filter} setFilter={setFilter} />

        <div className="paddings flexCenter properties">
          {filteredProperties && filteredProperties.length > 0 ? (
            filteredProperties.map((card, i) => (
              <PropertyCard card={card} key={i} />
            ))
          ) : (
            <div className="flexCenter" style={{marginTop: "2rem", textAlign: "center"}}>
              <h3 className="secondaryText">لا توجد نتائج تطابق بحثك حالياً في هذه المنطقة.</h3>
            </div>
          )}
        </div>
      </div>
    </div>
     
  );
};

export default Properties;