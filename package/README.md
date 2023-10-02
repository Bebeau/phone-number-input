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
3. Use the component
```
<PhoneNumberInput
  onInputChange={(data: {
    number: string,
    isValid: boolean
  }) => handlePhoneChange(data)}
  value="PHONE INPUT VALUE GOES HERE"
  placeholder="Phone Number"
>
```

## Props ##

Prop | Type | Description
|---|---|---|
onInputChange | function | onInputChange is a function that passes a data object `{number: string, isValid: boolean}` up to the parent component.

## Example ##
```
import react, {useState, useEffect} from 'react';
import PhoneNumberInput from '@bebeau/phone-number-input';

const Demo = () => {
  const [phone, setPhone] = useState<string>('');
  
  const handlePhoneUpdate = (data: any) => {
    setPhone(data.number);
  }

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
```

## Styling ##

The styling has been left bare for the most part to sync with the element styles of the project stylesheet it is being used in.

Here is the default [stylesheet](https://github.com/Bebeau/phone-number-input/blob/master/src/assets/scss/phone-number-input.scss).