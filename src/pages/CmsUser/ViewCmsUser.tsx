import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useNavigate, useParams } from 'react-router-dom';
import { postData } from '../../Networking/Api';
import Loader from '../../common/Loader';

const ViewCmsUser = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    getCMSUserView();
  }, []);

  // const data = [
  //   { label: 'Full Name', value: 'Rohit Bhujbal' },
  //   { label: 'Mobile No', value: '9999999999' },
  //   { label: 'Email', value: 'rohit@gmail.com' },
  //   { label: 'Password', value: '12345' },
  //   { label: 'Is active', value: 'false' },
  // ];
  const firstTableFields = data.slice(0, 2); // Extract first 3 elements
  const secondTableFields = data.slice(2);
  const getCMSUserView = async () => {
    try {
      // Define the payload structure
      setLoading(false);
      const payload = {
        modelName: 'cms_users',
        //id: userId,
        whereCondition: {
          id: userId,
        },
      };

      console.log('userData', payload);
      const cmsUserResponse = await postData('masters/getMasterList', payload);
      setLoading(false);
      const userData = cmsUserResponse.data[0];
      const newData = [
        { label: 'Full Name', value: userData.full_name },
        { label: 'Contact No', value: userData.mobile_no },
        { label: 'Email', value: userData.email },
        // { label: 'Password', value: userData.password },
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
      {/* <Breadcrumb pageName="<a onClick={() => navigate(`/cmsUser`)}>View CMS User</link>" /> */}
      <Breadcrumb pageName="View CMS User">
        <a onClick={() => navigate(`/cmsUser`)}> CMS User List</a>
      </Breadcrumb>
      {loading ? (
        <Loader />
      ) : (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="flex justify-end pb-2">
            <button
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => navigate(`/cmsUser`)}
            >
              Back
            </button>
          </div>
          <div className="rounded-sm  bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <table className="table-auto w-full sm:w-auto">
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
            <table className="table-auto w-full fixed-row-height-50 sm:w-auto">
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
export default ViewCmsUser;
