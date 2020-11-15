export const colDef = [
    {
      headerName: "Id",
      field: "hoistNumber",
      sortable: true,
      sort: 'asc',
    },
    {
        headerName: "Label",
        field: "hoistLabel",
        sortable: true,
    },
    {
        headerName: "Type",
        field: "type",
        sortable: true,
    },
    {
        headerName: "Location",
        field: "location",
        sortable: true,
    },
    {
        headerName: "Controller ID",
        field: "controlId",
        sortable: true,
    },
    {
        headerName: "Distro Port",
        field: "distroPort",
        sortable: true,
    },
    {
        headerName: "Controller Location",
        field: "controllerLocation",
        sortable: true,
    },
    {
        headerName: "Hoist Position",
        field: "hoistPosition",
        sortable: true,
    },
    {
        headerName: "User 1",
        field: "user1",
        sortable: true,
    },
    {
        headerName: "User 2",
        field: "user2",
        sortable: true,
    },
    {
        headerName: "User 3",
        field: "user3",
        sortable: true,
    },
    {
        headerName: "User 4",
        field: "user4",
        sortable: true,
    },
    {
        headerName: "Chain",
        field: 'doublePurchase',
        sortable: true,
        cellRenderer: params => {
            return params.value === 'True' ? "Double" : "Single";
        },
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
  
//   "hoistNumber": "9999",
//   "hoistLabel": "Kaffe",
//   "type": "1/2 Ton",
//   "location": "LX666",
//   "controlId": "ID1",
//   "distroPort": "PORT1",
//   "controllerLocation": "DC"
//   "hoistPosition": "",
//   "user1": "user1",
//   "user2": "user2",
//   "user3": "user3",
//   "user4": "user4",
//   "doublePurchase": "False",
  
  
  
  
  