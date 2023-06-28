import react, {useState, useEffect} from 'react';
import PhoneNumberInput from '@bebeau/phone-number-input';

const Demo = () => {
  const [phone, setPhone] = useState('');
  
  useEffect(() => {
    console.log('PHONE: ', phone);
  }, [phone]);

  return (
    <PhoneNumberInput 
      onInputChange={(value) => setPhone(value)}
    />
  );

}

export default Demo;
