import React, { useState, useEffect, useRef } from 'react';
import data from './assets/data/countryData';
import { ReactComponent as YesIcon } from './assets/img/yes.svg';
import { ReactComponent as NoIcon } from './assets/img/no.svg';
import { ReactComponent as SearchIcon } from './assets/img/search.svg';
import './assets/css/phone-number-input.css';
import { parseIncompletePhoneNumber, isPossiblePhoneNumber, validatePhoneNumberLength, AsYouType, } from 'libphonenumber-js';
const PhoneNumberInput = (props) => {
    const dropdownRef = useRef();
    const [countryData, setCountryData] = useState(data);
    const [countryAbbr, setCountryAbbr] = useState('');
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
    const toggleDropdown = () => {
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
            return setPhoneNumber(phoneNumber);
        }
        const number = new AsYouType(countryAbbr).input(event.target.value);
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
        if (countryAbbr !== '') {
            let match = countryData.filter(country => country.code.includes(countryAbbr))[0];
            setDialCode(match.dial_code);
        }
    }, [countryAbbr, countryData]);
    useEffect(() => {
        props.onInputChange(phoneNumber);
        if (isPossiblePhoneNumber(phoneNumber, countryAbbr)) {
            return setIsPossibleNumber(true);
        }
        setIsPossibleNumber(false);
    }, [phoneNumber, countryAbbr]);
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
            React.createElement("button", { className: "btn btn-default btn-lg btn-dropdown", type: "button", onClick: toggleDropdown }, dialCode),
            React.createElement("input", { placeholder: "Phone Number", type: "tel", value: phoneNumber, onChange: onPhoneChange }))));
};
export default PhoneNumberInput;
