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

    },
    {
        headerName: "Patch",
        field: "patch",
        sortable: true, 

    },
    {
        headerName: "Circuit Name",
        field: "circuitName",
        sortable: true, 
        editable: true,

    },
    {
        headerName: "Circuit Number",
        field: "circuitNumber",
        sortable: true, 
        editable: true,

    },
    {
        headerName: "Circuit",
        valueGetter: (params) => {
            return( params.data.circuitName + "-" + params.data.circuitNumber); 
        }
        
    },
    {
        headerName: "Wattage",
        field: "wattage",
        sortable: true, 

    },
    {
        headerName: "UID",
        field: "__UID",
        sortable: true, 

    },
]
