import { BackendService } from "../backend";

export default interface UseDataHookResult<T> {
	error?: string;
	loading: boolean;
	refresh: VoidFunction;
	service: BackendService;
	setError: React.Dispatch<React.SetStateAction<string | undefined>>;
	resultObject: T;
}
