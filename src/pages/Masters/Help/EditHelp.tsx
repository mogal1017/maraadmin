import React, { useState, useEffect } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Loader from '../../../common/Loader';
import Swal from 'sweetalert2';
import { postData } from '../../../Networking/Api';
import { useNavigate, useParams } from 'react-router-dom';

export const EditHelp = () => {
  const { id } = useParams();
  const [helpData, setHelpData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { name, description } = helpData;

  useEffect(() => {
    const fetchHelpDetails = async () => {
      try {
        setLoading(true);
        const payload = {
          modelName: 'free_text_details',
          whereCondition: { id },
        };
        const response = await postData('masters/getMasterList', payload);
        const helpDetails = response.data[0];

        console.log('Help Details:', helpDetails); // Debugging log

        setHelpData({
          name: helpDetails.title || '',
          description: helpDetails.description || '',
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching Help details:', error);
        setLoading(false);
      }
    };
    fetchHelpDetails();
  }, [id]);

  useEffect(() => {
    console.log('Help Data:', helpData);
  }, [helpData]);

  const handleNameChange = (e) => {
    setHelpData((prevData) => ({ ...prevData, name: e.target.value }));
    if (errors.name) {
      setErrors((prevErrors) => ({ ...prevErrors, name: '' }));
    }
  };

  const handleDescriptionChange = (value) => {
    setHelpData((prevData) => ({ ...prevData, description: value }));
    if (errors.description) {
      setErrors((prevErrors) => ({ ...prevErrors, description: '' }));
    }
  };

  const isDescriptionValid = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.trim().length > 0 && !/^\s/.test(text);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Please Enter The Name';

    if (!isDescriptionValid(description))
      newErrors.description = 'Description Should Not Start With A Space';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateHelp = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const payload = {
        modelName: 'free_text_details',
        id,
        inputData: {
          free_text_id: 1,
          title: name,
          description: description,
        },
      };
      console.log('Payload:', payload); // Debugging log
      const response = await postData('masters/createAndUpdateMaster', payload);
      console.log('Update Response:', response); // Debugging log
      setLoading(false);
      if (response.code === 1) {
        Swal.fire({
          title: 'Success',
          text: 'Help Updated Successfully',
          icon: 'success',
          timer: 2000,
          showConfirmButton: true,
        });
        setTimeout(() => {
          navigate(`/Help`);
        }, 2000);
      } else {
        console.error('Help update failed:', response.message);
      }
    } catch (error) {
      setLoading(false);
      console.error('An error occurred:', error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    updateHelp();
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
      {loading ? (
        <Loader />
      ) : (
        <>
          <Breadcrumb pageName={'Update Help'}>
            <a onClick={() => navigate('/Help')}>Help List</a>
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
                  <div className="mt-1 text-red-500">{errors.description}</div>
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
        </>
      )}
    </DefaultLayout>
  );
};

export default EditHelp;
