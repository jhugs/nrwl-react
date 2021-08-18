import { useCallback, useEffect, useRef, useState } from "react";
import { BackendService, Ticket } from "../backend";

export interface UseGetBackendServiceResult {
    tickets: Ticket[];
    error: string;
    loading: boolean;
    refresh: VoidFunction;
    service: BackendService
    setError:React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function useGetBackendService(id?: string) {
    const backend = useRef(new BackendService());
    const { current: backendService } = backend;

    const [tickets, setTickets] = useState<Array<Ticket>>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>();

    const fetch = useCallback(async () => {
      setLoading(true);
      try {
        const ticketId = id !== null ? parseInt(id!, 10) : undefined;
        const hasId = ticketId !== null && !isNaN(ticketId!);
        const result = hasId ? await backendService.ticket(ticketId!).toPromise() : await backendService.tickets().toPromise();
        if(hasId) {
            setTickets([result as Ticket]);
            setLoading(false);
            return;
        }
        setTickets(result as Ticket[]);

        // clear error
        setError(undefined);
      } catch (error) {
        setError("There was a problem retrieving tickets.");
        console.error(error);
      }
      setLoading(false);
    }, [backendService, id])


    useEffect(() => {
      fetch();
    }, [backendService, id, fetch]);

    return {
        loading,
        error,
        setError,
        tickets,
        refresh: fetch,
        service: backendService,
    }
}