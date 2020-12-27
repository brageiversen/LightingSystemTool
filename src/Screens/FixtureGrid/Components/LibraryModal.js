import React from "react";
import { Modal, Button } from "rsuite";

class LibraryModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} size="lg">
        <Modal.Header>
          <h3>Library</h3>
        </Modal.Header>

        <Modal.Body></Modal.Body>

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
