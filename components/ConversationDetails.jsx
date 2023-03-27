import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import ConversationHeader from "./ConversationHeader";
import Message from "./Message";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import { Orbis, useOrbis, User } from "@orbisclub/components";
import { LoadingCircle } from "./Icons";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { initPrompt } from "../utils/ai";

let _textResponse = "";
export default function ConversationDetails({selectedConv, setSelectedConv, conversations, setConversations}) {
  const { orbis, user } = useOrbis();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");
  const [messages, setMessages] = useState();
  const textareaRef = useRef();

  useEffect(() => {
    /** Reset conversation */
    setMessages([
      {role: "system", content: initPrompt}
    ]);

    /** Load messages from the conversation (we avoid loading messages from conversations we just created) */
    if(selectedConv) {
      loadMessages();
    }

    /** Will load all messages from the conversation, decrypt them and display in the app */
    async function loadMessages() {
      setLoading(true);
      let { data, error } = await orbis.getMessages(selectedConv.stream_id);

      if(data && data.length > 0) {
        //setConversations(data);
        let _messages = [];

        /** Loop through all messages returned by Orbis */
        for (let i = [...data].reverse().length - 1; i >= 0; i--) {
          let res = await orbis.decryptMessage(data[i].content);
          console.log("res:", res);
          _messages.push({
            role: data[i].content.data?.from ? data[i].content.data.from : "user" ,
            content: res.result
          });
        }

        /** Save decrypted messages in state */
        if(_messages.length > 0) {
          setMessages([
            {role: "system", content: initPrompt},
            ..._messages]);
        }
      }

      setLoading(false);
    }
  }, [selectedConv])

  /** Will update question field */
  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  /** Will handle keydown to submit message on enter */
  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      submit();
    }
  }

  /** Will submit the message and generate an answer from GPT */
  async function submit() {
    console.log("Enter submit with selectedConv:", selectedConv);
    let conv = selectedConv;
    /** Create conversation if none is selected and if this is the first message from a conversation */
    if(!selectedConv && messages.length <= 1) {
      conv = await createNewConversation();
      console.log("Conversation created: ", conv);

      /** Send user's message */
      sendMessageWithOrbis("user", message, conv);
    } else {
      /** Send user's message */
      sendMessageWithOrbis("user", message, conv);
    }

    /** Loop messages */
    let _messages = [...messages];
    _messages.push(
      {
        role: "user",
        content: message
      }
    );
    setMessages(_messages);

    /** Reset fields */
    setMessage("");

    /** Generate a prompt based on the question */
    let _promptData = {
      model: "gpt-3.5-turbo",
      messages: _messages,
      stream: true,
      temperature: 0.6,
      user: user.did
    };
    try {
      const responseStreamed = await fetchEventSource("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        body: JSON.stringify(_promptData),
        headers: {
          "Content-Type": "application/json",
          'Authorization': "Bearer " + process.env.NEXT_PUBLIC_OPEN_AI_KEY,
          'OpenAI-Organization': 'org-WbmUqbZDRruhWmTtqo3ToWPO'
        },
        onopen(res) {
          if (res.ok && res.status === 200) {
          } else if (
            res.status >= 400 &&
            res.status < 500 &&
            res.status !== 429
          ) {
            console.log("Client side error ", res);
          }
        },
        onmessage(event) {
          if(event.data != "[DONE]") {
            const parsedData = JSON.parse(event.data);
            if(parsedData?.choices[0]?.delta?.content) {
              _textResponse = _textResponse + parsedData.choices[0].delta.content
              setCurrentResponse(_textResponse);
            }
          }
        },
        onclose() {
          _messages.push(
            {
              role: "assistant",
              content: _textResponse
            }
          );
          setMessages(_messages);
          sendMessageWithOrbis("assistant", _textResponse, conv);
          _textResponse = "";
          setCurrentResponse(null);
        },
        onerror(err) {
          console.log("There was an error from server", err);
        },
      });
    } catch(e) {
      console.log("Error retrieving response from assistant:", e);
    }
  }

  /** Encrypt and send message with Orbis */
  async function sendMessageWithOrbis(from, text, conv) {
    console.log("Enter sendMessageWithOrbis conv:", conv)
    /** Send message to the slected conversation */
    let res = await orbis.sendMessage({
      conversation_id: conv.stream_id,
      body: text
    }, {
      from: from
    });
    console.log("message sent:", res);
  }
  /** Create conversation if none is selected and if this is the first message from a conversation */
  async function createNewConversation() {
    let newConversation;
    console.log("enter createNewConversation");
    let conversationName = message.substring(0, 50) + "...";
    let res = await orbis.createConversation(
      {
        recipients: [
          "did:key:z6MkhvoSQhPDNwotybwX9o2scoSvkx5Syem3GiM9FV8h5YXG",
          user.did
        ],
        context: global.orbis_context,
        name: conversationName
      }
    );
    console.log("res:", res);

    newConversation = {
      stream_id: res.doc,
      content: {
        name: conversationName
      },
      new: true
    };
    setSelectedConv(newConversation);
    setConversations([
      newConversation,
      ...conversations
    ]);

    return newConversation;
  }

  return(
    <div className="flex flex-col h-full w-full bg-white pb-4 flex-1">

       {/** List all messages in a conversation */}
       <div className="h-full overflow-hidden px-4">
        {loading ?
          <div className="flex text-gray-900 w-full items-center pt-12 pb-12 flex flex-col">
            <p className="text-slate-600 w-full text-center text-sm pb-2">Loading and decrypting your previous messages...</p>
            <LoadingCircle />
          </div>
        :
          <Messages messages={messages} currentResponse={currentResponse} />
        }
       </div>

       {/** Input to send new messages */}
       <div className="flex flex-row items-center bg-gray-50 border-t border-slate-200 pt-3 px-3">
          <MessageInput message={message} handleKeyDown={handleKeyDown} handleInputChange={handleInputChange} submit={submit} />
       </div>
    </div>
  )
}
