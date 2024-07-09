"use client";
import ObjectID from "bson-objectid";
import { isEqual } from "lodash";

import { useState, useEffect, useCallback } from "react";

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
} from "@mui/x-data-grid";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Skeleton from "@mui/material/Skeleton";

import AlertMsg from "./AlertMsg";
import ReactNodeCell from "./ReactNodeCell";

function EditToolbar({ setRows, setRowModesModel, showAddRecord, hideSearch }) {
  const addRecord = () => {
    const id = ObjectID().toString();

    setRows((oldRows) => [...oldRows, { id, isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: id },
    }));
  };

  return (
    <GridToolbarContainer
      sx={{ display: "flex", justifyContent: "space-between" }}
    >
      {showAddRecord && (
        <Button color="primary" startIcon={<AddIcon />} onClick={addRecord}>
          Add record
        </Button>
      )}
      <Box></Box>
      {!hideSearch && <GridToolbarQuickFilter />}
    </GridToolbarContainer>
  );
}

const EditableDataGrid = ({
  columnsData,
  rowsData,
  apiURL,
  alertText,
  showAddRecord,
  showActions,
  disableColumnMenu,
  columnGroupingModel,
  pageSize,
  density,
  hideFooter,
  hideSearch,
  hiddenColumn,
  loading,
}) => {
  const [alert, setAlert] = useState({ text: "", severity: "" });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [idDelete, setIdDelete] = useState();
  const [loadData, setLoadData] = useState(true);

  // Generate the columns array based on columnsData
  const columns = columnsData.map((item) => ({
    field: item.field,
    headerName: item.headerName,
    editable: item.editable,
    width: item.width,
    minWidth: item.minWidth,
    flex: item.flex,
    sortable: item.sortable,
    type: item.type,
    headerClassName: item.headerClassName,
    cellClassName: item.cellClassName,
    headerAlign: item.headerAlign,
    align: item.align,
    hidden: item.hidden,
    renderCell: ReactNodeCell,
  }));

  // Update rows state when initialRows prop changes
  useEffect(() => {
    // Map rowsData to the format expected by the Data Grid component
    const initialRows = rowsData.map((item, index) => {
      const row = { id: index };

      columns.map((col) => {
        row.nr = index + 1;
        row[col.field] = item[col.field];
      });

      return row;
    });

    setRows(initialRows);
    setLoadData(false);
  }, [rowsData]);

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

  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

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
      const response = await fetch(`/api/${apiURL}/${rowToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success === false) {
        throw new Error(data.message);
      }

      setAlert({
        text: `Successfully deleted ${alertText}`,
        severity: "success",
      });

      setRows(rows.filter((row) => row.id !== id));
    } catch (error) {
      setAlert({ text: `${error}`, severity: "error" });
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
    if (isEqual(newRow, oldRow)) {
      return oldRow;
    }

    const body = {};

    columnsData.forEach((col) => {
      body[col.field] = newRow[col.field];
    });

    const apiUrl = newRow.isNew
      ? `/api/${apiURL}/`
      : `/api/${apiURL}/${oldRow.id}`;

    try {
      const method = newRow.isNew ? "POST" : "PUT";
      const response = await fetch(apiUrl, {
        method,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success === false) {
        throw new Error(data.message);
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
      setAlert({ text: `${error}`, severity: "error" });
    }
  });

  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    id: false,
    [hiddenColumn]: false,
  });

  const handleRowClick = useCallback((params) => {
    setRowModesModel((oldModel) => ({
      // Other rows in view mode
      ...Object.keys(oldModel).reduce((acc, id) => {
        return { ...acc, [id]: { mode: GridRowModes.View } };
      }, {}),
      [params.id]: { mode: GridRowModes.Edit },
    }));
  }, []);

  if (loadData) {
    return (
      <Paper
        elevation={24}
        sx={{
          height: "auto",
          width: "100%",
          marginTop: "1rem",
        }}
      >
        <Skeleton
          variant="rectangular"
          animation="wave"
          height="50vh"
          width="100%"
        />
      </Paper>
    );
  }

  return (
    <Paper
      elevation={24}
      sx={{
        height: "auto",
        width: "100%",
        marginTop: "1rem",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
        "& .table-highlight": {
          backgroundColor: "rgb(153 241 132 / 50%)",
        },
        "& .table-striped": {
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
        loading={loading}
        disableColumnMenu={disableColumnMenu}
        disableDensitySelector
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={() => ({})}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowClick={handleRowClick}
        slots={{ toolbar: EditToolbar }}
        onColumnVisibilityModelChange={(newModel) =>
          setColumnVisibilityModel(newModel)
        }
        slotProps={{
          toolbar: {
            rows,
            setRows,
            setRowModesModel,
            showAddRecord,
            hideSearch,
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
        autoHeight={true}
        getRowClassName={(params) => {
          if (params.indexRelativeToCurrentPage % 2 === 0)
            return "table-striped";
        }}
      />

      <AlertMsg alert={alert} />
    </Paper>
  );
};

export default EditableDataGrid;
