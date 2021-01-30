import React from "react";
import { Modal, Button, Form, FormGroup, Input, ControlLabel } from "rsuite";

class DimmerSettingsModal extends React.Component {
  constructor(props) {
    super(props);

    let universe = 0;
    let address = 0;
    let numberOfChannels = 0;

    if (this.props.dimmerAddressAndUniverse) {
      universe = this.props.dimmerAddressAndUniverse.universe;
      address = this.props.dimmerAddressAndUniverse.address;
      numberOfChannels = this.props.dimmerAddressAndUniverse.numberOfChannels;
    }

    this.state = {
      universe,
      address,
      numberOfChannels,
    };
    this.submitResult = this.submitResult.bind(this);
  }

  submitResult() {
    this.props.onHide();
    this.props.setDimmerAddressAndUniverse({
      universe: parseInt(this.state.universe),
      address: parseInt(this.state.address),
      numberOfChannels: parseInt(this.state.numberOfChannels),
    });
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} size="xs">
        <Modal.Header>
          <h3>Dimmer settings</h3>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <FormGroup>
              <FormGroup>
                <ControlLabel>Universe</ControlLabel>
                <Input
                  placeholder="Universe"
                  onChange={(universe) => this.setState({ universe })}
                  style={{ width: 250 }}
                  value={this.state.universe}
                />
              </FormGroup>

              <FormGroup>
                <ControlLabel>Address</ControlLabel>
                <Input
                  placeholder="Address"
                  onChange={(address) => this.setState({ address })}
                  style={{ width: 250 }}
                  value={this.state.address}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Number of channels</ControlLabel>
                <Input
                  placeholder="Number of channels"
                  onChange={(numberOfChannels) => this.setState({ numberOfChannels })}
                  style={{ width: 250 }}
                  value={this.state.numberOfChannels}
                />
              </FormGroup>
            </FormGroup>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button appearance="subtle" onClick={this.submitResult}>
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

export default DimmerSettingsModal;
