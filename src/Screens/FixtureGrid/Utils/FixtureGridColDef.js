import {
  patchComparator,
  circuitNameComparator,
  circuitComparator,
  dmxLineComparator,
  stringNumberComparator,
} from "../../../Utils/fixtureGridTools";

const vwxFixtureData = {
  headerName: "VWX Fixture Data",

  children: [
    {
      headerName: "Fixture Type",
      field: "instrumentType",
      sortable: true,
    },

    {
      headerName: "Fixture Mode",
      field: "fixtureMode",
      sortable: true,
    },
  ],
};

const userFixtureData = {
  headerName: "User Fixture Data",
  children: [
    {
      headerName: "User Fixture Type",
      field: "userInstrumentType",
      sortable: true,
      editable: true,
    },
    {
      headerName: "User Fixture Mode",
      field: "userFixtureMode",
      sortable: true,
      editable: true,
    },
  ],
};

const general = {
  headerName: "General",
  children: [
    {
      headerName: "Position",
      field: "position",
      sortable: true,
      editable: true,
    },
    {
      headerName: "Channel",
      field: "channel",
      sortable: true,
      sort: "asc",
      comparator: stringNumberComparator,
    },
    {
      headerName: "Patch",
      field: "patch",
      sortable: true,
      comparator: patchComparator,
    },
    {
      headerName: "Circuit",
      sortable: true,
      comparator: circuitComparator,
      valueGetter: (params) => {
        return params.data.circuitName + "-" + params.data.circuitNumber;
      },
    },
    {
      headerName: "Wattage",
      field: "wattage",
      sortable: true,
      editable: true,
    },
    {
      headerName: "DMX Line",
      field: "dmxLine",
      sortable: true,
      editable: true,
      comparator: dmxLineComparator,
    },
  ],
};

const userFields = {
  headerName: "User Fields",
  children: [
    {
      headerName: "User 1",
      field: "userField1",
      sortable: true,
      resizable: true,
      editable: true,
    },
    {
      headerName: "User 2",
      field: "userField2",
      sortable: true,
      resizable: true,
      editable: true,
    },
    {
      headerName: "User 3",
      field: "userField3",
      sortable: true,
      resizable: true,
      editable: true,
    },
    {
      headerName: "User 4",
      field: "userField4",
      sortable: true,
      resizable: true,
      editable: true,
    },
    {
      headerName: "User 5",
      field: "userField5",
      sortable: true,
      resizable: true,
      editable: true,
    },
    {
      headerName: "User 6",
      field: "userField6",
      sortable: true,
      resizable: true,
      editable: true,
    },
  ],
};

const power = {
  headerName: "Power",
  children: [
    {
      headerName: "Circuit Name",
      field: "circuitName",
      sortable: true,
      editable: true,
      comparator: circuitNameComparator,
    },
    {
      headerName: "Circuit Number",
      field: "circuitNumber",
      sortable: true,
      editable: true,
    },
    {
      headerName: "Circuit Type",
      field: "circuitType",
      cellRenderer: (params) => {
        if (params.value === 1) {
          return "HOT";
        } else if (params.value === 2) {
          return "DIM";
        } else {
          return null;
        }
      },
    },
    {
      headerName: "Phase sequence",
      field: "phaseSequ",
      editable: true,
    },
    {
      headerName: "Load dynamics",
      field: "loadDynamics",
    },
  ],
};

const vwxCadData = {
  headerName: "VWX Cad data",
  children: [
    {
      headerName: "VWX Class",
      field: "class",
      sortable: true,
      editable: true,
    },
    {
      headerName: "VWX Layer",
      field: "layer",
      sortable: true,
      editable: false,
    },
    {
      headerName: "UID",
      field: "__UID",
      sortable: true,
    },
  ],
};

// All fields
export const colDef = [vwxFixtureData, userFixtureData, general, userFields, power, vwxCadData];

// Possible to turn on and off fields. 
/*
params = {
  vwxFixtureData: true, 
  userFixtureData: true, 
  general: true, 
  userFields: true, 
  power: true,
  vwxCadData: true, 
}
*/
export const createColDef = (params) => {
  let colDef = [];

  if (params.vwxFixtureData) {
    colDef.push(vwxFixtureData);
  }

  if (params.userFixtureData) {
    colDef.push(userFixtureData);
  }

  if (params.general) {
    colDef.push(general);
  }

  if (params.userFields) {
    colDef.push(userFields);
  }

  if (params.power) {
    colDef.push(power);
  }

  if (params.vwxCadData) {
    colDef.push(vwxCadData);
  }

  return colDef;
};
