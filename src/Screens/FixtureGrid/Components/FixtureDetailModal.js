import React from "react";
import { Modal, Button } from "rsuite";
import { AgGridReact } from "ag-grid-react";

class FixtureDetailModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {
          headerName: "Instrument Type (VWX)",
          field: "instrumentType",
          sort: "asc",
        },
        {
          headerName: "Fixture Mode (VWX)",
          field: "fixtureMode",
        },
        {
          headerName: "User Instrument Type",
          field: "userInstrumentType",
          editable: true,
        },
        {
          headerName: "User Fixture Mode",
          field: "userFixtureMode",
          editable: true,
        },
      ],
    };

    this.submit = this.submit.bind(this);
  }

  async onGridReady(params) {
    this.gridApi = params.api;
    this.AgGridColumnApi = params.columnApi;

    let uniqueFixturesAndModes = [];

    const data = this.props.fixtureDetailData;

    data.forEach((entry) => {
      if ("instrumentType" in entry) {
        const instrumentType = entry.instrumentType;
        const fixtureMode = entry.fixtureMode;
        const userInstrumentType = entry.userInstrumentType;
        const userFixtureMode = entry.userFixtureMode;

        let existsInList = false;
        for (let row of uniqueFixturesAndModes) {
          if (
            row.instrumentType === instrumentType &&
            row.fixtureMode === fixtureMode &&
            row.userInstrumentType === userInstrumentType &&
            row.userFixtureMode === userFixtureMode
          ) {
            existsInList = true;
            break;
          }
        }
        if (!existsInList) {
          uniqueFixturesAndModes.push({
            instrumentType,
            fixtureMode,
            userInstrumentType,
            userFixtureMode,
          });
        }
      }
    });

    this.gridApi.setRowData(uniqueFixturesAndModes);
    this.gridApi.sizeColumnsToFit();
  }

  submit() {
    if (this.gridApi) {
      let data = [];

      this.gridApi.forEachNode((node) => {
        data.push(node.data);
      });

      this.props.addUserModeAndName(data);
    }

    this.props.onHide();
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} size="lg">
        <Modal.Header>
          <h3>Fixture details</h3>
        </Modal.Header>

        <Modal.Body>
          <div className="ag-theme-balham-dark" style={{ flex: 1, height: "600px" }}>
            <AgGridReact
              columnDefs={this.state.columnDefs}
              rowData={this.state.rowData}
              onGridReady={this.onGridReady.bind(this)}
              defaultColDef={{
                resizable: true,
                sortable: true,
              }}
              singleClickEdit={true}
              enterMovesDownAfterEdit={true}
              rowSelection="single"
              // onSelectionChanged={this.onSelectionChanged.bind(this)}
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button appearance="subtle" onClick={() => this.submit()}>
            Ok
          </Button>
          <Button appearance="subtle" onClick={this.props.onHide}>
            Quit
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default FixtureDetailModal;
