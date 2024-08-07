import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Loader from '../../common/Loader';
import { useParams, useNavigate } from 'react-router-dom';
import { postData } from '../../Networking/Api';
import { ClinicInsurance } from './ClinicInsurance';
import { ClinicSubscriptions } from './ClinicSubscriptions';
import { ClinicCardDeatils } from './ClinicCardDetails';

const ClinicView = () => {
  const { clinicId } = useParams();
  const navigate = useNavigate();
  const [clinicData, setClinicData] = useState<{ label: string; value: any }[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClinicData();
  }, []);

  const fetchClinicData = async () => {
    try {
      setLoading(true);
      const payload = {
        modelName: 'clinics',
        whereCondition: {
          id: clinicId,
        },
      };
      const response = await postData('masters/getMasterList', payload);
      setLoading(false);
      const data = response.data[0];
      const newData = [
        { label: 'Name', value: data.name },
        { label: 'Website', value: data.website },
        { label: 'FaxNumber', value: data.faxNumber },
        { label: 'Address Type', value: data.address_ype },
        { label: 'City', value: data.city },
        { label: 'State', value: data.state },
        { label: 'Taxonomy Description', value: data.taxonomy_description },
        { label: 'Email', value: data.email },
        { label: 'Contact', value: data.phone },
        { label: 'NPI', value: data.npi_number },
        { label: 'Street', value: data.street },
        { label: 'Country', value: data.country },
        { label: 'Zipcode', value: data.zipcode },
        // Corrected key name
      ];
      setClinicData(newData);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const halfLength = Math.ceil(clinicData.length / 2);
  const firstTableFields = clinicData.slice(0, halfLength);
  const secondTableFields = clinicData.slice(halfLength);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Clinic View">
        <a onClick={() => navigate(`/Clinic`)}>Clinic List</a>
      </Breadcrumb>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col gap-10">
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="flex justify-end pb-2">
              <button
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => navigate(`/Clinic`)}
              >
                Back
              </button>
            </div>
            <div className="rounded-sm  bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 gap-4">
              <table className="table-auto w-full fixed-row-height-50">
                <tbody>
                  {firstTableFields.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-gray' : 'bg-white'} // Adjusted modulo for alternate row colors
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
                      className={index % 2 === 0 ? 'bg-gray' : 'bg-white'} // Adjusted modulo for alternate row colors
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
            </div>
            <div className="rounded-sm  bg-white  dark:border-strokedark dark:bg-boxdark p-2 mt-4">
              <ClinicInsurance clinicId={clinicId} />
            </div>

            <div className="rounded-sm  bg-white  dark:border-strokedark dark:bg-boxdark p-4  mt-4">
              <ClinicSubscriptions clinicId={clinicId} />
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default ClinicView;
