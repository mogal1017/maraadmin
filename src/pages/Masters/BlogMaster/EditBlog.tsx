import React, { useState, useEffect } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Loader from '../../../common/Loader';
import Swal from 'sweetalert2';
import { apiURL, postData } from '../../../Networking/Api';
import { useNavigate, useParams } from 'react-router-dom';

export const EditBlog = () => {
  const { id } = useParams();
  const [blogData, setBlogData] = useState({
    type: '',
    name: '',
    image: '',
    description: '',
  });
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { type, name, image, description } = blogData;

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setLoading(true);
        const payload = {
          modelName: 'blogs',
          whereCondition: { id },
        };
        const response = await postData('masters/getMasterList', payload);
        const blogDetails = response.data[0];

        console.log('Blog Details:', blogDetails); // Debugging log

        setBlogData({
          type: blogDetails.type || '',
          name: blogDetails.title || '',
          image: blogDetails.image || '',
          description: blogDetails.description || '',
        });
        setFileName(blogDetails.image || '');
        setLoading(false);
      } catch (error) {
        console.error('Error fetching testimonial details:', error);
        setLoading(false);
      }
    };
    fetchBlogDetails();
  }, [id]);

  const handleTypeChange = (e) =>
    setBlogData({ ...blogData, type: e.target.value });
  const handleNameChange = (e) =>
    setBlogData({ ...blogData, name: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setBlogData({ ...blogData, image: reader.result });
          setFileName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDescriptionChange = (value) =>
    setBlogData({ ...blogData, description: value });

  const isDescriptionValid = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.trim().length > 0 && !/^\s/.test(text);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!type.trim()) newErrors.type = 'Please Select The Type';
    if (!name.trim()) newErrors.name = 'Please Enter The Name';
    if (!image) newErrors.image = 'Please Add The Image';
    if (!isDescriptionValid(description))
      newErrors.description = 'Description Should Not Start With A Space';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const UpdateBlog = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const payload = {
        modelName: 'blogs',
        id,
        inputData: {
          title: name,
          type,
          description,
          image,
        },
      };
      const response = await postData('masters/createAndUpdateMaster', payload);
      setLoading(false);
      if (response.code === 1) {
        Swal.fire({
          title: 'Success',
          text: 'Testimonial Updated Successfully',
          icon: 'success',
          timer: 2000,
          showConfirmButton: true,
        });
        setTimeout(() => {
          navigate(`/BlogMaster`);
        }, 2000);
      } else {
        console.error('Testimonial update failed:', response.message);
      }
    } catch (error) {
      setLoading(false);
      console.error('An error occurred:', error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    UpdateBlog();
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
      <Breadcrumb pageName={'Update Testimonial'}>
        <a onClick={() => navigate('/BlogMaster')}>Testimonial List</a>
      </Breadcrumb>
      <div className="p-5 bg-white rounded-md shadow-md">
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label className="mb-2.5 block font-semibold text-black dark:text-white">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              value={type}
              onChange={handleTypeChange}
              className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary ${
                errors.type ? 'border-red-500' : ''
              }`}
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
            <label className="mb-2.5 font-semibold block text-black dark:text-white">
              Practitioner/Provider Name <span className="text-red-500">*</span>
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

          <div className="mb-4 relative">
            <label className="mb-2.5 font-semibold block text-black dark:text-white">
              Image <span className="text-red-500">*</span>
            </label>
          </div>
          <div className="mb-4 relative flex">
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              placeholder={fileName}
              className={`flex-1 rounded border-[1.5px] border-stroke bg-transparent py-3 pl-5 pr-12 text-black outline-none transition focus:border-primary active:border-primary ${
                errors.image ? 'border-red-500' : ''
              }`}
            />
            {image && (
              <div className="absolute top-0 right-0 mt-3 mr-3 ">
                <img
                  src={image.startsWith('data:') ? image : apiURL + image}
                  alt="Preview"
                  className="w-10 h-9 object-cover"
                />
              </div>
            )}
            {errors.image && (
              <div className="mt-1 text-red-500">{errors.image}</div>
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

          <div className="flex justify-center  mt-16">
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
