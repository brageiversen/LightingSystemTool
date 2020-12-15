import React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham-dark.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

import FixtureData from "../../Mockdata/importexportLights.json";
import { colDef } from "./Utils/SocaListColDef";
import {Form, FormGroup, Input } from 'rsuite';

class SocaList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: colDef,
      rowData: [],
    };
  }

  componentDidMount() {}

  getSocaNamesFromData() {
    let data = FixtureData.lightingDevices;
    let socaList = [];

    data.forEach((entry) => {
      let circuitName = entry.circuitName;
      let position = entry.position;

      let existsInList = false;
      for (let row of socaList) {
        if (row.circuitName === circuitName) {
          existsInList = true;
          break;
        }
      }

      if (!existsInList) {
        socaList.push({
          circuitName,
          position,
          type: "2.5mm2",
        });
      }
    });

    this.gridApi.setRowData(socaList);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.AgGridColumnApi = params.columnApi;

    this.getSocaNamesFromData();
  }

  quickSearch(value) {
    this.gridApi.setQuickFilter(value);
  }

  render() {
    return (
      <div className="agGridWrapper" style={{ height: "90vh" }}>
        <Form>
          <FormGroup>
            <Input
            size="xs"
              placeholder="Search"
              onChange={(value) => this.quickSearch(value)}
              style={{ width: "100%" }}
            />
          </FormGroup>
        </Form>
        <div className="ag-theme-balham-dark" style={{ flex: 1 }}>
          <AgGridReact
            columnDefs={this.state.columnDefs}
            rowData={this.state.rowData}
            onGridReady={this.onGridReady.bind(this)}
            defaultColDef={{
              resizable: true,
              sort: true,
            }}
            sideBar={true}
            rowSelection="multiple"
            enterMovesDown={true}
            enterMovesDownAfterEdit={true}
          />
        </div>{" "}
      </div>
    );
  }
}

export default SocaList;
