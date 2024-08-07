import { ChangeEvent, useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { BsFillPencilFill, BsFillTrash2Fill } from 'react-icons/bs';
import { postData } from '../../Networking/Api';

interface InsurancePlan {
  insurance_name: string;
  id: string;
  name: string;
}

interface HealthInsuranceData {
  insuranceName: string;
  insurancePlan: InsurancePlan[];
  selectedPlan: string;
}

interface Provider {
  nipNumber: string;
  healthcareProvider: string;
  providerType: string;
  providerEmail: string;
  profile: string | null;
  calendar: string;
}

export const ClinicSignup = () => {
  const [outpatientData, setOutPatientData] = useState({
    practiceName: '',
    email: '',
    website: '',
    phone: '',
    faxNumber: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    logoImage: null as string | null,
  });
  const [providerData, setProviderData] = useState<
    Array<{
      nipNumber: string;
      healthcareProvider: string;
      providerType: string;
      providerEmail: string;
      profile: string | null;
      calendar: string;
    }>
  >([]);
  const [newProvider, setNewProvider] = useState<Provider>({
    nipNumber: '',
    healthcareProvider: '',
    providerType: '',
    providerEmail: '',
    profile: '',
    calendar: '',
  });
  const [errorMessage, setErrorMessage] = useState({});
  const [errors, setErrors] = useState({});
  const [assistantErrors, setAssistantErrors] = useState({});
  const [insuranceErrors, setInsuranceErrors] = useState({});
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [facilityImages, setFacilityImages] = useState<string[]>([]);
  const [carriers, setCarriers] = useState<Array<{ id: number; name: string }>>([]);


  const [assistantData, setAssistantData] = useState({
    firstName: '',
    lastName: '',
    assistantEmail: '',
    assistantProfile: null as string | null,
  });
  const [healthInsuranceData, setHealthInsuranceData] =
    useState<HealthInsuranceData>({
      insuranceName: '',
      insurancePlan: [],
      selectedPlan: '',
    });

  const handleOutpatientInputChange = (e: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = e.target;
    setOutPatientData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProvider({ ...newProvider, profile: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddOrUpdateProvider = () => {
    const newErrors = {};

    // Validation
    if (!newProvider.nipNumber.trim()) {
      newErrors.nipNumber = 'NIP Number Is Required';
    } else if (!/^\d{1,10}$/.test(newProvider.nipNumber.trim())) {
      newErrors.nipNumber = 'NIP Number Must Be Up To 10 Digits Long';
    }
    if (!newProvider.healthcareProvider.trim()) {
      newErrors.healthcareProvider = 'Healthcare Provider Is Required';
    } else if (newProvider.healthcareProvider.trim().length < 6) {
      newErrors.healthcareProvider =
        'Healthcare Provider Must Be At Least 6 Characters Long';
    } else if (!/^[a-zA-Z\s]+$/.test(newProvider.healthcareProvider.trim())) {
      newErrors.healthcareProvider =
        'Healthcare Provider Can Only Contain Letters and Spaces';
    }

    if (!newProvider.providerType.trim()) {
      newErrors.providerType = 'Provider Type Is Required';
    } else if (!/^[a-zA-Z0-9\s]+$/.test(newProvider.providerType.trim())) {
      newErrors.providerType =
        'Provider Type Can Only Contain Letters, Numbers, and Spaces';
    }

    if (!newProvider.providerEmail.trim()) {
      newErrors.providerEmail = 'Provider Email Is Required';
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newProvider.providerEmail.trim())
    ) {
      newErrors.providerEmail = 'Invalid Email Format';
    }

    if (!newProvider.profile.trim()) newErrors.profile = 'Profile Photo Is Required';
    if (!newProvider.calendar.trim()) newErrors.calendar = 'Calendar Link Is Required';

    setErrors(newErrors);

    // If there are any errors, stop the submission
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Proceed with adding/updating provider
    if (editingIndex === -1) {
      setProviderData([...providerData, newProvider]);
    } else {
      const updatedProviders = providerData.map((provider, index) =>
        index === editingIndex ? newProvider : provider
      );
      setProviderData(updatedProviders);
      setEditingIndex(-1);
    }

    // Reset the form fields after submission
    setNewProvider({
      nipNumber: '',
      healthcareProvider: '',
      providerType: '',
      providerEmail: '',
      profile: '',
      calendar: '',
    });
  };

  const handleEdit = (index: number) => {
    setErrors({});
    // Ensure that profile is always a string
    const editedProvider = { ...providerData[index] };
    if (editedProvider.profile === null) {
      editedProvider.profile = ''; // Provide a default value if profile is null
    }
    setNewProvider(editedProvider);
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    const updatedProviders = providerData.filter((_, i) => i !== index);
    setProviderData(updatedProviders);
  };

  const handleAssistantImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAssistantData((prevData) => ({
            ...prevData,
            assistantProfile: reader.result,
          }));
        }
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  useEffect(() => {
    const fetchInsurancePlans = async () => {
      try {
        const payload = {
          modelName: 'insurance_masters',
        };
        const response = await postData('masters/getMasterList', payload);
        setHealthInsuranceData((prevData) => ({
          ...prevData,
          insurancePlan: response.data,
        }));
      } catch (error) {
        console.error('Error fetching Insurance masters:', error);
      }
    };

    fetchInsurancePlans();
  }, []);

  const handleInsuranceNameChange = (e) => {
    const { value } = e.target;
    setHealthInsuranceData((prevData) => ({
      ...prevData,
      insuranceName: value,
    }));

    // Clear the specific error message when the user starts typing
    setInsuranceErrors((prevErrors) => ({
      ...prevErrors,
      insuranceName: '',
    }));
  };

  const handleInsurancePlanChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
  ) => {
    const { value } = e.target;
    setHealthInsuranceData((prevData) => ({
      ...prevData,
      selectedPlan: value,
    }));

    // Clear the specific error message when the user selects a plan
    setInsuranceErrors((prevErrors) => ({
      ...prevErrors,
      insurancePlan: '',
    }));
  };

  const handleLogoImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setOutPatientData((prevData) => ({
            ...prevData,
            logoImage: reader.result,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFacilityImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const imageFiles = Array.from(files);
      const promises = imageFiles.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target && e.target.result) {
              resolve(e.target.result.toString());
            } else {
              reject('Failed to read file');
            }
          };
          reader.onerror = () => {
            reject('File reading failed');
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(promises)
        .then((base64Images) => {
          setFacilityImages((prevImages) => [...prevImages, ...base64Images]);
        })
        .catch((error) => {
          console.error('Error reading files:', error);
        });
    }
  };

  const removeImage = (index: number) => {
    setFacilityImages((prevFacilityImages) => {
      const updatedImages = [...prevFacilityImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };

  const validateAssistantData = (data) => {
    const errors = {};
    const nameAlphaRegex = /^[a-zA-Z\s]+$/; // Only letters and spaces
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email validation regex
  
    // Validate first name
    if (!data.firstName.trim()) {
      errors.firstName = 'First Name Is Required';
    } else if (!nameAlphaRegex.test(data.firstName.trim())) {
      errors.firstName = 'First Name Must Contain Only Letters And Spaces';
    } else if (data.firstName.trim().length < 3) {
      errors.firstName = 'First Name Must Be At Least 3 Characters Long';
    }
  
    // Validate last name
    if (!data.lastName.trim()) {
      errors.lastName = 'Last Name Is Required';
    } else if (!nameAlphaRegex.test(data.lastName.trim())) {
      errors.lastName = 'Last Name Must Contain Only Letters And Spaces';
    } else if (data.lastName.trim().length < 3) {
      errors.lastName = 'Last Name Must Be At Least 3 Characters Long';
    }
  
    // Validate email
    if (!data.assistantEmail.trim()) {
      errors.assistantEmail = 'Email Is Required';
    } else if (!emailRegex.test(data.assistantEmail.trim())) {
      errors.assistantEmail = 'Invalid Email Format';
    }
  
    return errors;
  };
  

  const validateInsuranceData = (data) => {
    const errors = {};
    if (!data.insuranceName || !data.insuranceName.trim()) {
      errors.insuranceName = 'Health/Dental Insurance Carrier Name Is Required';
    }
    if (!data.selectedPlan || !data.selectedPlan.trim()) {
      errors.insurancePlan = 'Health/Dental Insurance Plan Is Required';
    }
    return errors;
  };

  const handleSubmit = () => {
    const newErrors = {};

    if (!outpatientData.practiceName.trim()) {
      newErrors.practiceName = 'Clinic Name Is Required';
    } else if (/^[0-9]+$/.test(outpatientData.practiceName.trim())) {
      newErrors.practiceName = 'Clinic Name Cannot Be Only Numeric';
    } else if (/^[^a-zA-Z0-9]+$/.test(outpatientData.practiceName.trim())) {
      newErrors.practiceName = 'Clinic Name Cannot Be Only Special Symbols';
    } else if (outpatientData.practiceName.trim().length < 6) {
      newErrors.practiceName = 'Clinic Name Must Be At Least 6 Characters Long';
    }

    if (!/^\d+$/.test(outpatientData.faxNumber.trim())) {
      newErrors.faxNumber = 'Fax Number Must Contain Only Digits';
    }

    if (!outpatientData.email.trim()) {
      newErrors.email = 'Email Is Required';
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(outpatientData.email.trim())
    ) {
      newErrors.email = 'Invalid Email Format';
    }

    if (!outpatientData.website.trim())
      newErrors.website = 'Website Is Required';
    if (!outpatientData.phone.trim()) {
      newErrors.phone = 'Contact Number Is Required';
    } else if (!/^\d{10}$/.test(outpatientData.phone.trim())) {
      newErrors.phone = 'Contact Number Must Be Exactly 10 Digits Long';
    }

    if (!outpatientData.street.trim()) newErrors.street = 'Street Is Required';
    if (!outpatientData.state.trim()) {
      newErrors.state = 'State Is Required';
    }else if (!/^[a-zA-Z\s]+$/.test(outpatientData.state.trim())) {
      newErrors.state = 'State Can Only Contain Letters And Spaces';
    }
    if (!outpatientData.city.trim()) {
      newErrors.city = 'City Is Required';
    } else if (!/^[a-zA-Z\s]+$/.test(outpatientData.city.trim())) {
      newErrors.city = 'City Can Only Contain Letters And Spaces';
    }
    if (!outpatientData.zipcode.trim())
      newErrors.zipcode = 'Zipcode Is Required';

    setErrors(newErrors);

    const newAssistantErrors = validateAssistantData(assistantData);
    setAssistantErrors(newAssistantErrors);

    const newInsuranceErrors = validateInsuranceData(healthInsuranceData);
    setInsuranceErrors(newInsuranceErrors);

    const formData = {
      outpatientData,
      providerData,
      newProvider,
      assistantData,
      healthInsuranceData,
      facilityImages,
    };
    console.log(JSON.stringify(formData, null, 2));
  };

  const fetchCarriers = async () => {
    try {
      const payload = {
        modelName: 'health_insurance_carrier_master',
      };

      const response = await postData('masters/getMasterList', payload);

      if (response.status === 200) {
        // Filter out inactive carriers
        const activeCarriers = response.data.filter(
          (carrier: { is_active: number }) => carrier.is_active === 1
        );

        // Map response data to format needed for dropdown options
        const formattedCarriers = activeCarriers.map((carrier: any) => ({
          id: carrier.id,
          name: carrier.health_insurance_carrier_name,
        }));

        setCarriers(formattedCarriers);
      } else {
        console.error('Failed to fetch carriers:', response.status);
      }
    } catch (error) {
      console.error('An error occurred while fetching carriers:', error);
    }
  };

  useEffect(() => {
    fetchCarriers();
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Outpatient Practice Details" />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 mb-4 pb-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 justify-center">
        <h2 className="mb-3 font-semibold text-black text-l">
          Please Enter The Details For Your Clinic
        </h2>
        <div className="w-full">
          <label className="mb-2.5 block text-black dark:text-white">
            Outpatient Practice Name<span className="text-meta-1">*</span>
          </label>
          <input
            type="text"
            name="practiceName"
            value={outpatientData.practiceName}
            onChange={handleOutpatientInputChange}
            placeholder="Enter Clinic Name"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          {errors.practiceName && (
            <div className="text-red-500">{errors.practiceName}</div>
          )}
        </div>
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div className="w-full xl:w-1/2 mt-2">
            <label className="mb-2.5 block text-black dark:text-white">
              Email<span className="text-meta-1">*</span>
            </label>
            <input
              type="text"
              name="email"
              value={outpatientData.email}
              onChange={handleOutpatientInputChange}
              placeholder="Enter Your Email"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {errors.email && <div className="text-red-500">{errors.email}</div>}
          </div>
          <div className="w-full xl:w-1/2 mt-2">
            <label className="mb-2.5 block text-black dark:text-white">
              Website
            </label>
            <input
              type="text"
              name="website"
              value={outpatientData.website}
              onChange={handleOutpatientInputChange}
              placeholder="Enter Website URL"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
        </div>
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div className="w-full xl:w-1/2 mt-2">
            <label className="mb-2.5 block text-black dark:text-white">
              Contact<span className="text-meta-1">*</span>
            </label>
            <input
              type="text"
              name="phone"
              value={outpatientData.phone}
              onChange={handleOutpatientInputChange}
              placeholder="(XXX)-XXX XXXX"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {errors.phone && <div className="text-red-500">{errors.phone}</div>}
          </div>
          <div className="w-full xl:w-1/2 mt-2">
            <label className="mb-2.5 block text-black dark:text-white">
              Fax Number
            </label>
            <input
              type="text"
              name="faxNumber"
              value={outpatientData.faxNumber}
              onChange={handleOutpatientInputChange}
              placeholder="Enter Your Fax Number"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {errors.faxNumber && (
              <div className="text-red-500">{errors.faxNumber}</div>
            )}
          </div>
        </div>
        <div className="w-full mt-2">
          <label className="mb-2.5 block text-black dark:text-white">
            Street Address<span className="text-meta-1">*</span>
          </label>
          <input
            type="text"
            name="street"
            value={outpatientData.street}
            onChange={handleOutpatientInputChange}
            placeholder="Enter Your Address"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          {errors.street && <div className="text-red-500">{errors.street}</div>}
        </div>
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div className="w-full xl:w-1/2 mt-2">
            <label className="mb-2.5 block text-black dark:text-white">
              City<span className="text-meta-1">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={outpatientData.city}
              onChange={handleOutpatientInputChange}
              placeholder="Enter Your City"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {errors.city && <div className="text-red-500">{errors.city}</div>}
          </div>
          <div className="w-full xl:w-1/2 mt-2">
            <label className="mb-2.5 block text-black dark:text-white">
              State<span className="text-meta-1">*</span>
            </label>
            <input
              type="text"
              name="state"
              value={outpatientData.state}
              onChange={handleOutpatientInputChange}
              placeholder="Enter Your State"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {errors.state && <div className="text-red-500">{errors.state}</div>}
          </div>
        </div>
        <div className="w-full mt-2">
          <label className="mb-2.5 block text-black dark:text-white">
            Zip Code<span className="text-meta-1">*</span>
          </label>
          <input
            type="text"
            name="zipcode"
            value={outpatientData.zipcode}
            onChange={handleOutpatientInputChange}
            placeholder="Enter Your Zipcode"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          {errors.zipcode && (
            <div className="text-red-500">{errors.zipcode}</div>
          )}
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 mb-4 pb-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h2 className="mb-3 text-xl text-black font-bold">
          Add Providers<span className="text-meta-1">*</span>
        </h2>
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div className="w-full xl:w-1/2 mt-2">
            <label className="mb-2.5 block text-black dark:text-white">
              NIP Number<span className="text-meta-1">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter NIP"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              value={newProvider.nipNumber}
              onChange={(e) => {
                setNewProvider({ ...newProvider, nipNumber: e.target.value });
                setErrorMessage((prevErrors) => ({
                  ...prevErrors,
                  nipNumber: '',
                }));
              }}
            />
            {errors.nipNumber && (
              <div className="text-red-500">{errors.nipNumber}</div>
            )}
          </div>

          <div className="w-full xl:w-1/2 mt-2">
            <label className="mb-2.5 block text-black dark:text-white">
              Health Insurance Carrier Info
              <span className="text-meta-1">*</span>
            </label>
            <select
              value={newProvider.healthcareProvider}
              onChange={(e) =>
                setNewProvider({
                  ...newProvider,
                  healthcareProvider: e.target.value,
                })
              }
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            >
              <option value="">Select Health Insurance Carrier</option>
              {carriers.map((carrier) => (
                <option key={carrier.id} value={carrier.name}>
                  {carrier.name}
                </option>
              ))}
            </select>
            {errors.healthcareProvider && (
              <div className="text-red-500">{errors.healthcareProvider}</div>
            )}
          </div>

          <div className="w-full xl:w-1/2 mt-2">
            <label className="mb-2.5 block text-black dark:text-white">
              Provider Type<span className="text-meta-1">*</span>
            </label>
            <input
              type="text"
              placeholder="Provider Type(Select)"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              value={newProvider.providerType}
              onChange={(e) =>
                setNewProvider({ ...newProvider, providerType: e.target.value })
              }
            />
            {errors.providerType && (
              <div className="text-red-500">{errors.providerType}</div>
            )}
          </div>
        </div>

        <div className="mb-4 pb-4 flex flex-col gap-6 xl:flex-row mb-3">
          <div className="w-full xl:w-2/2 mt-2">
            <label className="mb-2.5 block text-black dark:text-white">
              Email<span className="text-meta-1">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Email"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              value={newProvider.providerEmail}
              onChange={(e) =>
                setNewProvider({
                  ...newProvider,
                  providerEmail: e.target.value,
                })
              }
            />
            {errors.providerEmail && (
              <div className="text-red-500">{errors.providerEmail}</div>
            )}
          </div>
          <div className="w-full xl:w-2/2 mt-2">
            <label className="mb-2.5 block text-black dark:text-white">
              Profile Photo<span className="text-meta-1">*</span>
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/jpeg"
                placeholder="Upload Profile"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                onChange={handleImageUpload}
              />
              {newProvider.profile && (
                <img
                  src={newProvider.profile}
                  alt="Profile Preview"
                  className="absolute inset-y-0 right-0 mt-3 mr-3 w-10 h-10  object-cover"
                />
              )}
              {errors.profile && (
                <div className="text-red-500">{errors.profile}</div>
              )}
            </div>
          </div>
          <div className="w-full xl:w-2/1 mt-2">
            <label className="mb-2.5 block text-black dark:text-white">
              Calendar Link<span className="text-meta-1">*</span>
            </label>
            <input
              type="text"
              placeholder="Calendar Link"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              value={newProvider.calendar}
              onChange={(e) => {
                setNewProvider({ ...newProvider, calendar: e.target.value });
                setErrorMessage((prevErrors) => ({
                  ...prevErrors,
                  calendar: '',
                }));
              }}
            />
            {errors.calendar && (
              <div className="text-red-500">{errors.calendar}</div>
            )}
          </div>
          <div className="w-full xl:w-1/2 mt-2 flex items-end">
            <button
              onClick={handleAddOrUpdateProvider}
              className="inline-flex items-center justify-center rounded-full bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              {editingIndex === -1 ? 'Add' : 'Update'}
            </button>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto mt-3">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className=" py-4 px-4 font-medium text-black dark:text-white ">
                  NIP Number
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Health Insurance Carrier Info
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Provider Type
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Email
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Profile Photo
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Calendar
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {providerData.map((provider, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-200 dark:border-meta-2"
                >
                  <td className="py-4 px-4 whitespace-nowrap font-normal text-sm text-gray-700 dark:text-white">
                    {provider.nipNumber}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap font-normal text-sm text-gray-700 dark:text-white">
                    {provider.healthcareProvider}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap font-normal text-sm text-gray-700 dark:text-white">
                    {provider.providerType}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap font-normal text-sm text-gray-700 dark:text-white">
                    {provider.providerEmail}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap font-normal text-sm text-gray-700 dark:text-white">
                    {provider.profile && (
                      <img
                        src={provider.profile}
                        alt="Profile"
                        className="h-12 w-12 rounded-full"
                      />
                    )}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap font-normal text-sm text-gray-700 dark:text-white">
                    {provider.calendar}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap font-normal text-sm text-gray-700 dark:text-white flex items-center">
                    <BsFillPencilFill
                      className="mr-2 cursor-pointer"
                      onClick={() => handleEdit(index)}
                    />
                    <BsFillTrash2Fill
                      className="cursor-pointer"
                      onClick={() => handleDelete(index)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 mb-4 pb-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h2 className="mb-3 text-xl text-black font-bold">Front Office Team</h2>
        <h2 className="font-semibold text-black text-l">
          Please Enter Details For Clinic Assistant
        </h2>
        <label className="mb-2.5 block text-black dark:text-white">
          Name<span className="text-meta-1">*</span>
          <div className="flex gap-4 mt-2">
            <div className="flex flex-col w-1/2">
              <input
                type="text"
                value={assistantData.firstName}
                placeholder="First Name"
                onChange={(e) => {
                  setAssistantData({
                    ...assistantData,
                    firstName: e.target.value,
                  });
                  setErrorMessage({ ...errorMessage, firstName: '' });
                }}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {assistantErrors.firstName && (
                <div className="text-red-500">{assistantErrors.firstName}</div>
              )}
            </div>
            <div className="flex flex-col w-1/2">
              <input
                type="text"
                value={assistantData.lastName}
                placeholder="Last Name"
                onChange={(e) => {
                  setAssistantData({
                    ...assistantData,
                    lastName: e.target.value,
                  });
                  setErrorMessage({ ...errorMessage, lastName: '' });
                }}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {assistantErrors.lastName && (
                <div className="text-red-500">{assistantErrors.lastName}</div>
              )}
            </div>
          </div>
        </label>

        <div className="w-full mt-2">
          <label className="mb-2.5 block text-black dark:text-white">
            Email<span className="text-meta-1">*</span>
          </label>
          <input
            type="text"
            value={assistantData.assistantEmail}
            placeholder="Email"
            onChange={(e) => {
              setAssistantData({
                ...assistantData,
                assistantEmail: e.target.value,
              });
              setErrorMessage({ ...errorMessage, assistantEmail: '' });
            }}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          {assistantErrors.assistantEmail && (
            <div className="text-red-500">{assistantErrors.assistantEmail}</div>
          )}
        </div>

        <div className="w-full mt-2">
          <label className="mb-2.5 block text-black dark:text-white">
            Profile Photo
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/jpeg"
              onChange={handleAssistantImageUpload}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary pr-10"
            />
            {assistantData.assistantProfile && (
              <img
                src={assistantData.assistantProfile}
                alt="Profile"
                className="absolute inset-y-0 right-0 mt-3 mr-3 w-10 h-10  object-cover"
              />
            )}
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 mb-4 pb-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h2 className="mb-3 text-xl text-black font-bold">
          Health Insurance Carrier
        </h2>
        <h2 className="font-semibold text-black text-l">
          Please Add Your Accepted Health Insurance Plans
        </h2>

        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row mb-3">
          <div className="w-full xl:w-2/1 mt-2">
            <label className="mb-2.5 block text-black dark:text-white">
              Health/Dental Insurance Carrier
              <span className="text-meta-1">*</span>
            </label>
            <input
              type="text"
              value={healthInsuranceData.insuranceName}
              placeholder="Select Health/Dental Insurance Carrier Name"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              onChange={handleInsuranceNameChange}
            />
            {insuranceErrors.insuranceName && (
              <div className="text-red-500">
                {insuranceErrors.insuranceName}
              </div>
            )}
          </div>
          <div className="w-full xl:w-2/1 mt-2">
            <label className="mb-2.5 block text-black dark:text-white">
              Health/Dental Insurance Plans
              <span className="text-meta-1">*</span>
            </label>
            <select
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              value={healthInsuranceData.selectedPlan}
              onChange={handleInsurancePlanChange}
            >
              <option value="">Select Health/Dental Insurance Plans</option>
              {healthInsuranceData.insurancePlan &&
                healthInsuranceData.insurancePlan.map((plan) => (
                  <option
                    key={plan.id}
                    value={`${plan.insurance_name}-${plan.id}`}
                  >
                    {plan.insurance_name}
                  </option>
                ))}
            </select>
            {insuranceErrors.insurancePlan && (
              <div className="text-red-500">
                {insuranceErrors.insurancePlan}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 mb-4 pb-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h2 className="mb-3 text-xl text-black font-bold">
          Brand Identity & Media
        </h2>
        <div className="w-full  mt-2">
          <label className="mb-2.5 block text-black font-semibold text-l ">
            Add Clinic/Brand Logo
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/jpeg"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary pr-10"
            />
            {outpatientData.logoImage && (
              <img
                src={outpatientData.logoImage}
                alt="Logo"
                className="absolute inset-y-0 right-0 mt-3 mr-3 max-w-full h-auto w-12 h-12 rounded-full"
                onChange={handleLogoImageUpload}
              />
            )}
          </div>
        </div>

        <div className="w-full mt-2">
          <label className="mb-2.5 block text-black font-bold dark:text-white">
            Add Media Showcasing Your Facility
          </label>
          <input
            type="file"
            accept="image/jpeg"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            multiple
            onChange={handleFacilityImageUpload}
          />
          <div className="mt-3 flex gap-4 mt-10 ">
            {facilityImages.map((imageUrl, index) => (
              <div key={index} className="relative">
                <img
                  src={imageUrl}
                  alt={`Facility Image ${index + 1}`}
                  className="object-cover w-20 h-20"
                />
                <button
                  className="absolute top-0 right-0 bg-white rounded-full p-1"
                  onClick={() => removeImage(index)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 text-gray-600"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <button
          className="inline-flex items-center justify-center rounded-full bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          type="button"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </DefaultLayout>
  );
};
