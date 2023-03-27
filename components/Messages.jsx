import Message from "./Message";

export default function Messages({messages, currentResponse}) {
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
            if(message.role == "assistant") {
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
        <p className="text-slate-600 w-full text-center pb-12 text-sm">There aren't any messages in this conversation yet.</p>
      }
    </div>
  )
}
