//Vendors ---> Visa B2B API (who they spend money with & zip codes + FEMA)
//---> if vendor is in disaster zone, notify and recommend to contact them
//Corporate Office ---> FEMA API
//---> if corporate office is in disaster zone alert of emergency weather event
//Plug & Play email ---> FEMA API + Authorize.Net API + COUPON/EMERGENCY code + scripted letter by us
//Authorize API Login ID = 4j2Q295YbY9
//Authorize Transaction Key = 25647BuFcMEehg48
//Authorize key = Simon

'use strict';

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var constants = require('../constants.js');

function getCustomerShippingAddress(customerProfileId, customerAddressId, callback) {

	var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	merchantAuthenticationType.setName(constants.apiLoginKey);
	merchantAuthenticationType.setTransactionKey(constants.transactionKey);
	
	var getRequest = new ApiContracts.GetCustomerShippingAddressRequest();
	getRequest.setMerchantAuthentication(merchantAuthenticationType);
	getRequest.setCustomerProfileId(customerProfileId);
	getRequest.setCustomerAddressId(customerAddressId);

	//pretty print request
	//console.log(JSON.stringify(createRequest.getJSON(), null, 2));
		
	var ctrl = new ApiControllers.GetCustomerShippingAddressController(getRequest.getJSON());

	ctrl.execute(function(){

		var apiResponse = ctrl.getResponse();

		var response = new ApiContracts.GetCustomerShippingAddressResponse(apiResponse);

		//pretty print response
		console.log(JSON.stringify(response, null, 2));

		if(response != null) 
		{
			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK)
			{
				console.log('The customer shipping address is :');
				console.log(response.getAddress().getFirstName() + ' ' + response.getAddress().getLastName());
				console.log(response.getAddress().getAddress());
				console.log(response.getAddress().getCity());
				console.log(response.getAddress().getState());
				var customerzip = response.getAddress().getZip();
				console.log(response.getAddress().getCountry());
			}
			else
			{
				//console.log('Result Code: ' + response.getMessages().getResultCode());
				console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
				console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
			}
		}
		else
		{
			console.log('Null response received');
		}

		callback(response);
	});
}

if (require.main === module) {
	getCustomerShippingAddress('41003872', '38763292', function(){
		console.log('getCustomerShippingAddress call complete.');
	});
}

module.exports.getCustomerShippingAddress = getCustomerShippingAddress;