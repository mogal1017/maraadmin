import React, { useEffect, useState } from 'react';
import { postData } from '../../Networking/Api';
import { useParams } from 'react-router-dom';

interface InsuranceData {
  insurance_provider_id: number;
  insurance_master: {
    insurance_name: string;
    health_insurance_carrier_name: string;
  };
}

interface CarrierData {
  id: number;
  name: string;
  is_active: number;
}

export const ClinicInsurance = (props: any) => {
  const [insuranceData, setInsuranceData] = useState<InsuranceData[]>([]);
  const [carriers, setCarriers] = useState<CarrierData[]>([]);
  const { clinicId } = useParams();

  const getClinicInsurance = async () => {
    try {
      const payload = {
        modelName: 'clinic_insurances',
        whereCondition: {
          clinic_id: clinicId,
        },
        relations: [
          {
            module: 'insurance_masters',
          },
        ],
      };
      const response = await postData('masters/getMasterList', payload);
      console.log('Response from API:', response);
      if (response.code === 1) {
        setInsuranceData(response.data);
      } else {
        console.error('Error:', response.message);
      }
    } catch (error) {
      console.error(
        'An error occurred while fetching clinic insurance listing:',
        error,
      );
    }
  };

  const fetchCarriers = async () => {
    try {
      const payload = {
        modelName: 'health_insurance_carrier_master',
        pagination: {
          page: 1,
          pageSize: 100, // Adjust the pageSize if necessary
        },
      };

      const response = await postData('masters/getMasterList', payload);

      if (response.status === 200) {
        const activeCarriers = response.data.filter(
          (carrier) => carrier.is_active === 1,
        );
        setCarriers(activeCarriers);
      } else {
        console.error('Failed to fetch carriers:', response.status);
      }
    } catch (error) {
      console.error('An error occurred while fetching carriers:', error);
    }
  };

  const getCarrierName = (carrierId: number) => {
    const carrier = carriers.find((carrier) => carrier.id === carrierId);
    return carrier ? carrier.health_insurance_carrier_name : 'Unknown Carrier';
  };

  useEffect(() => {
    getClinicInsurance();
    fetchCarriers();
  }, [clinicId]);

  if (insuranceData.length === 0) {
    return null;
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-screen-lg">
        <div className="py-6 px-4 md:px-6 xl:px-7.5">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Clinic Insurance
          </h4>
        </div>

        <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
          <div className="hidden sm:block col-span-1 flex items-center justify-center">
            <p className="font-xl font-bold">Sr.No.</p>
          </div>

          <div className="col-span-3 flex items-center justify-center">
            <p className="font-xl font-bold">Health Insurance Carrier Name</p>
          </div>
          <div className="col-span-3 flex items-center justify-center">
            <p className="font-xl font-bold">Insurance Plan</p>
          </div>
        </div>

        {insuranceData.map((insurance, index) => (
          <div
            className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
            key={index}
          >
            <div className="hidden sm:block col-span-1 flex items-center justify-center">
              <p className="text-sm text-black dark:text-white">{index + 1}</p>
            </div>

            <div className="col-span-3 flex items-center justify-center">
              <p className="text-sm text-black dark:text-white">
                {getCarrierName(
                  insurance.insurance_masters
                    ?.health_insurance_carrier_master_id,
                )}
              </p>
            </div>
            <div className="col-span-3 flex items-center justify-center">
              <p className="text-sm text-black dark:text-white">
                {insurance.insurance_masters?.insurance_name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
