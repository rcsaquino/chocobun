import { Router } from "preact-router";
import { useStore } from "../store";
import Courses from "../views/Courses";
import Settings from "../views/Settings";
import Tools from "../views/Tools";
import Transmute from "../views/Transmute";

export default function RouterView() {
	const [, updateStore] = useStore();

	function handleRouteChange(e) {
		updateStore("currentPath", e.url);
	}

	return (
		<Router onChange={e => handleRouteChange(e)}>
			<Transmute path="/" />
			<Courses path="/courses" />
			<Tools path="/tools" />
			<Settings path="/settings" />
		</Router>
	);
}
