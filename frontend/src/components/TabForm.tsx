import React, { Dispatch, SetStateAction, useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import axios from "axios";

interface FormProps {
  result: [number] | undefined;
  setResult: Dispatch<SetStateAction<[number] | undefined>>;
}
interface Event<T = EventTarget> {
  target: T;
  // ...
}
const VideoForm: React.FC<FormProps> = ({ result, setResult }: FormProps) => {
  const [file, setFile] = useState<File | undefined>();
  const fileChangeHandler = (e: Event<HTMLInputElement>) => {
    setFile(e.target.files[0]);
  };
  const submitVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    axios({
      method: "POST",
      url: `/video`,
      baseURL: "http://localhost:5000/api",
      data: formData,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((res) => {
        setResult(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Card.Body>
      <Card.Title>Upload a video</Card.Title>
      <Card.Text>text</Card.Text>
      <Form onSubmit={submitVideo}>
        <Form.Group>
          <Form.File type="file" onChange={fileChangeHandler} />
        </Form.Group>
        <Button type="submit" variant="primary">
          Submit
        </Button>
      </Form>
    </Card.Body>
  );
};

const YTlinkForm: React.FC<FormProps> = ({ result, setResult }: FormProps) => {
  const submitYTlink = (e: React.FormEvent) => {
    e.preventDefault();
    //   axios({
    //     method: "POST",
    //     url: `/survey/${surveyType}`,
    //     baseURL: "http://localhost:5000/api",
    //     data: {
    //       traits,
    //       sentiments,
    //       questions,
    //       min,
    //       max,
    //     },
    //   })
    //     .then((res) => {
    //       setResult(res.data);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
  };
  return (
    <Card.Body>
      <Card.Title>Enter a Youtube link</Card.Title>
      <Card.Text>text</Card.Text>
      <Form onSubmit={submitYTlink}>
        <Form.Group>
          <Form.Control size="lg" type="text" placeholder="Large text" />
        </Form.Group>
      </Form>
      <Button type="submit" variant="primary">
        Submit
      </Button>
    </Card.Body>
  );
};

interface TabFormProps {
  tab: string | null;
  result: [number] | undefined;
  setResult: Dispatch<SetStateAction<[number] | undefined>>;
}

const TabForm: React.FC<TabFormProps> = ({
  tab,
  result,
  setResult,
}: TabFormProps) => {
  if (tab === "video") {
    return <VideoForm result={result} setResult={setResult}></VideoForm>;
  } else if (tab === "ytlink") {
    return <YTlinkForm result={result} setResult={setResult}></YTlinkForm>;
  }
  return null;
};

export default TabForm;
