import React from "react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham-dark.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { AgGridReact } from "ag-grid-react";

import { isBrumStyle } from "../../Utils/fixtureGridTools";
import FixtureData from "../../Mockdata/importexportLights.json";
import { colDef } from "./Utils/FixtureGridColDef";

import {
  Form,
  FormGroup,
  Input,
  Container,
  Footer,
  Content,
  Header,
  Navbar,
  Nav,
  Icon,
  Dropdown
} from "rsuite";

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

  quickSearch(value) {
    //console.log(e.target.value);
    this.gridApi.setQuickFilter(value);
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
      <div className="show-container">
        <Container>
          <Header>
            <Navbar appearance="subtle">
              <Navbar.Body>
                <Nav>
                  <Nav.Item icon={<Icon icon="home" />}>Home</Nav.Item>
                  <Nav.Item>News</Nav.Item>
                  <Nav.Item>Products</Nav.Item>
                  <Dropdown title="About">
                    <Dropdown.Item>Company</Dropdown.Item>
                    <Dropdown.Item>Team</Dropdown.Item>
                    <Dropdown.Item>Contact</Dropdown.Item>
                  </Dropdown>
                </Nav>
                <Nav pullRight>
                  <Nav.Item icon={<Icon icon="cog" />}>Settings</Nav.Item>
                </Nav>
              </Navbar.Body>
            </Navbar>
          </Header>
          <Content>
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
                  onSelectionChanged={this.onSelectionChanged.bind(this)}
                />
              </div>
            </div>
          </Content>
          <Footer>
            <span>{this.printPower(this.state.selectedPower)}</span>
          </Footer>
        </Container>
      </div>
    );
  }
}

export default FixtureGrid;
