import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Ticket } from "../backend";
import useBackendService from "../utils/use-backend-service";

// -----------------------------------------------------------------------------------------
// #region Interfaces
// -----------------------------------------------------------------------------------------

export interface TicketDetailPageProps {}

interface PageUrlParams {
	id?: string;
}

// #endregion Interfaces

// -----------------------------------------------------------------------------------------
// #region Component
// -----------------------------------------------------------------------------------------

const TicketDetailPage: React.FC<TicketDetailPageProps> = (
	props: TicketDetailPageProps,
) => {
	const { id } = useParams<PageUrlParams>();
	const { tickets, refresh, service, setError, loading } =
		useBackendService(id);
	const initialTicket = tickets[0];
	const [updatedTicket, setUpdatedTicket] = useState(initialTicket);
	const [isSaving, setIsSaving] = useState(false);

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
			try {
				await service
					.complete(updatedTicket.id, updatedTicket.completed)
					.toPromise();
			} catch (error) {
				setError(
					"There was an issue updating the completed status of this ticket.",
				);
				console.error(error);
			}
		}

		if (
			initialTicket.assigneeId !== updatedTicket.assigneeId &&
			updatedTicket.assigneeId !== null
		) {
			try {
				await service
					.assign(updatedTicket.id, updatedTicket.assigneeId)
					.toPromise();
			} catch (error) {
				setError(
					"There was an issue updating the Assignee on this ticket",
				);
				console.error(error);
			}
		}

		setIsSaving(false);
	};

	return (
		<div>
			<Link to="/tickets">Back</Link>
			<h2>{`Ticket Detail: ${initialTicket?.id ?? "..."}`}</h2>
			<form>
				<div>
					<label htmlFor="des">Description:</label>
					<input
						id="des"
						type="text"
						disabled={true}
						value={updatedTicket?.description}
						onChange={(e) =>
							handleUpdateTicket("description", e.target.value)
						}
					/>
				</div>
				<div>
					<label htmlFor="assignee">Assignee:</label>
					<input
						id="assignee"
						type="text"
						disabled={loading}
						value={updatedTicket?.assigneeId ?? 0}
						onChange={(e) =>
							handleUpdateTicket("assigneeId", e.target.value)
						}
					/>
				</div>
				<div>
					<label htmlFor="completed">Completed:</label>
					<input
						id="completed"
						type="checkbox"
						disabled={loading}
						checked={updatedTicket?.completed}
						onChange={(e) =>
							handleUpdateTicket("completed", e.target.checked)
						}
					/>
				</div>
				<button type="submit" onClick={handleSave}>
					Save
				</button>
				<button onClick={refresh}>Cancel</button>
			</form>
			<div>{`${isSaving ? "Saving..." : ""}`}</div>
		</div>
	);
};

// #endregion Component

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export default TicketDetailPage;

// #endregion Exports
