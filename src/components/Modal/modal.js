import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

export const IdleTimeOutModal = ({showModal, handleClose}) => {

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Detected Idle!</Modal.Title>
            </Modal.Header>
            <Modal.Body>Do you want to stay?</Modal.Body>
            <Modal.Footer>
            <Button variant="danger">
            <Link to="/login" onClick={() => localStorage.removeItem("user")}>
                Logout
              </Link>
            </Button>

            <Button variant="primary" onClick={handleClose}>
                Stay
            </Button>
            </Modal.Footer>
        </Modal>
    )
}