import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import SearchIcon from "@mui/icons-material/Search";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import UploadIcon from "@mui/icons-material/Upload";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}
      sx={{ height: "100%" }}
    >
      <Container>
        <Typography textAlign="center" variant="h5">
          Welcome to Quick Walks!
        </Typography>
        <Typography variant="subtitle1" textAlign="center">
          A walking route discovery app by Ben Pearse
        </Typography>
      </Container>
      <Container maxWidth="md">
        <Stack
          divider={<Divider orientation="horizontal" flexItem />}
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 1, md: 2, lg: 4 }}
          justifyContent={{ xs: "center", md: "space-evenly" }}
          alignItems={{ xs: "stretch", md: "flex-start" }}
        >
          <Card sx={{ minWidth: "265px" }}>
            <CardActionArea component={Link} to="/routes">
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-around"
                  alignItems="center"
                  spacing={1}
                >
                  <Container>
                    <Typography variant="h5" component="h2" textAlign="center">
                      Find a route
                    </Typography>
                  </Container>
                  <SearchIcon color="primary" sx={{ fontSize: "75px" }} />
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card sx={{ minWidth: "265px" }}>
            <CardActionArea component={Link} to="/bookmarks">
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-around"
                  alignItems="center"
                  spacing={1}
                >
                  <Container>
                    <Typography variant="h5" component="h2" textAlign="center">
                      Bookmarked routes
                    </Typography>
                  </Container>
                  <BookmarksIcon color="primary" sx={{ fontSize: "75px" }} />
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card sx={{ minWidth: "265px" }}>
            <CardActionArea component={Link} to="/upload">
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-around"
                  alignItems="center"
                  spacing={1}
                >
                  <Container>
                    <Typography variant="h5" component="h2" textAlign="center">
                      Upload a route
                    </Typography>
                  </Container>
                  <UploadIcon color="primary" sx={{ fontSize: "75px" }} />
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        </Stack>
      </Container>
    </Stack>
  );
};

export default Home;
