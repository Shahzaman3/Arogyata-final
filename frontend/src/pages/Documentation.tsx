import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Documentation = () => {
      const navigate = useNavigate();
      useEffect(() => {
            window.scrollTo(0, 0);
      }, []);

      return (
            <div className="relative w-full min-h-screen bg-background">
                  <Header />
                  <main className="container mx-auto px-4 pt-24 pb-12">
                        <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5 }}
                              className="max-w-4xl mx-auto"
                        >
                              <Button
                                    variant="ghost"
                                    className="mb-6 pl-0 hover:bg-transparent hover:text-primary"
                                    onClick={() => navigate('/')}
                              >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Home
                              </Button>
                              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient-primary">Documentation</h1>
                              <p className="text-xl text-muted-foreground mb-12">
                                    Everything you need to know about integrating and building with Arogyata.
                              </p>

                              <Tabs defaultValue="getting-started" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
                                          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
                                          <TabsTrigger value="features">Features</TabsTrigger>
                                          <TabsTrigger value="integration">Integration</TabsTrigger>
                                          <TabsTrigger value="api">API Reference</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="getting-started">
                                          <Card>
                                                <CardHeader>
                                                      <CardTitle>Getting Started with Arogyata</CardTitle>
                                                      <CardDescription>Learn the basics of the platform.</CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                      <h3 className="text-lg font-semibold">Introduction</h3>
                                                      <p>
                                                            Arogyata is a decentralized healthcare data management platform that leverages blockchain technology to ensure privacy, security, and interoperability of patient records.
                                                      </p>

                                                      <h3 className="text-lg font-semibold mt-6">Prerequisites</h3>
                                                      <ul className="list-disc pl-6 space-y-2">
                                                            <li>A Web3 wallet (Metamask, Coinbase Wallet, etc.)</li>
                                                            <li>Modern web browser (Chrome, Firefox, Brave)</li>
                                                            <li>Internet connection</li>
                                                      </ul>

                                                      <h3 className="text-lg font-semibold mt-6">Quick Start</h3>
                                                      <div className="bg-muted p-4 rounded-md font-mono text-sm">
                                                            1. Connect your wallet using the "Connect" button.<br />
                                                            2. Navigate to the Dashboard.<br />
                                                            3. Upload your health records securely.<br />
                                                            4. Manage access permissions for doctors and institutions.
                                                      </div>
                                                </CardContent>
                                          </Card>
                                    </TabsContent>

                                    <TabsContent value="features">
                                          <Card>
                                                <CardHeader>
                                                      <CardTitle>Platform Features</CardTitle>
                                                      <CardDescription>Explore what Arogyata can do.</CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                      <div className="grid gap-4 md:grid-cols-2">
                                                            <div className="p-4 border rounded-lg">
                                                                  <h3 className="font-semibold mb-2">Decentralized Storage</h3>
                                                                  <p className="text-sm text-muted-foreground">
                                                                        Your data is stored on IPFS, ensuring redundancy and censorship resistance.
                                                                  </p>
                                                            </div>
                                                            <div className="p-4 border rounded-lg">
                                                                  <h3 className="font-semibold mb-2">End-to-End Encryption</h3>
                                                                  <p className="text-sm text-muted-foreground">
                                                                        All records are encrypted before leaving your device. Only you hold the keys.
                                                                  </p>
                                                            </div>
                                                            <div className="p-4 border rounded-lg">
                                                                  <h3 className="font-semibold mb-2">Smart Contracts</h3>
                                                                  <p className="text-sm text-muted-foreground">
                                                                        Access control logic is governed by immutable smart contracts on the blockchain.
                                                                  </p>
                                                            </div>
                                                            <div className="p-4 border rounded-lg">
                                                                  <h3 className="font-semibold mb-2">Interoperability</h3>
                                                                  <p className="text-sm text-muted-foreground">
                                                                        Compatible with standard health data formats (FHIR) for easy integration.
                                                                  </p>
                                                            </div>
                                                      </div>
                                                </CardContent>
                                          </Card>
                                    </TabsContent>

                                    <TabsContent value="integration">
                                          <Card>
                                                <CardHeader>
                                                      <CardTitle>Integration Guide</CardTitle>
                                                      <CardDescription>For developers and healthcare providers.</CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                      <p>
                                                            Arogyata provides a comprehensive SDK for integrating health data management into existing hospital systems.
                                                      </p>

                                                      <h3 className="text-lg font-semibold mt-4">Installation</h3>
                                                      <div className="bg-muted p-4 rounded-md font-mono text-sm">
                                                            npm install @arogyata/sdk
                                                      </div>

                                                      <h3 className="text-lg font-semibold mt-4">Basic Usage</h3>
                                                      <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre">
                                                            {`import { ArogyataClient } from '@arogyata/sdk';

const client = new ArogyataClient({
  apiKey: 'YOUR_API_KEY',
  network: 'mainnet'
});

await client.connect();`}
                                                      </div>
                                                </CardContent>
                                          </Card>
                                    </TabsContent>

                                    <TabsContent value="api">
                                          <Card>
                                                <CardHeader>
                                                      <CardTitle>API Reference</CardTitle>
                                                      <CardDescription>Technical details of our API endpoints.</CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                      <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                                                            <div className="space-y-8">
                                                                  <div>
                                                                        <h3 className="text-lg font-semibold text-primary">GET /api/v1/records</h3>
                                                                        <p className="text-sm text-muted-foreground mb-2">Retrieve a list of health records.</p>
                                                                        <div className="bg-muted p-2 rounded text-xs font-mono">
                                                                              Authorization: Bearer &lt;token&gt;
                                                                        </div>
                                                                  </div>

                                                                  <div>
                                                                        <h3 className="text-lg font-semibold text-primary">POST /api/v1/records</h3>
                                                                        <p className="text-sm text-muted-foreground mb-2">Upload a new health record.</p>
                                                                        <div className="bg-muted p-2 rounded text-xs font-mono">
                                                                              Content-Type: multipart/form-data
                                                                        </div>
                                                                  </div>

                                                                  <div>
                                                                        <h3 className="text-lg font-semibold text-primary">GET /api/v1/access</h3>
                                                                        <p className="text-sm text-muted-foreground mb-2">Check access permissions for a user.</p>
                                                                  </div>

                                                                  <div>
                                                                        <h3 className="text-lg font-semibold text-primary">POST /api/v1/access/grant</h3>
                                                                        <p className="text-sm text-muted-foreground mb-2">Grant access to a specific record.</p>
                                                                  </div>
                                                            </div>
                                                      </ScrollArea>
                                                </CardContent>
                                          </Card>
                                    </TabsContent>
                              </Tabs>
                        </motion.div>
                  </main>
                  <Footer />
            </div>
      );
};

export default Documentation;
