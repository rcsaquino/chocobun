import { useEffect, useState } from "preact/hooks";

// useAutoFocus
function useAutoFocus(state, id) {
	if (navigator.userAgent.indexOf("Chrome") === -1) return;
	// eslint-disable-next-line react-hooks/rules-of-hooks
	useEffect(() => {
		if (state) document.getElementById(id).focus();
	}, [state, id]);
}

// useValidation
function useValidation(defaultViolations) {
	const [violations, setViolations] = useState({});
	function validation(customViolations) {
		const validateObj = customViolations || defaultViolations;
		setViolations(validateObj);
		return Object.values(validateObj).every(field => field === false);
	}
	function resetValidation() {
		setViolations({});
	}
	return [violations, validation, resetValidation];
}

export { useAutoFocus, useValidation };
