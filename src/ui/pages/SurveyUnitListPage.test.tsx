import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { simpleQuestionnaire } from "test/mock/questionnaire";
import { surveyUnitsData } from "test/mock/surveyUnitsData";
import { notifySpy, renderWithProviders } from "test/test-utils";
import { describe, expect, test, vi } from 'vitest'
import { SurveyUnitListPage } from "./SurveyUnitListPage";

describe.only("SurveyUnitListPage", () => {
  const fetchSurveyUnitsData = vi.fn(() => Promise.resolve(surveyUnitsData));
  const fetchQuestionnaire = vi.fn(() => Promise.resolve(simpleQuestionnaire));
  const resetSurveyUnit = vi.fn(() => Promise.resolve());
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: (
          <SurveyUnitListPage
            fetchSurveyUnitsData={fetchSurveyUnitsData}
            fetchQuestionnaire={fetchQuestionnaire}
            resetSurveyUnit={resetSurveyUnit}
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
