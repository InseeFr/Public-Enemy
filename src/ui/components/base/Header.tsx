import LaunchIcon from "@mui/icons-material/Launch";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import { Box, Button } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { getEnvVar } from "core/utils/configuration/env";
import { memo } from "react";
import { useIntl } from "react-intl";
import { makeStyles } from "tss-react/mui";
import { SidebarNavProps } from ".";
import { useOidc } from "core/application/auth/provider";

export const Header = memo((props: SidebarNavProps) => {
  const { toggleDrawer } = props;
  const { classes } = useStyles();
  const poguesUrl = getEnvVar("VITE_POGUES_URL");
  const documentationUrl = getEnvVar("VITE_DOCUMENTATION_URL");
  const intl = useIntl();

  const { decodedIdToken } = useOidc();

  return (
    <AppBar className={classes.root}>
      <Toolbar className={classes.toolbar}>
        <IconButton
          className={classes.burgerIcon}
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          className={classes.globalTitle}
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
        >
          Public enemy
        </Typography>

        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Button sx={{ color: "#fff" }}>
            <PersonIcon fontSize="small"></PersonIcon>
            {`${decodedIdToken?.preferred_username}`}
          </Button>

          {"|"}

          <Button
            sx={{ color: "#fff" }}
            href={poguesUrl}
            target="_blank"
            rel="noreferrer"
          >
            <LaunchIcon fontSize="small"></LaunchIcon>
            {intl.formatMessage({
              id: "menu_pogues",
            })}
          </Button>

          <Button
            sx={{ color: "#fff" }}
            href={documentationUrl}
            target="_blank"
            rel="noreferrer"
          >
            <TextSnippetIcon fontSize="small"></TextSnippetIcon>
            {intl.formatMessage({
              id: "menu_documentation",
            })}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
});

const useStyles = makeStyles()((theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
  },
  toolbar: {
    paddingRight: "24px",
  },
  burgerIcon: {
    marginRight: "24px",
  },
  globalTitle: {
    flexGrow: 1,
  },
}));

Header.displayName = "Header";
