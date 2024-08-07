import { SetStateAction, useEffect, useState } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../layout/DefaultLayout';
import { BsFillPencilFill } from 'react-icons/bs';
import { postData } from '../../../Networking/Api';
import Loader from '../../../common/Loader';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import { Switch } from '@headlessui/react';

interface Specialty {
  id: number;
  specialty: string;
  is_active: boolean;
}

export const SpecialityMaster = () => {
  const [specialtyData, setSpecialtyData] = useState<Specialty[]>([]);
  const [specialty, setSpecialty] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [enabled, setEnabled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = Math.max(0, indexOfLastRecord - recordsPerPage);
  const currentRecords = specialtyData.slice(
    indexOfFirstRecord,
    indexOfLastRecord,
  );
  useEffect(() => {
    getSpecialtyMasters(currentPage);
  }, [currentPage, recordsPerPage, specialtyData.length]);
  useEffect(() => {
    setCurrentPage(1);
    getSpecialtyMasters(currentPage);
  }, [searchKeyword]);
  useEffect(() => {
    // Update the enabled state based on the is_active property
    setSpecialtyData((prevSpecilMaster) =>
      prevSpecilMaster.map((user) => ({
        ...user,
        enabled: user.is_active == 1, // Assuming 1 means active, modify as per your API response
      })),
    );
  }, [specialtyData]);

  const handleIsActiveChange = async (userId: string, checked: boolean) => {
    try {
      setLoading(true);

      const payload = {
        modelName: 'specialty_masters',
        id: userId,
        inputData: {
          is_active: checked ? 1 : 0, // Convert boolean to 1 or 0
        },
      };

      const response = await postData('masters/createAndUpdateMaster', payload);
      // Update the CMSMaster state with the updated data
      const updatedSpecialityMaster = specialtyData.map((user) => {
        if (user.id === userId) {
          return {
            ...user,
            is_active: response.data.is_active,
          };
        }
        return user;
      });
      setSpecialtyData(updatedSpecialityMaster);
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
      name: 'Sr No.',
      selector: (_row: any, index: number) =>
        index + 1 + (currentPage - 1) * recordsPerPage,
      sortable: false,
    },
    {
      name: 'Specialty',
      selector: 'specialty',
      sortable: true,
    },
    {
      name: 'Status',
      selector: 'is_active',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center">
          <Switch
            checked={row.enabled}
            onChange={(checked) => handleIsActiveChange(row.id, checked)} // Handle the change
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
                row.enabled ? 'hidden' : ''
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
      cell: (row, index) => (
        <div className="flex justify-center items-center">
          <BsFillPencilFill
            className="cursor-pointer mr-2"
            title="Edit"
            onClick={() => {
              setEditIndex(index);
              setSpecialty(row.specialty);
              setIsModalOpen(true);
            }}
          />
        </div>
      ),
    },
  ];
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditIndex(null);
    setSpecialty('');
    setLoading(false);
    setErrorMessage('');
  };

  const handleActionClick = () => {
    if (editIndex !== null) {
      handleEditSpecialty();
    } else {
      handleAddSpecialty();
    }
  };

  const handleAddSpecialty = async () => {
    if (!specialty.trim()) {
      setErrorMessage('Please Enter The Specialty Name');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        modelName: 'specialty_masters',
        inputData: {
          specialty: specialty,
          is_active: isActive ? 1 : 0,
        },
      };

      const response = await postData('masters/createAndUpdateMaster', payload);
      setLoading(false);

      Swal.fire({
        title: 'Success',
        text: 'Speciality Added Successfully',
        icon: 'success',
        timer: 2000,
        showConfirmButton: true,
      });
      setTimeout(() => {}, 2000);

      console.log('Specialty Added Successfully', response);
      setLoading(false);

      setSpecialtyData([...specialtyData, response.data]);
      setSpecialty('');
      setIsModalOpen(false);
      setErrorMessage('');
    } catch (error) {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        timer: 2000,
        showConfirmButton: true,
      });
      console.error('Error adding specialty:', error);
      setErrorMessage('Failed to add specialty');
    }
  };

  const handleEditSpecialty = async () => {
    if (!specialty.trim()) {
      setErrorMessage('Please Enter The Specialty Name');
      return;
    }

    if (editIndex === null) {
      setErrorMessage('Please Select A Specialty To Edit');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        modelName: 'specialty_masters',
        id: specialtyData[editIndex].id,
        inputData: {
          specialty: specialty,
          //is_active: isActive ? 1 : 0,
        },
      };

      const response = await postData('masters/createAndUpdateMaster', payload);
      setLoading(false);

      console.log('Response:', response);

      if (response.status === 201) {
        Swal.fire({
          title: 'Success',
          text: 'Speciality Updated Successfully',
          icon: 'success',
          timer: 2000,
          showConfirmButton: true,
        });
        setTimeout(() => {}, 2000);

        const updatedSpecialties = [...specialtyData];
        updatedSpecialties[editIndex] = response.data;
        setSpecialtyData(updatedSpecialties);

        setSpecialty('');
        setIsModalOpen(false);
        setErrorMessage('');
        console.log('Specialty Updated Successfully');
      } else {
        Swal.fire({
          title: 'Error',
          icon: 'error',
          timer: 2000,
          showConfirmButton: true,
        });

        setErrorMessage('Failed to update specialty');
        console.error('Error updating specialty:', response);
      }
    } catch (error) {
      console.error('Error updating specialty:', error);
      setErrorMessage('Failed to update specialty');
    }
  };

  const getSpecialtyMasters = async (pageNumber: number) => {
    try {
      setLoading(true);
      const pagination = {
        page: pageNumber,
        pageSize: recordsPerPage,
      };
      const search = {
        field_name: ['specialty'],
        searchKeyword: searchKeyword,
      };
      const payload = {
        modelName: 'specialty_masters',
        pagination: pagination,
        search: search,
      };

      const response = await postData('masters/getMasterList', payload);

      if (pageNumber === 1) {
        setLoading(false);
        setSpecialtyData(response.data);
      } else {
        setLoading(false);
        setSpecialtyData((prevSpecialMaster) => {
          // Filter out duplicates from the new data
          const newData = response.data.filter(
            (newItem: { id: any }) =>
              !prevSpecialMaster.some(
                (existingItem) => existingItem.id === newItem.id,
              ),
          );
          // Append filtered new data to existing CMSMaster state
          return [...prevSpecialMaster, ...newData];
        });
      }
      setTotalRecords(response.count);

      // return response.data; // Assuming the response contains the user listing
    } catch (error) {
      console.error('An error occurred while fetching user listing:', error);
      throw error; // Rethrow the error for handling at a higher level if needed
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //setErrorMessage('');
    //setSpecialty(e.target.value);
    const { name, value, checked } = e.target;
    setErrorMessage('');
    if (name === 'specialty') {
      setSpecialty(value);
    } else if (name === 'isActive') {
      setIsActive(checked);
    }
  };
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const handleRecordsPerPageChange = (value: SetStateAction<number>) => {
    //getUserListing();
    setRecordsPerPage(value);
    setCurrentPage(1); // Reset current page when changing records per page
  };
  const handlePageClick = (pageNumber: number) => {
    setSpecialtyData([]);
    setCurrentPage(pageNumber);
    getSpecialtyMasters(pageNumber);
  };

  return (
    <DefaultLayout>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Breadcrumb pageName="Specialty Master" />
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="flex justify-end pb-2">
              <button
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={handleOpenModal}
              >
                Add Specialty
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
                    <option value="5">5</option>
                    <option value="10">10</option>
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
                  onChange={(e) => {
                    setSearchKeyword(e.target.value);
                  }}
                  autoFocus
                  className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 sm:w-50 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search For Items"
                />
              </div>
            </div>
            <DataTable
              columns={columns}
              data={specialtyData}
              pagination={false}
              paginationPerPage={recordsPerPage}
              customStyles={{
                headRow: {
                  style: {
                    fontWeight: 'bold', 
                    fontSize: '1.1rem', 
                  },
                },
              }}
            />
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
                    Of <span className="font-medium">{totalRecords}</span>{' '}
                    Entries
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
          </div>

          {isModalOpen && (
  <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-800 bg-opacity-75 backdrop-filter backdrop-blur-sm flex justify-center items-center">
    <div className="bg-white rounded-lg p-3 max-w-md w-full sm:max-w-md mx-6 md:mx-auto shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold">
          {editIndex !== null ? 'Update Specialty' : 'Add Specialty'}
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="border-t border-gray-300 opacity-25 mb-4 sm:mb-10"></div>
      <div className="mb-1">
        <label className="mb-4 block font-medium text-black dark:text-white text-lg">
          Specialty<span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter Specialty"
          value={specialty}
          onChange={handleInputChange}
          className="w-full rounded-lg border border-stroke bg-transparent py-3 px-3 text-base sm:text-lg text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mb-2"
        />
      </div>
      {errorMessage && (
        <div className="text-sm sm:text-lg text-red-600">{errorMessage}</div>
      )}
      {editIndex === null && (
        <div className="mb-4.5 flex items-center gap-6">
          <label className="mb-2.5 font-medium block text-black dark:text-white">
            Is Active
          </label>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={isActive}
              onChange={(e) => handleIsActiveModalChange(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
          </div>
        </div>
      )}

      <div className="border-t border-gray-300 opacity-25 mt-6 mb-6"></div>
      <div className="flex items-center mt-6 space-x-4 rtl:space-x-reverse">
        <button
          data-modal-hide="progress-modal"
          type="button"
          className="flex text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={handleActionClick}
        >
          {editIndex !== null ? 'Update' : 'Submit'}
        </button>
        <button
          data-modal-hide="progress-modal"
          type="button"
          className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
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
