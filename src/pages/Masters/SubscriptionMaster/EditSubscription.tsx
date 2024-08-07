import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import Loader from '../../../common/Loader';
import { useNavigate, useParams } from 'react-router-dom';
import { postData } from '../../../Networking/Api';
import Swal from 'sweetalert2';

const EditSubscription = () => {
  const { userId } = useParams();
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    price: '',
    actual_price: '',
    duration_type: '',
    duration: '',
    // isActive: '',
  });
  const [loading, setLoading] = useState<boolean>(false);

  // const [selectedType, setSelectedType] = useState('');
  // const [selectedDurationType, setSelectedDurationType] = useState('');

  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    name: '',
    price: '',
    duration: '',
  });

  useEffect(() => {
    getSubscriptionView();
  }, []);

  useEffect(() => {
    setFormData({
      ...formData,
      type: '',
      name: '',
      price: '',
      actual_price: '',
      duration_type: '',
      duration: '',
    });
  }, []);

  const handleInputChange = (event: any) => {
    const { name, value, type, checked } = event.target;
    const newValue =
      type === 'checkbox'
        ? checked
          ? 1
          : 0
        : type === 'number'
        ? String(value)
        : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const getSubscriptionView = async () => {
    try {
      setLoading(true);
      // Define the payload structure
      const payload = {
        modelName: 'subscription_masters',
        //id: userId,
        whereCondition: {
          id: userId,
        },
        //is_active:1,
      };

      const subscriptionResponse = await postData(
        'masters/getMasterList',
        payload,
      );
      setLoading(false);
      const userData = subscriptionResponse.data[0];
      setFormData({
        type: userData.type,
        name: userData.name,
        price: userData.price,
        actual_price: userData.actual_price,
        duration_type: userData.duration_type,
        duration: userData.duration,
        //isActive: userData.is_active, // Convert 0/1 to boolean
      });
    } catch (error) {
      // Handle any exceptions
      console.error('An error occurred:', error);
    }
  };
  const UpdateSubscription = async () => {
    try {
      setLoading(true);
      // Define the payload structure
      const payload = {
        modelName: 'subscription_masters',
        id: userId,
        inputData: {
          type: formData.type,
          name: formData.name,
          price: formData.price,
          actual_price: formData.actual_price,
          duration_type: formData.duration_type,
          duration: formData.duration,
          //is_active: formData.isActive,
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
          text: 'Subcription Updated Successfully',
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

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      type: '',
      name: '',
      price: '',
      duration: '',
    };
  
    // Name validation
    if (!formData.name) {
      valid = false;
      newErrors.name = 'Name Is Required';
    } else if (/^\d+$/.test(formData.name)) {
      newErrors.name = 'Name Cannot Contain Only Numbers';
      valid = false;
    } else if (/^[^a-zA-Z0-9]+$/.test(formData.name)) {
      newErrors.name = 'Name Cannot Contain Only Special Symbols';
      valid = false;
    } else if (/^\s/.test(formData.name)) {
      newErrors.name = 'Name Cannot Start With A Space';
      valid = false;
    } else if (!/(?:[a-zA-Z]{3,})/.test(formData.name)) {
      newErrors.name = 'Name Must Contain At Least 3 Alphabets';
      valid = false;
    }
  
    // Price validation
    if (!formData.price) {
      valid = false;
      newErrors.price = 'Price Is Required';
    } else if (!/^\d+$/.test(formData.price)) {
      newErrors.price = 'Price Must Be A Number';
      valid = false;
    }
  
    // Duration validation
    if (!formData.duration) {
      valid = false;
      newErrors.duration = 'Duration Is Required';
    } else if (!/^\d+$/.test(formData.duration)) {
      newErrors.duration = 'Duration Must Be a Number';
      valid = false;
    }
  
    setErrors(newErrors);
    return valid;
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (validateForm()) {
      // Call validateForm only when submitting
      console.log('Formdata..', formData);
      try {
        await UpdateSubscription();
        // Navigate after the user is successfully added
      } catch (error) {
        //console for error
        console.error('Error adding user:', error);
      }
    }
  };
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Update Subscription">
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
                <label className="mb-2.5 block font-semibold text-black dark:text-white">
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
                  <p className="text-red-500 text-md mt-1">{errors.name}</p>
                )}
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block font-semibold text-black dark:text-white">
                  Type <span className="text-meta-1">*</span>
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="relative z-20 w-full rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                  disabled
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  <option value="Patient">Patient</option>
                  <option value="Clinic">Clinic</option>
                  <option value="Practitioner">Practitioner</option>
                </select>
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block font-semibold text-black dark:text-white">
                  Duration Type <span className="text-meta-1">*</span>
                </label>
                <select
                  name="duration_type"
                  value={formData.duration_type}
                  onChange={handleInputChange}
                  className="relative z-20 w-full rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                  disabled
                >
                  <option value="" disabled>
                    Select Duration
                  </option>
                  <option value="Annually">Annually</option>
                  <option value="Monthly">Monthly</option>
                  {/* <option value="Days">Days</option> */}
                </select>
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
                  <p className="text-red-500 text-md mt-1">{errors.duration}</p>
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
                  placeholder="Enter Actual Price"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5  outline-none transition focus:border-primary active:border-primary"
                  disabled
                />
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
                  <p className="text-red-500 text-md mt-1">{errors.price}</p>
                )}
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
                Update
              </button>
            </div>
          </form>
        </div>
      )}
    </DefaultLayout>
  );
};
export default EditSubscription;
