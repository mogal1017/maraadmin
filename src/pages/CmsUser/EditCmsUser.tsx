import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useNavigate, useParams } from 'react-router-dom';
import { postData } from '../../Networking/Api';
import Swal from 'sweetalert2';
import Loader from '../../common/Loader';

const EditCmsUser = (onUserUpdated) => {
  const { userId } = useParams();
  const [formData, setFormData] = useState({
    id: '',
    fullName: '',
    mobileNo: '',
    email: '',
    password: '',
    //isActive: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState({
    fullName: '',
    mobileNo: '',
    email: '',
    password: '',
    //isActive: '',
  });

  const navigate = useNavigate();
  useEffect(() => {
    getCMSUserView();
  }, []);
  function formatMobileNumber(value) {
    const numbersOnly = value.replace(/[^\d+]/g, '');
    if (numbersOnly.length <= 3) {
      return numbersOnly; // Don't format if less than 3 digits
    }
    return `(${numbersOnly.slice(0, 3)})-${numbersOnly.slice(3, 6)}-${numbersOnly.slice(6)}`;
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
      //isActive: '',
    };

    if (!formData.fullName.trim()) {
      isValid = false;
      newErrors.fullName = 'Full name is required.';
    } else if (/[^a-zA-Z\s]/.test(formData.fullName)) {
      isValid = false;
      newErrors.fullName = 'Full name can only contain letters and spaces.';
    }

    // Mobile number validation (enhanced)
    if (!formData.mobileNo.trim()) {
      isValid = false;
      newErrors.mobileNo = 'Mobile number is required.';
    } else if (
      !/^(\+\d{1,2}\s)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}$/.test(
        formData.mobileNo,
      )
    ) {
      isValid = false;
      newErrors.mobileNo =
        'Invalid Contact Number Format. Must Be In (XXX) XXX-XXXX Or +XX (XXX) XXX-XXXX Format.';
    }

    if (!formData.email.trim()) {
      isValid = false;
      newErrors.email = 'Email Is Required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      isValid = false;
      newErrors.email = 'Invalid Email Format.';
    }
    console.log('formData.password---', formData.password);

    if (formData.password != '') {
      if (!formData.password.trim()) {
        isValid = false;
        newErrors.password = 'Password Is Required.';
      } else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          formData.password,
        )
      ) {
        isValid = false;
        newErrors.password =
          'Password Must Be At Least 8 Characters Long And Contain At Least One Lowercase Letter, One Uppercase Letter, One Digit, And One Special Character';
      }
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
  const getCMSUserView = async () => {
    try {
      setLoading(true);
      // Define the payload structure
      const payload = {
        modelName: 'cms_users',
        //id: userId,
        whereCondition: {
          id: userId,
        },
        //is_active:1,
      };

      const cmsUserResponse = await postData('masters/getMasterList', payload);
      setLoading(false);
      const userData = cmsUserResponse.data[0];
      setFormData({
        id: userData.id,
        fullName: userData.full_name,
        mobileNo: userData.mobile_no,
        email: userData.email,
        password: '',
        isActive: userData.is_active, // Convert 0/1 to boolean
      });
    } catch (error) {
      // Handle any exceptions
      console.error('An error occurred:', error);
    }
  };
  const UpdateCMSUser = async () => {
    try {
      // Define the payload structure
      setLoading(true);

      var payload = {};
      if (formData.password == '') {
        payload = {
          modelName: 'cms_users',
          id: userId,
          inputData: {
            full_name: formData.fullName,
            mobile_no: formData.mobileNo,
            email: formData.email,
            //is_active: formData.isActive,
          },
        };
      } else {
        payload = {
          modelName: 'cms_users',
          id: userId,
          inputData: {
            full_name: formData.fullName,
            mobile_no: formData.mobileNo,
            email: formData.email,
            password: formData.password,
            //is_active: formData.isActive,
          },
        };
      }
      console.log('payload-- ->', payload);
      const cmsUserResponse = await postData(
        'masters/createAndUpdateMaster',
        payload,
      );
      setLoading(false);

      if (cmsUserResponse.code === 1) {
        Swal.fire({
          title: 'Success',
          text: 'User Updated Successfully',
          icon: 'success',
          timer: 2000,
          showConfirmButton: true,
        });
        setTimeout(() => {
          navigate(`/cmsUser`);
        }, 2000);
      } else {
        console.error('User creation failed:', cmsUserResponse.message);
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
        await UpdateCMSUser();
      } catch (error) {
        console.error('Error adding user:', error);
      }
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Update CMS User">
        <a onClick={() => navigate(`/cmsUser`)}>CMS User List</a>
      </Breadcrumb>
      {loading ? (
        <Loader />
      ) : (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          {/* <div className='flex justify-end pb-2 px-3 py-2'>
          <button  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={() => navigate(`/cmsUser`)}>
            Back
         </button>
         </div> */}

          <form onSubmit={handleSubmit} className="p-6.5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Full name <span className="text-meta-1">*</span>
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
                  Password
                </label>
                <input
                  type="password"
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
              {/* <div className="mb-4.5 flex items-center gap-6">
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
              </div> */}
            </div>
            <div className="space-x-2">
              <button
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => navigate(`/cmsUser`)}
              >
                Back
              </button>
              <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Update
              </button>
            </div>
          </form>
        </div>
      )}
    </DefaultLayout>
  );
};
export default EditCmsUser;
