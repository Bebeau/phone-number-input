import React, {useState, useEffect} from 'react';
import PhoneNumberInput from './PhoneNumberInput';

const Demo = () => {
  const [phone, setPhone] = useState<string>('');

  const handlePhoneUpdate = (data: any) => {
    console.log(data);
    setPhone(data.number);
  }

  useEffect(() => {
    setTimeout(() => setPhone('+3580850230943'), 1000);
  }, []);

  return (
    <PhoneNumberInput 
      onInputChange={(data: {
        number: string,
        isValid: boolean
      }) => handlePhoneUpdate(data)}
      value={phone}
      placeholder='phone'
    />
  );

}

export default Demo;
