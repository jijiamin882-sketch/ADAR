import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, Group, NumberInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import { db } from "../../firebase";
import { ref, push, set } from "firebase/database";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next"; // استدعاء الترجمة

const Facilities = ({
  prevStep,
  propertyDetails,
  setPropertyDetails,
  setOpened,
  setActiveStep,
}) => {
  const { t } = useTranslation(); // تعريف الترجمة
  
  const form = useForm({
    initialValues: {
      bedrooms: propertyDetails.facilities.bedrooms,
      parkings: propertyDetails.facilities.parkings,
      bathrooms: propertyDetails.facilities.bathrooms,
    },
    validate: {
      bedrooms: (value) => (value < 1 ? t('facilities_bedrooms_error') : null),
      bathrooms: (value) => (value < 1 ? t('facilities_bathrooms_error') : null),
    },
  });

  const { bedrooms, parkings, bathrooms } = form.values;
  const { user } = useAuth0();

  const handleSubmit = async () => {
    const { hasErrors } = form.validate();
    if (!hasErrors) {
      try {
        const propertiesRef = ref(db, "listings");
        const newPropertyRef = push(propertiesRef);

        await set(newPropertyRef, {
          ...propertyDetails,
          facilities: { bedrooms, parkings, bathrooms },
          userEmail: user?.email || t('facilities_unregistered'), // ترجمة الحالة الافتراضية
          addedAt: new Date().toISOString(),
        });

        toast.success(t('facilities_success_toast'), { position: "bottom-right" });

        setPropertyDetails({
          title: "",
          description: "",
          price: 0,
          country: "",
          city: "",
          address: "",
          image: null,
          facilities: { bedrooms: 0, parkings: 0, bathrooms: 0 },
        });
        setOpened(false);
        setActiveStep(0);

      } catch (error) {
        console.error(error);
        toast.error(t('facilities_error_toast'), { position: "bottom-right" });
      }
    }
  };

  return (
    // تمت إزالة dir="rtl" لتجنب التعارض مع تبديل اللغة العالمي
    <Box maw="30%" mx="auto" my="sm"> 
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <NumberInput
          withAsterisk
          label={t('facilities_bedrooms_label')}
          min={0}
          {...form.getInputProps("bedrooms")}
        />
        <NumberInput
          label={t('facilities_parkings_label')}
          min={0}
          {...form.getInputProps("parkings")}
        />
        <NumberInput
          withAsterisk
          label={t('facilities_bathrooms_label')}
          min={0}
          {...form.getInputProps("bathrooms")}
        />
        <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            {t('facilities_btn_back')}
          </Button>
          <Button type="submit" color="green">
            {t('facilities_btn_submit')}
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default Facilities;