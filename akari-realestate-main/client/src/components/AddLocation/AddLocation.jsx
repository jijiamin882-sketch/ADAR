import React from "react";
import { useForm } from "@mantine/form";
import { validateString } from "../../utils/common";
import { Button, Group, Select, TextInput } from "@mantine/core";
import useCountries from "../../hooks/useCountries";
import Map from "../Map/Map";
import { useTranslation } from "react-i18next"; // استدعاء الترجمة

const AddLocation = ({ propertyDetails, setPropertyDetails, nextStep }) => {
  const { t } = useTranslation(); // تعريف الترجمة
  const { getAll } = useCountries();
  
  const form = useForm({
    initialValues: {
      country: propertyDetails?.country,
      city: propertyDetails?.city,
      address: propertyDetails?.address,
    },

    validate: {
      country: (value) => validateString(value),
      city: (value) => validateString(value),
      address: (value) => validateString(value),
    },
  });

  const { country, city, address } = form.values;

  const handleSubmit = ()=> {
    const {hasErrors} = form.validate();
    if(!hasErrors) {
        setPropertyDetails((prev)=> ({...prev, city, address, country}))
        nextStep()
    }
  }
  
  return (
    <form
    onSubmit={(e)=>{
        e.preventDefault();
        handleSubmit()
    }}
    >
      <div
        className="flexCenter"
        style={{
          justifyContent: "space-between",
          gap: "3rem",
          marginTop: "3rem",
          flexDirection: "row",
        }}
      >
        {/* inputs */}
        <div className="flexColStart" style={{ flex: 1, gap: "1rem" }}>
          <Select
            w={"100%"}
            withAsterisk
            label={t('add_loc_country')} // ترجمة
            clearable
            searchable
            data={getAll()}
            {...form.getInputProps("country", { type: "input" })}
          />

          <TextInput
            w={"100%"}
            withAsterisk
            label={t('add_loc_city')} // ترجمة
            {...form.getInputProps("city", { type: "input" })}
          />

          <TextInput
            w={"100%"}
            withAsterisk
            label={t('add_loc_address')} // ترجمة
            {...form.getInputProps("address", { type: "input" })}
          />
        </div>

        {/* map */}
        <div style={{ flex: 1 }}>
          <Map address={address} city={city} country={country} />
        </div>
      </div>

      <Group position="center" mt={"xl"}>
        <Button type="submit">{t('add_loc_next_btn')}</Button> {/* ترجمة */}
      </Group>
    </form>
  );
};

export default AddLocation;