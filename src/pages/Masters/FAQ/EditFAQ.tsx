import React, { useState, useEffect } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Loader from '../../../common/Loader';
import Swal from 'sweetalert2';
import { postData } from '../../../Networking/Api';
import { useNavigate, useParams } from 'react-router-dom';

export const EditFAQ = () => {
  const { id } = useParams();
  const [faqData, setFaqData] = useState({
    name: '',
    sequence: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { name, sequence, description } = faqData;

  useEffect(() => {
    const fetchFAQDetails = async () => {
      try {
        setLoading(true);
        const payload = {
          modelName: 'faqs',
          whereCondition: { id },
        };
        const response = await postData('masters/getMasterList', payload);
        const faqDetails = response.data[0];

        console.log('FAQ Details:', faqDetails);

        setFaqData({
          name: faqDetails.faq_title || '',
          sequence: faqDetails.sequence || '',
          description: faqDetails.description || '',
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching FAQ details:', error);
        setLoading(false);
      }
    };
    fetchFAQDetails();
  }, [id]);
  const handleNameChange = (e) => {
    setFaqData({ ...faqData, name: e.target.value });
    if (errors.name) {
      setErrors((prevErrors) => ({ ...prevErrors, name: '' }));
    }
  };

  const handleSequenceChange = (e) => {
    const cleanedValue = e.target.value.replace(/\D/g, '');
    setFaqData({ ...faqData, sequence: cleanedValue });
    if (errors.sequence) {
      setErrors((prevErrors) => ({ ...prevErrors, sequence: '' }));
    }
  };

  const handleDescriptionChange = (value) => {
    setFaqData({ ...faqData, description: value });
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

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!faqData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!String(faqData.sequence).trim()) {
      newErrors.sequence = 'Sequence is required';
      valid = false;
    }

    if (!faqData.description.trim()) {
      newErrors.description = 'Description is required';
      valid = false;
    } else if (!isDescriptionValid(faqData.description)) {
      newErrors.description = 'Description should not be empty';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const updateFAQ = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const payload = {
        modelName: 'faqs',
        id,
        inputData: {
          faq_title: faqData.name,
          sequence: faqData.sequence,
          description: faqData.description,
        },
      };
      const response = await postData('masters/createAndUpdateMaster', payload);
      setLoading(false);
      if (response.code === 1) {
        Swal.fire({
          title: 'Success',
          text: 'FAQ Updated Successfully',
          icon: 'success',
          timer: 2000,
          showConfirmButton: true,
        });
        setTimeout(() => {
          navigate(`/FAQ`);
        }, 2000);
      } else {
        console.error('FAQ update failed:', response.message);
      }
    } catch (error) {
      setLoading(false);
      console.error('An error occurred:', error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    updateFAQ();
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

  // Function to strip HTML tags from content
  const stripHtmlTags = (html) => {
    return html.replace(/<[^>]+>/g, '');
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName={'Update FAQ'}>
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
              id="sequence"
              value={sequence}
              placeholder="Enter Sequence"
              onChange={handleSequenceChange}
              className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary ${
                errors.sequence ? 'border-red-500' : ''
              }`}
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

export default EditFAQ;
