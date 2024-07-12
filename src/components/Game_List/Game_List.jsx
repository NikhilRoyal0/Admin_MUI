import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
} from "@mui/material";
import errorimage from "../../assets/images/errorimage.jpg";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGameListData,
  selectGameListData,
  selectGameListLoading,
  selectGameListError,
  deleteGameListData,
} from "../../app/gameListSlice";

const Game_List = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const GameListData = useSelector(selectGameListData);
  const isLoading = useSelector(selectGameListLoading);
  const error = useSelector(selectGameListError);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [GameListToDelete, setGameListToDelete] = useState(null);
  const [selectedGameList, setSelectedGameList] = useState(null);
  const [fullArticleDialogOpen, setFullArticleDialogOpen] = useState(false);

  const deleteClick = (GameList) => {
    setGameListToDelete(GameList);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (GameListToDelete) {
      dispatch(deleteGameListData(GameListToDelete.gameId)).then(() => {
        setDeleteConfirmationOpen(false);
        setGameListToDelete(null);
        dispatch(fetchGameListData());
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false);
    setGameListToDelete(null);
  };

  useEffect(() => {
    dispatch(fetchGameListData());
  }, [dispatch]);

  if (isLoading) {
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

  if (error) {
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
  const editClick = (GameList) => {
    navigate(`edit/${GameList.gameId}`);
  };

  const handleClick = () => {
    navigate("newGame");
  };

  const openFullArticleDialog = (GameList) => {
    setSelectedGameList(GameList);
    setFullArticleDialogOpen(true);
  };

  const closeFullArticleDialog = () => {
    setFullArticleDialogOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <Button
        sx={{
          position: "absolute",
          top: "10px",
          right: "30px",
          mt: "5px",
          zIndex: 1,
        }}
        color="primary"
        onClick={handleClick}
      >
        <AddIcon />
        <Typography sx={{ ml: 1 }}>Add Game</Typography>
      </Button>
      <Card>
        <CardContent
          sx={{
            paddingLeft: 0,
            paddingRight: 0,
          }}
        >
          <Grid container sx={{ marginTop: "25px" }}>
            {GameListData.map((GameList, index) => (
              <Grid
                key={index}
                item
                xs={12}
                sm={6}
                md={4}
                lg={4}
                xl={3}
                sx={{
                  display: "flex",
                  alignItems: "stretch",
                }}
              >
                <Card
                  variant="outlined"
                  sx={{
                    p: 0,
                    width: "100%",
                    mt: "8px",
                    maxHeight: "600px",
                  }}
                >
                  <img
                    src={GameList.gameThumbnail}
                    alt={GameList.gameThumbnail}
                    onError={(e) => {
                      e.target.src = errorimage;
                      e.target.alt = "Error Image";
                    }}
                    width="100%"
                    height="210px"
                    style={{
                      objectFit: "contain",
                    }}
                  />
                  <CardContent
                    sx={{
                      maxHeight: "500px",
                      paddingLeft: "30px",
                      paddingRight: "30px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "h4.fontSize",
                        fontWeight: "500",
                      }}
                    >
                      {GameList.categoryId}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      sx={{
                        fontSize: "14px",
                        fontWeight: "400",
                        mt: 1,
                      }}
                    >
                      {GameList.gameTitle}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "h4.fontSize",
                        fontWeight: "500",
                        overflow: "hidden",
                        maxWidth: "100%",
                      }}
                    >
                      {GameList.gameInfo.length <= 15 ? (
                        GameList.gameInfo
                      ) : (
                        <>
                          {GameList.gameInfo.split(" ").slice(0, 5).join(" ")}
                          <span
                            style={{
                              fontSize: "15px",
                              color: "blue",
                              cursor: "pointer",
                              display: "inline-block",
                              marginLeft: "4px",
                            }}
                            onClick={() => openFullArticleDialog(GameList)}
                          >
                            ...{" "}
                            <span style={{ display: "inline" }}>read more</span>
                          </span>
                        </>
                      )}
                    </Typography>
                    <br />
                    <br />
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => editClick(GameList)}
                      sx={{ mt: "auto", ml: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => deleteClick(GameList)}
                      sx={{ mt: "auto", ml: 1 }}
                    >
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
      <Dialog open={fullArticleDialogOpen} onClose={closeFullArticleDialog}>
        <DialogTitle>{selectedGameList?.gameTitle}</DialogTitle>
        <DialogContent>
          <img
            src={selectedGameList?.gameThumbnail}
            alt={selectedGameList?.gameThumbnail}
            onError={(e) => {
              e.target.src = errorimage;
              e.target.alt = "Error Image";
            }}
            width="100%"
            height="210px"
            style={{
              objectFit: "contain",
            }}
          />
          <Typography>Category Id: {selectedGameList?.categoryId}</Typography>
          <Typography>Game Info: {selectedGameList?.gameInfo}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeFullArticleDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteConfirmationOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this Game ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button sx={{ mr: 1 }} onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button
            sx={{ ml: 1 }}
            onClick={handleDeleteConfirm}
            color="error"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Game_List;
