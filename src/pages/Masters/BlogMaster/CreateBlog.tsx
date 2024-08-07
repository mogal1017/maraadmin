import React, { useState } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Swal from 'sweetalert2';
import { postData } from '../../../Networking/Api';
import { useNavigate } from 'react-router-dom';

export const CreateBlog = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
    if (errors.type) {
      setErrors((prevErrors) => ({ ...prevErrors, type: '' }));
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (errors.name) {
      setErrors((prevErrors) => ({ ...prevErrors, name: '' }));
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

  const isDescriptionValid = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.trim().length > 0 && !/^\s/.test(text);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedDescription = description.trim();
    const newErrors: { [key: string]: string } = {};

    if (!type.trim()) {
      newErrors.type = 'Please Select The Type';
    }

    if (!name.trim()) {
      newErrors.name = 'Please Enter The Practitioner/Provider Name';
    } else if (/^\s/.test(name)) {
      newErrors.name = 'Name Should Not Start With A Space';
    } else if (!/^[A-Za-z][A-Za-z\s]*$/.test(name)) {
      newErrors.name = 'Name Should Contain Only Alphabets And Spaces';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Name Should Be At Least 3 Characters Long';
    }

    if (!image) {
      newErrors.image = 'Please Add The Photo';
    }

    if (!description.trim()) {
      newErrors.description = 'Please Enter The Description';
    } else if (/^\s/.test(description)) {
      newErrors.description = 'Description Should Not Start With A Space';
    } else if (description.startsWith(' ')) {
      newErrors.description = 'Description Should Not Start With A Space';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const payload = {
        modelName: 'blogs',
        inputData: {
          title: name,
          image: image,
          description: trimmedDescription,
          type: type,
          is_active: 1,
        },
      };

      const response = await postData('masters/createAndUpdateMaster', payload);

      setLoading(false);

      Swal.fire({
        title: 'Success',
        text: 'Testimonial Added successfully',
        icon: 'success',
        timer: 2000,
        showConfirmButton: true,
      });

      console.log('Blog Added Successfully', response);
      setName('');
      setImage(null);
      setDescription('');
      setType('');
      setErrors({});
      navigate('/BlogMaster');
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

  return (
    <DefaultLayout>
      <Breadcrumb pageName={'Add Testimonial'}>
        <a onClick={() => navigate('/BlogMaster')}>Testimonial List</a>
      </Breadcrumb>
      <div className="p-5 bg-white rounded-md shadow-md">
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label className="mb-2.5 block font-semibold text-black dark:text-white">
              Type<span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              value={type}
              onChange={handleTypeChange}
              className="w-full rounded border-[2px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            >
              <option value="">Select Type</option>
              <option value="provider">Provider</option>
              <option value="patient">Patient</option>
            </select>
            {errors.type && (
              <div className="mt-1 text-red-500">{errors.type}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="mb-2.5 block font-semibold text-black dark:text-white">
              Practitioner/Provider Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter Practitioner/Provider Name"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {errors.name && (
              <div className="mt-1 text-red-500">{errors.name}</div>
            )}
          </div>

          <div className="mb-4 relative">
            <label className="mb-2.5 block font-semibold text-black dark:text-white">
              Photo<span className="text-red-500">*</span>
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
          {errors.image && (
            <div className="mb-4 mt-1 text-red-500">{errors.image}</div>
          )}

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

          <div className="flex justify-center gap-4.5  mt-16">
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
    </DefaultLayout>
  );
};

export default CreateBlog;
