import React, { useState } from 'react'
import * as Yup from 'yup'

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
  size: Yup.string().oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect).required('Size is required'),
  toppings: Yup.array().of(Yup.string()),
});

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

  const handleInputChange = (e) => {
    const {name, value, type, checked} = e.target;
    const inputValues = type === 'checkbox' ? checked : value;

    setFormValues({
      ...formValues, 
      [name]: inputValues,
    });
  };

  const handleCheckboxChange = (topping) => {
    const updatedToppings = [...formValues.toppings];
    const index = updatedToppings.indexOf(topping);

    if (index !== -1) {
      updatedToppings.splice(index, 1);
    } else {
      updatedToppings.push(topping)
  }

setFormValues({
  ...formValues, 
  toppings: updatedToppings,
});
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    validationSchema.validate(formValues, {abortEarly: false})
    .then(() => {
      console.log('Form submitted with values:', formValues);
    })
.catch((err) => {
  const newErrors = {};
  err.inner.forEach(error => {
    newErrors[error.path]
 = error.message;  });
 setFormErrors(newErrors);
})
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {true && <div className='success'>Thank you for your order!</div>}
      {true && <div className='failure'>Something went wrong</div>}

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
            name="Pepperoni"
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
      <input type="submit" />
    </form>
  )
}
