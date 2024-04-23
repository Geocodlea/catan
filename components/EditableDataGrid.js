"use client";

import { useState, useCallback } from "react";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import AlertMsg from "./AlertMsg";
import ReactNodeCell from "./ReactNodeCell";

function EditToolbar({
  rows,
  setRows,
  setRowModesModel,
  uniqueField,
  showAddRecord,
}) {
  const handleClick = () => {
    let id;
    if (rows.length === 0) {
      id = 1;
    } else {
      const lastId = rows[rows.length - 1].id;
      id = lastId + 1;
    }

    setRows((oldRows) => [...oldRows, { id, isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: uniqueField },
    }));
  };

  return (
    <GridToolbarContainer
      sx={{ display: "flex", justifyContent: "space-between" }}
    >
      {showAddRecord && (
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add record
        </Button>
      )}
      <Box></Box>
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
}

const EditableDataGrid = ({
  columnsData,
  rowsData,
  apiURL,
  uniqueField,
  alertText,
  showAddRecord,
  showActions,
  disableColumnMenu,
  columnGroupingModel,
  pageSize,
  density,
  hideFooter,
}) => {
  const [alert, setAlert] = useState({ text: "", severity: "" });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [idDelete, setIdDelete] = useState();

  // Generate the columns array based on columnsData
  const columns = columnsData.map((item) => ({
    field: item.field,
    headerName: item.headerName,
    editable: item.editable,
    width: item.width,
    flex: item.flex,
    sortable: item.sortable,
    type: item.type,
    headerClassName: item.headerClassName,
    cellClassName: item.cellClassName,
    headerAlign: item.headerAlign,
    align: item.align,
    renderCell: ReactNodeCell,
  }));

  // Generate the initialRows array based on users and the dynamically generated columns
  const initialRows = rowsData.map((item, index) => {
    const row = { id: index };

    columns.map((col) => {
      row[col.field] = item[col.field];
    });

    return row;
  });

  if (showActions) {
    columns.push({
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              color="primary"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="error"
          />,
        ];
      },
    });
  }

  const [rows, setRows] = useState(initialRows);
  const [rowModesModel, setRowModesModel] = useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setIdDelete(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = (id) => async () => {
    setOpenDeleteDialog(false);
    const rowToDelete = rows.find((row) => row.id === id);

    try {
      const response = await fetch(
        `/api/${apiURL}/${rowToDelete[uniqueField]}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        // Check for non-successful HTTP status codes
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setAlert({
        text: `Successfully deleted ${alertText}`,
        severity: "success",
      });

      setRows(rows.filter((row) => row.id !== id));
    } catch (error) {
      // Handle any errors that occurred during the fetch operation
      setAlert({ text: `Error deleting ${alertText}`, severity: "error" });
    }
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const processRowUpdate = useCallback(async (newRow, oldRow) => {
    const body = {};

    columnsData.forEach((col) => {
      body[col.field] = newRow[col.field];
    });

    const apiUrl = newRow.isNew
      ? `/api/${apiURL}`
      : `/api/${apiURL}/${oldRow[uniqueField]}`;

    try {
      const method = newRow.isNew ? "POST" : "PUT";
      const response = await fetch(apiUrl, {
        method,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const actionText = newRow.isNew ? "created" : "updated";
      const updatedRow = { ...newRow, isNew: false };

      setAlert({
        text: `Successfully ${actionText} ${alertText}`,
        severity: "success",
      });

      setRows((rows) =>
        rows.map((row) => (row.id === newRow.id ? updatedRow : row))
      );

      return updatedRow;
    } catch (error) {
      const actionText = newRow.isNew ? "creating" : "updating";
      setAlert({ text: `Error ${actionText} ${alertText}`, severity: "error" });
    }
  });

  const handleProcessRowUpdateError = useCallback((error) => {
    setAlert({ text: `Error updating ${alertText}`, severity: "error" });
  }, []);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    id: false,
  });

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
        "& .table--highlight": {
          backgroundColor: "rgb(153 241 132 / 50%)",
        },
        "& .table--striped": {
          backgroundColor: "grey.200",
        },
      }}
    >
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete User?</DialogTitle>
        <DialogContent dividers>
          Are you sure you want to delete the user? The user will be permanently
          deleted.
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => setOpenDeleteDialog(false)}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={confirmDelete(idDelete)}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <DataGrid
        rows={rows}
        columns={columns}
        disableColumnMenu={disableColumnMenu}
        disableDensitySelector
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        slots={{ toolbar: EditToolbar }}
        onColumnVisibilityModelChange={(newModel) =>
          setColumnVisibilityModel(newModel)
        }
        slotProps={{
          toolbar: {
            rows,
            setRows,
            setRowModesModel,
            uniqueField,
            showAddRecord,
          },
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: pageSize,
            },
          },
          density: density,
        }}
        pageSizeOptions={[10, 25, 50]}
        columnVisibilityModel={columnVisibilityModel}
        columnGroupingModel={columnGroupingModel}
        hideFooter={hideFooter}
        getRowClassName={(params) => {
          if (params.indexRelativeToCurrentPage % 2 === 0)
            return "table--striped";
        }}
      />

      <AlertMsg alert={alert} />
    </Box>
  );
};

export default EditableDataGrid;
