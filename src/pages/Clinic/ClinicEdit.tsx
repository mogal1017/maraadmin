import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Loader from '../../common/Loader';
import { postData, apiURL } from '../../Networking/Api';
import Swal from 'sweetalert2';

const ClinicEdit = () => {
  const { clinicId } = useParams();
  const navigate = useNavigate();
  const [clinicData, setClinicData] = useState({
    npiNumber: '',
    name: '',
    website: '',
    logoImage: '',
    taxonomyDescription: '',
    email: '',
  });
  const [locationData, setLocationData] = useState([]);
  const [reviewData, setReviewData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClinicData();
    fetchLocationData();
  }, [clinicId]);

  const fetchClinicData = async () => {
    try {
      setLoading(true);
      const payload = {
        modelName: 'clinics',
        whereCondition: { id: clinicId },
      };
      const response = await postData('masters/getMasterList', payload);
      setLoading(false);
      const data = response.data[0];
      setClinicData({
        npiNumber: data.npi_number,
        name: data.name,
        website: data.website,
        logoImage: data.logo_image,
        taxonomyDescription: data.taxonomy_description,
        email: data.email,
      });
    } catch (error) {
      setLoading(false);
      console.error('An error occurred:', error);
    }
  };

  const fetchLocationData = async () => {
    try {
      setLoading(true);
      const payload = {
        modelName: 'clinic_locations',
        whereCondition: { clinic_id: clinicId },
      };
      const response = await postData('masters/getMasterList', payload);
      setLoading(false);
      setLocationData(response.data);

      const initialReviewData = {};
      response.data.forEach((location) => {
        initialReviewData[location.id] = location.google_business_link || '';
      });
      setReviewData(initialReviewData);
    } catch (error) {
      setLoading(false);
      console.error('An error occurred:', error);
    }
  };

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setClinicData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleReviewChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: any,
  ) => {
    const { value } = e.target;
    setReviewData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleEditButtonClick = async () => {
    try {
      setLoading(true);

      const updatePromises = Object.entries(reviewData).map(([id, review]) => {
        const payload = {
          modelName: 'clinic_locations',
          id: parseInt(id),
          inputData: {
            google_business_link: review,
          },
        };
        return postData('masters/createAndUpdateMaster', payload);
      });

      await Promise.all(updatePromises);

      setLoading(false);
      Swal.fire({
        title: 'Success',
        text: 'Review Updated Successfully',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
      setTimeout(() => {
        navigate('/Clinic');
      }, 2000);
    } catch (error) {
      setLoading(false);
      console.error('Failed to update reviews:', error);
      Swal.fire({
        title: 'Error',
        text: 'An Error Occurred While Updating Review',
        icon: 'error',
        timer: 2000,
        showConfirmButton: true,
      });
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Clinic Update">
        <a onClick={() => navigate(`/Clinic`)}>Clinic List</a>
      </Breadcrumb>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col gap-10">
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="flex justify-start pb-2">
              <h1 className="text-black text-2xl font-bold dark:text-white">
                Organization Info
              </h1>
            </div>
            <div className="flex justify-end pb-2">
              <button
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => navigate(`/Clinic`)}
              >
                Back
              </button>
            </div>
            <div className="rounded-sm bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="mb-2.5 block text-black dark:text-white">
                  Organization NPI Number
                </label>
                <input
                  type="text"
                  name="npiNumber"
                  value={clinicData.npiNumber}
                  onChange={handleInputChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block text-black dark:text-white">
                  Organization Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={clinicData.name}
                  onChange={handleInputChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block text-black dark:text-white">
                  Website
                </label>
                <input
                  type="text"
                  name="website"
                  value={clinicData.website}
                  onChange={handleInputChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                  disabled
                />
              </div>
              <div className="mb-4 flex flex-col">
                <label className="font-bold text-gray-900 mb-2.5">
                  Organization Logo
                </label>

                <div className="relative">
                  {clinicData.logoImage && (
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <img
                        src={`${apiURL}/${clinicData.logoImage}`}
                        alt="Organization Logo"
                        className="h-10 w-15 object-contain rounded-md border border-gray-300"
                        disabled
                      />
                    </div>
                  )}

                  <input
                    type="text"
                    className="pl-14 pr-4 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                    disabled
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block text-black dark:text-white">
                  Taxonomy Description
                </label>
                <input
                  type="text"
                  name="taxonomyDescription"
                  value={clinicData.taxonomyDescription}
                  onChange={handleInputChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block text-black dark:text-white">
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  value={clinicData.email}
                  onChange={handleInputChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="flex justify-start pb-2">
              <h1 className="text-black text-2xl font-bold dark:text-white mb-6">
                Organization Location
              </h1>
            </div>
            <div className="overflow-x-auto max-h-96">
              <table className="min-w-full bg-white dark:bg-boxdark">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-black uppercase tracking-wider dark:text-gray-400">
                      Sr. No
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-black uppercase tracking-wider dark:text-gray-400">
                      Contact No
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-black uppercase tracking-wider dark:text-gray-400">
                      Street
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-black uppercase tracking-wider dark:text-gray-400">
                      City
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-black uppercase tracking-wider dark:text-gray-400">
                      State
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-black uppercase tracking-wider dark:text-gray-400">
                      Country
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-black uppercase tracking-wider dark:text-gray-400">
                      Address Type
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-black uppercase tracking-wider dark:text-gray-400">
                      Zip Code
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-black uppercase tracking-wider dark:text-gray-400">
                      Fax Number
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-black uppercase tracking-wider dark:text-gray-400">
                      Write a Review
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {locationData.map((location, index) => (
                    <tr
                      key={location.id}
                      className="border-t dark:border-strokedark"
                    >
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                        {index + 1}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                        {location.phone}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                        {location.street}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                        {location.city}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                        {location.state}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                        {location.country}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                        {location.address_ype}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                        {location.zipcode}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                        {location.fax_number}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                        <input
                          className="w-60 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                          style={{ minWidth: '150px' }}
                          value={reviewData[location.id] || ''}
                          onChange={(e) => handleReviewChange(e, location.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-center mt-4">
                <button
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={handleEditButtonClick}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default ClinicEdit;
