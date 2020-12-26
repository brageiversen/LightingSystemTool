import React from "react";
import { Modal, Button, CheckboxGroup, Checkbox } from "rsuite";

class SettingsModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      colDefParams: this.props.colDefParams,
    };

    this.submit = this.submit.bind(this);
    this.handleChecked = this.handleChecked.bind(this);
  }

  submit() {
    this.props.updateColDef(this.state.colDefParams);
    this.props.onHide();
  }

  handleChecked(checked,field) {
    this.setState({
      colDefParams: {
        ...this.state.colDefParams,
        [field]: checked,
      }
    })
  }
/*
params = {
  vwxFixtureData: true, 
  userFixtureData: true, 
  general: true, 
  userFields: true, 
  power: true,
  vwxCadData: true, 
}
*/
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} size="lg">
        <Modal.Header>
          <h3>Settings</h3>
        </Modal.Header>

        <Modal.Body>
          <CheckboxGroup name="checkboxList">
            <p>Visibilities</p>
            <Checkbox checked={this.state.colDefParams.vwxFixtureData} onChange={(value,checked) => this.handleChecked(checked, 'vwxFixtureData')}>VWX Fixture Data</Checkbox>
            <Checkbox checked={this.state.colDefParams.userFixtureData} onChange={(value,checked) => this.handleChecked(checked, 'userFixtureData')}>User Fixture Data</Checkbox>
            <Checkbox checked={this.state.colDefParams.general} onChange={(value,checked) => this.handleChecked(checked, 'general')}>General</Checkbox>
            <Checkbox checked={this.state.colDefParams.userFields} onChange={(value,checked) => this.handleChecked(checked, 'userFields')}>User Fields</Checkbox>
            <Checkbox checked={this.state.colDefParams.power} onChange={(value,checked) => this.handleChecked(checked, 'power')}>Power</Checkbox>
            <Checkbox checked={this.state.colDefParams.vwxCadData} onChange={(value,checked) => this.handleChecked(checked, 'vwxCadData')}>VWX Cad Data</Checkbox>
          </CheckboxGroup>
        </Modal.Body>

        <Modal.Footer>
          <Button appearance="subtle" onClick={this.submit}>
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

export default SettingsModal;
