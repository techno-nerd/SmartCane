import { resizeBase64Image } from './ImageUtils';


const SERVER_ADDRESS = "http://172.20.10.2:8000"


const getPrediction = async (base64) => {
  const response = await fetch(SERVER_ADDRESS+'/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "image": await resizeBase64Image(base64) }),
  });

  if (response.ok) {
    const data = await response.json();
    console.log('Prediction:', data.prediction);
    return data.prediction;
  } 
  else {
      console.error('Error with prediction request:', response.status);
  }
}


const getDescription = async (base64) => {
  const response = await fetch(SERVER_ADDRESS+'/describe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "image": await resizeBase64Image(base64) }),
  });

  if (response.ok) {
    console.log('Description request successful');
    const data = await response.json();
    return JSON.parse(data);
  } 
  else {
      console.error('Error with description request:', response.status);
  }

}

export { getPrediction, getDescription };
