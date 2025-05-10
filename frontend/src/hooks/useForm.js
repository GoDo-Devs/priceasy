import { useState } from "react";

function useForm(initialFields, validator) {
  const [fields, setFields] = useState(initialFields);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setFields({
      ...fields,
      [e.target.name]: e.target.value,
    });
  }

  async function validate() {
    try {
      await validator.validate(fields, { abortEarly: false });
      setErrors({});
      return true;
    } catch (e) {
      let fieldErr = {};

      e.inner?.forEach((error) => {
        console.log(error.path);
        fieldErr[error.path] = error.errors;
      });

      setErrors(fieldErr);
      return false;
    }
  }

  return {
    fields,
    setFields,
    handleChange,
    validate,
    errors,
    setErrors,
  };
}

export default useForm;
