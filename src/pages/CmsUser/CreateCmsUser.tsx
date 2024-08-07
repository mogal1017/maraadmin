import React, { useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { postData } from '../../Networking/Api';
import Swal from 'sweetalert2';
import Loader from '../../common/Loader';

const CreateCmsUser = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNo: '',
    email: '',
    password: '',
    isActive: 1,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState({
    fullName: '',
    mobileNo: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  // const handleInputChange=(event: any)=>{
  //   const { name, value } = event.target;
  //   setFormData({ ...formData, [name]: value });
  //   setErrors({ ...errors, [name]: "" });
  // }
  function formatMobileNumber(value) {
    const numbersOnly = value.replace(/[^\d+]/g, '');
    if (numbersOnly.length <= 3) {
      return numbersOnly; // Don't format if less than 3 digits
    }
    return `(${numbersOnly.slice(0, 3)}) ${numbersOnly.slice(3, 6)}-${numbersOnly.slice(6)}`;
  }
  
  const handleInputChange = (event: any) => {
    const { name, value, type, checked } = event.target;
    if (name === 'mobileNo') {
      const formattedValue = formatMobileNumber(value);
      const newValue = type === 'checkbox' ? checked : formattedValue;
      setFormData({ ...formData, [name]: newValue });
    } else {
      const newValue = type === 'checkbox' ? (checked ? 1 : 0) : value;
      setFormData({ ...formData, [name]: newValue });
    }
    setErrors({ ...errors, [name]: '' });
  };
  // const handleInputChange = (event: any) => {
  //   const { name, value, type, checked } = event.target;
  //   const newValue = type === 'checkbox' ? (checked ? 1 : 0) : value;
  //   setFormData({ ...formData, [name]: newValue });
  //   setErrors({ ...errors, [name]: '' });
  // };
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      fullName: '',
      mobileNo: '',
      email: '',
      password: '',
      isActive: '',
    };
  
    const trimmedFullName = formData.fullName.trim();
    const trimmedMobileNo = formData.mobileNo.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPassword = formData.password.trim();
  
    // Full Name validation
    if (!trimmedFullName) {
      isValid = false;
      newErrors.fullName = 'Full Name Is Required';
    } else if (/[^a-zA-Z\- ]/.test(trimmedFullName)) {
      isValid = false;
      newErrors.fullName = 'Full Name Can Only Contain Letters And Spaces';
    } else if (/^\s/.test(trimmedFullName)) {
      isValid = false;
      newErrors.fullName = 'Full Name Should Not Start With A Space';
    } else if (trimmedFullName.length < 6) {
      isValid = false;
      newErrors.fullName = 'Full Name Must Be At Least 6 Characters Long';
    }
  
    // Mobile number validation (enhanced)
    if (!trimmedMobileNo) {
      isValid = false;
      newErrors.mobileNo = 'Mobile Number Is Required';
    } else if (
      !/^(\+\d{1,2}\s)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}$/.test(
        trimmedMobileNo,
      )
    ) {
      isValid = false;
      newErrors.mobileNo =
        'Invalid Contact Number Format Must Be In (XXX) XXX-XXXX or +XX (XXX) XXX-XXXX Format';
    }
  
    // Email validation
    if (!trimmedEmail) {
      isValid = false;
      newErrors.email = 'Email Is Required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      isValid = false;
      newErrors.email = 'Invalid Email Format';
    } else if (/^\s/.test(formData.email)) {
      isValid = false;
      newErrors.email = 'Email Should Not Start With A Space';
    }
  
    // Password validation
    if (!trimmedPassword) {
      isValid = false;
      newErrors.password = 'Password Is Required';
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        trimmedPassword,
      )
    ) {
      isValid = false;
      newErrors.password =
        'Password Must Be At Least 8 Characters Long And Contain At Least One Lowercase Letter, One Uppercase Letter, One Digit, And One Special Character';
    } else if (/^\s/.test(formData.password)) {
      isValid = false;
      newErrors.password = 'Password Should Not Start With A Space';
    }
  
    // Display errors to the user (consider using a UI library for better presentation)
    if (!isValid) {
      console.error('Form validation errors:', newErrors);
      // Alert the user about the errors
      // ... (implementation depends on your UI framework)
    }
  
    setErrors(newErrors);
    return isValid;
  };
  
  const CreateCMSUser = async () => {
    try {
      setLoading(true);
      // Define the payload structure
      const payload = {
        modelName: 'cms_users',
        inputData: {
          full_name: formData.fullName,
          mobile_no: formData.mobileNo,
          email: formData.email,
          password: formData.password,
          is_active: formData.isActive,
        },
      };

      const cmsUserResponse = await postData('auth/signUp', payload);
      setLoading(false);
      if (cmsUserResponse.code === 1) {
        // Success case
        // console.log('User created successfully:', cmsUserResponse.data);
        Swal.fire({
          title: 'Success',
          text: 'User Created Successfully',
          icon: 'success',
          timer: 2000,
          showConfirmButton: true,
        });
        setTimeout(() => {
          navigate(`/cmsUser`);
        }, 2000);
      } else {
        console.error('User creation failed:', cmsUserResponse.message);
        Swal.fire({
          title: 'Error',
          text: cmsUserResponse.message,
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

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        await CreateCMSUser();
        // Navigate after the user is successfully added
      } catch (error) {
        console.error('Error adding user:', error);
      }
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName={'Add CMS User'}>
        <a onClick={() => navigate('/CmsUser')}>CMS User List</a>
      </Breadcrumb>
      {loading ? (
        <Loader />
      ) : (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex justify-end pb-2 px-3 py-2">
            {/* <button  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={() => navigate(`/cmsUser`)}>
      Back
   </button> */}
          </div>
          <form onSubmit={handleSubmit} className="p-6.5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Full Name <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter Your Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  //required
                  className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary ${
                    errors.fullName ? 'border-red-500' : ''
                  }`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-md">{errors.fullName}</p>
                )}
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                   Contact No <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  name="mobileNo"
                  placeholder="Enter Your Contact Number"
                  value={formData.mobileNo}
                  onChange={handleInputChange}
                  //required
                  maxLength={14} // Adjusted to accommodate optional country code
                  pattern="^\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}$|^(\+\d{1,2}\s)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}$"
                  className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary ${
                    errors.mobileNo ? 'border-red-500' : ''
                  }`}
                />
                {errors.mobileNo && (
                  <p className="text-red-500 text-md">{errors.mobileNo}</p>
                )}
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Email <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  name="email"
                  placeholder="Enter Your Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  //required
                  className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-md">{errors.email}</p>
                )}
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Password <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  name="password"
                  placeholder="Enter Your Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  //required
                  className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-md">{errors.password}</p>
                )}
              </div>
              <div className="mb-4.5 flex items-center gap-6">
                <label className="mb-2.5 block text-black dark:text-white">
                  Is Active
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    //required
                    className={`h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 ${
                      errors.fullName ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                {/* {errors.isActive && (
<div className="ml-10">
<p className="text-red-500 text-md">{errors.isActive}</p>
</div>
)} */}
              </div>
            </div>
            <div className="space-x-2">
              <button
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => navigate(`/cmsUser`)}
              >
                Back
              </button>
              <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </DefaultLayout>
  );
};
export default CreateCmsUser;
