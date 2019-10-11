/**
* @method formatGetUserProfileResult 
* @description Used to format user profile deatils
*/

export function formatGetUserProfileResult(result) {
    let actObj = {
        roles: result.data.roles,
        _id: result.data._id,
        isActive: result.data.isActive,
        email: result.data.email,
        phone: result.data.phone,
        firstname: result.data.firstname,
        lastname: result.data.lastname,
        profileImage: result.data.imageId,
        token: result.data.token
    };
    return actObj;
}


/**
* @method formatGetSiteDataResult 
* @description Used to format site data
*/

export function formatGetSiteDataResult(result) {
    const data = {};
    data.name = result.name;
    data.location = result.location;
    data.isEnabled = result.isEnabled;
    data.organisation = result.organisation;
    return data;
}


/**
* @method formatGetallOrganisationDataResult 
* @description Used to format organization data
*/

export function formatGetallOrganisationDataResult(result) {
    const organisation = result;
    let organisationResponse = [];
    organisation.map((val) => {
        let organisationData = {};
        organisationData.name = val.name;
        organisationData.id = val._id;
        organisationData.organisationImage = val.imageId;
        organisationResponse.push(organisationData);
    });
    return organisationResponse;
}


/**
* @method formatGetSingleAssetDataResult 
* @description Used to format single assets data
*/

export function formatGetSingleAssetDataResult(result) {
    let singleAssetData = [];
    const singleAsset = {};
    singleAsset.name = result.name;
    singleAsset.location = result.location;
    singleAssetData.push(singleAsset);
    return singleAssetData;
}

/**
* @method formatGetCompanyProfileResult 
* @description Used to format comapny profile
*/

export function formatGetCompanyProfileResult(result) {
    const data = result;
    if (result._id) {
        let actObj = {
            productionProfileImage: result.profileMedia.uniqueFilename,
            productionHeadshotImage: result.headshotMedia.uniqueFilename,
            directorDetails: result.directorDetails,
            producerDetails: result.producerDetails,
            conductorDetails: result.conductorDetails,
            published: result.published,
            listingLevel: result.listingLevel,
            listingOwnerPrivatePhone: result.listingOwnerPrivatePhone ? result.listingOwnerPrivatePhone : '',
            listingOwnerPrivateEmail: result.listingOwnerPrivateEmail,
            listingOwnerPrivateFullName: result.listingOwnerPrivateFullName,
            otherLink: result.otherLink,
            musicallyLink: result.musicallyLink,
            youtubeLink: result.youtubeLink,
            instagramLink: result.instagramLink,
            twitterLink: result.twitterLink,
            facebookLink: result.facebookLink,
            website: result.website,
            data: result.data,
            services: result.services,
            longDescription: result.longDescription,
            shortDescription: result.shortDescription,
            publicEmail: result.publicEmail,
            publicTollFree: result.publicTollFree,
            publicPhone: result.publicPhone,
            categories: result.categories ? result.categories : [],
            country: result.country,
            zipCode: result.zipCode,
            state: result.state,
            city: result.city,
            address: result.address,
            listingType: result.listingType ? result.listingType : [],
            name: result.name,
            profileType: 'Premium' // Not available in api
        };
        return actObj;
    }
    return null;
}


/**
* @method getPriviligedDeviceList 
* @description used to get device list which have access privilege
*/

export function getPriviligedDeviceList(response, organisationId) {
    /**
    * Checking organiztion array have id's then 
    * response all the formated assets
    */
    const formatedDeviceList = formatGetDevicesDataResult(response[0].data);
    if (response[1].data.organisations.length > 0 && response[1].data.organisations.includes(organisationId)) {
        /** If a user has organisation permission  */
        return formatedDeviceList;
    } else {
        /**
        * Checking privileged assets have id then filtering 
        * assets from all asssets and response all the 
        * formated asssets (We have to get  matched object from two object)
        */
        if (response[1].data.assets.length > 0) {
            const privilegedAssetes = formatedDeviceList.filter((el) => {
                return response[1].data.assets.some((f) => {
                    return f === el.assetDetail._id;
                });
            });
            return privilegedAssetes;
        } else {
            /** No permission is assigned to the user */
            return [];
        }
    }
}

