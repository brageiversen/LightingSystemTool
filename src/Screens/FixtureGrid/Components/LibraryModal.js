import React from "react";
import { Modal, Button, Form, FormGroup, Input } from "rsuite";
import { AgGridReact } from "ag-grid-react";
import LightingLibrary from "../../../Mockdata/lightingLibrary.json";

class LibraryModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rowData: LightingLibrary,
      columnDefs: [
        {
          headerName: "Manufacturer",
          field: "manufacturer",
        },
        {
          headerName: "Model",
          field: "model",
        },
        {
          headerName: "Type",
          field: "type",
        },
        {
          headerName: "Short Name",
          field: "shortName",
        },
        {
          headerName: "Mode",
          field: "mode",
        },
        {
          headerName: "DMX Footprint",
          field: "dmxFootprint",
        },
        {
          headerName: "Wattage",
          field: "wattage",
        },
        {
          headerName: "Current",
          field: "current",
        },
        {
          headerName: "Circuit Type",
          field: "circuitType",
        },
        {
          headerName: "Load dynamics",
          field: "loadDynamics",
        },
      ],
    };
  }

  async onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;

    this.gridApi.sizeColumnsToFit();
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} size="lg">
        <Modal.Header>
          <h3>Library</h3>
        </Modal.Header>

        <Modal.Body>
          <div className="agGridWrapper" style={{ height: "600px" }}>
            <Form>
              <FormGroup>
                <Input
                  size="xs"
                  placeholder="Search"
                  onChange={(value) => this.gridApi.setQuickFilter(value)}
                  style={{ width: "100%" }}
                />
              </FormGroup>
            </Form>
            <div className="ag-theme-balham-dark" style={{ flex: 1 }}>
              <AgGridReact
                // getRowNodeId={(data) => {
                //   return data.circuitName;
                // }}
                columnDefs={this.state.columnDefs}
                rowData={this.state.rowData}
                onGridReady={this.onGridReady.bind(this)}
                defaultColDef={{
                  resizable: true,
                  sortable: true,
                }}
                rowSelection="single"
              />
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button appearance="subtle" onClick={this.props.onHide}>
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

export default LibraryModal;
