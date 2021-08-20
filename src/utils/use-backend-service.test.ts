import { act, renderHook } from "@testing-library/react-hooks";
import * as Jotai from "jotai";
import { BackendService } from "../backend";
import useBackendService from "./use-backend-service";

const setupSut = (id?: string) => {
	jest.spyOn(Jotai, "useAtom").mockReturnValue([
		new BackendService() as any,
		null!,
	]);

	return {
		hookResult: renderHook(
			(initialParams) => useBackendService(initialParams),
			{
				initialProps: id,
			},
		),
	};
};

describe("useBackendService", () => {
	it("returns backendService", () => {
		// Arrange & Act
		const { hookResult } = setupSut();

		// Assert
		expect(hookResult.result.current.service).not.toBeNull();
	});

	// TODO: Mock the actual backendService and test the hook functionality / execution separately.
	// The random delay in the backendService makes this test very flakey.
	describe("when id is present", () => {
		it("returns single ticket", async () => {
			// Arrange & Act
			const { hookResult } = setupSut(undefined);

			// Act
			act(() => {
				hookResult.rerender("0");
			});

			// Assert
			await hookResult.waitFor(
				() => hookResult.result.current.tickets.length === 1,
			);
		});
	});
});
