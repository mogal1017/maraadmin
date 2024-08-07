import React, { SetStateAction, useCallback, useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { useNavigate } from 'react-router-dom';
import { postData } from '../../Networking/Api';
import DataTable from 'react-data-table-component';
import Loader from '../../common/Loader';
import Swal from 'sweetalert2';
import debounce from 'lodash.debounce';

const Patients = () => {
  const [patientsData, setPatientsData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(25);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = Math.max(0, indexOfLastRecord - recordsPerPage);
  const currentRecords = patientsData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage,
  );

  function formatISODate(isoDate: string | number | Date) {
    if (!isoDate) return ''; // Add a null check
    const date = new Date(isoDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  useEffect(() => {
    getPractitionerListing(currentPage);
  }, [currentPage, recordsPerPage, searchKeyword]);

  useEffect(() => {
    setPatientsData((prevPatientsMaster) =>
      prevPatientsMaster.map((user) => ({
        ...user,
        enabled: user.is_active === 1,
      })),
    );
  }, [patientsData]);

  const columns = [
    {
      name: 'Sr No.',
      selector: (_row: any, index: number) =>
        index + 1 + (currentPage - 1) * recordsPerPage,
      sortable: false,
    },
    {
      name: 'First Name',
      selector: 'first_name',
      sortable: true,
    },
    {
      name: 'Last Name',
      selector: 'last_name',
      sortable: true,
    },
    {
      name: 'Email',
      selector: 'email',
      sortable: true,
    },
    {
      name: 'Sex',
      selector: 'gender',
      sortable: true,
    },
    {
      name: 'Date of Birth',
      selector: 'date_of_birth',
      sortable: true,
      cell: (row: { date_of_birth: any }) => formatISODate(row.date_of_birth),
    },

    {
      name: 'Zip Code',
      selector: 'zipcode',
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row) => (
        <div className="flex items-center space-x-3.5">
          <button
            className="hover:text-primary"
            onClick={() => navigate(`/patients/viewpatients/${row.id}`)}
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                fill=""
              />
              <path
                d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                fill=""
              />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  const getPractitionerListing = async (pageNumber: number) => {
    try {
      // setLoading(true);
      const pagination = {
        page: 1,
        pageSize: 1000, // fetch all records
      };
      const search = {
        field_name: ['first_name', 'email', 'last_name', 'zipcode', 'gender'],
        searchKeyword: searchKeyword,
      };
      const payload = {
        modelName: 'patients',
        pagination: pagination,
        search: search,
      };

      const response = await postData('masters/getMasterList', payload);

      // setLoading(false);
      if (response.data.length > 0) {
        setPatientsData(response.data);
        setTotalRecords(response.count);
        setCurrentPage(pageNumber);
      } else {
        // Handle the case where no data is returned
      }
    } catch (error) {
      console.error('An error occurred while fetching user listing:', error);
      // setLoading(false);
    }
  };

  const debouncedGetListing = useCallback(
    debounce(getPractitionerListing, 500),
    [searchKeyword],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
    setCurrentPage(1);
    debouncedGetListing(1);
  };

  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  const handleRecordsPerPageChange = (value: SetStateAction<number>) => {
    setRecordsPerPage(value);
    setCurrentPage(1);
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    getPractitionerListing(pageNumber);
  };

  return (
    <DefaultLayout>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Breadcrumb pageName="Patients List">
            <a onClick={() => navigate(`/patients`)}></a>
          </Breadcrumb>
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="flex flex-col sm:flex-row items-center justify-between bg-white px-4 py-3 sm:px-6">
              <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                <span>Show</span>
                <div className="relative">
                  <select
                    value={recordsPerPage}
                    onChange={(e) =>
                      handleRecordsPerPageChange(parseInt(e.target.value))
                    }
                    className="rounded-md border border-gray-300 shadow-md focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-500 px-2 py-1"
                  >
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="75">75</option>
                    <option value="100">100</option>
                    <option value="125">125</option>
                    <option value="150">150</option>
                  </select>
                </div>
                <span>Entries</span>
              </div>
              <div className="relative w-full sm:w-auto">
                <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
                <input
                  type="text"
                  id="table-search"
                  value={searchKeyword}
                  onChange={handleSearchChange}
                  autoFocus
                  className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 sm:w-50 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search For Items"
                />
              </div>
            </div>
            <DataTable
              columns={columns}
              data={currentRecords}
              pagination={false}
              customStyles={{
                headRow: {
                  style: {
                    fontWeight: 'bold',
                    fontSize: '1rem',
                  },
                },
              }}
            />
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {(currentPage - 1) * recordsPerPage + 1}
                  </span>{' '}
                  To{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * recordsPerPage, totalRecords)}
                  </span>{' '}
                  Of <span className="font-medium">{totalRecords}</span> Entries
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <a
                    href="#"
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    <span className="sr-only">Previous</span>
                    <button
                      disabled={currentPage === 1}
                      onClick={() => handlePageClick(currentPage - 1)}
                    >
                      Previous
                    </button>
                  </a>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <a
                      href="#"
                      key={index + 1}
                      onClick={() => handlePageClick(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                        currentPage === index + 1
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {index + 1}
                    </a>
                  ))}

                  <a
                    href="#"
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageClick(currentPage + 1)}
                    >
                      Next
                    </button>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </>
      )}
    </DefaultLayout>
  );
};

export default Patients;
