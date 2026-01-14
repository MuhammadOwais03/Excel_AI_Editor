import { useState } from "react";
import { MessageSquare, ChevronDown, ChevronUp, Send, Sparkles, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./ChatMessage";
import { promptToServer } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
}

const ChatDrawer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I can help you with your spreadsheet. Try asking me to create formulas, analyze data, or format cells.",
      isUser: false,
    },
  ]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
    };

    const res = await promptToServer(newMessage)

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    // Placeholder AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content:
            "This is a placeholder response. AI functionality will be connected soon.",
          isUser: false,
        },
      ]);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    // <div
    //   className={cn(
    //     'border-t border-border bg-background transition-all duration-300 ease-in-out',
    //     isExpanded ? 'h-72' : 'h-12'
    //   )}
    // >
    //   {/* Collapsed bar */}
    //   <button
    //     onClick={() => setIsExpanded(!isExpanded)}
    //     className="w-full h-12 flex items-center justify-between px-4 hover:bg-muted/50 transition-colors"
    //   >
    //     <div className="flex items-center gap-2 text-muted-foreground">
    //       <MessageSquare className="h-4 w-4" />
    //       <span className="text-sm">Ask AI...</span>
    //     </div>
    //     {isExpanded ? (
    //       <ChevronDown className="h-4 w-4 text-muted-foreground" />
    //     ) : (
    //       <ChevronUp className="h-4 w-4 text-muted-foreground" />
    //     )}
    //   </button>

    //   {/* Expanded content */}
    //   {isExpanded && (
    //     <div className="flex flex-col h-[calc(100%-3rem)]">
    //       <ScrollArea className="flex-1 px-4">
    //         <div className="space-y-3 py-3">
    //           {messages.map((message) => (
    //             <ChatMessage
    //               key={message.id}
    //               content={message.content}
    //               isUser={message.isUser}
    //             />
    //           ))}
    //         </div>
    //       </ScrollArea>

    //       <div className="p-3 border-t border-border flex gap-2">
    //         <Input
    //           value={inputValue}
    //           onChange={(e) => setInputValue(e.target.value)}
    //           onKeyDown={handleKeyDown}
    //           placeholder="Describe changes to the spreadsheet..."
    //           className="flex-1"
    //         />
    //         <Button
    //           onClick={handleSend}
    //           size="icon"
    //           variant="outline"
    //           disabled={!inputValue.trim()}
    //         >
    //           <Send className="h-4 w-4" />
    //         </Button>
    //       </div>
    //     </div>
    //   )}
    // </div>
    <div
      className={cn(
        "border-t border-slate-200 z-15 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all duration-300 ease-out",
        isExpanded ? "h-96" : "h-14 "
      )}
      style={{zIndex:16}}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full h-14 flex items-center justify-between px-6 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              AI Assistant
            </span>
            {!isExpanded && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Click to chat with AI
              </span>
            )}
          </div>
        </div>
        {isExpanded ? (
          <Minimize2 className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
        ) : (
          <Maximize2 className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="flex flex-col h-[calc(100%-3.5rem)]">
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} {...message} />
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask AI to help with formulas, analysis, or formatting..."
                className="flex-1 h-11 rounded-xl border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatDrawer;
