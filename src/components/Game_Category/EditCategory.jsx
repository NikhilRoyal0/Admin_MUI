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
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useSelector, useDispatch } from "react-redux";
import {
  selectGameCategoryData,
  fetchGameCategoryData,
  updateGameCategoryData,
} from "../../app/gameCategorySlice";
import { baseTheme } from "../../assets/global/Theme-variable";

const EditCategory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { crId: crIdParam } = useParams();
  const [editMode, setEditMode] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fileError, setFileError] = useState(""); // State for file error message

  const [data, setData] = useState({
    title: "",
    info: "",
    imageLink: file,
    status: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    dispatch(updateGameCategoryData(data.crId, data))
      .then(() => {
        toggleEditMode();
        setIsSuccess(true);
        showSnackbar("Category updated successfully!");
        console.log(data);

        setTimeout(() => {
          navigate("../game/game-category");
        }, 1000);
      })

      .catch((error) => {
        setIsSuccess(false);
        showSnackbar("Error in updating category. Please try again.");
        console.error("Error in updating category:", error);
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
          setFile(event.target.result);
          setData((prevData) => ({
            ...prevData,
            [name]: event.target.result,
          }));
          setFileError(""); // Reset file error
        };
        reader.readAsDataURL(selectedFile);
      } else {
        // Set file error message for invalid file extension
        setFileError("Please select a JPG, PNG, WEBP, or JPEG image.");
      }
    }
  };

  const [loading, setLoading] = useState(true);
  const categoryData = useSelector(selectGameCategoryData);

  const fetchcategoryDataById = () => {
    const crId = parseInt(crIdParam);
    const selectedcategory = categoryData.find(
      (category) => category.crId === crId
    );
    setData({ ...selectedcategory });
    setLoading(false);
  };

  useEffect(() => {
    if (categoryData.length === 0) {
      dispatch(fetchGameCategoryData());
    } else {
      fetchcategoryDataById();
    }
  }, [crIdParam, dispatch, categoryData]);

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
    const fileInput = document.getElementById("imageLink");
    if (fileInput) {
      fileInput.click();
    }
  };

  const toggleEditMode = () => {
    setEditMode((prevEditMode) => !prevEditMode);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4">
          Edit category - {data && data.crId}
        </Typography>
        <br />
        <Divider />
        <br />
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <Card
                variant="outlined"
                sx={{
                  height: "150px",
                  width: "210px",
                  textAlign: "center",
                }}
              >
                <img
                  src={file || (data && data.imageLink)}
                  alt="Preview"
                  id="image"
                  name="imageLink"
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
                      id="imageLink"
                      name="imageLink"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={handleImageChange}
                      startIcon={<AddIcon />}
                    >
                      Change
                    </Button>
                  </Popover>
                )}
              </Card>
              {fileError && (
                <Typography variant="body2" color="error">
                  {fileError}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Title"
                variant="outlined"
                name="title"
                onChange={handleTextChange}
                fullWidth
                value={data && data.title}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Info"
                variant="outlined"
                name="info"
                onChange={handleTextChange}
                fullWidth
                value={data && data.info}
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
            message="Category updated successfully!"
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

export default EditCategory;
