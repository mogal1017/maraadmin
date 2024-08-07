import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Swal from 'sweetalert2';
import Loader from '../../../common/Loader';
import { postData } from '../../../Networking/Api';
import { useNavigate } from 'react-router-dom';

export const CreateServiceDetails = () => {
  const [services, setServices] = useState([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [sequence, setSequence] = useState('');
  const [type, setType] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  const navigate = useNavigate();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (errors.name) {
      setErrors((prevErrors) => ({ ...prevErrors, name: '' }));
    }
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedService(e.target.value);
    if (errors.type) {
      setErrors((prevErrors) => ({ ...prevErrors, type: '' }));
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
    if (errors.image) {
      setErrors((prevErrors) => ({ ...prevErrors, image: '' }));
    }
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (errors.description) {
      setErrors((prevErrors) => ({ ...prevErrors, description: '' }));
    }
  };

  const handleSequenceChange = (e: { target: { value: string } }) => {
    const cleanedValue = e.target.value.replace(/\D/g, '');
    setSequence(cleanedValue);
    if (errors.sequence) {
      setErrors((prevErrors) => ({ ...prevErrors, sequence: '' }));
    }
  };

  const isDescriptionValid = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    const trimmedText = text.trim();
    return trimmedText.length > 0 && text === trimmedText;
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedDescription = description.trim();
    const newErrors: { [key: string]: string } = {};

    if (!selectedService.trim()) {
      newErrors.type = 'Please Select The Service';
    }

    if (!name.trim()) {
      newErrors.name = 'Please Enter  Name';
    } else if (/^\s/.test(name)) {
      newErrors.name = 'Name Should Not Start With A Space';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Name Should Be At Least 3 Characters Long';
    }

    // if (!image) {
    //   newErrors.image = 'Please Add The Photo';
    // }

    if (!description.trim()) {
      newErrors.description = 'Please Enter The Description';
    } else if (/^\s/.test(description)) {
      newErrors.description = 'Description Should Not Start With A Space';
    } else if (!isDescriptionValid(description)) {
      newErrors.description = 'Description Should Not Start With A Space';
    }
    if (!sequence.trim()) {
      newErrors.sequence = 'Please Enter The Sequence';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const payload = {
        modelName: 'services_details',
        inputData: {
          service_id: selectedService,
          title: name,
          description: trimmedDescription,
          sequences: sequence,
          image: image,
          is_active: 1,
        },
      };

      const response = await postData('masters/createAndUpdateMaster', payload);

      setLoading(false);

      Swal.fire({
        title: 'Success',
        text: 'Service Added successfully',
        icon: 'success',
        timer: 2000,
        showConfirmButton: true,
      });

      console.log('Service Added Successfully', response);
      setName('');
      setImage(null);
      setDescription('');
      setType('');
      setErrors({});
      navigate('/ServicesDetails');
    } catch (error) {
      setLoading(false);

      Swal.fire({
        title: 'Error',
        text: 'An Error Occurred While Adding The Blog',
        icon: 'error',
        timer: 2000,
        showConfirmButton: true,
      });

      console.error('Error adding blog:', error.message, error.stack);
    }
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

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const payload = { modelName: 'services' };
      const response = await postData('masters/getMasterList', payload);

      if (response.status === 200) {
        const ServiceNames = response.data.filter(
          (service) => service.is_active === 1,
        );
        setServices(ServiceNames);
      } else {
        console.error('Failed to fetch Services:', response.status);
      }
    } catch (error) {
      console.error('An error occurred while fetching Services:', error);
    }
  };

  return (
    <DefaultLayout>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Breadcrumb pageName={'Add Service Details'}>
            <a onClick={() => navigate('/Servicesdetails')}>
              Service Details List
            </a>
          </Breadcrumb>
          <div className="p-5 bg-white rounded-md shadow-md">
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="mb-2.5 block font-semibold text-black dark:text-white">
                  Service<span className="text-red-500">*</span>
                </label>
                <select
                  id="service"
                  className="w-full rounded-lg border border-stroke bg-transparent py-2 px-3 text-base sm:text-lg text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mb-2"
                  value={selectedService}
                  onChange={handleServiceChange}
                >
                  <option value="">Select A Service</option>
                  {services?.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <div className="mt-1 text-red-500">{errors.type}</div>
                )}
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block font-semibold text-black dark:text-white">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={handleTitleChange}
                  placeholder="Enter Title"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
                  id="sequence"
                  value={sequence}
                  onChange={handleSequenceChange}
                  placeholder="Enter Sequence"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                {errors.sequence && (
                  <div className="mt-1 text-red-500">{errors.sequence}</div>
                )}
              </div>

              <div className="mb-4 relative">
                <label className="mb-2.5 block font-semibold text-black dark:text-white">
                  Photo
                </label>
              </div>

              <div className="mb-4 relative flex">
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  accept=".jpg,.jpeg,.png"
                  placeholder="Upload Profile"
                  className="flex-1 rounded border-[1.5px] border-stroke bg-transparent py-3 pl-5 pr-12 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                {image && (
                  <div className="absolute top-0 right-0 mt-3 mr-3">
                    <img
                      src={image}
                      alt="Preview"
                      className="w-9 h-9 object-cover"
                    />
                  </div>
                )}
              </div>
              {/* {errors.image && (
                <div className="mb-4 mt-1 text-red-500">{errors.image}</div>
              )} */}

              <div className="mb-4">
                <label className="mb-2.5 block font-semibold text-black dark:text-white">
                  Description <span className="text-red-500">*</span>
                </label>
                <ReactQuill
                  theme="snow"
                  value={description}
                  onChange={handleDescriptionChange}
                  modules={modules}
                  className="h-[200px]"
                />
                {errors.description && (
                  <div className="mt-12 text-red-500">{errors.description}</div>
                )}
              </div>

              <div className="flex justify-center gap-4.5 mt-16">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
                >
                  {loading ? 'Loading...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </DefaultLayout>
  );
};

export default CreateServiceDetails;
