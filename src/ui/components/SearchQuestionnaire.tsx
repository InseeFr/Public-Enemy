import React from "react";
import { useIntl } from "react-intl";
import TextField from "@mui/material/TextField";

interface SearchQuestionnaireProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

export const SearchQuestionnaire: React.FC<SearchQuestionnaireProps> = ({
  searchTerm,
  onSearchTermChange,
}) => {
  const intl = useIntl();

  return (
    <>
      <TextField
        id="search-questionnaire"
        placeholder={intl.formatMessage({ id: "search_questionnaire" })}
        variant="outlined"
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        size="small"
        fullWidth
      />
    </>
  );
};
