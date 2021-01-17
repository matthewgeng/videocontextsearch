import React, { useState } from "react";
import "./App.css";
import { Col, Container, Row, Nav, Card } from "react-bootstrap";
import TabForm from "./components/TabForm";

const App: React.FC = () => {
  const [tab, setTab] = useState<string | null>("video");
  const [result, setResult] = useState<[number]>();

  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Nav fill variant="pills" activeKey={tab} onSelect={setTab}>
                <Nav.Item>
                  <Nav.Link eventKey="video">Video</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="ytlink">Youtube Link</Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            <TabForm tab={tab} result={result} setResult={setResult}></TabForm>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default App;
