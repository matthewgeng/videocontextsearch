import React, {
  Dispatch,
  SetStateAction,
  useState,
  useRef,
  useEffect,
} from "react";
import { Card, Button, Form } from "react-bootstrap";
import axios from "axios";
import ReactPlayer from "react-player";

interface FormProps {
  result: {} | undefined;
  setResult: Dispatch<SetStateAction<{} | undefined>>;
}
interface Event<T = EventTarget> {
  target: T;
  // ...
}
const VideoForm: React.FC<FormProps> = ({ result, setResult }: FormProps) => {
  const [file, setFile] = useState<File | undefined>();
  const [videoFilePath, setVideoFileURL] = useState(null);
  const [search, setSearch] = useState<string>();
  const [isFileProcessed, setIsFileProcessed] = useState<boolean>(false);
  const vidRef = useRef<ReactPlayer>();

  const fileChangeHandler = (e: Event<HTMLInputElement>) => {
    setFile(e.target.files[0]);
    setVideoFileURL(URL.createObjectURL(e.target.files[0]));
  };
  const submitVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    setIsFileProcessed(false);

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
        console.log(res.data);
        setIsFileProcessed(true);
      })
      .catch((err) => {
        console.log(err);
        setIsFileProcessed(false);
      });
  };
  const searchChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();

    axios({
      method: "POST",
      url: `/search`,
      baseURL: "http://localhost:5000/api",
      data: {
        search,
      },
    })
      .then((res) => {
        setResult(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [timestamps, setTimestamps] = useState<any>();

  useEffect(() => {
    if (result !== undefined) {
      setTimestamps(
        Object.keys(result).map((key, i) => {
          return (
            <Button
              key={i}
              onClick={() => vidRef.current.seekTo(parseFloat(key) / 1000)}
              className="m-2"
            >
              {parseFloat(key) / 1000} s
            </Button>
          );
        })
      );
    }
  }, [result]);

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
      {isFileProcessed && (
        <ReactPlayer
          ref={vidRef}
          url={videoFilePath}
          width="100%"
          controls={true}
        ></ReactPlayer>
      )}
      <Form onSubmit={submitSearch}>
        <Form.Group>
          <Form.Control
            size="lg"
            type="text"
            placeholder="Search"
            onChange={searchChangeHandler}
          />
        </Form.Group>
      </Form>
      <div>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
      {timestamps}
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
  result: {} | undefined;
  setResult: Dispatch<SetStateAction<{} | undefined>>;
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
