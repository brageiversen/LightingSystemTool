import React from 'react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

import { AgGridReact } from 'ag-grid-react';

import Trussdata from '../../Mockdata/importexportTruss.json';
import { colDef } from './Utils/TrussGridColDef';
import { Form } from 'react-bootstrap';

class TrussGrid extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            columnDefs: colDef, 
            rowData: Trussdata.truss,
        };
    }

    componentDidMount() {


    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.AgGridColumnApi = params.columnApi;
        
    
    }

    test(e) {
        //console.log(e.target.value);
        this.gridApi.setQuickFilter(e.target.value);
    }

    render() {

        return (
            <div className="ag-theme-balham-dark" style={{ height: "100vh", width: "100%", overflow: 'scroll' }}>

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
                    rowSelection='multiple'

                />
            </div>
        );
    }
}

export default TrussGrid; 