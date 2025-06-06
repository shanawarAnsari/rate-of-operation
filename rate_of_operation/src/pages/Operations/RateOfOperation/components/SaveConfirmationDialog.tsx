import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

interface SaveConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reviewedRecipes: any[];
  originalData: any[];
  isSaving?: boolean;
}

const SaveConfirmationDialog: React.FC<SaveConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  reviewedRecipes,
  originalData,
  isSaving = false,
}) => {
  // Get original values for comparison
  const getOriginalValues = (recipeKey: string) => {
    return originalData.find(
      (item) =>
        item.RATE_OF_OPERATION_KEY === recipeKey || item.RECIPE_NUMBER === recipeKey
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box>
          <Typography variant="h6">Confirm Recipe Updates</Typography>
          <Typography variant="body2" color="text.secondary">
            {`You are about to update ${reviewedRecipes.length} recipe${reviewedRecipes.length > 1 ? "s" : ""}. Please
            review the changes below:`}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 1.5 }}>
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: 600,
            boxShadow: "none",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1.5,
            overflow: "hidden",
          }}
        >
          <Table
            stickyHeader
            size="small"
            sx={{ "& .MuiTableCell-root": { py: 0.75, px: 1.5 } }}
          >
            <TableHead>
              <TableRow
                sx={{
                  "& .MuiTableCell-head": {
                    backgroundColor: (theme) => theme.palette.background.paper,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  },
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: "text.secondary",
                    width: "25%",
                  }}
                >
                  Recipe Key
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: "text.secondary",
                    width: "25%",
                  }}
                >
                  Rate of Operation
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: "text.secondary",
                    width: "15%",
                  }}
                >
                  Change %
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: "text.secondary",
                    width: "25%",
                  }}
                >
                  Planning Time
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: "text.secondary",
                    width: "10%",
                  }}
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviewedRecipes.map((recipe, index) => {
                const originalValues = getOriginalValues(
                  recipe.RATE_OF_OPERATION_KEY
                );

                // Calculate percentage change for display
                const changePercent =
                  originalValues?.NEW_RO && recipe.NEW_RO
                    ? (
                      ((recipe.NEW_RO - originalValues.NEW_RO) /
                        originalValues.NEW_RO) *
                      100
                    ).toFixed(1)
                    : null;

                return (
                  <TableRow
                    key={index}
                    sx={{
                      "&:nth-of-type(even)": { backgroundColor: "grey.25" },
                      "&:hover": { backgroundColor: "action.hover" },
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        fontSize: "0.9rem",
                        color: "text.primary",
                        fontFamily: "monospace",
                      }}
                    >
                      {recipe.RATE_OF_OPERATION_KEY}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {originalValues?.NEW_RO && recipe.NEW_RO && (
                            <>
                              {parseFloat(recipe.NEW_RO) >
                                parseFloat(originalValues.NEW_RO) && (
                                  <ArrowUpwardIcon
                                    fontSize="small"
                                    sx={{
                                      color: "success.600",
                                      mr: 0.5,
                                      fontSize: "0.9rem",
                                    }}
                                  />
                                )}
                              {parseFloat(recipe.NEW_RO) <
                                parseFloat(originalValues.NEW_RO) && (
                                  <ArrowDownwardIcon
                                    fontSize="small"
                                    sx={{
                                      color: "error.600",
                                      mr: 0.5,
                                      fontSize: "0.9rem",
                                    }}
                                  />
                                )}
                            </>
                          )}
                          <Typography
                            sx={{
                              fontSize: "0.9rem",
                              fontWeight: 600,
                              color: "primary.main",
                            }}
                          >
                            {recipe.NEW_RO}
                          </Typography>
                        </Box>
                        <Typography
                          sx={{ fontSize: "0.85rem", color: "text.secondary" }}
                        >
                          (was {originalValues?.NEW_RO || "-"})
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {changePercent ? (
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            px: 0.75,
                            py: 0.25,
                            borderRadius: 1,
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            backgroundColor: (theme) =>
                              theme.palette.mode === "light"
                                ? theme.palette.grey[200]
                                : theme.palette.grey[800],


                          }}
                        >
                          {parseFloat(changePercent) > 0 ? (
                            <>
                              <ArrowUpwardIcon
                                sx={{ fontSize: "0.85rem", mr: 0.5 }}
                              />
                              +{changePercent}%
                            </>
                          ) : parseFloat(changePercent) < 0 ? (
                            <>
                              <ArrowDownwardIcon
                                sx={{ fontSize: "0.85rem", mr: 0.5 }}
                              />
                              {changePercent}%
                            </>
                          ) : (
                            <>{changePercent}%</>
                          )}
                        </Box>
                      ) : (
                        <Typography
                          sx={{ fontSize: "0.7rem", color: "text.disabled" }}
                        >
                          -
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {originalValues?.NEW_PLANNING_TIME &&
                            recipe.NEW_PLANNING_TIME && (
                              <>
                                {parseFloat(recipe.NEW_PLANNING_TIME) >
                                  parseFloat(originalValues.NEW_PLANNING_TIME) && (
                                    <ArrowUpwardIcon
                                      fontSize="small"
                                      sx={{
                                        color: "success.600",
                                        mr: 0.5,
                                        fontSize: "0.9rem",
                                      }}
                                    />
                                  )}
                                {parseFloat(recipe.NEW_PLANNING_TIME) <
                                  parseFloat(originalValues.NEW_PLANNING_TIME) && (
                                    <ArrowDownwardIcon
                                      fontSize="small"
                                      sx={{
                                        color: "error.600",
                                        mr: 0.5,
                                        fontSize: "0.9rem",
                                      }}
                                    />
                                  )}
                              </>
                            )}
                          <Typography
                            sx={{
                              fontSize: "0.9rem",
                              fontWeight: 600,
                              color: "text.primary",
                            }}
                          >
                            {recipe.NEW_PLANNING_TIME}
                          </Typography>
                        </Box>
                        <Typography
                          sx={{ fontSize: "0.85rem", color: "text.secondary" }}
                        >
                          (was {originalValues?.NEW_PLANNING_TIME || "-"})
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                      }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "start",
                            backgroundColor: "success.100",
                            color: "success.800",
                            px: 0.75,
                            py: 0.25,
                            borderRadius: 2,
                            fontSize: "0.65rem",
                            fontWeight: 600,
                            letterSpacing: "0.02em",
                          }}
                        >
                          <Box
                            sx={{
                              width: 4,
                              height: 4,
                              borderRadius: "50%",
                              backgroundColor: "success.600",
                              mr: 0.5,
                            }}
                          />
                          REVIEWED
                        </Box>
                        <Typography
                          sx={{ fontSize: "0.85rem", color: "text.secondary", whiteSpace: "nowrap" }}
                        >
                          (was N)
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={isSaving}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="primary"
          disabled={isSaving}
          startIcon={isSaving ? <CircularProgress size={20} /> : null}
        >
          {isSaving
            ? "Saving..."
            : `Confirm & Save (${reviewedRecipes.length} recipes)`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveConfirmationDialog;