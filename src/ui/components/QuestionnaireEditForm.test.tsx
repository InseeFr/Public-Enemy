import userEvent from "@testing-library/user-event";
import { Questionnaire } from "core/application/model";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { questionnaireAdd, simpleQuestionnaire } from "test/mock/questionnaire";
import { surveyContexts } from "test/mock/surveyContext";
import {
  act,
  fireEvent,
  notifySpy,
  renderWithProviders,
  screen,
} from "test/test-utils";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { QuestionnaireEditForm } from "./QuestionnaireEditForm";
import { interrogationsWarningMessages } from "test/mock/surveyUnitsWarningMessages";

const file = new File(['"test","test2"'], "units.csv", {
  type: "text/csv",
});

const saveQuestionnaire = vi.fn((questionnaire: Questionnaire) =>
  Promise.resolve(simpleQuestionnaire)
);
const fetchSurveyContexts = vi.fn(() => Promise.resolve(surveyContexts));
const checkInterrogationsCsvData = vi.fn(() =>
  Promise.resolve(interrogationsWarningMessages)
);

const getInterrogationsSchemaCSV = vi.fn(() => Promise.resolve());
const getExistingInterrogationsSchemaCSV = vi.fn(() => Promise.resolve());

beforeEach(async () => {
  // Clear mocks and add some testing data after before each test run
  await vi.clearAllMocks();
});

function createQuestionnaireEditFormRouter(isEditMode: boolean) {
  return createMemoryRouter(
    [
      {
        path: "/",
        element: (
          <QuestionnaireEditForm
            questionnaire={questionnaireAdd}
            fetchSurveyContexts={fetchSurveyContexts}
            isEditMode={isEditMode}
            isSubmitting={false}
            saveQuestionnaire={saveQuestionnaire}
            checkInterrogationsCsvData={checkInterrogationsCsvData}
            getInterrogationsSchemaCSV={getInterrogationsSchemaCSV}
            getExistingInterrogationsSchemaCSV={getExistingInterrogationsSchemaCSV}
          />
        ),
      },
    ],
    { initialEntries: ["/"], initialIndex: 0 }
  );
}

describe("QuestionnaireEditForm saving questionnaire", () => {
  test("should add questionnaire when valid form", async () => {
    await fillCorrectForm(false);

    const questionnaire = {
      ...questionnaireAdd,
      interrogationData: file,
      context: {
        name: surveyContexts[0].name,
      },
    };

    expect(saveQuestionnaire).toHaveBeenCalledWith(questionnaire);
    expect(notifySpy).toHaveBeenCalledWith({
      message: "Le questionnaire a bien été paramétré",
      type: "success",
    });
  });

  test("should edit questionnaire when valid form", async () => {
    await fillCorrectForm(true);

    const confirmationDialog = screen.getByTestId("confirmation-dialog");
    expect(confirmationDialog).not.toBeNull();

    const confirmationButton = screen.getByTestId("confirmation-agree");
    expect(confirmationDialog).not.toBeNull();
    await userEvent.click(confirmationButton);

    const questionnaire = {
      ...questionnaireAdd,
      interrogationData: file,
      context: {
        name: surveyContexts[0].name,
      },
    };

    expect(saveQuestionnaire).toHaveBeenCalledWith(questionnaire);
    expect(notifySpy).toHaveBeenCalledWith({
      message: "Le questionnaire a bien été paramétré",
      type: "success",
    });
  });
});

describe.each([
  { isEditMode: true, label: "edit" },
  { isEditMode: false, label: "add" },
])(
  "QuestionnaireEditForm when incorrect form values",
  ({ isEditMode, label }) => {
    test(`should not ${label} questionnaire when invalid input file`, async () => {
      await fillFormWithoutInputFile(isEditMode);

      const errorInputFile = await screen.findByText(
        "Veuillez renseigner le fichier de données"
      );

      expect(errorInputFile).not.null;
      expect(saveQuestionnaire).toHaveBeenCalledTimes(0);
    });

    test(`should not ${label} questionnaire when no context`, async () => {
      await fillFormWithoutContext(isEditMode);

      const errorContext = await screen.findByText(
        "Veuillez saisir le contexte"
      );

      expect(errorContext).not.null;
      expect(saveQuestionnaire).toHaveBeenCalledTimes(0);
    });
  }
);

async function fillCorrectForm(isEditMode = true) {
  const { container } = await act(async () =>
    renderWithProviders(
      <RouterProvider router={createQuestionnaireEditFormRouter(isEditMode)} />
    )
  );

  fillInputFile(container);
  fillSelectContext(container);

  const submitButton = screen.getByTestId("save-questionnaire");
  expect(submitButton).not.toBeNull();
  await userEvent.click(submitButton);
}

async function fillFormWithoutInputFile(isEditMode = true) {
  const { container } = await act(async () =>
    renderWithProviders(
      <RouterProvider router={createQuestionnaireEditFormRouter(isEditMode)} />
    )
  );

  fillSelectContext(container);

  const submitButton = screen.getByTestId("save-questionnaire");
  expect(submitButton).not.toBeNull();
  await userEvent.click(submitButton);
}

async function fillFormWithoutContext(isEditMode = true) {
  const { container } = await act(async () =>
    renderWithProviders(
      <RouterProvider router={createQuestionnaireEditFormRouter(isEditMode)} />
    )
  );

  fillInputFile(container);

  const submitButton = screen.getByTestId("save-questionnaire");
  expect(submitButton).not.toBeNull();
  await userEvent.click(submitButton);
}

function fillInputFile(container: HTMLElement): void {
  const inputFile = container.querySelector(
    `input[name="interrogationData"]`
  ) as HTMLInputElement;
  expect(inputFile).not.toBeNull();
  userEvent.upload(inputFile, file);
}

function fillSelectContext(container: HTMLElement) {
  /** Handle change select with mui select */
  const contextSelectTextField = container.querySelector(
    "#questionnaire-context"
  ) as HTMLDivElement;
  expect(contextSelectTextField).not.null;

  const contextSelectInput = container.querySelector(
    "#select-input"
  ) as HTMLInputElement;

  expect(contextSelectInput).not.null;

  fireEvent.mouseDown(contextSelectTextField);

  expect(screen.getByRole("listbox")).not.toEqual(null);

  act(() => {
    const options = screen.getAllByRole("option");
    fireEvent.mouseDown(options[0]);
    options[0].click();
  });
}
