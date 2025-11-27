import { QrCode, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface IdentityCardProps {
      address: string;
}

export const IdentityCard = ({ address }: IdentityCardProps) => {
      const [copied, setCopied] = useState(false);
      const [isConnected, setIsConnected] = useState(false);
      const [isConnecting, setIsConnecting] = useState(false);

      const copyToClipboard = () => {
            navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
      };

      const handleConnect = () => {
            setIsConnecting(true);
            // Simulate wallet connection delay
            setTimeout(() => {
                  setIsConnected(true);
                  setIsConnecting(false);
            }, 1500);
      };

      return (
            <Card className="glass-card border-primary/20 bg-primary/5">
                  <CardHeader>
                        <CardTitle className="text-lg font-semibold text-primary flex items-center gap-2">
                              <QrCode className="w-5 h-5" />
                              Decentralized ID
                        </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center gap-6">
                        {!isConnected ? (
                              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                                    <div className="p-4 rounded-full bg-primary/10">
                                          <QrCode className="w-12 h-12 text-primary opacity-50" />
                                    </div>
                                    <div className="text-center space-y-2">
                                          <p className="font-medium">Connect your wallet</p>
                                          <p className="text-xs text-muted-foreground max-w-[200px]">
                                                Connect to view your decentralized identity and QR code.
                                          </p>
                                    </div>
                                    <Button
                                          onClick={handleConnect}
                                          disabled={isConnecting}
                                          className="w-full"
                                    >
                                          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                                    </Button>
                                    <p className="text-[10px] text-muted-foreground text-center">
                                          Currently using managed identity (MongoDB)
                                    </p>
                              </div>
                        ) : (
                              <>
                                    <div className="p-4 bg-white rounded-xl shadow-lg animate-in fade-in zoom-in duration-300">
                                          <div className="w-32 h-32 bg-white p-2 flex items-center justify-center shadow-inner rounded-lg">
                                                <img
                                                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${address}`}
                                                      alt="Wallet QR"
                                                      className="w-full h-full object-contain"
                                                />
                                          </div>
                                    </div>

                                    <div className="w-full space-y-2 animate-in slide-in-from-bottom-4 duration-500 delay-150">
                                          <p className="text-xs text-muted-foreground text-center uppercase tracking-wider">Wallet Address</p>
                                          <div className="flex items-center gap-2 p-3 rounded-lg bg-background/50 border border-border/50">
                                                <code className="text-sm font-mono flex-1 truncate text-primary">
                                                      {address}
                                                </code>
                                                <Button
                                                      variant="ghost"
                                                      size="icon"
                                                      className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                                                      onClick={copyToClipboard}
                                                >
                                                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                </Button>
                                          </div>
                                          <Button
                                                variant="ghost"
                                                size="sm"
                                                className="w-full text-xs text-muted-foreground hover:text-destructive"
                                                onClick={() => setIsConnected(false)}
                                          >
                                                Disconnect
                                          </Button>
                                    </div>
                              </>
                        )}
                  </CardContent>
            </Card>
      );
};
