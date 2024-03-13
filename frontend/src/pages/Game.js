import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import EventsList from '../components/EventsList/EventsList';
import { Pitch } from '../components/Pitch/Pitch';
import '../components/Pitch/pitch_style.css';

function Game() {
  const [selectedAction, setSelectedAction] = useState(null);
  const [isPitchClickable, setIsPitchClickable] = useState(false);
  const [blurActive, setBlurActive] = useState(false);

  const handleActionSelection = (actionType) => {
    setSelectedAction(actionType);
    setIsPitchClickable(true);
    setBlurActive(true);
  };

  const handleMarkerPlacement = () => {
    setIsPitchClickable(false);
    setBlurActive(false);
  };

  return (
    <Container fluid className="p-0">
      <Row noGutters className="flex-nowrap">
        <Col md={2} className={`d-flex flex-column align-items-center p-2 action-buttons-column ${blurActive ? 'blur-effect' : ''}`}>
          {['Goal', 'Point', 'Miss', 'Block', 'Foul'].map((actionType) => (
            <Button key={actionType} variant="primary" className="my-1" onClick={() => handleActionSelection(actionType)}>
              {actionType}
            </Button>
          ))}
        </Col>

        <Col md={7} className="d-flex justify-content-center p-2">
          <Pitch onMarkerPlaced={handleMarkerPlacement} isClickable={isPitchClickable} selectedAction={selectedAction} />
        </Col>
        
        <Col md={2} className={`d-flex flex-column align-items-center p-2 action-buttons-column ${blurActive ? 'blur-effect' : ''}`}>
            
        </Col>


      </Row>
      <Row noGutters className="flex-nowrap">
        {/* <EventsList/> */}
      </Row>
    </Container>
  );
}

export default Game;
