'use strict';

class PhoneNumberInput extends React.Component {
	
	constructor(props) {
		super(props);
	
		this.state = {
			countryData: countryData,
			countryName: '',
			countryCode: '',
			dialCode: '',
			phoneNumber: '',
			searchVal: '',
			isPossibleNumber: false,
			showDropdown: false,
			isSearching: false
		};

		this.onPhoneChange = this.onPhoneChange.bind(this);
		this.onCountryChange = this.onCountryChange.bind(this);
		this.toggleDropdown = this.toggleDropdown.bind(this);
		this.searchCountries = this.searchCountries.bind(this);
		this.clearInput = this.clearInput.bind(this);
		this.handleClickOutside = this.handleClickOutside.bind(this);
	}
	componentDidMount() {
		let countryCode = navigator.language ? navigator.language.replace("en-","").toUpperCase() : 'US',
			match = countryData.filter(country => country.code.includes(countryCode))[0],
			dialCode = libphonenumber.getCountryCallingCode(countryCode);
		this.setState({
			countryName: match.name,
			countryCode: countryCode,
			dialCode: dialCode
		});
		document.addEventListener('mousedown', this.handleClickOutside);
		$("body").trigger($.Event( "isValidPhoneNumber", { isPossibleNumber: false } ));
	}
	componentDidUpdate(prevState) {
	   	if (prevState.isPossibleNumber !== this.state.isPossibleNumber) {
	   		$("body").trigger($.Event( "isValidPhoneNumber", { isPossibleNumber: this.state.isPossibleNumber } ));
	   	}
	}
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }
    componentDidCatch(error, errorInfo) {
	    this.setState({
			error: error,
			errorInfo: errorInfo,
	    });
	}
    handleClickOutside(event) {
    	let dropdown = document.getElementsByClassName("dd-menu")[0];
    	if (dropdown && !dropdown.contains(event.target)) {
            this.setState({
				showDropdown: false
			});
        }
    }
	onPhoneChange(event) {
		let code = this.state.countryCode.toUpperCase(),
			number = libphonenumber.parseIncompletePhoneNumber(event.target.value, code),
			limit = new libphonenumber.Metadata().metadata.countries[code][3].slice(-1)[0];

			if(number.length > limit) {
	    		number = number.substring(0,limit);
	    	}

			let isPossible = libphonenumber.isPossiblePhoneNumber(number, code);
			if(isPossible) {
				$("body").trigger($.Event( "isValidPhoneNumber", { isPossibleNumber: true } ));
				number = libphonenumber.parsePhoneNumber(number, code).format("NATIONAL");
			}

		this.setState({
			phoneNumber: number,
			isPossibleNumber: isPossible
		});
	}
	onCountryChange(event) {
		let option = event.target.closest("article"),
			code = option.dataset.code,
			dialCode = libphonenumber.getCountryCallingCode(code),
			limit = new libphonenumber.Metadata().metadata.countries[code][3].slice(-1)[0],
			number = this.state.phoneNumber;
			
			if(number.length > limit) {
	    		number = number.substring(0,limit);
	    	}

			let isPossible = libphonenumber.isPossiblePhoneNumber(number, code);
			if(isPossible) {
				number = libphonenumber.parsePhoneNumber(number, code).format("NATIONAL");
			}
			
		this.setState({
			countryName: option.dataset.country,
			countryCode: option.dataset.code,
			showDropdown: !this.state.showDropdown,
			dialCode: dialCode,
			phoneNumber: number,
			isPossibleNumber: isPossible
		});
	}
	toggleDropdown() {
		this.setState({
			showDropdown: !this.state.showDropdown
		});
	}
	searchCountries(event) {
		let input = event.target.value,
			searchVal = input.charAt(0).toUpperCase() + input.slice(1),
			results = countryData.filter(country => country.name.includes(searchVal)),
			isSearching = false;
		if(event.target.value) {
			isSearching = true;
		}
		this.setState({
			countryData: results,
			isSearching: isSearching,
			searchVal: searchVal
		});
	}
	clearInput() {
		this.setState({
			countryData: countryData,
			isSearching: !this.state.showDropdown,
			searchVal: ""
		});
	}
	render() {
		if (this.state.errorInfo) {
			return (
				<div>
					<h2>Something went wrong.</h2>
					<details style={{ whiteSpace: 'pre-wrap' }}>
						{this.state.error && this.state.error.toString()}
						<br />
						{this.state.errorInfo.componentStack}
					</details>
				</div>
			);
	    }
		return (
			<div className="phone">
				<div className="input-group">
					<button 
						className="btn btn-default btn-lg btn-dropdown" 
						type="button"
						onClick={this.toggleDropdown}
					>
						+{this.state.dialCode}
					</button>
					<div className={this.state.showDropdown  ? 'in dd-menu': 'dd-menu'}>
						<div className="dd-wrap">
							<div className="dd-search">
								<input 
									type="text" 
									name="flagSearch" 
									placeholder="Search..." 
									autoComplete="off"
									onChange={this.searchCountries}
									value={this.state.searchVal}
								/>
								<i className={this.state.isSearching  ? 'icon-close': 'icon-search'} onClick={this.clearInput}></i>
							</div>
							<div className="dd-results" ref={this.box}>
								{this.state.countryData.map((country, index) => 
									<article 
										key={index}
										data-code={country.code}
										data-country={country.name}
										onClick={this.onCountryChange}
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
					<input type="hidden" name="dialCode" value={this.state.dialCode} />
					<div className="form-label-group">
						{this.state.phoneNumber ? (
				            <i className={this.state.isPossibleNumber  ? 'status icon-check': 'status icon-na'}></i>
				        ) : null}
						<input 
							className="form-control input-lg w-100" 
							name="telephone"
							placeholder="Phone Number" 
							type="tel"
							value={this.state.phoneNumber}
		              		onChange={this.onPhoneChange}
		              		onKeyDown={this.onKeyDown}
		              	/>
		           		<label>Phone Number</label>
		           	</div>
				</div>
			</div>
		);
	}
}

const targetElms = document.getElementsByClassName("phone-number-input");
Array.prototype.forEach.call(targetElms, function(domContainer) {
	ReactDOM.render(
      <PhoneNumberInput {...domContainer.dataset} />, domContainer
    );
});
