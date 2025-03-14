import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const AddAwardModal = ({sh,onClose}) => {


  return (
    <div className="container mt-4">
    

      <Modal show={sh} onHide={onClose} centered>
        <Modal.Header closeButton>
          <div className="d-flex flex-column">
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ width: "56px", height: "56px", backgroundColor: "#F5F7F8", borderRadius: "8px" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "32px", color: "#414651" }}>flag</span>
            </div>
            <h5 className="mt-2 mb-1">Add Awards</h5>
            <p className="text-muted">Share where you've worked on your profile.</p>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Award Title*</Form.Label>
              <Form.Control type="text" placeholder="What is your title?" required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Issuer/Organization*</Form.Label>
              <Form.Control type="text" placeholder="Who issued the award?" required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Attach Proof (Optional)</Form.Label>
              <Form.Control type="file" />
              <Form.Text className="text-muted">*max size is 5MB</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Provide a brief description of the recognition." />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="info" onClick={onClose}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddAwardModal;
