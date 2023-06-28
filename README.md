# Phone Number Input #

This is a phone number input component that uses [libphonenumber-js](https://www.npmjs.com/package/libphonenumber-js) to validate and format as you type. The input includes a dial code selection dropdown and a search feature.

## Install ##
1. Add package to working project
```
yarn add @bebeau/phone-number-input
```
```
npm install @bebeau/phone-number-input
```
2. Import into project
```
import PhoneNumberInput from '@bebeau/phone-number-input';
```
3. Set useState for phone number input value
```
const [phone, setPhone] = useState('');
```
4. Use the component
```
<PhoneNumberInput
  onInputChange={(value) => setPhone(value)}
>
```

## Example ##
```
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
```

## Props ##

Prop | Type | Description
|---|---|---|
onInputChange | function | onInputChange is a function that accepts the input value and passes it up to the parent component.

## Styling ##

The styling has been left bare for the most part to sync with the element styles of the project stylesheet it is being used in.

Here is the default [stylesheet](https://github.com/Bebeau/phone-number-input/blob/master/src/assets/scss/phone-number-input.scss).