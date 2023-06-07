const checkInputValidity = () => {
    const inputs = [...document.querySelectorAll("input")];
    const allValid = inputs.every(input => input.reportValidity())
    //console.log(allValid);
    return allValid;
}

export default checkInputValidity;
