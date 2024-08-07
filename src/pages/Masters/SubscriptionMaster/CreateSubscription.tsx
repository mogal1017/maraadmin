import React, { useState } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import Loader from '../../../common/Loader';
import { useNavigate } from 'react-router-dom';
import { postData } from '../../../Networking/Api';
import Swal from 'sweetalert2';

const CreateSubscription = () => {
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    price: '',
    actual_price: '',
    duration_type: '',
    duration: '',
    isActive: 1,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState({
    type: '',
    name: '',
    price: '',
    actual_price: '',
    duration_type: '',
    duration: '',
  });

  const navigate = useNavigate();
  const priceRegex = /^\d+(\.\d{1,2})?$/;

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = event.target;
    let newValue = value;

    if (name === 'name') {
      newValue = value.replace(/[^\w\s\-]/gi, '');
    }

    setFormData({ ...formData, [name]: newValue });

    if (name !== 'price' && name !== 'duration') {
      setErrors({ ...errors, [name]: '' });
    } else if (name === 'price') {
      let newErrors = { ...errors };
      if (!value.trim()) {
        newErrors.price = 'Price Is Required';
      } else if (!priceRegex.test(value)) {
        newErrors.price = 'Price Must Be A Number';
      } else {
        newErrors.price = '';
      }
      setErrors(newErrors);
    } else if (name === 'duration') {
      let newErrors = { ...errors };
      if (!value.trim()) {
        newErrors.duration = 'Duration Is Required';
      } else if (!/^\d+$/.test(value)) {
        newErrors.duration = 'Duration Must Be A Number';
      } else {
        newErrors.duration = '';
      }
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      type: '',
      name: '',
      price: '',
      actual_price: '',
      duration_type: '',
      duration: '',
    };

    if (!formData.type) {
      isValid = false;
      newErrors.type = 'Type Is Required';
    }

    if (!formData.name.trim()) {
      isValid = false;
      newErrors.name = 'Name Is Required';
    } else if (/^\d+$/.test(formData.name.trim())) {
      isValid = false;
      newErrors.name = 'Name Cannot Be Only Numbers';
    } else if (/^[^a-zA-Z0-9]+$/.test(formData.name)) {
      newErrors.name = 'Name Cannot Contain Only Special Symbols';
      isValid = false;
    } else if (!/(?:[a-zA-Z]{3,})/.test(formData.name)) {
      newErrors.name = 'Name Must Contain At Least 3 Alphabets';
      isValid = false;
    }

    if (!formData.price.trim()) {
      isValid = false;
      newErrors.price = 'Price Is Required';
    } else if (!/^\d+(\.\d+)?$/.test(formData.price)) {
      isValid = false;
      newErrors.price = 'Price Must Be A Number';
    }

    if (!formData.actual_price.trim()) {
      isValid = false;
      newErrors.actual_price = 'Price Is Required';
    } else if (!/^\d+(\.\d+)?$/.test(formData.actual_price)) {
      isValid = false;
      newErrors.actual_price = 'Actual Price Must Be A Number';
    }

    if (!formData.duration_type) {
      isValid = false;
      newErrors.duration_type = 'Duration Type Is Required';
    }

    if (!formData.duration.trim()) {
      isValid = false;
      newErrors.duration = 'Duration Is Required';
    } else if (!/^\d+$/.test(formData.duration)) {
      isValid = false;
      newErrors.duration = 'Duration Must Be A Number';
    }

    if (!isValid) {
      console.error('Form validation errors:', newErrors);
    }

    setErrors(newErrors);
    return isValid;
  };
  const CreateSubscription = async () => {
    try {
      setLoading(true);
      // Define the payload structure
      const payload = {
        modelName: 'subscription_masters',
        inputData: {
          type: formData.type,
          name: formData.name,
          price: formData.price,
          actual_price: formData.actual_price,
          duration_type: formData.duration_type,
          duration: formData.duration,
          is_active: formData.isActive,
        },
      };

      const subscriptionResponse = await postData(
        'masters/createAndUpdateMaster',
        payload,
      );
      setLoading(false);
      if (subscriptionResponse.code === 1) {
        // Success case
        // console.log('User created successfully:', cmsUserResponse.data);
        Swal.fire({
          title: 'Success',
          text: 'Subscription Created Successfully',
          icon: 'success',
          timer: 2000,
          showConfirmButton: true,
        });
        setTimeout(() => {
          navigate(`/subscriptionmaster`);
        }, 2000);
      } else {
        console.error('User creation failed:', subscriptionResponse.message);
        Swal.fire({
          title: 'Error',
          text: subscriptionResponse.message,
          icon: 'error',
          timer: 2000,
          showConfirmButton: true,
        });
      }
    } catch (error) {
      // Handle any exceptions
      console.error('An error occurred:', error);
    }
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Formdata..', formData);
      try {
        await CreateSubscription();
      } catch (error) {
        console.error('Error adding user:', error);
      }
    }
  };
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Add Subscription ">
        <a onClick={() => navigate(`/subscriptionmaster`)}>Subscription List</a>
      </Breadcrumb>
      {loading ? (
        <Loader />
      ) : (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex justify-end pb-2 px-3 py-2"></div>
          <form onSubmit={handleSubmit} className="p-6.5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4.5">
                <label className="mb-2.5 font-semibold block text-black dark:text-white">
                  Name <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter Name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                />
                {errors.name && (
                  <p className="text-red-500 text-md">{errors.name}</p>
                )}
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 font-semibold block text-black dark:text-white">
                  Type <span className="text-meta-1">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="relative z-20 w-full rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  <option value="Patient">Patient</option>
                  <option value="Clinic">Clinic</option>
                  <option value="Practitioner">Practitioner</option>
                </select>
                {errors.type && (
                  <p className="text-red-500 text-md">{errors.type}</p>
                )}
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 font-semibold block text-black dark:text-white">
                  Duration Type <span className="text-meta-1">*</span>
                </label>
                <select
                  name="duration_type"
                  value={formData.duration_type}
                  onChange={handleInputChange}
                  className="relative z-20 w-full rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                >
                  <option value="" disabled>
                    Select Duration
                  </option>
                  <option value="Annually">Annually</option>
                  <option value="Monthly">Monthly</option>
                  {/* <option value="Days">Days</option> */}
                </select>
                {errors.duration_type && (
                  <p className="text-red-500 text-md">{errors.duration_type}</p>
                )}
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block font-semibold text-black dark:text-white">
                  Duration <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="Enter Duration"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                />
                {errors.duration && (
                  <p className="text-red-500 text-md">{errors.duration}</p>
                )}
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block font-semibold text-black dark:text-white">
                  Price <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter Price"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                />
                {errors.price && (
                  <p className="text-red-500 text-md">{errors.price}</p>
                )}
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block font-semibold text-black dark:text-white">
                  Actual Price <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  name="actual_price"
                  value={formData.actual_price}
                  onChange={handleInputChange}
                  placeholder="Enter Price"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                />
                {errors.actual_price && (
                  <p className="text-red-500 text-md">{errors.actual_price}</p>
                )}
              </div>
              <div className="mb-4.5 flex items-center gap-6">
                <label className="mb-2.5 block font-semibold text-black dark:text-white">
                  Is Active
                </label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  //required
                  className={`h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600`}
                />
              </div>
            </div>
            <div className="space-x-2">
              <button
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => navigate(`/subscriptionmaster`)}
              >
                Back
              </button>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </DefaultLayout>
  );
};
export default CreateSubscription;
