import {
  validateAllFormValidations,
  validateFormHelper,
  validateFormRequiredFields,
} from "@/utils/CommonFunc";
import { useState } from "react";

export default function useForm(initialState = {}) {
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (error[name]) setError({ ...error, [name]: [] });
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (value, action) => {
    if (action.action === "clear") {
      setFormData((prev) => ({
        ...prev,
        [action.name]: "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [action.name]: value?.value }));
    }
    if (error[action.name]) setError({ ...error, [action.name]: [] });
  };

  const validateForm = (validationSchema) => {
    const inputSchema = validationSchema;
    const error = validateAllFormValidations(inputSchema, formData);
    setError(error);
    return error;
  };

  return {
    handleInputChange,
    handleSelectChange,
    validateForm,
    formData,
    setFormData,
    isSubmitted,
    error,
    setError,
  };
}
