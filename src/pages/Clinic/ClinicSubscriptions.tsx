import { useState, useEffect } from 'react';
import { postData } from '../../Networking/Api';
import { useParams } from 'react-router-dom';

interface Subscription {
  SrNo: number;
  name: string;
  start_date: string;
  end_date: string;
  price: number;
  status: boolean;
}

export const ClinicSubscriptions = (props: { clinicId: any }) => {
  const [subscriptionData, setSubscriptionData] = useState<Subscription[]>([]);
  const { clinicId } = useParams();

  const getSubscription = async () => {
    try {
      const payload = {
        modelName: 'clinic_subscriptions',
        whereCondition: {
          clinic_id: clinicId,
        },
        relations: [
          {
            module: 'subscription_masters',
          },
        ],
      };
      console.log('id-->', props.clinicId);
      const response = await postData('masters/getMasterList', payload);
      console.log('Response from API:', response);
      console.log('Res---->', response);

      if (response.code === 1) {
        const formattedSubscriptions = response.data.map((subscription) => {
          const name = subscription.subscription_master
            ? subscription.subscription_master.name
            : '';
          console.log('Name:', name);
          // Format start_date
          const startDateParts = subscription.start_date
            .split('T')[0]
            .split('-');
          const formattedStartDate = `${startDateParts[2]}-${startDateParts[1]}-${startDateParts[0]}`;

          // Format end_date
          const endDateParts = subscription.end_date.split('T')[0].split('-');
          const formattedEndDate = `${endDateParts[2]}-${endDateParts[1]}-${endDateParts[0]}`;
          return {
            ...subscription,
            start_date: formattedStartDate,
            end_date: formattedEndDate,
            name: name,
          };
        });
        setSubscriptionData(formattedSubscriptions);
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

  useEffect(() => {
    getSubscription();
  }, []);

  if (subscriptionData.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="py-6 px-4 md:px-6 xl:px-7.5 ">
        <h4 className="text-xl font-semibold text-black dark:text-white ">
          Clinic Subscription
        </h4>
      </div>

      <div className="grid grid-cols-6 gap-x-4 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5">
        <div className="hidden sm:block sm:col-span-1 flex items-center justify-center">
          <p className="font-xl font-bold">Sr.No.</p>
        </div>
        <div className="col-span-1.5 sm:col-span-1 flex items-center justify-center break-all">
          <p className="font-xl font-bold ">Subscription</p>
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <p className="font-xl font-bold">Start Date</p>
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <p className="font-xl font-bold">End Date</p>
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <p className="font-xl font-bold">Price</p>
        </div>
        <div className="col-span-1.5 flex items-center justify-center">
          <p className="font-xl font-bold">Status</p>
        </div>
      </div>

      {subscriptionData.map((subscription, key) => (
        <div
          className="grid grid-cols-6 grid-auto-flow-row dense gap-x-4 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5"
          key={key}
        >
          <div className="hidden sm:block sm:col-span-1 flex items-center justify-center">
            <p className="text-sm text-black dark:text-white">{key + 1}</p>
          </div>
          <div className="col-span-1.5 sm:col-span-1 flex items-center justify-center">
            <p className="text-sm text-black dark:text-white">
              {subscription.subscription_masters.name}
            </p>
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <p className="text-sm text-black dark:text-white break-all">
              {subscription.start_date}
            </p>
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <p className="text-sm text-black dark:text-white break-all">
              {subscription.end_date}
            </p>
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <p className="text-sm text-black dark:text-white">
              {subscription.price}
            </p>
          </div>
          <div className="col-span-1.5 flex items-center justify-center">
            <p className="text-sm text-black dark:text-white">
              {subscription.status ? 'Active' : 'InActive'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
