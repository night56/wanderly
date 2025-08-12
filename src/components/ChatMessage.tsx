import { Message } from '../types'
import { User, Bot } from 'lucide-react'

interface ChatMessageProps {
  message: Message
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAI = message.type === 'ai'
  
  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <strong key={index} className="text-primary-600">{line.slice(2, -2)}</strong>
      }
      if (line.startsWith('•')) {
        return <li key={index} className="ml-4">{line.slice(1)}</li>
      }
      if (line.trim() === '') {
        return <br key={index} />
      }
      return <span key={index}>{line}</span>
    })
  }

  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex items-start space-x-3 max-w-[80%] ${isAI ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isAI ? 'bg-primary-600' : 'bg-gray-600'
        }`}>
          {isAI ? (
            <Bot className="h-5 w-5 text-white" />
          ) : (
            <User className="h-5 w-5 text-white" />
          )}
        </div>
        
        <div className={`rounded-2xl px-4 py-3 ${
          isAI 
            ? 'bg-gray-100 text-gray-900' 
            : 'bg-primary-600 text-white'
        }`}>
          <div className="text-sm whitespace-pre-wrap">
            {formatContent(message.content)}
          </div>
          <div className={`text-xs mt-2 ${
            isAI ? 'text-gray-500' : 'text-primary-200'
          }`}>
            {message.timestamp.toLocaleTimeString('tr-TR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatMessage