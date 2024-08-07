import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useNavigate, useParams } from 'react-router-dom';
import { postData, apiURL } from '../../Networking/Api';
import Loader from '../../common/Loader';

const Viewpractitioner = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [data, setData] = useState([]);
  const [appointmentData, setAppointmentData] = useState([]);
  const [specialtyData, setSpecialtyData] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [symptomsData, setSymptomsData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [enlargeImage, setEnlargeImage] = useState(false);
  const [enlargedImageUrl, setEnlargedImageUrl] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  function formatISODate(isoDate) {
    const date = new Date(isoDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  function formatDateVertical(isoDate) {
    const date = new Date(isoDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}-\n${month}-\n${year}`;
  }

  useEffect(() => {
    getPractitionerView();
    getAppointMentType();
    getSpecialtyDetails();
    getSubscriptionDetails();
    getServiceDetails();
    getSymptomDetails();
  }, []);

  const firstTableFields = data.slice(0, 6); // Extract first 3 elements
  const secondTableFields = data.slice(6);

  const getPractitionerView = async () => {
    try {
      // Define the payload structure
      setLoading(false);
      const payload = {
        modelName: 'practitioners',
        //id: userId,
        whereCondition: {
          id: userId,
        },
        relations: [
          {
            module: 'clinics',
            moduleas: 'clinic',
          },
        ],
      };
      console.log('userData', payload);
      const practitionerResponse = await postData(
        'masters/getMasterList',
        payload,
      );
      setLoading(false);
      const userData = practitionerResponse.data[0];
      const newData = [
        { label: 'Clinic', value: userData.clinic.name },
        { label: 'NPI Number', value: userData.npi_number },
        { label: 'First Name', value: userData.f_name },
        { label: 'Last Name', value: userData.l_name },
        { label: 'Email', value: userData.email },
        { label: 'Taxonomy', value: userData.taxonomy_description },
        { label: 'Photo', value: userData.photo, isImage: true },
      ];
      setData(newData);
    } catch (error) {
      // Handle any exceptions
      console.error('An error occurred:', error);
    }
  };
  const getAppointMentType = async () => {
    try {
      // Define the payload structure
      setLoading(false);
      const payload = {
        modelName: 'practitioner_appointment_types',
        //id: userId,
        whereCondition: {
          practitioner_id: userId,
        },
      };
      console.log('userData', payload);
      const appointmentResponse = await postData(
        'masters/getMasterList',
        payload,
      );
      setLoading(false);
      const userData = appointmentResponse.data[0];
      const newData = appointmentResponse.data.map((item) => ({
        label: 'Appointment Type',
        value: item.appointment_type,
      }));
      setAppointmentData(newData);
    } catch (error) {
      // Handle any exceptions
      console.error('An error occurred:', error);
    }
  };
  const getSpecialtyDetails = async () => {
    try {
      // Define the payload structure
      setLoading(false);
      const payload = {
        modelName: 'practitioner_specialtys',
        //id: userId,
        whereCondition: {
          practitioner_id: userId,
        },
        relations: [
          {
            module: 'specialty_masters',
          },
        ],
      };
      console.log('userData', payload);
      const specialtyResponse = await postData(
        'masters/getMasterList',
        payload,
      );
      setLoading(false);
      const userData = specialtyResponse.data[0];
      const newData = specialtyResponse.data.map((item) => ({
        label: 'Specialty ID',
        value: item.specialty_master?.specialty,
        experience: item.experience_in_year,
      }));
      console.log('Specialty', newData);
      setSpecialtyData(newData);
    } catch (error) {
      // Handle any exceptions
      console.error('An error occurred:', error);
    }
  };
  const getSubscriptionDetails = async () => {
    try {
      // Define the payload structure
      setLoading(false);
      const payload = {
        modelName: 'practitioner_subscriptions',
        //id: userId,
        whereCondition: {
          practitioner_id: userId,
        },
        relations: [
          {
            module: 'subscription_masters',
          },
        ],
      };
      console.log('userData', payload);
      const subscriptionResponse = await postData(
        'masters/getMasterList',
        payload,
      );
      setLoading(false);
      const userData = subscriptionResponse.data[0];
      const newData = subscriptionResponse.data.map((item) => ({
        name: item.subscription_master.name,
        startDate: item.start_date,
        endDate: item.end_date,
        price: item.price,
      }));
      setSubscriptionData(newData);
    } catch (error) {
      // Handle any exceptions
      console.error('An error occurred:', error);
    }
  };
  const getServiceDetails = async () => {
    try {
      // Define the payload structure
      setLoading(false);
      const payload = {
        modelName: 'practitioner_service_experts',
        //id: userId,
        whereCondition: {
          practitioner_id: userId,
        },
        relations: [
          {
            module: 'practitioner_service_masters',
          },
        ],
      };
      console.log('userData', payload);
      const serviceResponse = await postData('masters/getMasterList', payload);
      setLoading(false);
      const userData = serviceResponse.data[0];
      const newData = serviceResponse.data.map((item) => ({
        name: item.practitioner_service_master.service_name,
      }));
      setServiceData(newData);
    } catch (error) {
      // Handle any exceptions
      console.error('An error occurred:', error);
    }
  };
  const getSymptomDetails = async () => {
    try {
      // Define the payload structure
      setLoading(false);
      const payload = {
        modelName: 'practitioner_symptoms_experts',
        //id: userId,
        whereCondition: {
          practitioner_id: userId,
        },
        relations: [
          {
            module: 'practitioner_symptoms_masters',
          },
        ],
      };
      console.log('userData', payload);
      const symptomsResponse = await postData('masters/getMasterList', payload);
      setLoading(false);
      const userData = symptomsResponse.data[0];
      const newData = symptomsResponse.data.map((item) => ({
        name: item.practitioner_symptoms_master.symptoms_name,
      }));
      setSymptomsData(newData);
    } catch (error) {
      // Handle any exceptions
      console.error('An error occurred:', error);
    }
  };

  const toggleEnlargeImage = (imageUrl: string) => {
    setEnlargedImageUrl(imageUrl);
    setEnlargeImage(!enlargeImage);
  };

  return (
    <DefaultLayout>
      {/* <Breadcrumb pageName="<a onClick={() => navigate(`/cmsUser`)}>View CMS User</link>" /> */}
      <Breadcrumb pageName=" Practitioner View">
        <a onClick={() => navigate(`/practitioners`)}>Practitioner List</a>
      </Breadcrumb>
      {loading ? (
        <Loader />
      ) : (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="flex justify-end pb-2">
            <button
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => navigate(`/practitioners`)}
            >
              Back
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <table className="table-auto w-full sm:w-auto">
              <tbody>
                {data
                  .slice(0, Math.ceil(data.length / 2))
                  .map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-gray' : 'bg-white'}
                    >
                      <td className="px-6 py-2 text-left font-bold text-gray-900">
                        {item.label}
                      </td>
                      <td className="px-6 py-2 text-left text-gray-500">
                        {item.value}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <table className="table-auto w-full sm:w-auto">
              <tbody>
                {data.slice(Math.ceil(data.length / 2)).map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-gray' : 'bg-white'}
                  >
                    <td className="px-6 py-2 text-left font-bold text-gray-900">
                      {item.label}
                    </td>
                    <td className="py-2">
                      {item.isImage ? (
                        <img
                          src={`${apiURL}/${item.value}`}
                          alt={item.label}
                          className="w-14 h-14 object-cover cursor-pointer"
                          onClick={() => toggleEnlargeImage(item.value)}
                        />
                      ) : (
                        item.value
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointmentData.length > 0 && (
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-4">
                <div className="py-6 px-4 md:px-6 xl:px-7.5">
                  <h4 className="text-xl font-semibold text-black dark:text-white">
                    Appointment Type
                  </h4>
                </div>
                <div className="grid grid-cols-2 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                  <div className="col-span-3 hidden items-center sm:flex">
                    {' '}
                    {/* Set col-span-6 for each */}
                    <p className="font-medium">Sr.No</p>
                  </div>
                  <div className="col-span-2 items-center sm:flex">
                    {' '}
                    {/* Set col-span-6 for each */}
                    <p className="font-medium">Appointment Type</p>
                  </div>
                </div>
                {appointmentData.map((item, key) => (
                  <div
                    className="grid grid-cols-2 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                    key={key}
                  >
                    <div className="col-span-3 hidden items-center sm:flex">
                      {' '}
                      {/* Set col-span-6 for each */}
                      <p className="font-medium">{key + 1}</p>
                    </div>
                    <div className="col-span-2 items-center sm:flex">
                      {' '}
                      {/* Set col-span-6 for each */}
                      <p className="font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {specialtyData.length > 0 && (
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-4">
                <div className="py-6 px-4 md:px-6 xl:px-7.5">
                  <h4 className="text-xl font-semibold text-black dark:text-white">
                    Specialty
                  </h4>
                </div>
                <div className="grid grid-cols-2 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                  <div className="col-span-3 hidden items-center sm:flex">
                    <p className="font-medium">Sr.No</p>
                  </div>
                  <div className="col-span-2 items-center sm:flex">
                    <p className="font-medium">Specialty</p>
                  </div>
                </div>
                {specialtyData.map((item, key) => (
                  <div
                    className="grid grid-cols-3 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                    key={key}
                  >
                    <div className="col-span-3 hidden items-center sm:flex">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <p className="text-sm text-black dark:text-white">
                          {key + 1}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-2 items-center sm:flex">
                      <p className="text-sm text-black flex items-center">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mb-8 mt-4">
            {subscriptionData.length > 0 && (
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="py-6 px-4 md:px-6 xl:px-7.5">
                  <h4 className="text-xl font-semibold text-black dark:text-white">
                    Subscription
                  </h4>
                </div>

                <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                  <div className="col-span-2 hidden items-center sm:flex">
                    <p className="font-medium w-full">Sr.No</p>
                  </div>
                  <div className="col-span-3 items-center sm:flex">
                    <p className="font-medium w-full">Subscription</p>
                  </div>
                  <div className="col-span-1 flex items-center sm:space-x-2">
                    <p className="font-medium w-full">Start Date</p>
                  </div>
                  <div className="col-span-1 flex items-center sm:space-x-2">
                    <p className="font-medium w-full">End Date</p>
                  </div>
                  <div className="col-span-1 flex items-center sm:space-x-2">
                    <p className="font-medium w-full">Price</p>
                  </div>
                </div>

                {subscriptionData.map((item, key) => (
                  <div
                    className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                    key={key}
                  >
                    <div className="col-span-2 hidden items-center sm:flex">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <p className="text-sm text-black dark:text-white w-full">
                          {key + 1}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-3 items-center sm:flex">
                      <p className="text-sm text-black dark:text-white w-full">
                        {item.name}
                      </p>
                    </div>
                    <div className="col-span-1 flex items-center sm:space-x-2">
                      <p className="text-sm text-black dark:text-white w-full sm:hidden">
                        {formatDateVertical(item.startDate)}
                      </p>
                      <p className="text-sm text-black dark:text-white w-full hidden sm:block">
                        {formatISODate(item.startDate)}
                      </p>
                    </div>
                    <div className="col-span-1 flex items-center sm:space-x-2">
                      <p className="text-sm text-black dark:text-white w-full sm:hidden">
                        {formatDateVertical(item.endDate)}
                      </p>
                      <p className="text-sm text-black dark:text-white w-full hidden sm:block">
                        {formatISODate(item.endDate)}
                      </p>
                    </div>
                    <div className="col-span-1 flex items-center w-full sm:space-x-2">
                      <p className="text-sm text-black">${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {symptomsData.length > 0 && (
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-4">
                <div className="py-6 px-4 md:px-6 xl:px-7.5">
                  <h4 className="text-xl font-semibold text-black dark:text-white">
                    Symptoms
                  </h4>
                </div>
                <div className="grid grid-cols-2 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                  <div className="col-span-3 hidden items-center sm:flex">
                    {' '}
                    {/* Set col-span-6 for each */}
                    <p className="font-medium">Sr.No</p>
                  </div>
                  <div className="col-span-2 items-center sm:flex">
                    {' '}
                    {/* Set col-span-6 for each */}
                    <p className="font-medium">Symptom</p>
                  </div>
                </div>
                {symptomsData.map((item, key) => (
                  <div
                    className="grid grid-cols-2 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                    key={key}
                  >
                    <div className="col-span-3 hidden items-center sm:flex">
                      <p className="font-medium">{key + 1}</p>
                    </div>
                    <div className="col-span-2  items-center sm:flex">
                      <p className="font-medium">{item.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {serviceData.length > 0 && (
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-4">
                <div className="py-6 px-4 md:px-6 xl:px-7.5">
                  <h4 className="text-xl font-semibold text-black dark:text-white">
                    Services
                  </h4>
                </div>
                <div className="grid grid-cols-2 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                  <div className="col-span-3 hidden items-center sm:flex">
                    <p className="font-medium">Sr.No</p>
                  </div>
                  <div className="col-span-2 items-center sm:flex">
                    <p className="font-medium">Service</p>
                  </div>
                </div>
                {serviceData.map((item, key) => (
                  <div
                    className="grid grid-cols-2 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                    key={key}
                  >
                    <div className="col-span-3 hidden items-center sm:flex">
                      <p className="font-medium">{key + 1}</p>
                    </div>
                    <div className="col-span-2 items-center sm:flex">
                      <p className="font-medium">{item.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {enlargeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={toggleEnlargeImage}
        >
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="w-100 aspect-square overflow-hidden">
              <img
                src={`${apiURL}/${enlargedImageUrl}`}
                alt="Enlarged"
                className="object-contain w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};
export default Viewpractitioner;
