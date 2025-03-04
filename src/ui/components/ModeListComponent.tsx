import React, { memo } from 'react'

import { Mode, Questionnaire } from 'core/application/model'
import { Link } from 'react-router-dom'
import { ModeIcon } from 'ui/components/base'

type ModeListProps = {
  questionnaire: Questionnaire
}
export const ModeListComponent = memo(({ questionnaire }: ModeListProps) => {
  const getVisiblesModes = (questionnaire: Questionnaire): Mode[] => {
    //return questionnaire?.modes?.filter((mode) => mode.isWebMode);
    //as long as stromae is the only orchestrator, keep this line below, otherwise use line above
    return questionnaire?.modes?.filter((mode) =>
      ['CATI', 'CAPI', 'CAWI'].includes(mode.name),
    )
  }

  return (
    <>
      {getVisiblesModes(questionnaire).map((mode) => (
        <React.Fragment key={`${questionnaire.id}-${mode.name}`}>
          <Link to={`/questionnaires/${questionnaire.id}/modes/${mode.name}`}>
            <ModeIcon mode={mode} />
          </Link>
        </React.Fragment>
      ))}
    </>
  )
})

ModeListComponent.displayName = 'ModeListComponent'
