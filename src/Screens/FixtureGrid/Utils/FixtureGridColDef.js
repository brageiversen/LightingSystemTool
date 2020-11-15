import {patchComparator, circuitNameComparator, circuitComparator,dmxLineComparator,stringNumberComparator} from  '../../../Utils/fixtureGridTools';

export const colDef = [
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
    sort: 'asc',
    comparator: stringNumberComparator,
  },
  {
    headerName: "Patch",
    field: "patch",
    sortable: true,
    comparator: patchComparator,
  },
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
    comparator: dmxLineComparator
  },
  // {
  //   headerName: "User 1",
  //   field: "userField1",
  //   sortable: true,
  //   resizable: true,
  // },
  // {
  //   headerName: "User 2",
  //   field: "userField2",
  //   sortable: true,
  //   resizable: true,
  // },
  // {
  //   headerName: "User 3",
  //   field: "userField3",
  //   sortable: true,
  //   resizable: true,
  // },
  // {
  //   headerName: "User 4",
  //   field: "userField4",
  //   sortable: true,
  //   resizable: true,
  // },
  // {
  //   headerName: "User 5",
  //   field: "userField5",
  //   sortable: true,
  //   resizable: true,
  // },
  {
    headerName: "User 6",
    field: "userField6",
    sortable: true,
    resizable: true,
  },
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
];
