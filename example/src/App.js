import react, {useState, useEffect} from 'react';
import PhoneNumberInput from '@bebeau/phone-number-input';

const Demo = () => {
  const [phone, setPhone] = useState<string>('');

  const handlePhoneUpdate = (data) => {
    setPhone(data.number);
  }

  useEffect(() => {
    setTimeout(() => setPhone('+155555555555'), 1000);
  }, []);

  return (
    <PhoneNumberInput 
      onInputChange={(data) => handlePhoneUpdate(data)}
      value={phone}
      placeholder='phone'
    />
  );

}

export default Demo;
