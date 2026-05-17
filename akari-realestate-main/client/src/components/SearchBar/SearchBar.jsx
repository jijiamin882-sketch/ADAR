import React from "react";
import { Select, TextInput, Group } from "@mantine/core";
import "./SearchBar.css";
import { useTranslation } from "react-i18next"; // استدعاء الترجمة

const SearchBar = ({ filter, setFilter }) => {
  const { t } = useTranslation(); // تعريف الترجمة

  // المدن (تم نقلها للداخل وترجمة الـ label مع إبقاء الـ value للفلترة)
  const djelfaCities = [
    { value: "djelfa", label: t('search_city_djelfa') },
    { value: "hassi_bahbah", label: t('search_city_hassi_bahbah') },
    { value: "charef", label: t('search_city_charef') },
    { value: "birine", label: t('search_city_birine') },
  ];

  // الأحياء (قيمة الـ value تبقى بالعربي كما هي مخزنة في قاعدة البيانات)
  const neighborhoods = [
    { value: "بن جرمة", label: t('search_area_bin_germa') },
    { value: "حاشي معمر", label: t('search_area_hachi_mammar') },
    { value: "بوتريفيس", label: t('search_area_bou_tarfis') },
    { value: "100 هكتار", label: t('search_area_100_hectares') },
    { value: "عين أسرار", label: t('search_area_ain_alsarar') },
  ];

  // أنواع العقارات (قيمة الـ value بالإنجليزية للفلترة، والـ label مترجم)
  const propertyTypes = [
    { value: "apartment", label: t('search_type_apartment') },
    { value: "villa", label: t('search_type_villa') },
    { value: "house", label: t('search_type_house') },
    { value: "land", label: t('search_type_land') },
  ];

  return (
    <div className="flexCenter search-bar-container" style={{padding: "12px", background: "white", borderRadius: "15px", width: "100%", border: "1px solid #e0e0e0"}}>
      <Group grow style={{width: "100%"}}>
        
        <Select
          placeholder={t('search_placeholder_city')}
          data={djelfaCities}
          variant="filled"
          clearable
          onChange={(val) => setFilter((prev) => ({ ...prev, city: val || "" }))}
        />

        <Select
          placeholder={t('search_placeholder_area')}
          data={neighborhoods}
          variant="filled"
          clearable
          searchable
          onChange={(val) => setFilter((prev) => ({ ...prev, area: val || "" }))}
        />

        <Select
          placeholder={t('search_placeholder_type')}
          data={propertyTypes}
          variant="filled"
          clearable
          onChange={(val) => setFilter((prev) => ({ ...prev, type: val || "" }))}
        />

        <TextInput
          placeholder={t('search_placeholder_price')}
          variant="filled"
          type="number"
          onChange={(e) => setFilter((prev) => ({ ...prev, price: e.target.value }))}
        />
      </Group>
    </div>
  );
};

export default SearchBar;