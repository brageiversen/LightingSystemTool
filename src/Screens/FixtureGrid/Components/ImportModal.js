import React, { createRef } from "react";
import { Modal, Button } from "rsuite";


class ImportModal extends React.Component {
  fileInputRef = createRef(null);

  constructor(props) {
    super(props);

    this.state = {
      info: [],
      dataType: null,
      lightingDevices: [],
    };
    this.uploadFile = this.uploadFile.bind(this);
    this.applyData = this.applyData.bind(this);
    this.downloadData = this.downloadData.bind(this);
  }

  uploadFile(event) {
    const { files } = event.target;

    if (files.length > 0) {
      const fileToOpen = files[0];

      const reader = new FileReader();
      reader.readAsText(fileToOpen);
      reader.onload = () => {
        let data = JSON.parse(reader.result);

        if ("info" in data) {
          this.listInfo(data.info[0]);
        }

        if ("lightingDevices" in data) {
          this.setState({ lightingDevices: data.lightingDevices });
        }
      };
      reader.onerror = (error) => {
        console.log(error);
      };
    }
  }

  listInfo(info) {
    if (info) {
      let kaffe = [];
      for (let key in info) {
        console.log(info[key]);
        kaffe.push({
          key,
          value: info[key],
        });
      }
      this.setState({ info: kaffe });
    }
  }

  applyData() {
    this.props.addNewLightingData(this.state.lightingDevices);
    this.props.onHide();
  }

  downloadData() {
    this.props.downloadData(); 
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} size="sm">
        <Modal.Header>
          <h3>Import Data</h3>
        </Modal.Header>

        <Modal.Body>
          <Button appearance="primary" onClick={() => this.fileInputRef.current.click()}>
            Import data
          </Button>
          <input
            type="file"
            onChange={this.uploadFile}
            ref={this.fileInputRef}
            multiple={false}
            hidden
            accept="application/JSON"
          />
          <ul>
            {this.state.info.map((entry) => {
              return (
                <li key={entry.key}>
                  <b>{entry.key}</b> : {entry.value}
                </li>
              );
            })}
          </ul>
        </Modal.Body>

        <Modal.Footer>
          <Button appearance="subtle" onClick={this.applyData}>
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

export default ImportModal;
