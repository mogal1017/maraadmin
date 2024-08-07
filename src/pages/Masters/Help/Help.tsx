import React, { useState, useEffect, useCallback } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import DataTable from 'react-data-table-component';
import { BsFillPencilFill } from 'react-icons/bs';
import { Switch } from '@headlessui/react';
import Swal from 'sweetalert2';
import Loader from '../../../common/Loader';
import { useNavigate } from 'react-router-dom';
import { postData } from '../../../Networking/Api';
import debounce from 'lodash.debounce';

export const Help = () => {
  const [helpData, setHelpData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchHelpData = async (pageNumber: number = 1) => {
    try {
      // setLoading(true);
      const pagination = {
        page: pageNumber,
        pageSize: recordsPerPage,
      };
      const search = {
        field_name: ['title', 'sr.no'],
        searchKeyword: searchKeyword,
      };
      const payload = {
        modelName: 'free_text_details',
        pagination: pagination,
        search: search,
      };
      const response = await postData('masters/getMasterList', payload);
      const sortedData = response.data.sort((a, b) => a.sequence - b.sequence);
      setHelpData(sortedData);
      setTotalRecords(response.count);
    } catch (error) {
      console.error('Error fetching testimonial data:', error);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while fetching data. Please try again later.',
        icon: 'error',
        showConfirmButton: true,
      });
    } finally {
      // setLoading(false);
    }
  };

  const debouncedGetListing = useCallback(debounce(fetchHelpData, 500), [
    searchKeyword,
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
    setPageNumber(1);
    debouncedGetListing(1);
  };
  useEffect(() => {
    fetchHelpData(currentPage);
  }, [currentPage, recordsPerPage, searchKeyword]);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const columns = [
    {
      name: 'Sr No.',
      selector: (_row: any, index: number) =>
        index + 1 + (currentPage - 1) * recordsPerPage,
      sortable: false,
    },
    {
      name: 'Title',
      selector: 'title',
      sortable: true,
    },
    {
      name: 'Status',
      selector: 'is_active',
      sortable: true,
      cell: (row: { is_active: boolean | undefined; id: any }) => (
        <div className="flex items-center">
          <Switch
            checked={row.is_active}
            onChange={(checked) => handleIsActiveChange(row.id, checked)}
            className={`${
              row.is_active ? 'bg-green-600' : 'bg-red-500'
            } relative inline-flex items-center h-8 rounded-full w-20 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            <span className="absolute left-2 sm:left-1">
              {row.is_active ? 'Active' : ''}
            </span>
            <span
              className={`${
                row.is_active ? 'translate-x-12' : 'translate-x-1'
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
      cell: (row: { id: any }) => (
        <div className="flex justify-center items-center">
          <BsFillPencilFill
            className="cursor-pointer mr-2"
            title="Edit"
            onClick={() => navigate(`/Help/EditHelp/${row.id}`)}
          />
        </div>
      ),
    },
  ];

  const handleIsActiveChange = async (id: any, checked: boolean) => {
    try {
      setLoading(true);

      const payload = {
        modelName: 'free_text_details',
        id: id,
        inputData: {
          is_active: checked ? 1 : 0,
        },
      };

      const response = await postData('masters/createAndUpdateMaster', payload);
      const updatedhelpData = helpData.map((blog) => {
        if (blog.id === id) {
          return {
            ...blog,
            is_active: response.data.is_active,
          };
        }
        return blog;
      });
      setHelpData(updatedhelpData);
      Swal.fire({
        title: 'Success',
        text: 'Status Changed Successfully',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('An error occurred while updating isActive:', error);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred. Please try again later.',
        icon: 'error',
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecordsPerPageChange = (value: React.SetStateAction<number>) => {
    setRecordsPerPage(value);
    setCurrentPage(1); // Reset current page when changing records per page
  };

  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <DefaultLayout>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Breadcrumb pageName={'Help List'} />
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="flex justify-end pb-2">
              <button
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => navigate(`/Help/CreateHelp`)}
              >
                Add Help
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
              data={helpData}
              pagination={false}
              paginationPerPage={recordsPerPage}
              progressPending={loading}
              customStyles={{
                headRow: {
                  style: {
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
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
        </>
      )}
    </DefaultLayout>
  );
};
function setPageNumber(arg0: number) {
  throw new Error('Function not implemented.');
}
