import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { useNavigate, useParams } from 'react-router-dom';
import { postData } from '../../../Networking/Api';
import Loader from '../../../common/Loader';

const ViewSubscription = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    getSubscriptionView();
  }, []);
  const firstTableFields = data.slice(0, 3); // Extract first 3 elements
  const secondTableFields = data.slice(3);
  const getSubscriptionView = async () => {
    try {
      // Define the payload structure
      setLoading(false);
      const payload = {
        modelName: 'subscription_masters',
        //id: userId,
        whereCondition: {
          id: userId,
        },
      };

      console.log('userData', payload);
      const subscriptionResponse = await postData(
        'masters/getMasterList',
        payload,
      );
      setLoading(false);
      const userData = subscriptionResponse.data[0];
      const newData = [
        { label: 'Name', value: userData.name },
        { label: 'Duration Type', value: userData.duration_type },
        { label: 'Actual Price', value: userData.actual_price },
        { label: 'Type', value: userData.type },
        { label: 'Duration', value: userData.duration },
        { label: 'Price', value: userData.price },
        { label: 'Status', value: userData.is_active ? 'Active' : 'Inactive' }, 
      ];
      setData(newData);
    } catch (error) {
      // Handle any exceptions
      console.error('An error occurred:', error);
    }

  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="View Subscription Master">
        <a onClick={() => navigate(`/subscriptionmaster`)}>Subscription List</a>
      </Breadcrumb>
      {loading ? (
        <Loader />
      ) : (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="flex justify-end pb-2">
            <button
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => navigate(`/subscriptionmaster`)}
            >
              Back
            </button>
          </div>
          <div className="rounded-sm  bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <table className="table-auto w-full">
              <tbody>
                {firstTableFields.map((item, index) => (
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
            <table className="table-auto w-full fixed-row-height-50">
              <tbody>
                {secondTableFields.map((item, index) => (
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
                {/* <tr className="h-10"></tr> */}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};
export default ViewSubscription;
