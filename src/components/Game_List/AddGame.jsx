import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardActionArea,
  Divider,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Popover,
  Snackbar,
  SnackbarContent,
  IconButton,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { AddData } from "../../app/gameListSlice";
import { useNavigate } from "react-router-dom";
import { baseTheme } from "../../assets/global/Theme-variable";
import LoadingButton from "@mui/lab/LoadingButton";
import CircularProgress from "@mui/material/CircularProgress";
import {
  fetchGameCategoryData,
  selectGameCategoryData,
  selectGameCategoryError,
  selectGameCategoryLoading,
} from "../../app/gameCategorySlice";

const AddGame = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const categoryData = useSelector(selectGameCategoryData);
  const categoryError = useSelector(selectGameCategoryError);
  const categoryLoading = useSelector(selectGameCategoryLoading);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [gameGraphic1, setgameGraphic1] = React.useState(null);
  const [gameGraphic2, setgameGraphic2] = React.useState(null);
  const [gameGraphic3, setgameGraphic3] = React.useState(null);
  const [popoverAnchor, setPopoverAnchor] = React.useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileWarning, setFileWarning] = useState("");

  const [formData, setFormData] = React.useState({
    categoryId: "",
    gameTitle: "",
    gameInfo: "",
    gameStartBid: "",
    gameMaxBid: "",
    gameType: "",
    gameCountDown: "",
    gameMaxWiningPercentage: "",
    gameThumbnail: selectedFile,
    gameGraphics1: gameGraphic1,
    gameGraphics2: gameGraphic2,
    gameGraphics3: gameGraphic3,
    status: "",
    totalPlayed: "",
  });

  useEffect(() => {
      dispatch(fetchGameCategoryData());
  }, [dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Start loading

    if (!selectedFile || !gameGraphic1 || !gameGraphic2 || !gameGraphic3) {
      setFileWarning("Please select an image file.");
      setIsLoading(false); // Stop loading
      return;
    }

    const form = new FormData();
    form.append("categoryId", formData.categoryId);
    form.append("gameTitle", formData.gameTitle);
    form.append("gameInfo", formData.gameInfo);
    form.append("gameStartBid", formData.gameStartBid);
    form.append("gameMaxBid", formData.gameMaxBid);
    form.append("gameType", formData.gameType);
    form.append("gameCountDown", formData.gameCountDown);
    form.append("gameMaxWiningPercentage", formData.gameMaxWiningPercentage);
    form.append("gameThumbnail", selectedFile);
    form.append("gameGraphics1", gameGraphic1);
    form.append("gameGraphics2", gameGraphic2);
    form.append("gameGraphics3", gameGraphic3);
    form.append("status", formData.status);
    form.append("totalPlayed", formData.totalPlayed);

    dispatch(AddData(form))
      .then(() => {
        setIsSuccess(true);
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate("../game/game-list");
        }, 1000);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    if (!isSuccess) {
      setSnackbarOpen(false);
    }
  };

  const handleFileSelect = (event, field) => {
    const file = event.target.files[0];
    const allowedExtensions = ["jpg", "png", "webp", "jpeg"];

    if (file) {
      const fileNameParts = file.name.split(".");
      const fileExtension =
        fileNameParts[fileNameParts.length - 1].toLowerCase();

      // Check if the file extension is allowed
      if (allowedExtensions.includes(fileExtension)) {
        switch (field) {
          case "thumbnail":
            setSelectedFile(file);
            setFormData({ ...formData, gameThumbnail: file });
            break;
          case "graphic1":
            setgameGraphic1(file);
            setFormData({ ...formData, gameGraphics1: file });
            break;
          case "graphic2":
            setgameGraphic2(file);
            setFormData({ ...formData, gameGraphics2: file });
            break;
          case "graphic3":
            setgameGraphic3(file);
            setFormData({ ...formData, gameGraphics3: file });
            break;
          default:
            break;
        }
        setFileWarning("");
      } else {
        setFileWarning("Please select a JPG, PNG, WEBP, or JPEG image.");
      }
    }
  };

  const handleRemoveClick = (field) => {
    switch (field) {
      case "thumbnail":
        setSelectedFile(null);
        setFormData({ ...formData, gameThumbnail: null });
        break;
      case "graphic1":
        setgameGraphic1(null);
        setFormData({ ...formData, gameGraphics1: null });
        break;
      case "graphic2":
        setgameGraphic2(null);
        setFormData({ ...formData, gameGraphics2: null });
        break;
      case "graphic3":
        setgameGraphic3(null);
        setFormData({ ...formData, gameGraphics3: null });
        break;
      default:
        break;
    }
    setPopoverAnchor(null);
  };
  const handleImageClick = (event) => {
    setPopoverAnchor(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
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
    <div>
      <Card
        variant="outlined"
        sx={{
          p: 0,
          borderRadius: baseTheme.shape.borderRadius,
          padding: baseTheme.mixins.toolbar.padding,
        }}
      >
        <Box
          sx={{
            padding: "15px 30px",
          }}
          display="flex"
          alignItems="center"
        >
          <Box flexGrow={1}>
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: "500",
              }}
            >
              Add Game
            </Typography>
          </Box>
        </Box>
        <Divider />
        <CardContent
          sx={{
            padding: "30px",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Game Thumbnail Upload */}
              <Grid item xs={12} md={3}>
                {selectedFile ? (
                  <Card
                    variant="outlined"
                    sx={{
                      height: "150px",
                      width: "190px",
                      textAlign: "center",
                    }}
                  >
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      id="gameThumbnail"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "130px",
                        marginRight: "10px",
                        marginTop: "auto",
                      }}
                      onClick={handleImageClick}
                    />
                    <Popover
                      open={Boolean(popoverAnchor)}
                      anchorEl={popoverAnchor}
                      onClose={handlePopoverClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                    >
                      <Box p={2}>
                        <Button
                          color="secondary"
                          variant="contained"
                          onClick={() => handleRemoveClick("thumbnail")}
                          startIcon={<CancelIcon />}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Popover>
                    <Typography sx={{ mt: 1, fontSize: 9 }}>
                      Selected File: {selectedFile.name}
                    </Typography>
                  </Card>
                ) : (
                  <label htmlFor="file-input-thumbnail">
                    <input
                      id="file-input-thumbnail"
                      type="file"
                      name="gameThumbnail"
                      onChange={(e) => handleFileSelect(e, "thumbnail")}
                      style={{ display: "none" }}
                      required
                    />
                    <Card
                      sx={{
                        maxWidth: 210,
                        height: 150,
                        textAlign: "center",
                        display: "flex",
                      }}
                    >
                      <CardActionArea
                        onClick={() =>
                          document
                            .getElementById("file-input-thumbnail")
                            .click()
                        }
                      >
                        <CardContent>
                          <AddIcon
                            sx={{
                              fontSize: 40,
                              color: "#808080",
                              cursor: "pointer",
                            }}
                          />
                          <br />
                          <Typography variant="caption" sx={{ color: "#000" }}>
                            Upload Image
                          </Typography>
                          <br />
                          <Typography
                            variant="caption"
                            sx={{ color: "#808080" }}
                          >
                            Thumbnail size should be 500 x 500
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </label>
                )}
              </Grid>

              {[gameGraphic1, gameGraphic2, gameGraphic3].map(
                (graphic, index) => (
                  <Grid item xs={12} md={3} key={index}>
                    {graphic ? (
                      <Card
                        variant="outlined"
                        sx={{
                          height: "150px",
                          width: "190px",
                          textAlign: "center",
                        }}
                      >
                        <img
                          src={URL.createObjectURL(graphic)}
                          alt="Preview"
                          id={`gameGraphic${index + 1}`}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "130px",
                            marginRight: "10px",
                            marginTop: "auto",
                          }}
                          onClick={handleImageClick}
                        />
                        <Popover
                          open={Boolean(popoverAnchor)}
                          anchorEl={popoverAnchor}
                          onClose={handlePopoverClose}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "center",
                          }}
                        >
                          <Box p={2}>
                            <Button
                              color="secondary"
                              variant="contained"
                              onClick={() =>
                                handleRemoveClick(`graphic${index + 1}`)
                              }
                              startIcon={<CancelIcon />}
                            >
                              Remove
                            </Button>
                          </Box>
                        </Popover>
                        <Typography sx={{ mt: 1, fontSize: 9 }}>
                          Selected File: {graphic.name}
                        </Typography>
                      </Card>
                    ) : (
                      <label htmlFor={`file-input-graphic${index + 1}`}>
                        <input
                          id={`file-input-graphic${index + 1}`}
                          type="file"
                          name={`gameGraphics${index + 1}`}
                          onChange={(e) =>
                            handleFileSelect(e, `graphic${index + 1}`)
                          }
                          style={{ display: "none" }}
                          required
                        />
                        <Card
                          sx={{
                            maxWidth: 210,
                            height: 150,
                            textAlign: "center",
                            display: "flex",
                          }}
                        >
                          <CardActionArea
                            onClick={() =>
                              document
                                .getElementById(
                                  `file-input-graphic${index + 1}`
                                )
                                .click()
                            }
                          >
                            <CardContent>
                              <AddIcon
                                sx={{
                                  fontSize: 40,
                                  color: "#808080",
                                  cursor: "pointer",
                                }}
                              />
                              <br />
                              <Typography
                                variant="caption"
                                sx={{ color: "#000" }}
                              >
                                Upload Image
                              </Typography>
                              <br />
                              <Typography
                                variant="caption"
                                sx={{ color: "#808080" }}
                              >
                                Image size should be 500 x 500
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </label>
                    )}
                  </Grid>
                )
              )}

              <Grid item xs={12} md={6}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                >
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="categoryId"
                    name="categoryId"
                    onChange={handleInputChange}
                    label="Category"
                  >
                    {categoryData.map((category) => (
                      <MenuItem key={category.crId} value={category.crId}>
                        {category.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="gameTitle"
                  label="Title"
                  variant="outlined"
                  name="gameTitle"
                  fullWidth
                  required
                  onChange={handleInputChange}
                  sx={{
                    mb: 2,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="gameInfo"
                  label="Info"
                  variant="outlined"
                  name="gameInfo"
                  fullWidth
                  required
                  onChange={handleInputChange}
                  sx={{
                    mb: 2,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="gameStartBid"
                  label="Start Bid"
                  variant="outlined"
                  name="gameStartBid"
                  fullWidth
                  required
                  onChange={handleInputChange}
                  sx={{
                    mb: 2,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="gameMaxBid"
                  label="Max Bid"
                  variant="outlined"
                  name="gameMaxBid"
                  fullWidth
                  required
                  onChange={handleInputChange}
                  sx={{
                    mb: 2,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  sx={{ mb: 2 }}
                >
                  <InputLabel htmlFor="Type">Type</InputLabel>
                  <Select
                    label="Type"
                    id="gameType"
                    name="gameType"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="colorTwo">Color Two</MenuItem>
                    <MenuItem value="imageTwo">Image Two</MenuItem>
                    <MenuItem value="ImageColorTwo">Image Color Two</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="gameCountDown"
                  label="Count Down"
                  variant="outlined"
                  name="gameCountDown"
                  fullWidth
                  required
                  onChange={handleInputChange}
                  sx={{
                    mb: 2,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="gameMaxWiningPercentage"
                  label="Max Winning Percentage"
                  variant="outlined"
                  name="gameMaxWiningPercentage"
                  fullWidth
                  required
                  onChange={handleInputChange}
                  sx={{
                    mb: 2,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  sx={{ mb: 2 }}
                >
                  <InputLabel htmlFor="Status">Status</InputLabel>
                  <Select
                    label="Status"
                    id="status"
                    name="status"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="totalPlayed"
                  label="Total Played"
                  variant="outlined"
                  name="totalPlayed"
                  fullWidth
                  required
                  onChange={handleInputChange}
                  sx={{
                    mb: 2,
                  }}
                />
              </Grid>
            </Grid>
            <div>
              <br />
              <LoadingButton
                color="secondary"
                variant="contained"
                type="submit"
                loading={isLoading}
              >
                Submit
              </LoadingButton>
            </div>
          </form>
        </CardContent>
      </Card>
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
          message="New Category added successfully!"
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
    </div>
  );
};

export default AddGame;
