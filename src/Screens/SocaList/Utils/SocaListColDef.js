import {circuitNameComparator} from '../../../Utils/fixtureGridTools';

export const colDef = [
  {
    headerName: "Circuit Name",
    field: "circuitName",
    sortable: true,
    sort: 'asc',
    comparator: circuitNameComparator,
    
  },
  {
    headerName: "Position",
    field: "position",
    sortable: true,
  },
  {
    headerName: "Type",
    field: "type",
    sortable: true,
    editable: true, 
    cellEditorSelector: (params) => {
        return {
          component: "agSelectCellEditor",
          params: {
            values: ["2.5mm2", "1.5mm2"],
          },
        };
      },
  },
  {
    headerName: "Part 1 (DC)",
    field: "part1",
    sortable: true,
    editable: true, 
  },
  {
    headerName: "Part 2",
    field: "part2",
    sortable: true,
    editable: true, 
  },
  {
    headerName: "Part 3",
    field: "part3",
    sortable: true,
    editable: true, 
  },
  {
    headerName: "Part 4",
    field: "part4",
    sortable: true,
    editable: true, 
  },
  {
    headerName: "Part 5 (Truss)",
    field: "part5",
    sortable: true,
    editable: true, 
  },
  {
    headerName: "Breakout",
    field: "breakout",
    sortable: true,
    editable: true, 
    // valueSetter: function(params) {
    //     params.data.name = params.newValue;
    //     return true;
    // },
    cellEditorSelector: (params) => {
      return {
        component: "agSelectCellEditor",
        params: {
          values: ["2m Breakout", "6m Breakout", "12m Breakout", "Box"],
        },
      };
    },
  },
];
