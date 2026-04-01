import React from "react";
import { Select, TextInput, Group } from "@mantine/core";
import "./SearchBar.css";

const SearchBar = ({ filter, setFilter }) => {
  
  // المدن المطلوبة فقط مع ربطها بالقيم البرمجية في قاعدتك
  const djelfaCities = [
    { value: "djelfa", label: "الجلفة" },
    { value: "hassi_bahbah", label: "حاسي بحبح" },
    { value: "charef", label: "شارف" },
    { value: "birine", label: "بيرين" },
  ];

  // الأحياء (سيتم البحث عنها في حقل العنوان/address)
  const neighborhoods = [
    { value: "بن جرمة", label: "بن جرمة" },
    { value: "حاشي معمر", label: "حاشي معمر" },
    { value: "بوتريفيس", label: "بوتريفيس" },
    { value: "100 هكتار", label: "100 هكتار" },
    { value: "عين أسرار", label: "عين أسرار" },
  ];

  // أنواع العقارات (تطابق القيم في قاعدتك)
  const propertyTypes = [
    { value: "apartment", label: "شقة" },
    { value: "villa", label: "فيلا" },
    { value: "house", label: "منزل" },
    { value: "land", label: "قطعة أرض" },
  ];

  return (
    <div className="flexCenter search-bar-container" style={{padding: "12px", background: "white", borderRadius: "15px", width: "100%", border: "1px solid #e0e0e0"}}>
      <Group grow style={{width: "100%"}}>
        
        {/* اختيار المدينة */}
        <Select
          placeholder="اختر المدينة"
          data={djelfaCities}
          variant="filled"
          clearable
          onChange={(val) => setFilter((prev) => ({ ...prev, city: val || "" }))}
        />

        {/* اختيار الحي */}
        <Select
          placeholder="اختر الحي"
          data={neighborhoods}
          variant="filled"
          clearable
          searchable
          onChange={(val) => setFilter((prev) => ({ ...prev, area: val || "" }))}
        />

        {/* نوع العقار */}
        <Select
          placeholder="نوع العقار"
          data={propertyTypes}
          variant="filled"
          clearable
          onChange={(val) => setFilter((prev) => ({ ...prev, type: val || "" }))}
        />

        {/* السعر */}
        <TextInput
          placeholder="أقصى سعر (دج)"
          variant="filled"
          type="number"
          onChange={(e) => setFilter((prev) => ({ ...prev, price: e.target.value }))}
        />
      </Group>
    </div>
  );
};

export default SearchBar;