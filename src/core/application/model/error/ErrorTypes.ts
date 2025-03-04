export type ErrorObject = {
  code: number
  path: string
  timestamp: string
  message: string
}

export type ErrorDetails<Details> = ErrorObject & {
  details: Details
}

export type ErrorDetailsSurveyUnit = {
  surveyUnitId: string
  attributesErrors: ErrorDetailsAttributes[]
}

export type ErrorDetailsAttributes = {
  attributeKey: string
  messages: string[]
}
