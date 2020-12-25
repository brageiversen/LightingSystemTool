import React from "react";
import {
  Form,
  Modal,
  Button,
  TagPicker,
  FormGroup,
  ControlLabel,
  Input,
} from "rsuite";

const pdfMake = require("pdfmake/build/pdfmake.js");
const pdfFonts = require("pdfmake/build/vfs_fonts.js");
pdfMake.vfs = pdfFonts.pdfMake.vfs;

class ReportModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: [],
      tagsToPrint: [],
      reportTitle: "",
      templates: [],
    };

    this.onShow = this.onShow.bind(this);
    this.printReport = this.printReport.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.createReport = this.createReport.bind(this);
    this.showReport = this.showReport.bind(this);
    this.downloadReport = this.downloadReport.bind(this);
    this.printReport = this.printReport.bind(this);
  }

  onShow() {
    this.setState({ tagsToPrint: [], reportTitle: "" });
    this.createTags();
  }

  createTags() {
    const capitalize = (s) => {
      if (typeof s !== "string") return "";
      return s.charAt(0).toUpperCase() + s.slice(1);
    };

    const data = this.props.rowData[0];
    let keys = Object.keys(data);

    keys.sort();

    let res = [];
    keys.forEach((entry) => {
      res.push({
        title: capitalize(entry),
        field: entry,
      });
    });

    this.setState({ tags: res });
  }

  createReport() {
    const tagsToPrint = this.state.tagsToPrint;

    // Create header
    const reportHeader = { text: this.state.reportTitle, style: "header" };

    // Create header with correct styling
    let header = [];
    tagsToPrint.forEach((entry) => {
      header.push({
        text: entry,
        style: "tableHeader",
      });
    });

    // Add header as first row
    let tableData = [header];

    // Get all data from dataset
    const data = this.props.rowData;

    // Loop through all data fields and create table content
    data.forEach((entry) => {
      let row = [];
      tagsToPrint.forEach((field) => {
        const value = entry[field];
        row.push(value);
      });
      tableData.push(row);
    });

    // Create a set of widths for table
    let widths = [];
    for (let i = 0; i < tagsToPrint.length; i++) {
      widths.push("auto");
    }

    // The main table it self
    const reportTable = {
      style: "tableExample",
      widths,
      table: {
        headerRows: 1,
        body: tableData,
      },
    };

    // Styles
    const styles = {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      tableExample: {
        margin: [0, 5, 0, 15],
        fontSize: 11,
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: "black",
      },
    };

    // Meta data for the pdf. 
    const info = {
      title: this.state.reportTitle,
    }

    // Put it all together as one big document
    const pdf = {
      content: [
        reportHeader,
        reportTable,
      ],
      styles,
      info,
    };
    return pdf;
  }

  showReport() {
    const pdf = this.createReport();

    pdfMake.createPdf(pdf).open();

    this.setState({
      tagsToPrint: [],
    });
  }

  downloadReport() {
    const pdf = this.createReport();

    pdfMake.createPdf(pdf).download();

    this.setState({
      tagsToPrint: [],
    });
  }

  printReport() {
    const pdf = this.createReport();

    pdfMake.createPdf(pdf).print();

    this.setState({
      tagsToPrint: [],
    });
  }

  handleChange(value) {
    console.log(value);
    this.setState({ tagsToPrint: value });
  }

  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onHide}
        size="lg"
        onShow={this.onShow}
      >
        <Modal.Header>
          <h3>Report Generator</h3>
        </Modal.Header>

        <Modal.Body>
          <Form fluid>
            <FormGroup>
              <ControlLabel>Title</ControlLabel>
              <Input
                name="name"
                onChange={(value) => this.setState({ reportTitle: value })}
                value={this.state.reportTitle}
              />
            </FormGroup>

            <FormGroup>
              <ControlLabel>Fields</ControlLabel>
              <TagPicker
                searchable={true}
                data={this.state.tags}
                block
                valueKey={"field"}
                labelKey={"title"}
                value={this.state.tagsToPrint}
                onChange={this.handleChange}
                onSelect={(val) => console.log(val)}
              />
            </FormGroup>

            {/* <FormGroup>
              <ControlLabel>Templates</ControlLabel>
              <Dropdown 
                data={this.state.templates}
                labelKey=""
                valueKey=""
                
              />
            </FormGroup> */}
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button appearance="subtle" onClick={this.showReport}>
            Show
          </Button>
          <Button appearance="subtle" onClick={this.downloadReport}>
            Download
          </Button>
          <Button appearance="subtle" onClick={this.printReport}>
            Print
          </Button>
          <Button appearance="subtle" onClick={this.props.onHide}>
            Quit
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ReportModal;
