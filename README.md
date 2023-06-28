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

## Props ##

Prop | Type | Description
|---|---|---|
onInputChange | (value: string) => VOID | onInputChange is a function that passes the value up to the parent component. It is used to set the value of the phone number input.