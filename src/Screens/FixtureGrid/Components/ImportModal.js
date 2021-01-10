import React, { createRef } from "react";
import { Modal, Button, Steps, Panel, FlexboxGrid, FormGroup, Form, Input, ButtonToolbar } from "rsuite";
import _ from "lodash";

class ImportModal extends React.Component {
  fileInputRef = createRef(null);

  constructor(props) {
    super(props);

    this.state = {
      info: [],
      dataType: null,
      lightingDevices: [],
      currentStep: 0,
      diffText: "",
      updateData: {
        add: [],
        delete: [],
        update: [],
        logString: "",
      },
    };
    this.existingData = [];

    this.uploadFile = this.uploadFile.bind(this);
    this.mergeData = this.mergeData.bind(this);
    this.overwriteData = this.overwriteData.bind(this);
    this.saveFixtureDataToLocalstorage = this.saveFixtureDataToLocalstorage.bind(this);
    this.onShow = this.onShow.bind(this);
    this.diffData = this.diffData.bind(this);
    this.printDiff = this.printDiff.bind(this);
  }

  uploadFile(event) {
    const { files } = event.target;

    if (files.length > 0) {
      const fileToOpen = files[0];

      const reader = new FileReader();
      reader.readAsText(fileToOpen);
      reader.onload = async () => {
        let data = JSON.parse(reader.result);

        if ("info" in data) {
          this.listInfo(data.info[0]);
        }

        if ("lightingDevices" in data) {
          let diff = await this.diffData(this.existingData, data.lightingDevices);
          this.setState({ lightingDevices: data.lightingDevices, updateData: diff, currentStep: 1 });
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
        kaffe.push({
          key,
          value: info[key],
        });
      }
      this.setState({ info: kaffe });
    }
  }

  saveFixtureDataToLocalstorage(data) {
    localStorage.setItem("fixtureData", JSON.stringify(data));
  }

  overwriteData() {
    const data = this.state.lightingDevices;
    this.props.overwriteData(data);
    this.props.onHide();
    this.saveFixtureDataToLocalstorage(data);
  }

  mergeData() {
    const data = this.state.updateData;
    this.props.mergeData(data);
    this.props.onHide();
  }

  async onShow() {
    this.setState({ info: [], currentStep: 0 });

    this.existingData = await this.props.getRowData();
  }

  diffData(existingData, newData) {
    return new Promise((resolve, reject) => {
      if (!(Array.isArray(existingData) && Array.isArray(newData))) {
        return reject("Not array!");
      }
      let updates = [];
      let added = [];
      let deleted = [];
      let addedLogString = "Added: \n";
      let updatesLogString = "Updated: \n";
      let deletedLogString = "Deleted: \n";

      // Find added fixtures
      for (let newEntry of newData) {
        let newFixture = true;
        for (let existing of existingData) {
          if (newEntry.__UID === existing.__UID) {
            newFixture = false;
            break;
          }
        }

        if (newFixture) {
          addedLogString += `${newEntry.__UID}: Type: ${newEntry.instrumentType} / Id: ${newEntry.channel} \n`;
          added.push(newEntry);
        }
      }

      // Find updates and deleted fixtures
      for (let existing of existingData) {
        const uid = existing.__UID;

        let deletedFixture = true;
        for (let newEntry of newData) {
          if (newEntry.__UID === uid) {
            // The fixture exists from before and we want to updated it (maybe)
            deletedFixture = false;
            if (!_.isEqual(existing, newEntry)) {
              // If the fixture is not equal to earlier, get the difference

              const keys1 = _.keys(existing);
              const keys2 = _.keys(newEntry);

              const allKeys = _.concat(keys1, keys2);
              const uniqueKeys = _.uniq(allKeys);

              let updateStr = `${newEntry.__UID}: `;
              let haveDifferences = false;

              // ------------- TEST 123 ----------------
              for (let key of uniqueKeys) {
                if (key !== "__UID") {
                  if (key in existing && key in newEntry) {
                    // The field is in both of the objects.
                    // Compare the content

                    if (existing[key] !== newEntry[key]) {
                      // Difference for this key.
                      haveDifferences = true;
                      updateStr += `${key}: ${existing[key]}, `;
                    }
                  } else {
                    // The key is not in both objects === difference
                    if (key in existing) {
                      updateStr += `${key}: ${existing[key]}, `;
                      haveDifferences = true;
                    }

                    if (key in newEntry) {
                      updateStr += `${key}: ${newEntry[key]}, `;
                      haveDifferences = true;
                    }
                  }
                }
              }
              // ---------------------------------------

              // If we have differences, store them in the array
              if (haveDifferences) {
                updates.push(newEntry);
                updatesLogString += updateStr + "\n";
              }
            }
            break;
          }
        }

        if (deletedFixture) {
          // Fixture does not exists from before. We have a new fixture
          deletedLogString += `${existing.__UID}: Type: ${existing.instrumentType} / Id: ${existing.channel} \n`;
          deleted.push(existing);
        }
      }

      // Concat all logs into one
      const logString = updatesLogString + "\n" + addedLogString + "\n" + deletedLogString;

      const updateData = {
        update: updates,
        add: added,
        delete: deleted,
        logString,
      };

      // this.setState({updateData})
      resolve(updateData);
    });
  }

  printDiff() {
    return (
      <div style={{ margin: 15 }}>
        <p style={{ marginBottom: 10, marginTop: 15 }}>Changelog: </p>
        <Input
          componentClass="textarea"
          rows={15}
          placeholder="Textarea"
          value={this.state.updateData.logString}
          disabled
          size="xs"
        />
      </div>
    );
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} onShow={this.onShow} size="lg">
        <Modal.Header>
          <h3>Import Data</h3>
        </Modal.Header>

        <Modal.Body>
          <div style={{ minHeight: "500px", marginLeft: 100, marginRight: 100 }}>
            <Steps current={this.state.currentStep}>
              <Steps.Item title="Choose data" />
              <Steps.Item title="Info" />
              <Steps.Item title="Compare" />
            </Steps>
            {this.state.currentStep === 0 ? (
              <FlexboxGrid justify="center" align="middle" style={{ height: 150, marginTop: 35 }}>
                <FlexboxGrid.Item colspan={12} justify="center" align="middle">
                  <Panel header={<h3>Choose data</h3>} bordered>
                    <Form fluid>
                      <FormGroup>
                        <Button appearance="primary" onClick={() => this.fileInputRef.current.click()}>
                          Import data
                        </Button>
                      </FormGroup>
                    </Form>
                  </Panel>
                </FlexboxGrid.Item>
              </FlexboxGrid>
            ) : this.state.currentStep === 1 ? (
              <FlexboxGrid justify="center" align="middle" style={{ height: 150, marginTop: 35 }}>
                <FlexboxGrid.Item colspan={12} justify="center" align="middle">
                  <Panel header={<h3>Info</h3>} bordered>
                    <Form fluid>
                      <FormGroup>
                        <div align="left">
                          <ul>
                            {this.state.info.map((entry) => {
                              return (
                                <li key={entry.key}>
                                  <b>{entry.key}</b> : {entry.value}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        <Button appearance="primary" onClick={() => this.setState({ currentStep: 2 })}>
                          Next
                        </Button>
                      </FormGroup>
                    </Form>
                  </Panel>
                </FlexboxGrid.Item>
              </FlexboxGrid>
            ) : this.state.currentStep === 2 ? (
              <div>
                <FlexboxGrid justify="center" align="middle" style={{ height: 150, marginTop: 35 }}>
                  <FlexboxGrid.Item colspan={12} justify="center" align="middle">
                    <Panel header={<h3>Compare and import</h3>} bordered>
                      <ButtonToolbar>
                        <Button appearance="primary" onClick={this.overwriteData}>
                          Overwrite
                        </Button>
                        <Button appearance="primary" onClick={this.mergeData}>
                          Merge
                        </Button>
                      </ButtonToolbar>
                    </Panel>
                  </FlexboxGrid.Item>
                </FlexboxGrid>
                {this.printDiff()}
              </div>
            ) : null}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button appearance="subtle" onClick={this.props.onHide}>
            Quit
          </Button>
        </Modal.Footer>
        <input
          type="file"
          onChange={this.uploadFile}
          ref={this.fileInputRef}
          multiple={false}
          hidden
          accept="application/JSON"
        />
      </Modal>
    );
  }
}

export default ImportModal;
