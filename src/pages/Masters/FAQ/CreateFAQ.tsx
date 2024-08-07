import React, { useState, useEffect } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Swal from 'sweetalert2';
import { postData } from '../../../Networking/Api';
import { useNavigate } from 'react-router-dom';

export const CreateFAQ = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sequence, setSequence] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isDescriptionValid = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.trim().length > 0 && !/^\s/.test(text);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Please Enter The Title';
    } else if (/^\s/.test(name)) {
      newErrors.name = 'Title Should Not Start With A Space';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Title Should Be At Least 3 Characters Long';
    }

    if (!sequence.trim()) {
      newErrors.sequence = 'Please Enter Sequence';
    }

    if (!description.trim()) {
      newErrors.description = 'Please Enter The Description';
    } else if (/^\s/.test(description)) {
      newErrors.description = 'Description Should Not Start With A Space';
    } else if (!isDescriptionValid(description)) {
      newErrors.description = 'Description Should Not Start With A Space';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const payload = {
        modelName: 'faqs',
        inputData: {
          faq_title: name,
          sequence: sequence,
          description: description,
          is_active: 1,
        },
      };

      const response = await postData('masters/createAndUpdateMaster', payload);

      setLoading(false);

      Swal.fire({
        title: 'Success',
        text: 'FAQ Added Successfully',
        icon: 'success',
        timer: 2000,
        showConfirmButton: true,
      });

      console.log('FAQ Added Successfully', response);
      setName('');
      setSequence('');
      setDescription('');
      setErrors({});
      navigate('/FAQ');
    } catch (error) {
      setLoading(false);

      Swal.fire({
        title: 'Error',
        text: 'An error occurred while adding the FAQ',
        icon: 'error',
        timer: 2000,
        showConfirmButton: true,
      });

      console.error('Error adding FAQ:', error.message, error.stack);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (errors.name) {
      setErrors((prevErrors) => ({ ...prevErrors, name: '' }));
    }
  };

  const handleSequenceChange = (e: { target: { value: string } }) => {
    const cleanedValue = e.target.value.replace(/\D/g, '');
    setSequence(cleanedValue);
    if (errors.sequence) {
      setErrors((prevErrors) => ({ ...prevErrors, sequence: '' }));
    }
  };

  const handleDescriptionChange = (value: React.SetStateAction<string>) => {
    setDescription(value);
    if (errors.description) {
      setErrors((prevErrors) => ({ ...prevErrors, description: '' }));
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
      <Breadcrumb pageName={'Add FAQ'}>
        <a onClick={() => navigate('/FAQ')}>FAQ List</a>
      </Breadcrumb>
      <div className="p-5 bg-white rounded-md shadow-md">
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label className="mb-2.5 block font-semibold text-black dark:text-white">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              placeholder="Enter Title"
              onChange={handleNameChange}
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
              placeholder="Enter Sequence"
              onChange={handleSequenceChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {errors.sequence && (
              <div className="mt-1 text-red-500">{errors.sequence}</div>
            )}
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
              className="h-[200px]"
            />
            {errors.description && (
              <div className="mt-12 text-red-500">{errors.description}</div>
            )}
          </div>

          <div className="flex justify-center  mt-16">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              disabled={loading}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
};
