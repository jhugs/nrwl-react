import "./app.css";
import { Route, Switch } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import TicketPage from "../pages/tickets-page";
import TicketDetailPage from "../pages/ticket-detail-page";
import useAssignees from "../utils/use-assignees";

const App = () => {
	useAssignees();
	return (
		<Router>
			<Switch>
				<Route exact path="/" component={TicketPage} />
				<Route exact path="/tickets/:id" component={TicketDetailPage} />
			</Switch>
		</Router>
	);
};

export default App;
