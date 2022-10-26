import ChatBot from "react-simple-chatbot";
import ChatBotStyle from './ChatBot.module.css';

import { Button } from "primereact/button";
import { useState } from "react";
import { Dialog } from "primereact/dialog";

import ChatBotScripts from "./ChatBotScripts";
import StepByScript from "./ChatBotUtils";

import { ThemeProvider } from "styled-components";

function ChatBotModal() {

  const [displayDialog, setDisplayDialog] = useState(false);
  const [position, setPosition] = useState("center");

  const onClick = (displayDialog, position) => {
    setDisplayDialog(true);

    if (position) {
      setPosition(position);
    }
  };

  const onHide = (displayDialog) => {
    setDisplayDialog(false);
  };

  const chatBotBox = {
    backgroundColor: "#282936",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "500px",
    headerFontColor: "#9DDE93",
  };
    
  return (
    <>
      <Button
        className={ChatBotStyle.chatBotBtn}
        icon="pi pi-comments"
        onClick={() => onClick(displayDialog)}
      />
      <Dialog
        label="왜-애자일 챗봇"
        visible={displayDialog}
        style={{ width: "520px" }}
        onHide={() => onHide(displayDialog)}
      >
        <ThemeProvider theme={chatBotBox}>
          <ChatBot
            width={"480px"}
            headerTitle="WHY-AGILE CHATBOT"
            hideBotAvatar={true}
            enableSmoothScroll={true}
            hideSubmitButton={true}
            hideUserAvatar={true}
            inputStyle={{ backgroundColor: "#282936" }}
            bubbleStyle={{
              backgroundColor: "#333544",
              color: "white",
              fontSize: "0.85em",
            }}
            bubbleOptionStyle={{
              backgroundColor: "#9DDE93",
              color: "black",
              fontSize: "0.85em",
            }}
            placeholder={"WHY-AGILE CHATBOT Ver 1.0.2"}
            steps={StepByScript(ChatBotScripts)}
          />
        </ThemeProvider>
      </Dialog>
    </>
  );
} 


export default ChatBotModal;




 