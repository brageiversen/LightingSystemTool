import React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham-dark.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

import FixtureData from "../../Mockdata/importexportLights.json";
import { colDef } from "./Utils/DmxListColDef";
import { Form } from "react-bootstrap";

class DmxList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: colDef,
      rowData: [],
    };
  }

  componentDidMount() {}

  getDmxLinesFromFromData() {
    let data = FixtureData.lightingDevices;
    let dmxList = [];

    data.forEach((entry) => {
      if ("dmxLine" in entry) {
        let dmxLine = entry.dmxLine;
        let position = entry.position;

        let existsInList = false;
        for (let row of dmxList) {
          if (row.dmxLine === dmxLine) {
            existsInList = true;
            break;
          }
        }

        if (!existsInList) {
          dmxList.push({
            dmxLine,
            position,
          });
        }
      }
    });

    this.gridApi.setRowData(dmxList);
  
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.AgGridColumnApi = params.columnApi;

    this.getDmxLinesFromFromData();
  }

  test(e) {
    //console.log(e.target.value);
    this.gridApi.setQuickFilter(e.target.value);
  }

  paginationChanged(){
    this.gridApi.sizeColumnsToFit();
  }

  render() {
    return (
      <div
        className="ag-theme-balham-dark"
        style={{ height: "100vh", width: "100%", overflow: 'scroll' }}
      >

        <Form>
          <Form.Group controlId="quicksearch">
            <Form.Control
              type="sm"
              placeholder="Search..."
              onChange={(e) => this.test(e)}
            />
          </Form.Group>
        </Form>

        <AgGridReact
          columnDefs={this.state.columnDefs}
          rowData={this.state.rowData}
          onGridReady={this.onGridReady.bind(this)}
          paginationChanged={this.paginationChanged.bind(this)}
          defaultColDef={{
            resizable: true,
            sort: true,
          }}
          sideBar={true}
          rowSelection="multiple"
          enterMovesDown={true}
          enterMovesDownAfterEdit={true}
        />
      </div>
    );
  }
}

export default DmxList;
