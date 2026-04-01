import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, Group, NumberInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import { db } from "../../firebase"; // تأكد من استيراد قاعدة البيانات
import { ref, push, set } from "firebase/database";
import { toast } from "react-toastify";

const Facilities = ({
  prevStep,
  propertyDetails,
  setPropertyDetails,
  setOpened,
  setActiveStep,
}) => {
  // 1. إعداد النموذج (Form) كما كان في الأصل لكن مع تعريب التنبيهات
  const form = useForm({
    initialValues: {
      bedrooms: propertyDetails.facilities.bedrooms,
      parkings: propertyDetails.facilities.parkings,
      bathrooms: propertyDetails.facilities.bathrooms,
    },
    validate: {
      bedrooms: (value) => (value < 1 ? "يجب إدخال غرفة واحدة على الأقل" : null),
      bathrooms: (value) => (value < 1 ? "يجب إدخال حمام واحد على الأقل" : null),
    },
  });

  const { bedrooms, parkings, bathrooms } = form.values;
  const { user } = useAuth0();

  // 2. دالة الإرسال إلى Firebase
  const handleSubmit = async () => {
    const { hasErrors } = form.validate();
    if (!hasErrors) {
      try {
        const propertiesRef = ref(db, "listings");
        const newPropertyRef = push(propertiesRef);

        await set(newPropertyRef, {
          ...propertyDetails,
          facilities: { bedrooms, parkings, bathrooms },
          userEmail: user?.email || "غير مسجل",
          addedAt: new Date().toISOString(),
        });

        toast.success("تمت إضافة العقار بنجاح!", { position: "bottom-right" });

        // تصفير البيانات وإغلاق النافذة
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
        toast.error("حدث خطأ أثناء الإضافة", { position: "bottom-right" });
      }
    }
  };

  return (
    <Box maw="30%" mx="auto" my="sm" dir="rtl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <NumberInput
          withAsterisk
          label="عدد الغرف"
          min={0}
          {...form.getInputProps("bedrooms")}
        />
        <NumberInput
          label="مواقف السيارات"
          min={0}
          {...form.getInputProps("parkings")}
        />
        <NumberInput
          withAsterisk
          label="عدد الحمامات"
          min={0}
          {...form.getInputProps("bathrooms")}
        />
        <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            السابق
          </Button>
          <Button type="submit" color="green">
            نشر العقار الآن
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default Facilities;