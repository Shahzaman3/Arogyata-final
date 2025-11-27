import { FileText, Save, ShieldCheck, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export const WriteToChain = () => {
      const [isSaving, setIsSaving] = useState(false);
      const [formData, setFormData] = useState({
            patientId: '',
            diagnosisType: '',
            notes: ''
      });

      const handleSave = async () => {
            if (!formData.patientId || !formData.diagnosisType || !formData.notes) {
                  toast.error('Please fill all fields');
                  return;
            }

            setIsSaving(true);
            try {
                  const token = localStorage.getItem('token');
                  const response = await fetch('http://localhost:3000/api/content/upload', {
                        method: 'POST',
                        headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                              title: formData.diagnosisType,
                              description: `Patient ID: ${formData.patientId}`,
                              data: formData.notes
                        })
                  });

                  if (response.ok) {
                        toast.success('Record Cryptographically Signed & Added to Chain');
                        setFormData({ patientId: '', diagnosisType: '', notes: '' });
                  } else {
                        throw new Error('Failed to save record');
                  }
            } catch (error) {
                  console.error('Save error:', error);
                  toast.error('Failed to save record');
            } finally {
                  setIsSaving(false);
            }
      };

      return (
            <Card className="glass-card border-purple-500/20">
                  <CardHeader>
                        <CardTitle className="text-lg font-semibold text-purple-400 flex items-center gap-2">
                              <FileText className="w-5 h-5" />
                              Write to Chain (EHR Entry)
                        </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                    <Label>Patient ID</Label>
                                    <Input
                                          placeholder="0x..."
                                          className="bg-background/50"
                                          value={formData.patientId}
                                          onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                                    />
                              </div>
                              <div className="space-y-2">
                                    <Label>Diagnosis Type</Label>
                                    <Input
                                          placeholder="e.g. General Checkup"
                                          className="bg-background/50"
                                          value={formData.diagnosisType}
                                          onChange={(e) => setFormData({ ...formData, diagnosisType: e.target.value })}
                                    />
                              </div>
                        </div>

                        <div className="space-y-2">
                              <Label>Clinical Notes</Label>
                              <Textarea
                                    placeholder="Enter detailed diagnosis notes here..."
                                    className="min-h-[150px] bg-background/50 font-mono text-sm"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                              />
                        </div>

                        <div className="flex justify-end pt-2">
                              <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]"
                              >
                                    {isSaving ? (
                                          <>
                                                <ShieldCheck className="w-4 h-4 mr-2 animate-pulse" />
                                                Hashing & Signing...
                                          </>
                                    ) : (
                                          <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Cryptographic Sign & Save
                                          </>
                                    )}
                              </Button>
                        </div>
                  </CardContent>
            </Card>
      );
};
