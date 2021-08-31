import {
	TableHead,
	TableCell,
	Table,
	Paper,
	TableRow,
	TableBody,
	InputLabel,
	FormControl,
	Input,
	Button,
} from "@material-ui/core";
import TableContainer from "@material-ui/core/TableContainer";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import FilterByCompletedAtom from "../atoms/filter-by-completed-atom";
import UsersAtom from "../atoms/users-atom";
import useBackendService from "../utils/use-backend-service";

// -----------------------------------------------------------------------------------------
// #region Component
// -----------------------------------------------------------------------------------------

const TicketPage: React.FC = () => {
	const [filterByCompleted, setFilterByCompleted] = useAtom(
		FilterByCompletedAtom,
	);
	const { tickets, error, loading, service, setError, handleError } =
		useBackendService();
	const [newTicketDescription, setNewTicketDescripton] = useState("");
	const [newUserName, setNewUserName] = useState("");

	const [users] = useAtom(UsersAtom);

	const handleNewTicket = async () => {
		service.newTicket({ description: newTicketDescription }).subscribe({
			error: handleError,
			next: () => {
				setNewTicketDescripton("");
			},
		});
	};

	const handleNewUser = () => {
		service.newUser(newUserName).subscribe({
			error: (err) => {
				setError(err);
			},
			next: () => {
				setNewUserName("");
			},
		});
	};

	return (
		<div>
			<h2>Tickets</h2>
			<div>
				<label htmlFor="des">Filter By Completed:</label>
				<input
					id="completed"
					type="checkbox"
					disabled={loading}
					checked={filterByCompleted}
					onChange={(e) => setFilterByCompleted(e.target.checked)}
				/>
			</div>
			{tickets.length > 0 ? (
				<TableContainer component={Paper}>
					<Table aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>ID</TableCell>
								<TableCell align="right">Description</TableCell>
								<TableCell align="right">Assignee</TableCell>
								<TableCell align="right">Completed</TableCell>
								<TableCell align="right">Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{tickets
								.filter((t) =>
									filterByCompleted
										? t.completed === filterByCompleted
										: true,
								)
								.map((ticket) => {
									const user = users.find(
										(u) => u.id === ticket.assigneeId,
									);
									console.log(ticket);
									return (
										<TableRow key={`ticket-${ticket.id}`}>
											<TableCell
												component="th"
												scope="row">
												{ticket.id}
											</TableCell>
											<TableCell align="right">
												{ticket.description}
											</TableCell>
											<TableCell align="right">
												{user?.name ?? "N/A"}
											</TableCell>
											<TableCell align="right">
												{ticket.completed?.toString()}
											</TableCell>
											<TableCell align="right">
												<Link
													to={`/tickets/${ticket.id}`}>
													View
												</Link>
											</TableCell>
										</TableRow>
									);
								})}
						</TableBody>
					</Table>
				</TableContainer>
			) : (
				<span>{loading ? "..." : "Tickets unavailable"}</span>
			)}
			<div>{error !== null && error}</div>

			<h2>Add new</h2>
			<form>
				<div>
					<FormControl>
						<InputLabel htmlFor="des">Description:</InputLabel>
						<Input
							id="des"
							type="text"
							value={newTicketDescription}
							onChange={(e) =>
								setNewTicketDescripton(e.target.value)
							}
						/>
					</FormControl>
					<Button
						variant="contained"
						color="primary"
						onClick={handleNewTicket}>
						Save
					</Button>
				</div>
			</form>

			<h2>Add new user</h2>
			<form>
				<div>
					<FormControl>
						<InputLabel htmlFor="des">Name:</InputLabel>
						<Input
							id="user"
							type="text"
							value={newUserName}
							onChange={(e) => setNewUserName(e.target.value)}
						/>
					</FormControl>
					<Button
						variant="contained"
						color="primary"
						onClick={handleNewUser}>
						Save
					</Button>
				</div>
			</form>
		</div>
	);
};

// #endregion Component

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export default TicketPage;

// #endregion Exports;
