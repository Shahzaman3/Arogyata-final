import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Loader2, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
      role: 'user' | 'assistant';
      content: string;
}

export const ChatBot = () => {
      const [isOpen, setIsOpen] = useState(false);
      const [messages, setMessages] = useState<Message[]>([
            { role: 'assistant', content: 'Hello! I am Arogyata Bot. How can I help you today?' }
      ]);
      const [input, setInput] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const scrollAreaRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
            if (scrollAreaRef.current) {
                  const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
                  if (scrollContainer) {
                        scrollContainer.scrollTop = scrollContainer.scrollHeight;
                  }
            }
      }, [messages, isOpen]);

      const handleSend = async () => {
            if (!input.trim() || isLoading) return;

            const userMessage = input.trim();
            setInput('');
            setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
            setIsLoading(true);

            try {
                  const response = await fetch('http://localhost:3000/api/chat', {
                        method: 'POST',
                        headers: {
                              'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ message: userMessage }),
                  });

                  const data = await response.json();

                  if (data.error) {
                        throw new Error(data.error);
                  }

                  setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
            } catch (error) {
                  console.error('Chat Error:', error);
                  setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
            } finally {
                  setIsLoading(false);
            }
      };

      return (
            <div className="fixed bottom-6 right-6 z-50">
                  <AnimatePresence>
                        {isOpen && (
                              <motion.div
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="mb-4"
                              >
                                    <Card className="w-[350px] h-[500px] shadow-xl border-primary/20 flex flex-col">
                                          <CardHeader className="p-4 border-b bg-primary/5">
                                                <div className="flex items-center justify-between">
                                                      <div className="flex items-center gap-2">
                                                            <div className="p-2 bg-primary/10 rounded-full">
                                                                  <Bot className="w-5 h-5 text-primary" />
                                                            </div>
                                                            <CardTitle className="text-lg">Arogyata Assistant</CardTitle>
                                                      </div>
                                                      <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                                                            <X className="w-4 h-4" />
                                                      </Button>
                                                </div>
                                          </CardHeader>
                                          <CardContent className="flex-1 p-0 overflow-hidden">
                                                <ScrollArea ref={scrollAreaRef} className="h-full p-4">
                                                      <div className="space-y-4">
                                                            {messages.map((msg, index) => (
                                                                  <div
                                                                        key={index}
                                                                        className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                                                  >
                                                                        <div className={`p-2 rounded-full shrink-0 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                                                              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                                                        </div>
                                                                        <div
                                                                              className={`p-3 rounded-lg text-sm max-w-[80%] ${msg.role === 'user'
                                                                                          ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                                                          : 'bg-muted text-foreground rounded-tl-none'
                                                                                    }`}
                                                                        >
                                                                              {msg.content}
                                                                        </div>
                                                                  </div>
                                                            ))}
                                                            {isLoading && (
                                                                  <div className="flex items-start gap-2">
                                                                        <div className="p-2 rounded-full bg-muted shrink-0">
                                                                              <Bot className="w-4 h-4" />
                                                                        </div>
                                                                        <div className="bg-muted p-3 rounded-lg rounded-tl-none">
                                                                              <Loader2 className="w-4 h-4 animate-spin" />
                                                                        </div>
                                                                  </div>
                                                            )}
                                                      </div>
                                                </ScrollArea>
                                          </CardContent>
                                          <CardFooter className="p-4 border-t bg-background">
                                                <form
                                                      className="flex w-full gap-2"
                                                      onSubmit={(e) => {
                                                            e.preventDefault();
                                                            handleSend();
                                                      }}
                                                >
                                                      <Input
                                                            placeholder="Type a message..."
                                                            value={input}
                                                            onChange={(e) => setInput(e.target.value)}
                                                            disabled={isLoading}
                                                            className="flex-1"
                                                      />
                                                      <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                                                            <Send className="w-4 h-4" />
                                                      </Button>
                                                </form>
                                          </CardFooter>
                                    </Card>
                              </motion.div>
                        )}
                  </AnimatePresence>

                  <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                  >
                        <Button
                              onClick={() => setIsOpen(!isOpen)}
                              size="lg"
                              className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90"
                        >
                              {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
                        </Button>
                  </motion.div>
            </div>
      );
};
