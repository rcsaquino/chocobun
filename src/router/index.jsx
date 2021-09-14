import { Router } from "preact-router";
import Courses from "../views/Courses";
import Settings from "../views/Settings";
import Tools from "../views/Tools";
import Transmute from "../views/Transmute";

export default function RouterView() {
	return (
		<Router>
			<Transmute path="/" />
			<Courses path="/courses" />
			<Tools path="/tools" />
			<Settings path="/settings" />
		</Router>
	);
}
