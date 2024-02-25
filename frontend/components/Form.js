import React, { useState } from 'react'
import * as Yup from 'yup'
import axios from 'axios';

const apiEndpoint = 'http://localhost:9009/api/order';

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

// 👇 Here you will create your schema.

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

// Validation schema using Yup

const validationSchema = Yup.object({
  fullName: Yup.string()
  .min(3, validationErrors.fullNameTooShort)
  .max(20, validationErrors.fullNameTooLong)
  .required('Full name is required'),
  size: Yup.string().oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect)});

export default function Form() {
  const [formValues, setFormValues] = useState({
    fullName: '',
    size: '',
    toppings: [],
  });

  const [formErrors, setFormErrors] = useState({
    fullName: '',
    size: '',
    toppings: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(null)

  const handleInputChange = (e) => {
    const {name, value, type, checked} = e.target;
    const inputValues = type === 'checkbox' ? checked : value;

    setFormValues({
      ...formValues, 
      [name]: inputValues,
    });
  };

  const handleCheckboxChange = (topping) => {
    const updatedToppings = formValues.toppings.includes(topping)
    ? formValues.toppings.filter(item => item !== topping)
    : [...formValues.toppings, topping];

setFormValues({
  ...formValues, 
  toppings: updatedToppings,
});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate(formValues, {abortEarly: false})

      const response = await axios.post(apiEndpoint, formValues)

      setFormSubmitted(true);
      setFormErrors({})
      setFormValues({
        fullName: '',
        size: '',
        toppings: [],
      });
  } catch (err) {
  const newErrors = {};
  err.inner.forEach((error) => {
    newErrors[error.path]
 = error.message;  });
 setFormErrors(newErrors);
 setFormSubmitted(false);
}
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {formSubmitted && (
      <div className='success'>{formValues.toppings.length > 0
      ? `Thank you for your order, ${formValues.fullName}! Your ${formValues.size.toLowerCase()} pizza with ${formValues.toppings.length} is on the way.`
      :`Thank you for your order! Your ${formValues.size.toLowerCase()} with no toppings.`}
  </div>)}
      {formSubmitted === false && <div className='failure'>Something went wrong</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input name="fullName" placeholder="Type full name" id="fullName" type="text" onChange={handleInputChange} value={formValues.fullName}/>
        {formErrors.fullName && <div className='error'>{formErrors.fullName}</div>}
        </div>
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size" name="size" onChange={handleInputChange} value={formValues.size}>
            <option value="">----Choose Size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
          {formErrors.size && <div className='error'>{formErrors.size}</div>}
        </div>
      </div>

      <div className="input-group">
        {toppings.map(topping => (
        <label key={topping.topping_id}>
          <input
            name={topping.text}
            type="checkbox"
            value={topping.text}
            checked={formValues.toppings.includes(topping.text)}
            onChange={() => handleCheckboxChange(topping.text)}
          />
          {topping.text}<br />
        </label>
        ))}
        {formErrors.toppings && <div className='error'>{formErrors.toppings}</div>}
      </div>
      <input type="submit" disabled={!formValues.fullName || !formValues.size}/>
    </form>
  );
};


