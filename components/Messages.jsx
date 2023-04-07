import Message from "./Message";

export default function Messages({messages, currentResponse, setViewSettings}) {
  return(
    <div className="flex flex-col-reverse space-y-1 overflow-scroll h-full overflow-y-auto">
      {/** Display current response if any */}
      {currentResponse &&
        <Message message={{role: "assistant", content: currentResponse}} />
      }

      {/** Loop messages */}
      {messages && messages.length > 1 ?
        <>
          {/** Loop through all messages sent and display them */}
          {[...messages].reverse().map((message, key) => {
            if(message.role == "assistant" || (message.role == "system" && message.name)) {
              return (
                <Message message={message} key={key} sent={false} />
              );
            } else if(message.role == "user") {
              return (
                <Message message={message} key={key} sent={true} />
              );
            } else {
              return null;
            }
          })}
        </>
      :
        <div className="flex flex-col space-y-2 items-center">
          {/**<p className="text-slate-600 w-full text-center pb-12 text-sm w-2/3">Send your first message to get started! Additionally, you can engage with a variety of unique AI personas to gain new insights and ideas: <br/><span className="font-medium hover:underline text-blue-800 cursor-pointer" onClick={() => setViewSettings(true)}>+ Manage personas</span></p>*/}
          <p className="text-slate-600 w-full text-center pb-12 text-sm w-2/3">Send your first message to get started!</p>
        </div>
      }
    </div>
  )
}
