import { Box, CircularProgress } from "@mui/material";
import { memo, type PropsWithChildren } from "react";
import { makeStyles } from "tss-react/mui";

type LoaderType = PropsWithChildren<{
  isLoading: boolean;
}>;

/**
 * Loading component
 */
export const Loader = memo(({ isLoading, children }: LoaderType) => {
  const { classes } = useStyles();
  return (
    <>
      {isLoading ? (
        <Box className={classes.root}>
          <CircularProgress />
        </Box>
      ) : (
        children
      )}
    </>
  );
});

const useStyles = makeStyles()(() => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

Loader.displayName = "Loader";
