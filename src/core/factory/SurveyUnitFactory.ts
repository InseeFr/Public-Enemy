import { SurveyUnitRepositoryPort } from "core/application/port";
import {
  createSurveyUnitUseCase,
  SurveyUnitUseCaseType,
} from "core/application/usecase";
import { createSurveyUnitRepository } from "core/infrastructure";

/**
 * Repository factory
 * @returns surveyUnit repository factory
 */
export const makeSurveyUnitRepository = (): SurveyUnitRepositoryPort =>
  createSurveyUnitRepository(process.env.REACT_APP_API_URL);

/**
 * Use case factory
 * @returns surveyUnit usecase
 */
export const makeSurveyUnitUseCase = (): SurveyUnitUseCaseType =>
  createSurveyUnitUseCase(makeSurveyUnitRepository());
