import {dmxLineComparator} from '../../../Utils/fixtureGridTools';

export const colDef = [
  {
    headerName: "Dmx Line",
    field: "dmxLine",
    sortable: true,
    sort: 'asc',
    comparator: dmxLineComparator,
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
            values: ["5p", "3p"],
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

];
