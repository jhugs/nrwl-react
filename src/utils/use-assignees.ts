import { useAtom } from "jotai";
import { useState, useCallback, useEffect } from "react";
import ServiceAtom from "../atoms/service-atom";
import UsersAtom from "../atoms/users-atom";
import { User } from "../backend";
import UseDataHookResult from "./use-data-hook-result";

export default function useAssignees(): UseDataHookResult<User[]> {
	const [backendService] = useAtom(ServiceAtom);

	const [users, setUsers] = useAtom(UsersAtom);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | undefined>();

	const fetch = useCallback(async () => {
		setLoading(true);

		backendService.users().subscribe({
			error: (err) => {
				setError(err);
			},
			next: (result) => {
				setUsers(result);
				setLoading(false);
			},
		});

		setLoading(false);
	}, [backendService]);

	useEffect(() => {
		fetch();
	}, [backendService, fetch]);

	return {
		error,
		loading,
		refresh: fetch,
		resultObject: users,
		service: backendService,
		setError: setError,
	};
}
