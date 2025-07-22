'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase/client';

export default function EditDocumentTypePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [schema, setSchema] = useState('');
  const [loading, setLoading] = useState(false);

  // Load existing document type
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('document_type')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching document type:', error.message);
      } else if (data) {
        setName(data.name || '');
        setDescription(data.description || '');
        setSchema(data.schema || '');
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  // 🔁 Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('document_type')
      .update({
        name,
        description,
        schema,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    setLoading(false);

    if (error) {
      alert('Error updating document type: ' + error.message);
    } else {
      alert('Document type updated successfully!');
      router.push('/document-type');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-semibold text-slate-700 mb-4">Edit Document Type</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="schema">Schema (JSON)</Label>
          <Textarea
            id="schema"
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
            className="font-mono"
            rows={6}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Update Document Type'}
        </Button>
      </form>
    </div>
  );
}
