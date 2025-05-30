// Function to check if any of the field doesn't falls under the allowedFieldsArray
export const checkForUnlistedFields = (allowedFieldsArray, dataFieldsArray) => {
    const unsatisfiedField = dataFieldsArray.find((dataField) => !allowedFieldsArray.includes(dataField));
    return unsatisfiedField;
}