/**
* @method formatGetDevicesDataResult 
* @description Used to format assets data
*/

export function formatGetDevicesDataResult(result) {
    const devices = result;
    const newResponse = [];
    devices.map((val) => {
        const deviceData = {};
        deviceData.deviceId = val._id;
        deviceData.assetDetail = val.asset;
        deviceData.deviceTypeDisplayName = val.deviceType.displayName;
        deviceData.displayName = val.displayName;
        deviceData.isEnabled = val.isEnabled;
        newResponse.push(deviceData);
    });
    return newResponse;
}
/**
* @method formatGetSingleDevicesDataResult 
* @description Used to format device data
*/

export function formatGetSingleDevicesDataResult(result) {
    const deviceData = [];
    const device = {};
    device.isActive = result.isActive;
    device.isEnabled = result.isEnabled;
    device.deviceId = result._id;
    device.asset = result.asset;
    device.deviceType = result.deviceType;
    device.name = result.name;
    device.location = result.location ? result.location : {
        name: '',
        address: '',
        lat: 0,
        long: 0
    };
    device.deviceTypeDisplayName = result.deviceType.displayName;
    device.displayName = result.displayName;
    device.deviceTypeId = result.deviceType._id;
    deviceData.push(device);
    return deviceData;
}

/**
* @method getDeviceDataListWithParameters 
* @description Used to get the device data list with parameter of device
*/
export function getDeviceDataListWithParameters(allParametersOfDevices, privilegedDeviceDataList) {
    const result = [];
    privilegedDeviceDataList.map((val) => {
        const onParameterObj = allParametersOfDevices.find((el) => (val.deviceId === el.parameter.device) && (el.parameter.parameterType._id === '5c491f1e1fcd14c69982fd93' || el.parameter.parameterType._id === '5c5b6db01fcd14c699974940'));
        const offTimeParameterObj = allParametersOfDevices.find((el) => val.deviceId === el.parameter.device && el.parameter.parameterType._id === '5c5b632e1fcd14c69993b0c5');
        const obj = Object.assign(val);
        obj.deviceLoader = false;
        obj.lightOnOffPopupValue = {
            lightOnPopupValue: false,
            lightOffPopupValue: false
        }
        const lightOnParameterStatus = {
            value: onParameterObj ? onParameterObj.value : '',
            buttonValue: onParameterObj ? onParameterObj.value : '',
            parameterTypeId: onParameterObj ? onParameterObj.parameter.parameterType._id : '',
            parameterId: onParameterObj ? onParameterObj.parameter._id : ''
        };
        const lightOffTimeParameterStatus = {
            value: offTimeParameterObj ? offTimeParameterObj.value : '',
            parameterTypeId: offTimeParameterObj ? offTimeParameterObj.parameter.parameterType._id : '',
            parameterId: offTimeParameterObj ? offTimeParameterObj.parameter._id : ''
        };
        obj.lightOnParameterStatus = lightOnParameterStatus;
        obj.lightOffTimeParameterStatus = lightOffTimeParameterStatus;
        result.push(obj);
    });
    return result;
}

/**
* @method formatDeviceParameterDataResult 
* @description Used to get the status of the device
*/
export function formatDeviceParameterDataResult(response) {
    /** Get on paramter id */
    const onParameterObj = response.find((val) => val.parameterType._id === '5c47fe021fcd14c69911bbd7' || val.parameterType._id === '5c47fe2b1fcd14c69911ca1f');
    /* Get off time paramter id */
    const offTimeParameterObj = response.find((val) => val.parameterType._id === '5c4f93ba1fcd14c699e21392');
    /* Get device status parameter id */
    const deviceStatusParameterObj = response.find((val) => val.parameterType._id === '5c491f1e1fcd14c69982fd93' || val.parameterType._id === '5c5b6db01fcd14c699974940');

    const lightControlIDs = {
        onParameterId: onParameterObj ? onParameterObj._id : '',
        offTimeParameterId: offTimeParameterObj ? offTimeParameterObj._id : '',
        deviceStatusParameterId: deviceStatusParameterObj ? deviceStatusParameterObj._id : ''
    };
    return lightControlIDs;
}
