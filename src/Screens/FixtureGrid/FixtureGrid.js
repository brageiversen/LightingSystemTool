import React from 'react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import { AgGridReact } from 'ag-grid-react';

import FixtureData from '../../tempData/InstrumentData.json';
import { colDef } from './Utils/FixtureGridColDef';
import { Form } from 'react-bootstrap';

class FixtureGrid extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            columnDefs: colDef, 

            rowData: FixtureData.lightingDevices,

        };

        console.log("Fixture data: ");
        console.log(this.state.rowData);

    }

    componentDidMount() {


    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.AgGridColumnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();
    
    }

    test(e) {
        //console.log(e.target.value);
        this.gridApi.setQuickFilter(e.target.value);
    }

    render() {

        return (
            <div className="ag-theme-alpine" style={{ height: "100vh", width: "100%" }}>
                <h1>Fixture Grid</h1>

                <Form>
                    <Form.Group controlId="quicksearch">
                        <Form.Control type="sm" placeholder="Search..." onChange={(e) => this.test(e)}/>
                    </Form.Group>
                </Form>
                
                <AgGridReact
                    columnDefs={this.state.columnDefs}
                    rowData={this.state.rowData}
                    onGridReady={this.onGridReady.bind(this)}
                    defaultColDef={{
                        resizeable: true,
                        sort: true, 
                    }}
                    sideBar={true}

                />
            </div>
        );
    }
}

export default FixtureGrid; 