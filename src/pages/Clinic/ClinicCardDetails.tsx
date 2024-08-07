import React from 'react';

export const ClinicCardDeatils = () => {
    const cardDetails = [
        {
            srNo: '1',
            "cardType": "Visa",
            "cardNumber": "411111111111",
            "holderName": "John Doe",
            "expiryDate": "12/25",
            "cardStatus": "Active"
        },
        {
            srNo: '2',
            "cardType": "Mastercard",
            "cardNumber": "55555555555",
            "holderName": "Jane Smith",
            "expiryDate": "06/23",
            "cardStatus": "Active"
        },
        {
            srNo: '3',
            "cardType": "American Express",
            "cardNumber": "378282246310005",
            "holderName": "Mike Johnson",
            "expiryDate": "09/24",
            "cardStatus": "Inactive"
        }
    ];

    return (
        <div>
            <div className="py-6 px-4 md:px-6 xl:px-7.5 remove-right-margin">
                <h4 className="text-xl font-semibold text-black dark:text-white">
                    Clinic Card Details
                </h4>
            </div>

            <div className="grid grid-cols-6 gap-x-4 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5 space-x-2">
                <div className=" hidden sm:block col-span-1 flex items-center justify-center space-x-2">
                    <p className="font-xl font-bold">Sr.No.</p>
                </div>
                <div className="col-span-1 flex items-center justify-center sm:break-all space-x-2">
                    <p className="font-xl font-bold ">Card Type</p>
                </div>
                <div className="col-span-1.5 flex items-center justify-center space-x-2">
                    <p className="font-xl font-bold">Card Number</p>
                </div>
                <div className="col-span-1 flex items-center justify-center space-x-2">
                    <p className="font-xl font-bold">Holder Name</p>
                </div>
                <div className="col-span-1 flex items-center justify-center ">
                    <p className="font-xl font-bold">Expiry Date</p>
                </div>
                <div className="col-span-1.5 flex items-center justify-center">
                    <p className="font-xl font-bold">Card Status</p>
                </div>
            </div>

            {cardDetails.map((card, key) => (
                <div
                    className="grid grid-cols-6 gap-x-4 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5 "
                    key={key}
                >
                    <div className="hidden sm:block col-span-1 flex items-center justify-center">
                        <p className="text-sm text-black dark:text-white">
                            {card.srNo}
                        </p>
                    </div>
                    <div className="col-span-1 flex items-center justify-center sm:break-all">
                        <p className="text-sm text-black dark:text-white break-all">
                            {card.cardType}
                        </p>
                    </div>
                    <div className="col-span-1.5 flex items-center justify-center">
                        <p className=" text-sm text-black dark:text-white break-all">
                            {card.cardNumber}
                        </p>
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                        <p className="text-sm text-black dark:text-white">
                            {card.holderName}
                        </p>
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                        <p className="text-sm text-black dark:text-white">{card.expiryDate}</p>
                    </div>
                    <div className="col-span-1.5 flex items-center justify-center">
                        <p className="text-sm text-black dark:text-white">{card.cardStatus}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};