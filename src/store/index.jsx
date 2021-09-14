import { createContext } from "preact";
import { useState, useContext, useEffect } from "preact/hooks";

// Create store context
const Store = createContext();

// Get items from localStorage
const localStorageItems = [
	"courses",
	"gradingSystem",
	"lists",
	"history",
	"theme",
];

// Initialize initial state
let initialState = {};

// Loop thorugh local storage items and assign to initial state accordingly
localStorageItems.forEach(item => {
	try {
		initialState[item] = JSON.parse(localStorage[item]);
	} catch {
		initialState[item] = localStorage[item];
	}
});

// Set initial state to local storage values if available
initialState = {
	courses: initialState.courses instanceof Array ? initialState.courses : [],
	gradingSystem: initialState.grading || 65,
	lists: initialState.lists instanceof Array ? initialState.lists : [],
	history:
		initialState.history instanceof Array
			? initialState.history
			: [
					{
						label: "Initialized Randomizer",
						time: new Date().toString().substring(4, 24),
					},
			  ],
	theme:
		initialState.theme instanceof Object
			? initialState.theme
			: { mode: "light", color: "chocobun" },
};

// Clean up local storage if necessary
localStorage.length === localStorageItems.length || localStorage.clear();

function StoreProvider({ children }) {
	// Initialize store
	const [store, setStore] = useState(initialState);

	// Update local storage as store gets updated

	// Courses
	useEffect(() => {
		localStorage.courses = JSON.stringify(store.courses);
	}, [store.courses]);

	// Grading System
	useEffect(() => {
		localStorage.gradingSystem = JSON.stringify(store.gradingSystem);
	}, [store.gradingSystem]);

	// Lists
	useEffect(() => {
		localStorage.lists = JSON.stringify(store.lists);
	}, [store.lists]);

	// History
	useEffect(() => {
		localStorage.history = JSON.stringify(store.history);
	}, [store.history]);

	// Theme
	useEffect(() => {
		localStorage.theme = JSON.stringify(store.theme);

		// Aditionnaly, change theme-color meta tags content
		const metaThemes = document.querySelectorAll('meta[name="theme-color"]');

		if (store.theme.mode === "light") {
			document.body.style.backgroundColor = "#FFFFFF";
			metaThemes.forEach(meta => {
				meta.setAttribute("content", "#FFFFFF");
			});
		} else {
			document.body.style.backgroundColor = "#121212";
			metaThemes.forEach(meta => {
				meta.setAttribute("content", "#121212");
			});
		}
	}, [store.theme]);

	// Create a function for easier updating of store
	function updateStore(name, value) {
		setStore({ ...store, [name]: value });
	}

	return (
		// Provide store, updateStore and setStore throughout the app
		<Store.Provider value={[store, updateStore, setStore]}>
			{children}
		</Store.Provider>
	);
}

// Export this function for easier store implementaiton
function useStore() {
	return useContext(Store);
}

export { useStore, StoreProvider };
