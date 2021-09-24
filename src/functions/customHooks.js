import { useEffect, useRef, useState } from "preact/hooks";

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

// useDidMountEffect
function useDidMountEffect(runFunction, dependencies) {
	const didMount = useRef(false);

	useEffect(() => {
		if (didMount.current) runFunction();
		else didMount.current = true;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, dependencies);
}

// useModalHash - for android back button
function useModalHash(hashName, isOpen, closeModal) {
	useDidMountEffect(() => {
		let hashArr = location.hash ? location.hash.split("/") : [];
		if (isOpen) {
			hashArr.push(hashName);
			history.pushState({}, "", `${location.pathname}#/${hashArr.join("/")}`);
		} else {
			hashArr.pop();
			if (hashArr !== []) hashArr.shift();
			history.replaceState({}, "", `${location.pathname}${hashArr.join("/")}`);
		}
	}, [isOpen]);

	useEffect(() => {
		function hashJustChanged() {
			if (!location.hash.includes(hashName)) {
				closeModal();
			}
		}
		addEventListener("hashchange", hashJustChanged);
		return () => {
			removeEventListener("hashchange", hashJustChanged);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
}

export { useAutoFocus, useValidation, useModalHash, useDidMountEffect };
