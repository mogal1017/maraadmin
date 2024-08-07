import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useNavigate, useParams } from 'react-router-dom';
import { postData } from '../../Networking/Api';
import Loader from '../../common/Loader';

const Viewpatientappointment = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    getPatientAppointmentsView();
  }, []);

  // const data = [
  //   { label: 'Full Name', value: 'Rohit Bhujbal' },
  //   { label: 'Mobile No', value: '9999999999' },
  //   { label: 'Email', value: 'rohit@gmail.com' },
  //   { label: 'Password', value: '12345' },
  //   { label: 'Is active', value: 'false' },
  // ];
  const firstTableFields = data.slice(0, 3); // Extract first 3 elements
  const secondTableFields = data.slice(3);
  const getPatientAppointmentsView = async () => {
    try {
      // Define the payload structure
      setLoading(false);
      const payload = {
        modelName: 'patient_appointments',
        //id: userId,
        whereCondition: {
          id: userId,
        },
        relations: [
          { module: 'clinics', moduleas: 'clinics' },
          { module: 'patients', moduleas: 'patients' },
          { module: 'practitioners', moduleas: 'practitioners' },
        ],
      };

      console.log('userData', payload);
      const appointmentResponse = await postData(
        'masters/getMasterList',
        payload,
      );
      setLoading(false);
      const userData = appointmentResponse.data[0];
      const date = new Date(userData.appointment_date_time);
      const day = date.getDate();
      const month = date.getMonth() + 1; // Month is zero-based
      const year = date.getFullYear();

      const formattedDay = day < 10 ? '0' + day : day;
      const formattedMonth = month < 10 ? '0' + month : month;

      const dateString = `${formattedMonth}/${formattedDay}/${year}`;

      const timeString = date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      const formattedDate = `${dateString} ${timeString}`;
      const newData = [
        {
          label: 'Patient Name',
          value: `${userData.patients.first_name} ${userData.patients.last_name}`,
        },
        { label: 'Clinic Name', value: userData.clinics.name },
        {
          label: 'Practitioner Name',
          value: `${userData.practitioners.f_name} ${userData.practitioners.l_name}`,
        },
        { label: 'Appointment Date/time', value: formattedDate },
        { label: 'Status', value: userData.status },
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
      <Breadcrumb pageName="View Appointment List">
        <a onClick={() => navigate(`/patientappointments`)}>
          Patient Appointments List
        </a>
      </Breadcrumb>
      {loading ? (
        <Loader />
      ) : (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="flex justify-end pb-2">
            <button
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => navigate(`/patientappointments`)}
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
                <tr className="h-10"></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};
export default Viewpatientappointment;
