var env = 'testing';
var baseUrl = '';
var apiURL1 = '';
if (env == 'testing') {
  baseUrl = 'https://samarawellapi.disctesting.in/api/';
  //baseUrl = 'https://api.samarawell.com/api/';   //production url

  apiURL1 = 'https://samarawellapi.disctesting.in';
  //apiURL1 = 'https://api.samarawell.com';        //production url
} else {
  baseUrl = '';
}
export var apiURL = apiURL1;


export const postData = async (apiName: string, data: string) => {
  var options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), // Ensure data is JSON stringified
  };

  try {
    const response = await fetch(baseUrl + apiName, options);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
