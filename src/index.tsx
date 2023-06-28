import React from 'react';
import ReactDOM from 'react-dom/client';
import PhoneNumberInput from './PhoneNumberInput';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const handleInputChange = (value: string) => {
  console.log('VALUE: ', value);
}

root.render(
  <React.StrictMode>
    <PhoneNumberInput 
      onInputChange={(value: string) => handleInputChange(value)}
    />
  </React.StrictMode>
);
