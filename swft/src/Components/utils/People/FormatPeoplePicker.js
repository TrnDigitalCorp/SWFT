// import * as _ from 'lodash';

export function convertWrapperToUserObj(wrapperArr) {
    let uniqOwnersObj = {},
        owenerEmails = [],
        uniqOwners = [],
        index = 0,
        len = 0;
    try {
        if (wrapperArr) {
            len = wrapperArr.length;
            for (index = 0; index < len; index++) {
                const eachWrapper = wrapperArr[index];
                uniqOwnersObj = {};
                if (
                    eachWrapper.secondaryText &&
                    owenerEmails.indexOf(eachWrapper.secondaryText) === -1
                ) {
                    try {
                        let userPrincipalName =
                            eachWrapper.props.userPrincipalName;
                        uniqOwnersObj.UserLogin = userPrincipalName
                            ? userPrincipalName
                            : eachWrapper.secondaryText;
                        uniqOwnersObj.DisplayName = eachWrapper.text;
                        uniqOwnersObj.Email = eachWrapper.secondaryText;
                        // uniqOwnersObj.isChecked = true;
                        owenerEmails.push(eachWrapper.secondaryText);
                        uniqOwners.push(uniqOwnersObj);
                    } catch (err) {
                        console.log(err);
                    }
                }
            }
            return uniqOwners;
        } else {
            return uniqOwners;
        }
    } catch (err) {
        console.log(err);
        return uniqOwners;
    }
}
export function convertUserObjToWrapper(userObjArr) {
    let uniqOwnersObj = {},
        owenerEmails = [],
        uniqOwners = [],
        index = 0,
        len = 0;
    try {
        if (userObjArr) {
            len = userObjArr.length;
            for (index = 0; index < len; index++) {
                const eachUserObj = userObjArr[index];
                uniqOwnersObj = {};
                if (
                    eachUserObj.Email &&
                    owenerEmails.indexOf(eachUserObj.Email) === -1
                ) {
                    try {
                        let userPrincipalName = eachUserObj.UserLogin;
                        uniqOwnersObj.userPrincipalName = userPrincipalName;
                        uniqOwnersObj.displayName = eachUserObj.DisplayName;
                        uniqOwnersObj.mail = eachUserObj.Email;
                        uniqOwnersObj.id = index + eachUserObj.Email;
                        // uniqOwnersObj.isChecked = true;
                        owenerEmails.push(eachUserObj.Email);
                        uniqOwners.push(uniqOwnersObj);
                    } catch (err) {
                        console.log(err);
                    }
                }
            }
            return uniqOwners;
        } else {
            return uniqOwners;
        }
    } catch (err) {
        console.log(err);
        return uniqOwners;
    }
}
//mail
// displayName
// email
// userPrincipalName
