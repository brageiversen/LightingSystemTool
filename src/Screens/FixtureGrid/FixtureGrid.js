import React from "react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham-dark.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { AgGridReact } from "ag-grid-react";

import { isBrumStyle } from "../../Utils/fixtureGridTools";
import FixtureData from "../../Mockdata/importexportLights.json";
import { colDef } from "./Utils/FixtureGridColDef";

import ReportModal from "./Components/ReportModal";
import ImportModal from "./Components/ImportModal";
import LabelModal from "./Components/LabelModal";
import SettingsModal from "./Components/SettingsModal";
import FixtureDetailModal from "./Components/FixtureDetailModal";
import PowerDetailModal from "./Components/PowerDetailModal";



import { Form, FormGroup, Input, Container, Footer, Content, Header, Navbar, Nav, Icon, FlexboxGrid } from "rsuite";

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
      showImportModal: false,
      showReportModal: false,
      showLabelModal: false,
      showSettingsModal: false,
      showPowerDetailModal: false,

      reportData: [],
      fixtureDetailData: [],
    };

    this.showImportModal = this.showImportModal.bind(this);
    this.showReportModal = this.showReportModal.bind(this);
    this.showLabelModal = this.showLabelModal.bind(this);
    this.showSettingsModal = this.showSettingsModal.bind(this);
    this.showFixtureDetailModal = this.showFixtureDetailModal.bind(this);
    this.addUserModeAndName = this.addUserModeAndName.bind(this);
    this.showPowerDetailModal = this.showPowerDetailModal.bind(this);
    this.addPowerDetails = this.addPowerDetails.bind(this);
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

    this.gridApi.forEachNode((node) => {
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
      phase1Frac: (p1 / total).toFixed(2) * 100,
      phase2Frac: (p2 / total).toFixed(2) * 100,
      phase3Frac: (p3 / total).toFixed(2) * 100,
    };

    return totalPower;
  }

  printPower(p) {
    return (
      <div>
        <ul>
          <li>
            L1: <b>{p.phase1} W</b> ({p.phase1Frac}%)
          </li>
          <li>
            L2: <b>{p.phase2} W</b> ({p.phase2Frac}%)
          </li>
          <li>
            L3: <b>{p.phase3} W</b> ({p.phase3Frac}%)
          </li>
        </ul>
      </div>
    );
  }
  showImportModal() {
    this.setState({ showImportModal: true });
  }

  showReportModal() {
    if (this.gridApi) {
      let reportData = [];

      this.gridApi.forEachNodeAfterFilterAndSort((entry) => {
        reportData.push(entry.data);
      });
      this.setState({ showReportModal: true, reportData });
    }
  }

  showLabelModal() {
    this.setState({ showLabelModal: true });
  }

  showSettingsModal() {
    this.setState({ showSettingsModal: true });
  }

  showFixtureDetailModal() {
    if (this.gridApi) {
      let fixtureDetailData = [];
      this.gridApi.forEachNodeAfterFilterAndSort((entry) => {
        fixtureDetailData.push(entry.data);
      });
      this.setState({ showFixtureDetailModal: true, fixtureDetailData });
    }
  }
  showPowerDetailModal() {
    if (this.gridApi) {
      let fixtureDetailData = [];
      this.gridApi.forEachNodeAfterFilterAndSort((entry) => {
        fixtureDetailData.push(entry.data);
      });
      this.setState({ showPowerDetailModal: true, fixtureDetailData });
    }
  }

  addUserModeAndName(lookup) {
    let transactionData = [];

    this.gridApi.forEachNode((node) => {
      const instrumentType = node.data.instrumentType;
      const fixtureMode = node.data.fixtureMode;
      const userInstrumentType = node.data.userInstrumentType;
      const userFixtureMode = node.data.userFixtureMode;

      lookup.forEach((entry) => {
        // Add user fixture type
        if (entry.instrumentType === instrumentType && entry.fixtureMode === fixtureMode) {
          let updatedNode = node.data;

          let dataToUpdate = false;

          if ("userInstrumentType" in entry && entry.userInstrumentType !== userInstrumentType) {
            updatedNode = {
              ...updatedNode,
              userInstrumentType: entry.userInstrumentType,
            };
            dataToUpdate = true;
          }

          if ("userFixtureMode" in entry && entry.userFixtureMode !== userFixtureMode) {
            updatedNode = {
              ...updatedNode,
              userFixtureMode: entry.userFixtureMode,
            };
            dataToUpdate = true;
          }

          if (dataToUpdate) {
            transactionData.push(updatedNode);
          }
        }
      });
    });

    this.gridApi.applyTransaction({
      update: transactionData,
    });
    // console.log(transactionData);
  }

  addPowerDetails(lookup){
    let transactionData = [];

    this.gridApi.forEachNode((node) => {


      lookup.forEach((entry) => {
        if(node.data.circuitName === entry.circuitName){
          transactionData.push({
            ...node.data,
            circuitType: entry.circuitType,
            phaseSequ: entry.phaseSequ,
          })
        }

      })
      
    })

    this.gridApi.applyTransaction({
      update: transactionData,
    });
  }

  render() {
    return (
      <div className="show-container">
        <Container>
          <Header>
            <Navbar appearance="subtle">
              <Navbar.Body>
                <Nav>
                  <Nav.Item onClick={() => this.showImportModal()}>Import</Nav.Item>
                  <Nav.Item onClick={() => this.showReportModal()}>Reports</Nav.Item>
                  <Nav.Item onClick={() => this.showLabelModal()}>Labels</Nav.Item>
                  <Nav.Item onClick={() => this.showFixtureDetailModal()}>Fixture Details</Nav.Item>
                  <Nav.Item onClick={() => this.showPowerDetailModal()}>Power Details</Nav.Item>
                </Nav>
                <Nav pullRight>
                  <Nav.Item onClick={() => this.showSettingsModal()} icon={<Icon icon="cog" />}>
                    Settings
                  </Nav.Item>
                </Nav>
              </Navbar.Body>
            </Navbar>
          </Header>
          <Content>
            <div className="agGridWrapper" style={{ height: "81vh" }}>
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
                  getRowNodeId={(data) => {
                    return data.__UID;
                  }}
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
            <div>
              <FlexboxGrid>
                <FlexboxGrid.Item colspan={6}>
                  <p style={{ margin: "5px", marginRight: "15px" }}>
                    <b>Total power</b>
                  </p>
                  <div>{this.printPower(this.state.totalPower)}</div>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={6}>
                  <p style={{ margin: "5px", marginRight: "15px" }}>
                    <b>Selected power</b>
                  </p>
                  <div>{this.printPower(this.state.selectedPower)}</div>
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </div>
          </Footer>
        </Container>

        <ReportModal
          show={this.state.showReportModal}
          onHide={() => this.setState({ showReportModal: false })}
          rowData={this.state.reportData}
        />

        <ImportModal show={this.state.showImportModal} onHide={() => this.setState({ showImportModal: false })} />

        <LabelModal show={this.state.showLabelModal} onHide={() => this.setState({ showLabelModal: false })} />

        <SettingsModal show={this.state.showSettingsModal} onHide={() => this.setState({ showSettingsModal: false })} />

        <FixtureDetailModal
          show={this.state.showFixtureDetailModal}
          onHide={() => this.setState({ showFixtureDetailModal: false })}
          fixtureDetailData={this.state.fixtureDetailData}
          addUserModeAndName={this.addUserModeAndName}
        />

        <PowerDetailModal
          show={this.state.showPowerDetailModal}
          onHide={() => this.setState({ showPowerDetailModal: false })}
          fixtureDetailData={this.state.fixtureDetailData}
          addPowerDetails={this.addPowerDetails}
        />
      </div>
    );
  }
}

export default FixtureGrid;
