import React from "react";
import { AgGridReact } from "ag-grid-react";
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
  FlexboxGrid,
  Dropdown,
} from "rsuite";
import { calculatePower, printPower } from "./Helpers/PowerCalculation/powerCalculation";
import { createColDef } from "./Utils/FixtureGridColDef";
import ReportModal from "./Components/ReportModal";
import ImportModal from "./Components/ImportModal";
import ExportModal from "./Components/ExportModal";
import LabelModal from "./Components/LabelModal";
import SettingsModal from "./Components/SettingsModal";
import FixtureDetailModal from "./Components/FixtureDetailModal";
import PowerDetailModal from "./Components/PowerDetailModal";
import LibraryModal from "./Components/LibraryModal";
import DimmerSettingsModal from "./Components/DimmerSettingsModal";
import { saveAs } from "file-saver";
import moment from "moment";

class FixtureGrid extends React.Component {
  constructor(props) {
    super(props);

    // Coldef params
    const params = {
      vwxFixtureData: true,
      userFixtureData: true,
      general: true,
      userFields: false,
      power: true,
      vwxCadData: true,
    };

    this.state = {
      columnDefs: createColDef(params),
      colDefParams: params,
      rowData: [],
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
      showExportModal: false,
      showReportModal: false,
      showLabelModal: false,
      showSettingsModal: false,
      showPowerDetailModal: false,
      showLibraryModal: false,
      showDimmerSettingsModal: false,
      reportData: [],
      fixtureDetailData: [],
      dimmerAddressAndUniverse: { universe: 0, address: 0, numberOfChannels: 0 },
    };

    this.showImportModal = this.showImportModal.bind(this);
    this.showExportModal = this.showExportModal.bind(this);
    this.showReportModal = this.showReportModal.bind(this);
    this.showLabelModal = this.showLabelModal.bind(this);
    this.showSettingsModal = this.showSettingsModal.bind(this);
    this.showFixtureDetailModal = this.showFixtureDetailModal.bind(this);
    this.addUserModeAndName = this.addUserModeAndName.bind(this);
    this.showPowerDetailModal = this.showPowerDetailModal.bind(this);
    this.showDimmerSettingsModal = this.showDimmerSettingsModal.bind(this);
    this.addPowerDetails = this.addPowerDetails.bind(this);
    this.updateColDef = this.updateColDef.bind(this);
    this.sizeColumnsToFit = this.sizeColumnsToFit.bind(this);
    this.overwriteData = this.overwriteData.bind(this);
    this.mergeData = this.mergeData.bind(this);
    this.downloadData = this.downloadData.bind(this);
    this.saveColumnState = this.saveColumnState.bind(this);
    this.getRowData = this.getRowData.bind(this);
    this.setDimmerAddressAndUniverse = this.setDimmerAddressAndUniverse.bind(this);
  }

  componentDidMount() {}

