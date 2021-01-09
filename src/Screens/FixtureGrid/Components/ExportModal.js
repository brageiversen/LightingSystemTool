import React from "react";
import { Modal, Button, Input, Form, FormGroup, ControlLabel } from "rsuite";

class ImportModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filename: "ExportFromLST",
      warning: "",
    };

    this.downloadData = this.downloadData.bind(this);
    this.onShow = this.onShow.bind(this);
  }

  downloadData() {
    let fileName = this.state.filename;
    if (fileName.length > 0) {
      fileName += ".json";
      this.props.downloadData(fileName);
      this.props.onHide();
    } else {
      this.setState({ warning: "Error: No filename" });
    }
  }

  onShow() {
    this.setState({ warning: "" });
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} size="xs" onShow={this.onShow}>
        <Modal.Header>
          <h3>Export Data</h3>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <FormGroup>
              <ControlLabel>Filename</ControlLabel>
              <Input
                placeholder="Filename"
                value={this.state.filename}
                onChange={(value) => this.setState({ filename: value })}
              />
            </FormGroup>
            <FormGroup>
              <p style={{color:'red'}}>{this.state.warning}</p>
            </FormGroup>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button appearance="primary" onClick={this.downloadData}>
            Export Data
          </Button>
          <Button appearance="primary" onClick={this.props.onHide}>
            Quit
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ImportModal;
