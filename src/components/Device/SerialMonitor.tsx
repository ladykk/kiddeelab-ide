import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/solid";
import { Button, Modal, TextInput } from "flowbite-react";
import { useState, useEffect, Fragment } from "react";
import { useChatScroll } from "../../hooks/chat";
import { selectProject } from "../../redux/project";
import { useAppSelector } from "../../redux/store";
import { SerialData } from "../../types/device";

export default function SerialMonitor() {
  const { deviceId, port } = useAppSelector(selectProject);
  const [messages, setMessages] = useState<Array<SerialData>>([]);
  const [input, setInput] = useState<string>("");
  const [baudRate, setBaudRate] = useState<number>(9600);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);

  const messageRef = useChatScroll(messages);

  useEffect(() => {
    (async () => {
      setOpen(await window.serial.isOpen());
      window.serial.onSerialChange((event, status) => setOpen(status));
      window.serial.onSerialData((event, data) => {
        setMessages((prev) => {
          if (
            prev.find((p) => p.timestamp.getTime() === data.timestamp.getTime())
          ) {
            return prev;
          } else {
            return [...prev, data];
          }
        });
      });
      return () => {
        window.serial.onSerialChange(undefined);
        window.serial.onSerialData(undefined);
      };
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (show && port && baudRate) {
        await window.serial.open(port, baudRate);
      } else {
        console.log(await window.serial.close());
        setMessages([]);
      }
    })();
  }, [show, port, baudRate]);

  const sendMessage = async () => {
    if (isOpen) {
      const message = `${input}\n`;
      if (await window.serial.write(message)) {
        setMessages((prev) => [
          ...prev,
          {
            timestamp: new Date(),
            message: new TextEncoder().encode(`\n${message}`),
          },
        ]);
        setInput("");
      }
    }
  };

  const disabled = deviceId === null || !port;

  return (
    <Fragment>
      <Button onClick={() => setShow(true)} disabled={disabled}>
        <ChatBubbleOvalLeftIcon className="w-4 mr-2" />
        Serial Monitor
      </Button>
      <Modal
        show={show}
        onClose={() => {
          setShow(false);
        }}
      >
        <Modal.Header>
          <p className="font-bold text-blue-600">Serial Monitor</p>
        </Modal.Header>
        <Modal.Body>
          <div className="w-full h-[70vh] overflow-y-auto" ref={messageRef}>
            {messages
              .map((m) => `${new TextDecoder("utf-8").decode(m.message)}`)
              .join("")
              .split("\n")
              .map((m) => (
                <p>{m}</p>
              ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <TextInput
            className="flex-1"
            placeholder="Write command here..."
            disabled={!isOpen}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button disabled={!isOpen} onClick={sendMessage}>
            Send
          </Button>
          <TextInput
            className="w-[100px]"
            placeholder="Baud Rate"
            type="number"
            value={baudRate}
            onChange={(e) => setBaudRate(Number(e.target.value))}
          />
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}
