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
	// To determine the method of modal closure
	const closedWithBack = useRef(false);
	// To keep track which modal is open
	const openModals = useRef([]);

	// Triggered when hash changes
	function closeWithBack() {
		// If hashName is not in URL and it's open, close it
		if (
			!location.hash.includes(hashName) &&
			openModals.current.includes(hashName)
		) {
			// Set closed with back = true
			closedWithBack.current = true;
			// Close modal
			closeModal();
		}
	}

	useDidMountEffect(() => {
		const hashArr = location.hash ? location.hash.split("/") : [];
		const prefix = hashArr[0] === "#" ? "" : "#/";
		if (isOpen) {
			// If modal is opened, add hashName to URL
			// Add to list of opened modals
			openModals.current.push(hashName);
			hashArr.push(hashName);
			history.pushState(
				{},
				"",
				`${location.pathname}${prefix}${hashArr.join("/")}`
			);
		} else {
			// If modal is closed, remove hashName from URL
			// Remove from list of opened modals
			openModals.current = openModals.current.filter(x => x !== hashName);
			// If modal closed using back button, then hash is already taken care of.
			// Reset closedWithBack and do nothing
			if (closedWithBack.current) {
				closedWithBack.current = false;
			} else {
				// Else if modal is closed by button, remove from hash manually
				hashArr.pop();
				history.replaceState(
					{},
					"",
					`${location.pathname}${prefix}${hashArr.join("/")}`
				);
			}
		}
	}, [isOpen]);

	// Add event listeners for hashChange
	// Currently being added to all modals (can be optimized)
	useEffect(() => {
		addEventListener("hashchange", closeWithBack);
		return () => {
			removeEventListener("hashchange", closeWithBack);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
}

export { useAutoFocus, useValidation, useModalHash, useDidMountEffect };
