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
  });

  const [formSubmitted, setFormSubmitted] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [failureMessage, setFailureMessage] = useState('')

  useEffect(() => {
    formSchema.isValid(formValues).then((isValid) => {
      setFormSubmitted(isValid)
    })
  }, [formValues.fullName, formValues.size])


  const validate = (key, value) => {
    validationSchema.validate({[key]:value}).then(() => {
      setFormErrors({
        ...formErrors, [key]: ''
      })
    }).catch((err) => {setFormErrors({
      ...formErrors, [key]: err.errors[0]
    })})
  };

  const handleInputChange = (e) => {
    const {id, value} = e.target;
    validate(id, value)
    setFormValues({
      ...formValues, [id]: value
    })
  }


  const handleCheckboxChange = (e) => {
    const {name, checked} = e.target
    const topping_Id = name.toString()
    if (checked) {
      setFormValues({
        ...formValues, toppings: [...formValues.toppings, name]

      })
    }         else {
      setFormValues({
    ...formValues, toppings: formValues.toppings.filter((t) => 
      t !== name)
      })
    }
  }



  const handleSubmit = async (e) => {
    e.preventDefault();

      await validationSchema.validate(formValues, {abortEarly: false})

     await axios.post(apiEndpoint, formValues)

      .then(response => {
        const successMessageText = response.data.message;
        setSuccessMessage(successMessageText)
  
        setFormSubmitted(true);
        setFailureMessage('')
        setFormValues({
          fullName: '',
          size: '',
          toppings: [],
        });
      })

      .catch (err =>  {
 setFailureMessage(err?.response?.data?.message);
 setFormSubmitted(false);
})
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {successMessage && <div className='success'>{successMessage}</div>}
      {formErrors.fullName && <div className='failure'>{formErrors.fullName}</div>}

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
        {toppings.map(({topping_id, text}) => (
        <label key={topping_id}>
          <input
            name={topping_id}
            type="checkbox"
            checked={!!formValues.toppings.find(t => t==topping_id)}
            onChange={handleCheckboxChange}
          />
          {text}<br />
        </label>
        ))}
        {formErrors.toppings && <div className='error'>{formErrors.toppings}</div>}
      </div>
      <input type="submit" disabled={!formValues.fullName || !formValues.size}/>
    </form>
  );
        }   