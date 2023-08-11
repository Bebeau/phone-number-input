import React from 'react';
import ReactDOM from 'react-dom/client';
import PhoneNumberInput from './PhoneNumberInput';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const handleInputChange = (value: string) => {
  console.log('PHONE INPUT VALUE: ', value);
}

root.render(
  <React.StrictMode>
    <PhoneNumberInput 
      onInputChange={(info) => handleInputChange(info)}
      value='+18039993049'
      placeholder='Testing'
    />
  </React.StrictMode>
);