  async onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.getFixtureDataFromLocalstorage();
    let totalPower = await this.calculateTotalPower();
    this.setState({ totalPower });
    this.gridApi.sizeColumnsToFit();
  }

  async onSelectionChanged() {
    let selectedRows = this.gridApi.getSelectedRows();
    const selectedPower = await calculatePower(selectedRows, this.state.dimmerAddressAndUniverse);
    this.setState({ selectedPower });
  }

  async onRowDataUpdated() {
    if (this.gridApi) {
      let totalPower = await this.calculateTotalPower();
      this.setState({ totalPower });
    }
  }

  async onRowDataChanged() {
    if (this.gridApi) {
      let totalPower = await this.calculateTotalPower();
      this.setState({ totalPower });
    }
  }

  quickSearch(value) {
    this.gridApi.setQuickFilter(value);
  }

  async calculateTotalPower() {
    let powerData = [];

    this.gridApi.forEachNode((node) => {
      powerData.push(node.data);
    });

    const totalPower = await calculatePower(powerData, this.state.dimmerAddressAndUniverse);
    return totalPower;
  }

  showImportModal() {
    this.setState({ showImportModal: true });
  }

  showExportModal() {
    this.setState({ showExportModal: true });
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

  showDimmerSettingsModal() {
    this.setState({ showDimmerSettingsModal: true });
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

  showLibraryModal() {
    this.setState({ showLibraryModal: true });
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

  addPowerDetails(lookup) {
    let transactionData = [];

    this.gridApi.forEachNode((node) => {
      lookup.forEach((entry) => {
        if (node.data.circuitName === entry.circuitName) {
          transactionData.push({
            ...node.data,
            circuitType: entry.circuitType,
            phaseSequ: entry.phaseSequ,
          });
        }
      });
    });

    this.gridApi.applyTransaction({
      update: transactionData,
    });
  }

  sizeColumnsToFit() {
    this.gridApi.sizeColumnsToFit();
  }

  updateColDef(params) {
    const columnDefs = createColDef(params);
    this.setState({ columnDefs });
    // this.gridApi.sizeColumnsToFit();
  }

  overwriteData(data) {
    if (this.gridApi) {
      this.gridApi.setRowData(data);
    }
  }

  mergeData(data) {
    if (this.gridApi) {
      this.gridApi.applyTransaction({
        add: data.add,
        update: data.update,
        delete: data.delete,
      });
    }
  }

  downloadData(filename) {
    if (this.gridApi) {
      let lightingDevices = [];

      this.gridApi.forEachNodeAfterFilterAndSort((entry) => {
        lightingDevices.push(entry.data);
      });

      const data = {
        info: [
          {
            source: "LST",
            fileName: filename,
            exportDate: moment().format("DD.MM.YYYY"),
            exportTime: moment().format("HH:mm"),
            fixtureCount: lightingDevices.length,
          },
        ],
        lightingDevices,
      };

      const fileToDownload = new Blob([JSON.stringify(data, undefined, 2)], {
        type: "application/JSON",
        name: filename,
      });

      saveAs(fileToDownload, filename);
    }
  }

  saveColumnState() {
    const savedState = this.columnApi.getColumnState();

    localStorage.setItem("fixtureGridSettings", JSON.stringify(savedState));
  }

  getColumnState() {
    const state = localStorage.getItem("fixtureGridSettings");

    const newState = JSON.parse(state);

    this.columnApi.applyColumnState({ state: newState });
  }

  getFixtureDataFromLocalstorage() {
    if (this.gridApi) {
      const stringData = localStorage.getItem("fixtureData");
      if (stringData) {
        const lightingDevices = JSON.parse(stringData);
        this.gridApi.setRowData(lightingDevices);
      }
    }
  }

  getRowData() {
    return new Promise((resolve, reject) => {
      if (this.gridApi) {
        let rowData = [];
        this.gridApi.forEachNode((node) => {
          rowData.push(node.data);
        });
        resolve(rowData);
      }
      reject("No data");
    });
  }

  setDimmerAddressAndUniverse(dimmerAddressAndUniverse) {
    this.setState({ dimmerAddressAndUniverse }, () => this.onRowDataUpdated());
  }

  render() {
    return (
      <div className="show-container">
        <Container>
          <Header>
            <Navbar appearance="subtle">
              <Navbar.Body>
                <Nav>
                  <Dropdown title="Import/Export">
                    <Dropdown.Item onSelect={() => this.showImportModal()}>Import</Dropdown.Item>
                    <Dropdown.Item onSelect={() => this.showExportModal()}>Export</Dropdown.Item>
                  </Dropdown>
                  <Nav.Item onClick={() => this.showReportModal()}>Reports</Nav.Item>
                  {/* <Nav.Item onClick={() => this.showLabelModal()}>Labels</Nav.Item> */}
                  <Nav.Item onClick={() => this.showFixtureDetailModal()}>Fixture Details</Nav.Item>
                  <Nav.Item onClick={() => this.showPowerDetailModal()}>Power Details</Nav.Item>
                  <Nav.Item onClick={() => this.showLibraryModal()}>Library</Nav.Item>
                  <Nav.Item onClick={() => this.showDimmerSettingsModal()}>Dimmer Settings</Nav.Item>
                </Nav>

                <Nav pullRight>
                  <Nav.Item onClick={() => this.sizeColumnsToFit()}>Size columns to fit</Nav.Item>
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
                  onRowDataChanged={this.onRowDataChanged.bind(this)}
                  onRowDataUpdated={this.onRowDataUpdated.bind(this)}
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
                  <div>{printPower(this.state.totalPower)}</div>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={6}>
                  <p style={{ margin: "5px", marginRight: "15px" }}>
                    <b>Selected power</b>
                  </p>
                  <div>{printPower(this.state.selectedPower)}</div>
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

        <ImportModal
          show={this.state.showImportModal}
          onHide={() => this.setState({ showImportModal: false })}
          mergeData={this.mergeData}
          overwriteData={this.overwriteData}
          getRowData={this.getRowData}
        />

        <ExportModal
          show={this.state.showExportModal}
          onHide={() => this.setState({ showExportModal: false })}
          downloadData={this.downloadData}
        />

        <LabelModal show={this.state.showLabelModal} onHide={() => this.setState({ showLabelModal: false })} />

        <SettingsModal
          show={this.state.showSettingsModal}
          onHide={() => this.setState({ showSettingsModal: false })}
          updateColDef={this.updateColDef}
          colDefParams={this.state.colDefParams}
          saveColumnState={this.saveColumnState}
        />

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

        <DimmerSettingsModal
          show={this.state.showDimmerSettingsModal}
          onHide={() => this.setState({ showDimmerSettingsModal: false })}
          dimmerAddressAndUniverse={this.state.dimmerAddressAndUniverse}
          setDimmerAddressAndUniverse={this.setDimmerAddressAndUniverse}
        />

        <LibraryModal show={this.state.showLibraryModal} onHide={() => this.setState({ showLibraryModal: false })} />
      </div>
    );
  }
}

export default FixtureGrid;
