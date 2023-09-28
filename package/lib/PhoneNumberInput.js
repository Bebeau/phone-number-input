import React, { useState, useEffect, useRef } from 'react';
import data from './assets/data/countryData';
import { ReactComponent as YesIcon } from './assets/img/yes.svg';
import { ReactComponent as NoIcon } from './assets/img/no.svg';
import { ReactComponent as SearchIcon } from './assets/img/search.svg';
import './assets/css/phone-number-input.css';
import { parsePhoneNumber, parseIncompletePhoneNumber, isPossiblePhoneNumber, validatePhoneNumberLength, AsYouType } from 'libphonenumber-js';
const PhoneNumberInput = (props) => {
    const dropdownRef = useRef();
    const [countryData, setCountryData] = useState(data);
    const [countryAbbr, setCountryAbbr] = useState();
    const [dialCode, setDialCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [searchVal, setSearchVal] = useState('');
    const [isPossibleNumber, setIsPossibleNumber] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDropdown(false);
        }
    };
    const handleBtnClick = () => {
        setShowDropdown(!showDropdown);
    };
    const searchCountries = (event) => {
        let input = event.target.value, searchVal = input.charAt(0).toUpperCase() + input.slice(1), results = data.filter(country => country.name.includes(searchVal));
        setCountryData(results);
        setSearchVal(searchVal);
    };
    const onCountryChange = (country) => {
        setCountryAbbr(country.code);
        setShowDropdown(!showDropdown);
        setDialCode(country.dial_code);
        setPhoneNumber(parseIncompletePhoneNumber(phoneNumber));
    };
    const onPhoneChange = (event) => {
        if (validatePhoneNumberLength(event.target.value, countryAbbr) === 'TOO_LONG') {
            return;
        }
        let number = new AsYouType(countryAbbr).input(event.target.value);
        if (validatePhoneNumberLength(event.target.value, countryAbbr) === 'TOO_SHORT') {
            number = event.target.value;
        }
        if (isPossiblePhoneNumber(number, countryAbbr)) {
            props.onInputChange(parsePhoneNumber(number, countryAbbr).number);
        }
        if (!isPossiblePhoneNumber(number, countryAbbr)) {
            props.onInputChange(number);
        }
        setPhoneNumber(number);
    };
    useEffect(() => {
        setCountryAbbr(navigator.language ? navigator.language.replace("en-", "").toUpperCase() : 'US');
        window.addEventListener('mousedown', (e) => handleClickOutside(e));
        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    useEffect(() => {
        if (props.value) {
            let phone = parsePhoneNumber(props.value);
            setCountryAbbr(phone.country ? phone.country : navigator.language ? navigator.language.replace("en-", "").toUpperCase() : 'US');
            setPhoneNumber(phone.formatNational());
        }
    }, [props.value]);
    useEffect(() => {
        if (countryAbbr) {
            let match = countryData.filter(country => country.code.includes(countryAbbr))[0];
            if (match) {
                setDialCode(match.dial_code);
            }
        }
        if (isPossiblePhoneNumber(phoneNumber, countryAbbr)) {
            return setIsPossibleNumber(true);
        }
        setIsPossibleNumber(false);
    }, [countryData, phoneNumber, countryAbbr]);
    return (React.createElement("div", { className: "phone-number-input" },
        React.createElement("div", { className: showDropdown ? 'in dd-menu' : 'dd-menu', ref: dropdownRef },
            React.createElement("div", { className: "dd-wrap" },
                React.createElement("div", { className: "dd-search" },
                    React.createElement("section", null,
                        React.createElement("input", { type: "text", name: "flagSearch", placeholder: "Search...", autoComplete: "off", onChange: (e) => searchCountries(e), value: searchVal }),
                        React.createElement(SearchIcon, { className: "search icon" }))),
                React.createElement("div", { className: "dd-results" }, countryData.map((country, index) => React.createElement("article", { key: index, onClick: () => onCountryChange(country) },
                    React.createElement("img", { src: 'https://flagcdn.com/' + country.code.toString().toLowerCase() + '.svg', alt: country.name }),
                    React.createElement("span", { className: "countryName" }, country.name)))))),
        React.createElement("div", { className: "input-wrap" },
            phoneNumber && isPossibleNumber && (React.createElement(YesIcon, { className: "yes icon" })),
            phoneNumber && !isPossibleNumber && (React.createElement(NoIcon, { className: "no icon" })),
            React.createElement("button", { type: "button", tabIndex: -1, onClick: () => handleBtnClick() }, dialCode),
            React.createElement("input", { type: "tel", value: phoneNumber, onChange: onPhoneChange, placeholder: props.placeholder ? props.placeholder : 'phone number' }))));
};
export default PhoneNumberInput;
