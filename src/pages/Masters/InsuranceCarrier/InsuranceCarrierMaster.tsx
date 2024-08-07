import { SetStateAction, useEffect, useState, useCallback } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../layout/DefaultLayout';
import { BsFillPencilFill } from 'react-icons/bs';
import { postData } from '../../../Networking/Api';
import Loader from '../../../common/Loader';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import { Switch } from '@headlessui/react';
import debounce from 'lodash.debounce';

interface Insurance {
  is_active: boolean;
  id: number;
  health_insurance_carrier_name: string;
}

export const InsuranceCarrierMaster = () => {
  const [insuranceData, setInsuranceData] = useState<Insurance[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [insuranceCarrierName, setInsuranceCarrierName] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = Math.max(0, indexOfLastRecord - recordsPerPage);
  useEffect(() => {
    fetchInsuranceMasters(currentPage);
  }, [currentPage, recordsPerPage, insuranceData.length]);

  useEffect(() => {
    setCurrentPage(1);
    fetchInsuranceMasters(currentPage);
  }, [searchKeyword]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setEditIndex(null); // Reset editIndex when opening modal
    setInsuranceCarrierName('');
    setLoading(false);
    setErrorMessage('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditIndex(null);
    setInsuranceCarrierName('');
    setLoading(false);
    setErrorMessage('');
  };

  useEffect(() => {
    setInsuranceData((prevInsuranceData) =>
      prevInsuranceData.map((insurance) => ({
        ...insurance,
        enabled: insurance.is_active, // Update enabled based on is_active
      })),
    );
  }, [insuranceData]);

  const handleIsActiveChange = async (
    insuranceId: number,
    checked: boolean,
  ) => {
    try {
      setLoading(true);

      const payload = {
        modelName: 'health_insurance_carrier_master',
        id: insuranceId,
        inputData: {
          is_active: checked ? 1 : 0,
        },
      };

      const response = await postData('masters/createAndUpdateMaster', payload);
      const updatedInsuranceMaster = insuranceData.map((insurance) => {
        if (insurance.id === insuranceId) {
          return {
            ...insurance,
            is_active: response.data.is_active,
          };
        }
        return insurance;
      });
      setInsuranceData(updatedInsuranceMaster);
      setLoading(false);
      Swal.fire({
        title: 'Success',
        text: 'Status Changed Successfully',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('An error occurred while updating isActive:', error);
      setLoading(false);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred. Please try again later.',
        icon: 'error',
        showConfirmButton: true,
      });
    }
  };

  const columns = [
    {
      name: 'Sr.No.',
      selector: (_row: any, index: number) =>
        index + 1 + (currentPage - 1) * recordsPerPage,
      sortable: false,
    },
    {
      name: 'Insurance Carrier Name',
      selector: 'health_insurance_carrier_name',
      sortable: true,
    },
    {
      name: 'Status',
      selector: 'is_active',
      sortable: true,
      cell: (row: {
        enabled: boolean | undefined;
        id: number;
        is_active: any;
      }) => (
        <div className="flex items-center">
          <Switch
            checked={row.enabled}
            onChange={(checked) => handleIsActiveChange(row.id, checked)}
            className={`${
              row.enabled ? 'bg-green-600' : 'bg-red-500'
            } relative inline-flex items-center h-8 rounded-full w-20 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            <span className="absolute left-2 sm:left-1">
              {row.enabled ? 'Active' : ''}
            </span>
            <span
              className={`${
                row.enabled ? 'translate-x-12' : 'translate-x-1'
              } inline-block w-6 h-6 transform bg-white rounded-full transition-transform`}
            />
            <span
              className={`absolute right-2 sm:right-1 ${
                row.is_active ? 'hidden' : ''
              }`}
            >
              {'Inactive'}
            </span>
          </Switch>
        </div>
      ),
    },
    {
      name: 'Action',
      cell: (row: Insurance, index: number) => (
        <div className="flex justify-center items-center">
          <BsFillPencilFill
            className="cursor-pointer mr-2"
            title="Edit"
            onClick={() => {
              setEditIndex(index);
              setInsuranceCarrierName(row.health_insurance_carrier_name);
              setIsModalOpen(true);
            }}
          />
        </div>
      ),
    },
  ];

  const handleAddInsurance = async () => {
    if (insuranceCarrierName.charAt(0) === ' ') {
      setErrorMessage('Insurance Carrier Name Should Not Start With A Space');
      return;
    }

    const trimmedName = insuranceCarrierName.trim();

    const alphanumericRegex = /^[a-zA-Z0-9 ]*$/;
    const onlyNumbersRegex = /^[0-9 ]*$/;

    if (trimmedName.length < 3) {
      setErrorMessage('Please Enter At Least 3 Characters');
      return;
    }

    if (!alphanumericRegex.test(trimmedName)) {
      setErrorMessage('Insurance Carrier Name Should Not Contain Only Symbols');
      return;
    }

    if (onlyNumbersRegex.test(trimmedName)) {
      setErrorMessage('Insurance Carrier Name Should Not Contain Only Numbers');
      return;
    }

    setErrorMessage('');

    if (
      insuranceData.some(
        (insurance) =>
          insurance.health_insurance_carrier_name.toLowerCase() ===
          trimmedName.toLowerCase(),
      )
    ) {
      setErrorMessage('Insurance Carrier Name Already Exists');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        modelName: 'health_insurance_carrier_master',
        inputData: {
          health_insurance_carrier_name: trimmedName,
          is_active: isActive ? 1 : 0,
        },
      };

      const response = await postData('masters/createAndUpdateMaster', payload);
      setLoading(false);

      Swal.fire({
        title: 'Success',
        text: 'Insurance Carrier Added successfully',
        icon: 'success',
        timer: 2000,
        showConfirmButton: true,
      });

      setInsuranceData([...insuranceData, response.data]);
      setInsuranceCarrierName('');
      setIsModalOpen(false);
      setIsActive(false);
      setErrorMessage('');
    } catch (error) {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        timer: 2000,
        showConfirmButton: true,
      });
      console.error('Error adding Insurance carrier:', error);
      setErrorMessage('Failed to add insurance carrier');
    } finally {
      setLoading(false);
    }
  };

  const handleEditInsurance = async () => {
    if (!insuranceCarrierName.trim()) {
      setErrorMessage('Please Enter The Insurance Carrier');
      return;
    }

    if (editIndex === null) {
      setErrorMessage('Please Select An Insurance To Edit');
      return;
    }

    // Check for duplicate insurance carrier name
    const trimmedName = insuranceCarrierName.trim();
    if (
      insuranceData.some(
        (insurance, index) =>
          index !== editIndex &&
          insurance.health_insurance_carrier_name.toLowerCase() ===
            trimmedName.toLowerCase(),
      )
    ) {
      setErrorMessage('Insurance Carrier Name Already Exists');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        modelName: 'health_insurance_carrier_master',
        id: insuranceData[editIndex].id,
        inputData: {
          health_insurance_carrier_name: trimmedName,
          // is_active: isActive ? 1 : 0,
        },
      };

      const response = await postData('masters/createAndUpdateMaster', payload);
      setLoading(false);

      if (response.status === 201) {
        Swal.fire({
          title: 'Success',
          text: 'Insurance Carrier Updated Successfully',
          icon: 'success',
          timer: 2000,
          showConfirmButton: true,
        });

        const updatedInsuranceData = [...insuranceData];
        updatedInsuranceData[editIndex] = response.data;
        setInsuranceData(updatedInsuranceData);

        setInsuranceCarrierName('');
        setIsModalOpen(false);
        setIsActive(false);
        setErrorMessage('');
      } else {
        Swal.fire({
          title: 'Error',
          icon: 'error',
          timer: 2000,
          showConfirmButton: true,
        });

        setErrorMessage('Failed to update Insurance.');
        console.error('Error updating insurance carrier:', response);
      }
    } catch (error) {
      console.error('Error updating insurance carrier:', error);
      setErrorMessage('Failed to update insurance carrier');
    }
  };

  const handleActionClick = () => {
    if (editIndex !== null) {
      handleEditInsurance();
    } else {
      handleAddInsurance();
    }
  };

  const fetchInsuranceMasters = async (pageNumber: number) => {
    try {
      // setLoading(true);
      const pagination = {
        page: pageNumber,
        pageSize: recordsPerPage,
      };
      const search = {
        field_name: ['health_insurance_carrier_name'],
        searchKeyword: searchKeyword,
      };
      const payload = {
        modelName: 'health_insurance_carrier_master',
        pagination: pagination,
        search: search,
      };
      const response = await postData('masters/getMasterList', payload);
      setInsuranceData(response.data);

      setTotalRecords(response.count);
    } catch (error) {
      console.error('Error fetching Insurance masters:', error);
      setErrorMessage('Failed to fetch insurance masters.');
    } finally {
      // setLoading(false);
    }
  };

  const debouncedGetListing = useCallback(
    debounce(fetchInsuranceMasters, 500),
    [searchKeyword],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
    setPageNumber(1);
    debouncedGetListing(1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    setInsuranceCarrierName(e.target.value);
  };

  const handleIsActiveModalChange = (checked: boolean) => {
    setIsActive(checked);
  };

  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  const handlePageClick = (pageNumber: number) => {
    setInsuranceData([]);
    setCurrentPage(pageNumber);
    fetchInsuranceMasters(pageNumber);
  };

  const handleRecordsPerPageChange = (value: SetStateAction<number>) => {
    setRecordsPerPage(value);
    setCurrentPage(1); // Reset current page when changing records per page
  };

  return (
    <DefaultLayout>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Breadcrumb pageName="Insurance Carrier List" />
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="flex justify-end pb-2">
              <button
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={handleOpenModal}
              >
                Add Insurance Carrier
              </button>
            </div>
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
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
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
              data={insuranceData}
              pagination={false}
              paginationPerPage={recordsPerPage}
              customStyles={{
                headRow: {
                  style: {
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                  },
                },
                headCells: {
                  style: {
                    paddingLeft: '8px',
                    paddingRight: '8px',
                  },
                },
                cells: {
                  style: {
                    paddingLeft: '8px',
                    paddingRight: '8px',
                  },
                },
                rows: {
                  style: {
                    minHeight: '48px',
                  },
                },
              }}
            />
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageClick(currentPage - 1)}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageClick(currentPage + 1)}
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
          {isModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-800 bg-opacity-75 backdrop-filter backdrop-blur-sm flex justify-center items-center">
              <div className="bg-white rounded-lg p-3 max-w-md w-full sm:max-w-md mx-6 shadow-lg border border-gray-200">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold">
                    {editIndex !== null
                      ? 'Update Insurance Carrier'
                      : 'Add Insurance Carrier'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="border-t border-gray-300 opacity-25 mb-4 sm:mb-8"></div>
                <div className="mb-1 sm:mb-4">
                  <label className="mb-2 block font-medium text-black dark:text-white text-base sm:text-lg">
                    Insurance Carrier Name
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Insurance Carrier Name"
                    value={insuranceCarrierName}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-stroke bg-transparent py-2 px-3 text-base sm:text-lg text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mb-2"
                  />
                </div>
                {errorMessage && (
                  <div className="text-sm sm:text-base text-red-600">
                    {errorMessage}
                  </div>
                )}
                {editIndex === null && (
                  <div className="mb-4.5 flex items-center gap-2 sm:gap-6">
                    <label className="mb-2.5 block text-base font-medium sm:text-lg text-black dark:text-white">
                      Is Active
                    </label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={isActive}
                        onChange={(e) =>
                          handleIsActiveModalChange(e.target.checked)
                        }
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </div>
                  </div>
                )}
                <div className="border-t border-gray-300 opacity-25 mt-4 sm:mt-6 mb-4 sm:mb-6"></div>
                <div className="flex items-center mt-4 sm:mt-6 space-x-2 sm:space-x-4">
                  <button
                    data-modal-hide="progress-modal"
                    type="button"
                    className="flex text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base sm:text-lg px-4 py-2.5 sm:py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={handleActionClick}
                  >
                    {editIndex !== null ? 'Update' : 'Submit'}
                  </button>
                  <button
                    data-modal-hide="progress-modal"
                    type="button"
                    className="py-2.5 px-4 text-base sm:text-lg font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </DefaultLayout>
  );
};
function setPageNumber(arg0: number) {
  throw new Error('Function not implemented.');
}
