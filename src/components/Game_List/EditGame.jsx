import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  TextField,
  Button,
  Popover,
  Snackbar,
  SnackbarContent,
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useSelector, useDispatch } from "react-redux";
import {
  selectGameListData,
  fetchGameListData,
  updateGameListData,
} from "../../app/gameListSlice";
import { baseTheme } from "../../assets/global/Theme-variable";
import {
  fetchGameCategoryData,
  selectGameCategoryData,
  selectGameCategoryError,
  selectGameCategoryLoading,
} from "../../app/gameCategorySlice";

const EditGame = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const categoryData = useSelector(selectGameCategoryData);
  const categoryError = useSelector(selectGameCategoryError);
  const categoryLoading = useSelector(selectGameCategoryLoading);
  const { gameId: gameIdParam } = useParams();
  const [editMode, setEditMode] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fileErrors, setFileErrors] = useState({
    gameThumbnail: "",
    gameGraphics1: "",
    gameGraphics2: "",
    gameGraphics3: "",
  });

  const [data, setData] = useState({
    categoryId: "",
    gameTitle: "",
    gameInfo: "",
    gameStartBid: "",
    gameMaxBid: "",
    gameType: "",
    gameCountDown: "",
    gameMaxWiningPercentage: "",
    gameThumbnail: file,
    gameGraphics1: "",
    gameGraphics2: "",
    gameGraphics3: "",
    status: "",
    totalPlayed: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    dispatch(updateGameListData(data.gameId, data))
      .then(() => {
        toggleEditMode();
        setIsSuccess(true);
        showSnackbar("Game updated successfully!");
        console.log(data);

        setTimeout(() => {
          navigate("../game/game-list");
        }, 1000);
      })

      .catch((error) => {
        setIsSuccess(false);
        showSnackbar("Error in updating game. Please try again.");
        console.error("Error in updating game:", error);
      });
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (files.length > 0) {
      const selectedFile = files[0];
      const allowedExtensions = ["jpg", "png", "webp", "jpeg"];
      const fileNameParts = selectedFile.name.split(".");
      const fileExtension =
        fileNameParts[fileNameParts.length - 1].toLowerCase();

      // Check if the file extension is allowed
      if (allowedExtensions.includes(fileExtension)) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setData((prevData) => ({
            ...prevData,
            [name]: event.target.result,
          }));
          setFileErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
          }));
        };
        reader.readAsDataURL(selectedFile);
      } else {
        // Set file error message for invalid file extension
        setFileErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Please select a JPG, PNG, WEBP, or JPEG image.",
        }));
      }
    }
  };

  const [loading, setLoading] = useState(true);
  const gameData = useSelector(selectGameListData);

  const fetchgameDataById = () => {
    const gameId = parseInt(gameIdParam);
    const selectedgame = gameData.find((game) => game.gameId === gameId);
    setData({ ...selectedgame });
    setLoading(false);
  };

  useEffect(() => {
    if (gameData.length === 0) {
      dispatch(fetchGameListData());
    } else {
      fetchgameDataById();
    }
  }, [gameIdParam, dispatch, gameData]);

  useEffect(() => {
    dispatch(fetchGameCategoryData());
}, [dispatch]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    if (!isSuccess) {
      setSnackbarOpen(false);
    }
  };

  const showSnackbar = (message) => {
    setSnackbarOpen(true);
  };

  const handleImageClick = (event) => {
    setPopoverAnchor(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
  };

  const handleImageChange = () => {
    const fileInput = document.getElementById("gameThumbnail");
    if (fileInput) {
      fileInput.click();
    }
  };

  const toggleEditMode = () => {
    setEditMode((prevEditMode) => !prevEditMode);
  };

  if (categoryLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="primary" size={120} thickness={4} />
      </div>
    );
  }

  if (categoryError) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <Typography variant="h4" color="error" gutterBottom>
          Oops! Something went wrong.
        </Typography>
        <Typography variant="body1" color="textSecondary" align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h4">Edit game - {data && data.gameId}</Typography>
        <br />
        <Divider />
        <br />
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {[
              "gameThumbnail",
              "gameGraphics1",
              "gameGraphics2",
              "gameGraphics3",
            ].map((imageType, index) => (
              <Grid item xs={12} md={3} key={index}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "150px",
                    width: "210px",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={data[imageType]}
                    alt="Preview"
                    id={imageType}
                    name={imageType}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "130px",
                      marginRight: "10px",
                      marginTop: "auto",
                    }}
                    onClick={handleImageClick}
                  />
                  {editMode && (
                    <Popover
                      open={Boolean(popoverAnchor)}
                      anchorEl={popoverAnchor}
                      onClose={handlePopoverClose}
                      disabled={!editMode}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                    >
                      <input
                        type="file"
                        id={imageType}
                        name={imageType}
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                      />
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={() => handleImageChange(imageType)}
                        startIcon={<AddIcon />}
                      >
                        Change
                      </Button>
                    </Popover>
                  )}
                </Card>
                {fileErrors[imageType] && (
                  <Typography variant="body2" color="error">
                    {fileErrors[imageType]}
                  </Typography>
                )}
              </Grid>
            ))}

            <Grid item xs={12} sm={6}>
              <FormControl variant="outlined" fullWidth disabled={!editMode}>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  label="Category"
                  name="categoryId"
                  value={data && data.categoryId}
                  onChange={handleTextChange}
                >
                  {categoryData.map((category) => (
                    <MenuItem key={category.crId} value={category.crId}>
                      {category.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Title"
                variant="outlined"
                name="gameTitle"
                onChange={handleTextChange}
                fullWidth
                value={data && data.gameTitle}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Info"
                variant="outlined"
                name="gameInfo"
                onChange={handleTextChange}
                fullWidth
                value={data && data.gameInfo}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Start Bid"
                variant="outlined"
                name="gameStartBid"
                onChange={handleTextChange}
                fullWidth
                value={data && data.gameStartBid}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Max Bid"
                variant="outlined"
                name="gameMaxBid"
                onChange={handleTextChange}
                fullWidth
                value={data && data.gameMaxBid}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined" required sx={{ mb: 2 }}>
                <InputLabel htmlFor="Type">Type</InputLabel>
                <Select
                  label="Type"
                  variant="outlined"
                  name="gameType"
                  onChange={handleTextChange}
                  fullWidth
                  value={data && data.gameType}
                  disabled={!editMode}
                >
                  <MenuItem value="colorTwo">Color Two</MenuItem>
                  <MenuItem value="imageTwo">Image Two</MenuItem>
                  <MenuItem value="ImageColorTwo">Image Color Two</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Count Down"
                variant="outlined"
                name="gameCountDown"
                onChange={handleTextChange}
                fullWidth
                value={data && data.gameCountDown}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Max Winning Percentage"
                variant="outlined"
                name="gameMaxWiningPercentage"
                onChange={handleTextChange}
                fullWidth
                value={data && data.gameMaxWiningPercentage}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined" required sx={{ mb: 2 }}>
                <InputLabel htmlFor="Status">Status</InputLabel>
                <Select
                  label="Status"
                  variant="outlined"
                  name="status"
                  onChange={handleTextChange}
                  fullWidth
                  value={data && data.status}
                  disabled={!editMode}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Total Played"
                variant="outlined"
                name="totalPlayed"
                onChange={handleTextChange}
                fullWidth
                value={data && data.totalPlayed}
                disabled={!editMode}
              />
            </Grid>
          </Grid>
          <br />
          <Divider />
          <br />
          {editMode ? (
            <>
              <Button
                variant="contained"
                color="success"
                type="submit"
                onSubmit={handleSubmit}
              >
                Save
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{ ml: 1 }}
                onClick={toggleEditMode}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={toggleEditMode}
            >
              Edit
            </Button>
          )}
        </form>

        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={handleSnackbarClose}
        >
          <SnackbarContent
            message="Game updated successfully!"
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleSnackbarClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
            sx={{
              backgroundColor: isSuccess
                ? baseTheme.palette.success.main
                : baseTheme.palette.error.main,
              color: isSuccess ? "#fff" : undefined,
            }}
          />
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default EditGame;
