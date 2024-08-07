import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useNavigate, useParams } from 'react-router-dom';
import { postData } from '../../Networking/Api';
import Loader from '../../common/Loader';

const Viewpatient = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getPatientsView();
  }, []);

  const firstTableFields = data.slice(0, 4);
  const secondTableFields = data.slice(4);

  const getPatientsView = async () => {
    try {
      setLoading(true);
      const payload = {
        modelName: 'patients',
        whereCondition: {
          id: userId,
        },
      };

      const patientsResponse = await postData('masters/getMasterList', payload);
      const userData = patientsResponse.data[0];

      const formattedDate = userData.date_of_birth ? formatISODate(userData.date_of_birth) : 'N/A';

      const newData = [
        { label: 'First Name', value: userData.first_name },
        { label: 'Last Name', value: userData.last_name },
        { label: 'Email', value: userData.email },
        { label: 'Date of Birth', value: formattedDate },
        { label: 'Gender', value: userData.gender },
        { label: 'Address', value: userData.address_type },
        { label: 'Zipcode', value: userData.zipcode },
      ];
      setData(newData);
      setLoading(false);
    } catch (error) {
      console.error('An error occurred:', error);
      setLoading(false);
    }
  };

  function formatISODate(isoDate) {
    if (!isoDate) return 'N/A';
    const date = new Date(isoDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="View Patient">
        <a onClick={() => navigate(`/patients`)}>Patients List</a>
      </Breadcrumb>
      {loading ? (
        <Loader />
      ) : (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="flex justify-end pb-2">
            <button
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => navigate(`/patients`)}
            >
              Back
            </button>
          </div>
          <div className="rounded-sm  bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-x-auto">
            <table className="table-auto w-full sm:w-auto">
              <tbody>
                {firstTableFields.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray' : 'bg-white'}>
                    <td className="px-6 py-2 text-left font-bold text-gray-900">{item.label}</td>
                    <td className="px-6 py-2 text-left text-gray-500">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="table-auto w-full fixed-row-height-50 sm:w-auto">
              <tbody>
                {secondTableFields.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray' : 'bg-white'}>
                    <td className="px-6 py-2 text-left font-bold text-gray-900">{item.label}</td>
                    <td className="px-6 py-2 text-left text-gray-500">{item.value}</td>
                  </tr>
                ))}
                <tr className="h-10"></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default Viewpatient;
