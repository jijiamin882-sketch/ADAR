import React from "react";
import { TextInput, Box, Textarea, Group, Button, NumberInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { validateString } from "../../utils/common";
import { useTranslation } from "react-i18next"; // استدعاء الترجمة

const BasicDetails = ({ prevStep, nextStep, propertyDetails, setPropertyDetails }) => {
  const { t } = useTranslation(); // تعريف الترجمة

  const form = useForm({
    initialValues: {
      title: propertyDetails.title,
      description: propertyDetails.description,
      price: propertyDetails.price,
    },
    validate: {
      title: (value) => validateString(value),
      description: (value) => validateString(value),
      price: (value) =>
          value < 1000 ? t('basic_price_error') : null, // ترجمة رسالة الخطأ
    },
  });

  const {title, description, price} = form.values

  const handleSubmit = ()=> {
    const {hasErrors} = form.validate()
    if(!hasErrors) {
     setPropertyDetails((prev)=> ({...prev, title, description, price}))
     nextStep()
    }
  }
  
  return (
    <Box maw="50%" mx="auto" my="md">
      <form  onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}>
        <TextInput
          withAsterisk
          label={t('basic_title_label')} // ترجمة
          placeholder={t('basic_title_placeholder')} // ترجمة
          {...form.getInputProps("title")}
        />
        <Textarea
          placeholder={t('basic_desc_placeholder')} // ترجمة
          label={t('basic_desc_label')} // ترجمة
          withAsterisk
          {...form.getInputProps("description")}
        />
        <NumberInput
          withAsterisk
          label={t('basic_price_label')} // ترجمة
          placeholder="1000"
          min={0}
          {...form.getInputProps("price")}
        />
        <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            {t('basic_btn_back')} {/* ترجمة */}
          </Button>
          <Button type="submit">
            {t('basic_btn_next')} {/* ترجمة */}
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default BasicDetails;