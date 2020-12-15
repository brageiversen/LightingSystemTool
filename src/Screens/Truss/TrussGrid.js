import React from "react";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham-dark.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

import { AgGridReact } from "ag-grid-react";

import Trussdata from "../../Mockdata/importexportTruss.json";
import { colDef } from "./Utils/TrussGridColDef";
import { Form, FormGroup, Input } from "rsuite";

class TrussGrid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: colDef,
      rowData: Trussdata.truss,
    };
  }

  componentDidMount() {}

  onGridReady(params) {
    this.gridApi = params.api;
    this.AgGridColumnApi = params.columnApi;
  }

  quickSearch(value) {
    this.gridApi.setQuickFilter(value);
  }

  render() {
    return (
      <div className="agGridWrapper" style={{ height: "100vh" }}>
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
              resizeable: true,
              sort: true,
            }}
            sideBar={true}
            rowSelection="multiple"
          />
        </div>
      </div>
    );
  }
}

export default TrussGrid;
