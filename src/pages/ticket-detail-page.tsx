import {
	Button,
	Checkbox,
	FormControl,
	FormControlLabel,
	Input,
	InputLabel,
} from "@material-ui/core";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import UsersAtom from "../atoms/users-atom";
import { Ticket } from "../backend";
import useBackendService from "../utils/use-backend-service";

// -----------------------------------------------------------------------------------------
// #region Interfaces
// -----------------------------------------------------------------------------------------

interface PageUrlParams {
	id?: string;
}

// #endregion Interfaces

// -----------------------------------------------------------------------------------------
// #region Component
// -----------------------------------------------------------------------------------------

const TicketDetailPage: React.FC = () => {
	const { id } = useParams<PageUrlParams>();
	const { tickets, refresh, service, error, loading, handleError } =
		useBackendService(id);
	const initialTicket = tickets[0];
	const [updatedTicket, setUpdatedTicket] = useState(initialTicket);
	const [isSaving, setIsSaving] = useState(false);

	const [users] = useAtom(UsersAtom);

	useEffect(() => {
		setUpdatedTicket(initialTicket);
	}, [initialTicket]);

	const handleUpdateTicket = (
		key: keyof Ticket,
		value: Ticket[typeof key],
	) => {
		setUpdatedTicket(Object.assign({}, updatedTicket, { [key]: value }));
	};

	const handleSave = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		e.preventDefault();

		setIsSaving(true);
		if (initialTicket.completed !== updatedTicket.completed) {
			service
				.complete(updatedTicket.id, updatedTicket.completed)
				.subscribe({
					error: (error) => handleError(error),
				});
		}

		if (
			initialTicket.assigneeId !== updatedTicket.assigneeId &&
			updatedTicket.assigneeId !== null
		) {
			service
				.assign(updatedTicket.id, updatedTicket.assigneeId)
				.subscribe({
					error: (error) => handleError(error),
				});
		}

		setIsSaving(false);
	};

	if (loading) {
		return <div>...</div>;
	}

	return (
		<div>
			<Link to="/">Back</Link>
			<h2>{`Ticket Detail: ${initialTicket?.id ?? "..."}`}</h2>
			<form>
				<FormControl>
					<div>
						<InputLabel htmlFor="description">
							Description:
						</InputLabel>
						<Input
							id="description"
							type="text"
							disabled={true}
							value={updatedTicket?.description}
							onChange={(e) =>
								handleUpdateTicket(
									"description",
									e.target.value,
								)
							}
						/>
					</div>
				</FormControl>
				<FormControl>
					<div>
						<select
							name="assignees"
							id="users"
							onChange={(e) =>
								handleUpdateTicket(
									"assigneeId",
									parseInt(e.target.value, 10),
								)
							}
							value={`${updatedTicket?.assigneeId}`}>
							<option value={404}>invalid user</option>
							{users.map((u) => {
								return (
									<option key={u.id} value={u.id}>
										{u.name}
									</option>
								);
							})}
						</select>
					</div>
				</FormControl>
				<FormControlLabel
					control={
						<Checkbox
							checked={updatedTicket?.completed}
							onChange={(e) =>
								handleUpdateTicket(
									"completed",
									e.target.checked,
								)
							}
							color="primary"
						/>
					}
					label="Completed"
				/>
				<Button
					variant="contained"
					color="primary"
					type="submit"
					onClick={handleSave}>
					Save
				</Button>
				<Button variant="contained" color="secondary" onClick={refresh}>
					Cancel
				</Button>
			</form>
			<div>{`${isSaving ? "Saving..." : ""}`}</div>
			<div>{error !== null && error}</div>
		</div>
	);
};

// #endregion Component

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export default TicketDetailPage;

// #endregion Exports
