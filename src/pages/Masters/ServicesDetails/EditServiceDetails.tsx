import React, { useState, useEffect } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Loader from '../../../common/Loader';
import Swal from 'sweetalert2';
import { apiURL, postData } from '../../../Networking/Api';
import { useNavigate, useParams } from 'react-router-dom';

export const EditServiceDetails = () => {
  const { id } = useParams();
  const [serviceData, setServiceData] = useState({
    service: '',
    name: '',
    sequences: '',
    image: '',
    description: '',
  });
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  const { service, name, image, description, sequences } = serviceData;

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        const payload = {
          modelName: 'services_details',
          whereCondition: { id },
        };
        const response = await postData('masters/getMasterList', payload);
        const serviceDetails = response.data[0];

        setServiceData((prevData) => ({
          ...prevData,
          service: serviceDetails.service_id || '',
          name: serviceDetails.title || '',
          image: serviceDetails.image || '',
          sequences: serviceDetails.sequences || '',
          description: serviceDetails.description || '',
        }));
        setFileName(serviceDetails.image || '');
        setLoading(false);
      } catch (error) {
        console.error('Error fetching service details:', error);
        setLoading(false);
      }
    };

    const fetchServices = async () => {
      try {
        const payload = { modelName: 'services' };
        const response = await postData('masters/getMasterList', payload);

        if (response.status === 200) {
          const activeServices = response.data.filter(
            (service) => service.is_active === 1,
          );
          setServices(activeServices);
        } else {
          console.error('Failed to fetch services:', response.status);
        }
      } catch (error) {
        console.error('An error occurred while fetching services:', error);
      }
    };

    fetchServiceDetails();
    fetchServices();
  }, [id]);

  useEffect(() => {
    if (services.length > 0 && serviceData.service) {
      const selectedService = services.find(
        (serviceItem) => serviceItem.id === serviceData.service,
      );
      if (selectedService) {
        setServiceData((prevData) => ({
          ...prevData,
          service: selectedService.id,
        }));
      }
    }
  }, [services, serviceData.service]);

  const handleServiceChange = (e) => {
    const selectedService = e.target.value;
    setServiceData({ ...serviceData, service: selectedService });

    if (errors.service) {
      setErrors((prevErrors) => ({ ...prevErrors, service: '' }));
    }
  };

  const handleNameChange = (e) => {
    setServiceData({ ...serviceData, name: e.target.value });

    if (errors.name) {
      setErrors((prevErrors) => ({ ...prevErrors, name: '' }));
    }
  };

  const handleSequenceChange = (e) => {
    const cleanedValue = e.target.value.replace(/\D/g, '');
    setServiceData((prevData) => ({
      ...prevData,
      sequences: cleanedValue,
    }));
    if (errors.sequences) {
      setErrors((prevErrors) => ({ ...prevErrors, sequences: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setServiceData({ ...serviceData, image: reader.result });
          setFileName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDescriptionChange = (value) => {
    setServiceData({ ...serviceData, description: value });

    if (errors.description) {
      setErrors((prevErrors) => ({ ...prevErrors, description: '' }));
    }
  };

  const isDescriptionValid = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    const trimmedText = text.trim();
    return trimmedText.length > 0 && text === trimmedText;
  };

  const validateForm = () => {
    const newErrors = {};

    const sequencesString = String(sequences).trim();

    if (!service) newErrors.service = 'Please Select A Service';
    if (!name.trim()) newErrors.name = 'Please Enter The Name';
    if (!sequencesString) newErrors.sequences = 'Sequence is Required';
    else if (!/^\d+$/.test(sequencesString))
      newErrors.sequences = 'Sequence must be a number';
    // if (!image) newErrors.image = 'Please Add The Image';

    if (!description.trim()) {
      newErrors.description = 'Please Enter The Description';
    } else if (/^\s/.test(description)) {
      newErrors.description = 'Description Should Not Start With A Space';
    } else if (!isDescriptionValid(description)) {
      newErrors.description = 'Description Should Not Start With A Space';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const UpdateService = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const payload = {
        modelName: 'services_details',
        id,
        inputData: {
          title: name,
          service_id: service,
          sequences,
          description,
          image,
        },
      };
      const response = await postData('masters/createAndUpdateMaster', payload);
      setLoading(false);
      if (response.code === 1) {
        Swal.fire({
          title: 'Success',
          text: 'Services Updated Successfully',
          icon: 'success',
          timer: 2000,
          showConfirmButton: true,
        }).then(() => {
          navigate('/ServicesDetails');
        });
      } else {
        console.error('Service update failed:', response.message);
      }
    } catch (error) {
      setLoading(false);
      console.error('An error occurred:', error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    UpdateService();
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'video'],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
    ],
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName={'Update Service Details'}>
        <a onClick={() => navigate('/ServicesDetails')}>Service Details List</a>
      </Breadcrumb>
      <div className="p-5 bg-white rounded-md shadow-md">
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label className="mb-2.5 block font-semibold text-black dark:text-white">
              Service <span className="text-red-500">*</span>
            </label>
            <select
              id="service"
              value={service}
              onChange={handleServiceChange}
              className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary ${
                errors.service ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select Service</option>
              {services.map((serviceItem) => (
                <option key={serviceItem.id} value={serviceItem.id}>
                  {serviceItem.name}
                </option>
              ))}
            </select>
            {errors.service && (
              <div className="mt-1 text-red-500">{errors.service}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="mb-2.5 font-semibold block text-black dark:text-white">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary ${
                errors.name ? 'border-red-500' : ''
              }`}
            />
            {errors.name && (
              <div className="mt-1 text-red-500">{errors.name}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="mb-2.5 block font-semibold text-black dark:text-white">
              Sequence <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="sequences"
              value={sequences}
              onChange={handleSequenceChange}
              placeholder="Enter Sequence"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {errors.sequences && (
              <div className="mt-1 text-red-500">{errors.sequences}</div>
            )}
          </div>

          <div className="mb-4 relative">
            <label className="mb-2.5 font-semibold block text-black dark:text-white">
              Image
            </label>
          </div>
          <div className="mb-4 relative flex">
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              className={`flex-1 rounded border-[1.5px] border-stroke bg-transparent py-3 pl-5 pr-12 text-black outline-none transition focus:border-primary active:border-primary ${
                errors.image ? 'border-red-500' : ''
              }`}
            />
            {fileName && (
              <div className="absolute top-0 right-0 mt-3 mr-3">
                <img
                  src={image.startsWith('data:') ? image : apiURL + image}
                  alt="Preview"
                  className="w-10 h-9 object-cover"
                />
              </div>
            )}
            {/* {errors.image && (
              <div className="mt-1 text-red-500">{errors.image}</div>
            )} */}
          </div>

          <div className="mb-4">
            <label className="mb-2.5 block font-semibold text-black dark:text-white">
              Description <span className="text-red-500">*</span>
            </label>
            <ReactQuill
              theme="snow"
              value={description}
              onChange={handleDescriptionChange}
              modules={modules}
              className={`${
                errors.description ? 'border-red-500' : ''
              } h-[200px]`}
            />
            {errors.description && (
              <div className="mt-12 text-red-500">{errors.description}</div>
            )}
          </div>

          <div className="flex justify-center mt-16">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              disabled={loading}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
};
