import React, {useState, useEffect, useRef} from 'react';
import data from './assets/data/countryData';

import {ReactComponent as YesIcon} from './assets/img/yes.svg';
import {ReactComponent as NoIcon} from './assets/img/no.svg';
import {ReactComponent as SearchIcon} from './assets/img/search.svg';

import './assets/css/phone-number-input.css';

import
{
  parsePhoneNumber,
  parseIncompletePhoneNumber,
  isPossiblePhoneNumber,
  validatePhoneNumberLength,
  CountryCode,
  AsYouType
} from 'libphonenumber-js';

interface countryData {
  name: string,
  dial_code: string,
  code: string,
}

const PhoneNumberInput = (props: {
  onInputChange: (data: {
    number: string,
    isValid: boolean
  }) => void,
  value?: string,
  placeholder?: string,
}) => {
  const defaultRef = useRef<boolean>(false);
  const dropdownRef = useRef<any>();

  const [countryData, setCountryData] = useState<countryData[]>(data);
  const [countryAbbr, setCountryAbbr] = useState<string | undefined>();
  const [dialCode, setDialCode] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [searchVal, setSearchVal] = useState<string>('');
  const [isPossibleNumber, setIsPossibleNumber] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  }

  const handleBtnClick = () => {
    setShowDropdown(!showDropdown);
  }

  const searchCountries = (event: any) => {
		let input = event.target.value,
        searchVal = input.charAt(0).toUpperCase() + input.slice(1),
        results = data.filter(country => country.name.includes(searchVal));
    setCountryData(results);
    setSearchVal(searchVal);
	}

  const onCountryChange = (country: countryData) => {
    setCountryAbbr(country.code);
    setShowDropdown(!showDropdown);
    setDialCode(country.dial_code);
    setPhoneNumber(parseIncompletePhoneNumber(phoneNumber));
	}

  const onPhoneChange = (event: any) => {
    if (validatePhoneNumberLength(event.target.value, countryAbbr as CountryCode) === 'TOO_LONG') {
      return;
    }

    let number = new AsYouType(countryAbbr as CountryCode).input(event.target.value);
    if (validatePhoneNumberLength(event.target.value, countryAbbr as CountryCode) === 'TOO_SHORT') {
      number = event.target.value;
    }

    setPhoneNumber(number);
	}

  useEffect(() => {
    setCountryAbbr(navigator.language ? navigator.language.replace("en-","").toUpperCase() : 'US');
    window.addEventListener('mousedown', (e) => handleClickOutside(e));
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (props.value && countryAbbr) {

      if (
        validatePhoneNumberLength(props.value, countryAbbr as CountryCode) === 'TOO_LONG' ||
        validatePhoneNumberLength(props.value, countryAbbr as CountryCode) === 'TOO_SHORT'
        ) {
          return setPhoneNumber(parseIncompletePhoneNumber(props.value));
      }
      
      try {
        let phone = parsePhoneNumber(props.value, countryAbbr as CountryCode);
        if (phone.country) {
          setCountryAbbr(phone.country);
        }
        setPhoneNumber(phone.formatNational());
      } catch (err) {
        console.error(err);
        setPhoneNumber(parseIncompletePhoneNumber(props.value));
      }
      
    }
  }, [props.value]);

  useEffect(() => {

    if (countryAbbr) {
      let match = countryData.filter(country => country.code.includes(countryAbbr))[0];
      
      if (match) {
        setDialCode(match.dial_code);
      }
    }

    if (isPossiblePhoneNumber(phoneNumber, countryAbbr as CountryCode)) {
      let data =  {
        number: parsePhoneNumber(phoneNumber, countryAbbr as CountryCode).number,
        isValid: true
      }
      props.onInputChange(data);
      return setIsPossibleNumber(true);
    }

    let data = {
      number: phoneNumber,
      isValid: false
    }
    props.onInputChange(data);
    setIsPossibleNumber(false);

  }, [countryData, phoneNumber, countryAbbr]);

  return (
    <div className="phone-number-input">

      <div className={showDropdown  ? 'in dd-menu': 'dd-menu'} ref={dropdownRef}>
        <div className="dd-wrap">
          <div className="dd-search">
            <section>
              <input 
                type="text" 
                name="flagSearch" 
                placeholder="Search..." 
                autoComplete="off"
                onChange={(e) => searchCountries(e)}
                value={searchVal}
              />
              <SearchIcon className="search icon"/>
            </section>
          </div>
          <div className="dd-results">
            {countryData.map((country, index) => 
              <article 
                key={index}
                onClick={() => onCountryChange(country)}
                >
                <img 
                  src={'https://flagcdn.com/'+country.code.toString().toLowerCase()+'.svg'}
                  alt={country.name} 
                />
                <span className="countryName">
                  {country.name}
                </span>
              </article>
            )}
          </div>
        </div>
      </div>
      
      <div className="input-wrap">
        {phoneNumber && isPossibleNumber && (
          <YesIcon className="yes icon"/>
        )}
        {phoneNumber && !isPossibleNumber && (
          <NoIcon className="no icon"/>
        )}

        <button
          type="button"
          tabIndex={-1}
          onClick={() => handleBtnClick()}>
          {dialCode}
        </button>

        <input
          type="tel"
          value={phoneNumber ? phoneNumber : ''}
          onChange={onPhoneChange}
          placeholder={props.placeholder ? props.placeholder : 'phone number'}
        />
      </div>

    </div>
  );
}

export default PhoneNumberInput;
