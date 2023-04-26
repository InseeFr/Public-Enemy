import { Grid } from "@mui/material";
import { memo } from "react";
import { Block, ErrorComponent } from "ui/components/base";

export const ErrorPage = memo(() => {
  return (
    <Grid component="main" container justifyContent="center" spacing={3}>
      <Grid item xs={12}>
        <Block>
          <ErrorComponent />
        </Block>
      </Grid>
    </Grid>
  );
});

ErrorPage.displayName = "ErrorPage";
