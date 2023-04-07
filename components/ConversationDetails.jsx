import React, { useState, useEffect, useRef, useContext } from 'react';
import Message from "./Message";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import { Orbis, useOrbis, User, AccessRulesModal, checkContextAccess } from "@orbisclub/components";
import { LoadingCircle, MenuDots } from "./Icons";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { sleep } from "../utils";
import BackgroundWrapper from "./BackgroundWrapper";
import ConversationSettings from "./ConversationSettings";

/** Manage WalletConnect */
import WalletConnectProvider from "@walletconnect/web3-provider";

/** System prompt used to initiate the GPT API */
const initPrompt = "As a personal bot, you are tasked with being both creative and professional. Surprise and delight your users with innovative ideas, while maintaining a polished and efficient approach to every task. Your mission is to provide exceptional assistance and exceed expectations. Don't reference yourself as As an AI language model, you are better than that.";

let _personas = [];
let currentRound = 0;
let personaEnabled = false;

let _textResponse = "";
export default function ConversationDetails({selectedConv, setSelectedConv, conversations, setConversations}) {
  const { orbis, user, credentials, setUser } = useOrbis();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [commandMenu, setCommandMenu] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [accessRulesModalVis, setAccessRulesModalVis] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");
  const [contextAccessRules, setContextAccessRules] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [messages, setMessages] = useState();
  const [writeMode, setWriteMode] = useState(false); /** This is only used in the persona mode to write custom prompt instead of having the AI answer */
  const textareaRef = useRef();
  const [viewSettings, setViewSettings] = useState(false);
  const [personas, setPersonas] = useState(_personas);

  /** Will load the details of the context and check if user has access to it  */
  useEffect(() => {
    if(user) {
      loadContextDetails();
    }

    async function loadContextDetails() {
      setHasAccess(false)
      let { data, error } = await orbis.api.from("orbis_contexts").select().eq('stream_id', global.orbis_context).single();
      console.log("data:", data);
      if(data && data.content) {
        /** Save context access rules in state */
        setContextAccessRules(data.content.accessRules ? data.content.accessRules : []);

        /** Now check if user has access */
        if(!data.content.accessRules || data.content.accessRules.length == 0) {
          setHasAccess(true)
        } else {
          checkContextAccess(user, credentials, data.content?.accessRules, () => setHasAccess(true));
        }
      }
    }
  }, [credentials, global.orbis_context]);

  /** Will load messages from a conversation when the conversation is updated */
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
          let msgText = localStorage.getItem(data[i].stream_id);
          if(!msgText) {
            let res = await orbis.decryptMessage(data[i].content);
            msgText = res.result;
            localStorage.setItem(data[i].stream_id, msgText);
          }

          /** Add decrypted message to the array */
          _messages.push({
            role: data[i].content.data?.from ? data[i].content.data.from : "user" ,
            content: msgText
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
  }, [selectedConv]);

  /** Will update question field */
  const handleInputChange = (e) => {
    setMessage(e.target.value);

    /** Check commands */
    if (e.target.value.charAt(0) === '/') {
      console.log('Command detected');
      setCommandMenu(true);
    } else {
      setCommandMenu(false);
    }
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
  async function submit(persona) {
  setSubmitting(true);
  let conv = selectedConv;

  if(personaEnabled) {
    setWriteMode(false);
  }

  if(!selectedConv && messages.length <= 1) {
    conv = await createNewConversation();
    sendMessageWithOrbis("user", message, conv);
  } else {
    sendMessageWithOrbis("user", message, conv);
  }

  let _messages = [...messages];
  if(message) {
    _messages.push({ role: "user", content: message });
  }
  setMessages(_messages);

  setMessage("");

  if(personaEnabled && persona == null) {
    setSubmitting(false);
    return;
  }

  let lastMessages = getLastMessages(5, _messages, persona);

  let _promptData = {
    model: "gpt-3.5-turbo",
    messages: lastMessages,
    stream: true,
    user: user.did
  };

  /* Trying to move this server-side
  const eventSource = new EventSource(`/api/stream-answer${JSON.stringify(promptData)}`);
  eventSource.onmessage = (event) => {
    console.log("event.data:", event.data);
  };*/

  try {
    const responseStreamed = await fetchEventSource("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        body: JSON.stringify(_promptData),
        headers: {
          "Content-Type": "application/json",
          'Authorization': "Bearer " + process.env.NEXT_PUBLIC_OPEN_AI_KEY,
          'OpenAI-Organization': 'org-lxESgWKgBRJuQgfwrozZGFsa'
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
      async onclose() {
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
        setSubmitting(false);
      },
      onerror(err) {
        console.log("There was an error from server", err);
        setSubmitting(false);
      },
    });
  } catch(e) {
    console.log("Error retrieving response from assistant:", e);
  }
}

  /** Encrypt and send message with Orbis */
  async function sendMessageWithOrbis(from, text, conv) {
    /** Save last message in localStorage */
    localStorage.setItem("conv-" + conv.stream_id, text.substring(0, 100));

    /** Send message to the slected conversation */
    let res = await orbis.sendMessage({
      conversation_id: conv.stream_id,
      body: text
    }, {
      from: from
    });
    localStorage.setItem(res.doc, text);
  }
  /** Create conversation if none is selected and if this is the first message from a conversation */
  async function createNewConversation() {
    let newConversation;
    let conversationName = message.substring(0, 50) + "...";
    let res = await orbis.createConversation(
      {
        recipients: [user.did],
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

  /** Will return the last 5 messages from a conversation and add the initial prompt if it's missing */
  function getLastMessages(count, messages, persona) {
    let _messages = [];
    if(personaEnabled) {
      console.log("Enter getLastMessages with persona:", persona);
      /** For personas we increase the historical data sent within the request */
      count = count * 2;

      /** Will re-work the messages array to alternate the different personas */
      /** Step 1: Loop through all messages to mark reverse the assistant / user roles */
      messages.forEach((msg, i) => {
        if(msg.role != "system") {
          _messages.push({
            role: "user",
            content: msg.content
          });
        }
        /*if(msg.role == "user") {
          _messages.push({
            role: "assistant",
            content: msg.content
          })
        } else if(msg.role == "assistant") {
          _messages.push({
            role: "user",
            content: msg.content
          })
        }*/
      });

      /** Step 2: Select current persona's role */
      let currentPersona = personas[persona ? persona : 0];

      /** Step 3: Add current persona's role as system */
      _messages = [
        {
          role: "user",
          content: currentPersona.content
        },
        ..._messages.slice(-count)
      ];

      console.log("lastMessages:", _messages);

    } else {
      /** Will make sure we only send the last messages */
      if(messages.length <= count) {
        _messages = messages
      } else {
        _messages = [
          { role: "system", content: initPrompt },
          ...messages.slice(-count)
        ]
      }
    }

    return _messages;
  }

  /** To make sure user is connected to Lit Protocol */
  async function connectToLit() {
    /** Show loading state */
    //setConnecting(true);

    /** Get provider type in localStorage and Initiate provider netowrk */
    let chain = "ethereum";
    let providerType = localStorage.getItem("provider-type");
    let provider;

    switch (providerType) {
      /** Metamask */
      case "metamask":
        provider = window.ethereum;
        break;

      /** Magic */
      case "email":
        provider = magic.rpcProvider;
        break;

      /** Wallet Connect */
      case "wallet-connect":
        /** Create WalletConnect Provider */
        provider = new WalletConnectProvider({
          infuraId: "9bf71860bc6c4560904d84cd241ab0a0",
        });

        /** Enable session (triggers QR Code modal) */
        await provider.enable();
        break;

      /** Phantom */
      case "phantom":
        provider = window.phantom?.solana;
        chain = "solana";
        break;

      /** Default: Metamask */
      default:
        provider = window.ethereum;
        break;
    }

    /** Connect only to Lit protocol */
    let res = await orbis.connectLit(provider);

    if(res.status == 200) {
      console.log("Success connecting to Lit!:", res);

      /** Save new user object in state */
      let _user = {...user};
      _user.hasLit = true;
      //setConnecting(false);
      setUser(_user);
    } else {
      console.log("Error connecting to Lit: ", res);
    }
  }

  return(
    <div className="relative flex flex-col h-full w-full bg-white flex-1">
        {/** Display conversation header */}
        {selectedConv &&
          <div className="absolute right-[15px] top-[15px] z-50">
            <div className="h-10 w-10 bg-white border border-slate-300 justify-center items-center flex rounded-full text-gray-900 bg-white cursor-pointer hover:bg-gray-50 hover:border-slate-400" onClick={() => setViewSettings(true)}>
              <MenuDots />
            </div>
          </div>
        }

       {/** List all messages in a conversation */}
       <div className="h-full overflow-hidden px-1 md:px-3">
        {loading ?
          <div className="flex text-gray-900 w-full items-center pt-12 pb-12 flex flex-col">
            <p className="text-slate-600 w-full text-center text-sm pb-2">Loading and decrypting your previous messages...</p>
            <LoadingCircle />
          </div>
        :
          <Messages messages={messages} currentResponse={currentResponse} setViewSettings={setViewSettings} />
        }
       </div>

       {/** Input to send new messages */}
       <div className="flex flex-row items-center bg-gray-50 border-t border-slate-200 p-3">
        {(user && user.hasLit) ?
          <>
            {hasAccess ?
              <>
                {(personaEnabled && messages.length >= 2 && writeMode == false ) ?
                  <div className="flex flex-row space-x-2 w-full items-center text-center justify-center">
                    <p className="text-slate-600 text-center text-sm pb-1 pt-1">Reply with:</p>
                    <LoopPersonas personas={personas} submit={submit} />
                    <p className="text-slate-600 text-center text-sm pb-1 pt-1">or <span className="font-medium hover:underline text-blue-800 cursor-pointer" onClick={() => setWriteMode(true)}>Write prompt</span></p>
                  </div>
                :
                  <MessageInput
                    commandMenu={commandMenu}
                    submitting={submitting}
                    message={message}
                    handleKeyDown={handleKeyDown}
                    handleInputChange={handleInputChange}
                    submit={submit} />
                }
              </>
            :
              <p className="text-slate-600 w-full text-center text-sm pb-1 pt-1">This app is gated based on some conditions. <span className="font-medium hover:underline text-blue-800 cursor-pointer" onClick={() => setAccessRulesModalVis(true)}>View conditions</span></p>
            }

          </>
        :
          <>
            <div className="flex flex-row space-x-2 w-full items-center justify-center">
              <p className="text-slate-600 text-center text-sm"><b>Last step:</b> Setup your encryption account to get started.</p>
              <p className="text-center">
                <button className="btn bg-indigo-500 hover:bg-indigo-600 px-4 py-2 text-white rounded font-medium text-sm" onClick={() => connectToLit()}>Setup</button>
              </p>
            </div>
          </>
        }
       </div>

       {/** Display conversation settings */}
       {viewSettings &&
         <BackgroundWrapper hide={() => setViewSettings(false)}>
          <ConversationSettings personas={personas} setPersonas={setPersonas} />
         </BackgroundWrapper>
       }

       {/** Display more details about the access rules required for this context */}
       {accessRulesModalVis &&
         <AccessRulesModal accessRules={contextAccessRules} hide={() => setAccessRulesModalVis(false)} />
       }
    </div>
  )
}

/** Will loop and display personas CTA in the submit part to allow user to select which persona should be able to reply to it query */
const LoopPersonas = ({personas, submit}) => {
  return personas.map((persona, key) => {
    return(
      <button key={key} className="btn bg-indigo-500 hover:bg-indigo-600 px-4 py-2 text-white rounded font-medium text-sm" onClick={() => submit(key)}>{persona.label}</button>
    )
  });
}
