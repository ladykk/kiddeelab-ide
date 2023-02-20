import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/solid";
import { Button, Modal, Select, TextInput } from "flowbite-react";
import { useState, useEffect, Fragment } from "react";
import { useChatScroll } from "../../hooks/chat";
import { selectCore } from "../../redux/core";
import { selectProject } from "../../redux/project";
import { useAppSelector } from "../../redux/store";
import { SerialData } from "../../types/device";

export default function SerialMonitor() {
  const { deviceId, port } = useAppSelector(selectProject);
  const { isUploading } = useAppSelector(selectCore);
  const [messages, setMessages] = useState<Array<SerialData>>([]);
  const [input, setInput] = useState<string>("");
  const [baudRate, setBaudRate] = useState<number>(9600);
  const [isOpen, setOpen] = useState<boolean>(false);

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
      if (port && baudRate && !isUploading) {
        await window.serial.close();
        await window.serial.open(port, baudRate);
        setMessages([]);
      } else {
        await window.serial.close();
      }
    })();
  }, [port, baudRate, isUploading]);

  useEffect(() => {
    if (isUploading) {
      setMessages([]);
    }
  }, [isUploading]);

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

  const disabled = deviceId === null || !port || isUploading;

  return (
    <Fragment>
      <div className="bg-gray-50 px-4 py-2 border-t border-b flex justify-between items-center">
        <p className="text-lg font-bold text-blue-600">Serial Monitor</p>
        <Select
          className="w-[80px]"
          placeholder="Baud Rate"
          value={baudRate}
          sizing="sm"
          onChange={(e) => setBaudRate(Number(e.target.value))}
        >
          <option value="110">110</option>
          <option value="300">300</option>
          <option value="600">600</option>
          <option value="1200">1200</option>
          <option value="2400">2400</option>
          <option value="4800">4800</option>
          <option value="9600">9600</option>
          <option value="14400">14400</option>
          <option value="19200">19200</option>
          <option value="38400">38400</option>
          <option value="57600">57600</option>
          <option value="115200">115200</option>
          <option value="128000">128000</option>
          <option value="256000">256000</option>
        </Select>
      </div>

      <div
        className="w-full h-full min-h-[350px] overflow-y-auto p-2"
        ref={messageRef}
      >
        {messages
          .map((m) => `${new TextDecoder("utf-8").decode(m.message)}`)
          .join("")
          .split("\n")
          .map((m, index) => (
            <p key={index}>{m}</p>
          ))}
      </div>
      <div className="flex gap-2 bg-gray-50 p-2 border-t items-center">
        <TextInput
          className="flex-1"
          placeholder="Write command here..."
          disabled={!isOpen || disabled}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <Button disabled={!isOpen || disabled} size="sm" onClick={sendMessage}>
          Send
        </Button>
      </div>
    </Fragment>
  );
}
