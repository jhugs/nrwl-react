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
import React, { useState } from "react";
import { Link } from "react-router-dom";
import useBackendService from "../utils/use-backend-service";

// -----------------------------------------------------------------------------------------
// #region Component
// -----------------------------------------------------------------------------------------

const TicketPage: React.FC = () => {
	const { tickets, error, loading, service, setError } = useBackendService();
	const [filterByCompleted, setFilterByCompleted] = useState(false);
	const [newTicketDescription, setNewTicketDescripton] = useState("");

	const handleNewTicket = async () => {
		try {
			await service
				.newTicket({ description: newTicketDescription })
				.toPromise();
		} catch (error) {
			// TODO: not being caught?
			setError(
				"There was an issue updating the completed status of this ticket.",
			);
			console.error(error);
		}

		setNewTicketDescripton("");
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
								<TableCell align="right">AssgineeId</TableCell>
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
								.map((t) => (
									<TableRow key={t.id}>
										<TableCell component="th" scope="row">
											{t.id}
										</TableCell>
										<TableCell align="right">
											{t.description}
										</TableCell>
										<TableCell align="right">
											{t.assigneeId}
										</TableCell>
										<TableCell align="right">
											{t.completed?.toString()}
										</TableCell>
										<TableCell align="right">
											<Link to={`/tickets/${t.id}`}>
												View
											</Link>
										</TableCell>
									</TableRow>
								))}
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
		</div>
	);
};

// #endregion Component

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export default TicketPage;

// #endregion Exports;
