import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { simpleQuestionnaire } from "test/mock/questionnaire";
import { notifySpy, renderWithProviders, screen } from "test/test-utils";
import { vi } from "vitest";
import { QuestionnaireCheckPoguesIdPage } from ".";

describe.only("QuestionnaireAddPage", () => {
  const mockFetchPoguesQuestionnaire = vi.fn((poguesId: string) =>
    Promise.resolve(simpleQuestionnaire)
  );
  const mockFetchQuestionnaireFromPogues = vi.fn((poguesId: string) =>
    Promise.resolve(simpleQuestionnaire)
  );

  const router = createMemoryRouter(
    [
      {
        path: "/check",
        element: (
          <QuestionnaireCheckPoguesIdPage
            fetchPoguesQuestionnaire={mockFetchQuestionnaireFromPogues}
            fetchQuestionnaireFromPoguesId={mockFetchPoguesQuestionnaire}
          />
        ),
      },
    ],
    { initialEntries: ["/check", "/questionnaires/add"], initialIndex: 0 }
  );

  test("should retrieve questionnaire when searching it", async () => {
    const { container } = renderWithProviders(
      <RouterProvider router={router} />
    );
    const input = container.querySelector("input");
    expect(input).not.toBeNull();
    await userEvent.clear(input!);
    await userEvent.type(input!, "l8wwljbo");
    const submitButton = screen.getByRole("button");
    expect(submitButton).not.toBeNull();
    await userEvent.click(submitButton);

    expect(mockFetchPoguesQuestionnaire).toHaveBeenCalledWith("l8wwljbo");
    expect(mockFetchQuestionnaireFromPogues).toHaveBeenCalledTimes(0);

    expect(notifySpy).toHaveBeenCalledTimes(0);
  });
});
