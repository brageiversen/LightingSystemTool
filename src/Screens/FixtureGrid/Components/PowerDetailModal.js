import React from "react";
import { Modal, Button, Form, FormGroup, Input } from "rsuite";
import { AgGridReact } from "ag-grid-react";
import { circuitNameComparator } from "../../../Utils/fixtureGridTools";
class PowerDetailModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {
          headerName: "Circuit Name",
          field: "circuitName",
          sort: "asc",
          comparator: circuitNameComparator,
        },
        {
          headerName: "Circuit Type",
          field: "circuitType",
          editable: true,
          cellRenderer: (params) => {
            if (params.value === 1) {
              return "HOT";
            } else if (params.value === 2) {
              return "DIM";
            } else {
              return null;
            }
          },
        },
        {
          headerName: "Phase Sequence",
          field: "phaseSequ",
          editable: true,
        },
      ],
    };

    this.quickSearch = this.quickSearch.bind(this);
    this.submit = this.submit.bind(this);
    this.addPhaseSequence = this.addPhaseSequence.bind(this);
  }

  async onGridReady(params) {
    this.gridApi = params.api;
    this.AgGridColumnApi = params.columnApi;

    let uniqueCircuits = [];

    const data = this.props.fixtureDetailData;

    data.forEach((entry) => {
      if ("circuitName" in entry) {
        const circuitName = entry.circuitName;
        const circuitType = entry.circuitType;
        const phaseSequ = entry.phaseSequ;

        let existsInList = false;
        for (let row of uniqueCircuits) {
          if (row.circuitName === circuitName && row.circuitType === circuitType && row.phaseSequ === phaseSequ) {
            existsInList = true;
            break;
          }
        }
        if (!existsInList) {
          uniqueCircuits.push({
            circuitName,
            circuitType,
            phaseSequ,
          });
        }
      }
    });

    this.gridApi.setRowData(uniqueCircuits);
    this.gridApi.sizeColumnsToFit();
  }

  quickSearch(value) {
    //console.log(e.target.value);
    this.gridApi.setQuickFilter(value);
  }

  submit() {
    if (this.gridApi) {
      let data = [];

      this.gridApi.forEachNode((node) => {
        data.push(node.data);
      });

      this.props.addPowerDetails(data);
    }

    this.props.onHide();
  }

  assumeCircuitType() {
    let updateData = [];
    this.gridApi.forEachNode((node) => {
      const circuitName = node.data.circuitName;
      if (circuitName.charAt(0) === "H") {
        updateData.push({
          ...node.data,
          circuitType: 1,
        });
      } else if (circuitName.charAt(0) === "D") {
        updateData.push({
          ...node.data,
          circuitType: 2,
        });
      }
    });
    this.gridApi.applyTransaction({
      update: updateData,
    });
  }

  addPhaseSequence() {
    const phaseSequ = "112233";
    const selectedRows = this.gridApi.getSelectedRows();

    let updateData = [];
    selectedRows.forEach((node, index) => {
      updateData.push({
        ...node,
        phaseSequ,
      });
    });
    this.gridApi.applyTransaction({
      update: updateData,
    });
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} size="lg">
        <Modal.Header>
          <h3>Power details</h3>
        </Modal.Header>

        <Modal.Body>
          <div className="agGridWrapper" style={{ height: "600px" }}>
            <Form>
              <FormGroup>
                <FormGroup>
                  <Button appearance="subtle" onClick={() => this.assumeCircuitType()}>
                    Assume circuit
                  </Button>
                </FormGroup>
                <FormGroup>
                  <Button appearance="subtle" onClick={() => this.addPhaseSequence()}>
                    Phase Sequence
                  </Button>
                </FormGroup>
                <Input
                  size="xs"
                  placeholder="Search"
                  onChange={(value) => this.quickSearch(value)}
                  style={{ width: "100%" }}
                />
              </FormGroup>
            </Form>
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
                getRowNodeId={(data) => {
                  return data.circuitName;
                }}
                columnDefs={this.state.columnDefs}
                rowData={this.state.rowData}
                onGridReady={this.onGridReady.bind(this)}
                defaultColDef={{
                  resizable: true,
                  sortable: true,
                }}
                rowSelection="multiple"
                // onSelectionChanged={this.onSelectionChanged.bind(this)}
              />
            </div>
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

export default PowerDetailModal;
