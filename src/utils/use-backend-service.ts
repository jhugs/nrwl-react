import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import ServiceAtom from "../atoms/service-atom";
import { BackendService, Ticket } from "../backend";

export interface UseBackendServiceResult {
	error: string;
	get: (id: number) => void;
	handleError: (err: any) => void;
	index: VoidFunction;
	loading: boolean;
	refresh: VoidFunction;
	service: BackendService;
	setError: React.Dispatch<React.SetStateAction<string | undefined>>;
	tickets: Ticket[];
}

export default function useBackendService(id?: string) {
	const [backendService] = useAtom(ServiceAtom);

	const [tickets, setTickets] = useState<Array<Ticket>>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | undefined>();

	const get = async (id: number) => {
		try {
			const result = await backendService.ticket(id).toPromise();
			setTickets([result]);
		} catch (error) {
			setError(`There was a problem retrieving ticket with id: ${id}`);
			console.error(error);
		}
	};

	const index = async () => {
		try {
			const result = await backendService.tickets().toPromise();
			setTickets(result);
		} catch (error) {
			setError(`There was a problem retrieving tickets.`);
			console.error(error);
		}
	};

	const handleError = (err: any) => {
		setError(err.message);
		console.error(err);
	};

	const fetch = useCallback(async () => {
		setLoading(true);

		if (id != null) {
			await get(parseInt(id, 10));
			setLoading(false);
			return;
		}

		await index();
		setLoading(false);
	}, [backendService, id]);

	useEffect(() => {
		fetch();
	}, [backendService, id, fetch]);

	return {
		error,
		get,
		index,
		loading,
		refresh: fetch,
		service: backendService,
		setError,
		tickets,
		handleError,
	};
}
