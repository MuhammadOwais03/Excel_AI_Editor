import { cn } from '@/lib/utils';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
}

const ChatMessage = ({ content, isUser }: ChatMessageProps) => {
  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] rounded-lg px-3 py-2 text-sm',
          isUser
            ? 'bg-foreground text-background'
            : 'bg-muted text-foreground'
        )}
      >
        {content}
      </div>
    </div>
  );
};

export default ChatMessage;
