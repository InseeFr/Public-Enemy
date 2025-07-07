import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { simpleQuestionnaire } from "test/mock/questionnaire";
import { notifySpy, renderWithProviders } from "test/test-utils";
import { describe, expect, test, vi } from "vitest";
import { InterrogationListPage } from "./InterrogationListPage";
import { interrogationsData } from "test/mock/surveyUnitsData";

describe.only("InterrogationListPage", () => {
  const fetchInterrogationsData = vi.fn(() => Promise.resolve(interrogationsData));
  const fetchQuestionnaire = vi.fn(() => Promise.resolve(simpleQuestionnaire));
  const resetInterrogation = vi.fn(() => Promise.resolve());
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: (
          <InterrogationListPage
            fetchInterrogationsData={fetchInterrogationsData}
            fetchQuestionnaire={fetchQuestionnaire}
            resetInterrogation={resetInterrogation}
          />
        ),
      },
    ],
    { initialEntries: ["/"], initialIndex: 0 }
  );

  test("should show error when missing questionnaire and mode parameters", () => {
    renderWithProviders(<RouterProvider router={router} />);
    expect(notifySpy).toHaveBeenCalledWith({
      message:
        "Des paramètres sont manquants pour afficher correctement la page",
      type: "error",
    });
  });
});
