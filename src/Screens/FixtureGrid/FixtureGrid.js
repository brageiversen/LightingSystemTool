import React from "react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham-dark.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { AgGridReact } from "ag-grid-react";

import { isBrumStyle } from "../../Utils/fixtureGridTools";
import FixtureData from "../../Mockdata/importexportLights.json";
import { colDef } from "./Utils/FixtureGridColDef";
import { Form, Row, Col } from "react-bootstrap";

class FixtureGrid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: colDef,
      rowData: FixtureData.lightingDevices,
      totalPower: {},
      selectedPower: {
        phase1: 0,
        phase2: 0,
        phase3: 0,
        total: 0,
        phase1Frac: 0.0,
        phase2Frac: 0.0,
        phase3Frac: 0.0,
      },
    };
  }

  componentDidMount() {}

  async onGridReady(params) {
    this.gridApi = params.api;
    this.AgGridColumnApi = params.columnApi;
    
    let totalPower = await this.calculatePower();
    this.setState({ totalPower });
    this.gridApi.sizeColumnsToFit();
  }

  async onSelectionChanged() {
    let selectedRows = this.gridApi.getSelectedRows();

    let p1 = 0;
    let p2 = 0;
    let p3 = 0;

    selectedRows.forEach((node, index) => {
      let circuitNumber = parseInt(node.circuitNumber);
      if (Number.isNaN(circuitNumber)) return;

      let circuitType = isBrumStyle(node.circuitName).typeAsNumber;

      if (circuitType === 1) return;

      let rawWattage = node.wattage;
      let wattage = 0;
      if (rawWattage.indexOf("W") !== -1) {
        // We have a W in our wattage
        wattage = parseInt(rawWattage.substring(0, rawWattage.indexOf("W")));
      } else if (rawWattage.indexOf("w") !== -1) {
        // We have a w in our wattage
        wattage = parseInt(rawWattage.substring(0, rawWattage.indexOf("W")));
      } else {
        wattage = parseInt(rawWattage);
      }

      if (Number.isNaN(wattage)) return;

      if (circuitNumber === 1 || circuitNumber === 4) {
        p1 += wattage;
      } else if (circuitNumber === 2 || circuitNumber === 5) {
        p2 += wattage;
      } else if (circuitNumber === 3 || circuitNumber === 6) {
        p3 += wattage;
      }
    });

    let total = p1 + p2 + p3;

    let selectedPower = {
      phase1: p1,
      phase2: p2,
      phase3: p3,
      total,
      phase1Frac: ((p1 / total) * 100).toFixed(0),
      phase2Frac: ((p2 / total) * 100).toFixed(0),
      phase3Frac: ((p3 / total) * 100).toFixed(0),
    };
    this.setState({ selectedPower });
  }

  test(e) {
    //console.log(e.target.value);
    this.gridApi.setQuickFilter(e.target.value);
  }

  calculatePower() {
    let p1 = 0;
    let p2 = 0;
    let p3 = 0;

    this.gridApi.forEachNode((node, index) => {
      let circuitNumber = parseInt(node.data.circuitNumber);
      if (Number.isNaN(circuitNumber)) return;

      //  let circuitType =

      let rawWattage = node.data.wattage;
      let wattage = 0;
      if (rawWattage.indexOf("W") !== -1) {
        // We have a W in our wattage
        wattage = parseInt(rawWattage.substring(0, rawWattage.indexOf("W")));
      } else if (rawWattage.indexOf("w") !== -1) {
        // We have a w in our wattage
        wattage = parseInt(rawWattage.substring(0, rawWattage.indexOf("W")));
      } else {
        wattage = parseInt(rawWattage);
      }

      if (Number.isNaN(wattage)) return;

      if (circuitNumber === 1 || circuitNumber === 4) {
        p1 += wattage;
      } else if (circuitNumber === 2 || circuitNumber === 5) {
        p2 += wattage;
      } else if (circuitNumber === 3 || circuitNumber === 6) {
        p3 += wattage;
      }
    });

    let total = p1 + p2 + p3;

    let totalPower = {
      phase1: p1,
      phase2: p2,
      phase3: p3,
      total,
      phase1Frac: (p1 / total).toFixed(2),
      phase2Frac: (p2 / total).toFixed(2),
      phase3Frac: (p3 / total).toFixed(2),
    };

    // this.setState({ totalPower });
    return totalPower;
  }

  printPower(p) {
    let result = `${p.phase1} W (${p.phase1Frac} %),${p.phase2} W (${p.phase2Frac} %), ${p.phase3} W (${p.phase3Frac} %),`;

    return result;
  }

  render() {
    return (
      <div
        className="ag-theme-balham-dark"
        style={{ height: "93vh", width: "100%" }}
      >
        <Form>
          <Row>
            <Form.Group as={Col} controlId="quicksearch">
              <Form.Control
                size="sm"
                placeholder="Search..."
                onChange={(e) => this.test(e)}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="quicksearch2">
              {/* <span>{this.printPower(this.state.totalPower)}</span> */}
              <span>{this.printPower(this.state.selectedPower)}</span>
            </Form.Group>
          </Row>
        </Form>

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
          onSelectionChanged={this.onSelectionChanged.bind(this)}
        />
      </div>
    );
  }
}

export default FixtureGrid;
