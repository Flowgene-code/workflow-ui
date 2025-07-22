'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type FieldType = 'text' | 'number' | 'date' | 'dropdown' | 'file'

interface FormField {
  id: number
  label: string
  type: FieldType
  required: boolean
  validations?: {
    min?: number
    max?: number
    regex?: string
  }
  listOfValues?: string[]
}

export default function CreateDocumentTypePage() {
  const [activeTab, setActiveTab] = useState<'basic' | 'fields' | 'attachments'>('basic')

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [fields, setFields] = useState<FormField[]>([])
  const [attachmentsAllowed, setAttachmentsAllowed] = useState(true)
  const [allowedTypes, setAllowedTypes] = useState('pdf,jpg,png')
  const [maxSizeMB, setMaxSizeMB] = useState(2)
  const [maxFiles, setMaxFiles] = useState(3)

  const addField = () => {
    setFields([
      ...fields,
      {
        id: Date.now(),
        label: '',
        type: 'text',
        required: false,
        validations: {},
      },
    ])
    setActiveTab('fields')
  }

  const handleFieldChange = (index: number, key: keyof FormField, value: any) => {
    const updatedFields = [...fields]
    updatedFields[index][key] = value
    setFields(updatedFields)
  }

  const handleValidationChange = (index: number, key: string, value: string) => {
    const updatedFields = [...fields]
    if (!updatedFields[index].validations) updatedFields[index].validations = {}
    updatedFields[index].validations![key] = Number(value)
    setFields(updatedFields)
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  const payload = {
    name,
    description,
    schema: {
      fields,
      attachments: {
        allowed: attachmentsAllowed,
        types: allowedTypes,
        maxSizeMB,
        maxFiles,
      },
    },
  }

  try {
    const res = await fetch('/api/document-types', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const { error } = await res.json()
      alert('Error: ' + error)
      return
    }

    // Optionally redirect or show success
    alert('Document type saved successfully!')
  } catch (err) {
    console.error(err)
    alert('Unexpected error. Please try again.')
  }
}


  return (
    <div className="max-w-4xl mx-auto p-6 mt-6 bg-white rounded-xl border shadow-sm">
      <h1 className="text-2xl font-semibold mb-6">Create Document Type</h1>

      {/* Tabs */}
      <div className="flex space-x-3 mb-6">
        {['basic', 'fields', 'attachments'].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'secondary'}
            onClick={() => setActiveTab(tab as any)}
            className="capitalize"
          >
            {tab}
          </Button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {activeTab === 'basic' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter a description for this document type"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        )}

        {activeTab === 'fields' && (
          <div className="space-y-6">
            {fields.map((field, idx) => (
              <Card key={field.id} className="bg-muted/20">
                <CardHeader className="text-sm font-medium">
                  Field #{idx + 1}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Field Label</Label>
                    <Input
                      value={field.label}
                      onChange={(e) => handleFieldChange(idx, 'label', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Field Type</Label>
                    <Select
                      value={field.type}
                      onValueChange={(value) => handleFieldChange(idx, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a field type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="dropdown">Dropdown</SelectItem>
                        <SelectItem value="file">File</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`required-${field.id}`}
                      checked={field.required}
                      onCheckedChange={(checked) => handleFieldChange(idx, 'required', checked)}
                    />
                    <Label htmlFor={`required-${field.id}`}>Required</Label>
                  </div>

                  {(field.type === 'text' || field.type === 'number') && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Min Value</Label>
                        <Input
                          type="number"
                          value={field.validations?.min || ''}
                          onChange={(e) => handleValidationChange(idx, 'min', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Max Value</Label>
                        <Input
                          type="number"
                          value={field.validations?.max || ''}
                          onChange={(e) => handleValidationChange(idx, 'max', e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {field.type === 'dropdown' && (
                    <div className="space-y-2">
                      <Label>Dropdown Options</Label>
                      <Textarea
                        placeholder="Enter values separated by commas"
                        value={field.listOfValues?.join(',') || ''}
                        onChange={(e) =>
                          handleFieldChange(idx, 'listOfValues', e.target.value.split(','))
                        }
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            <Button type="button" onClick={addField}>
              + Add Field
            </Button>
          </div>
        )}

        {activeTab === 'attachments' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="attachmentsAllowed"
                checked={attachmentsAllowed}
                onCheckedChange={setAttachmentsAllowed}
              />
              <Label htmlFor="attachmentsAllowed">Allow Attachments</Label>
            </div>

            {attachmentsAllowed && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Allowed File Types (comma separated)</Label>
                  <Input
                    value={allowedTypes}
                    onChange={(e) => setAllowedTypes(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max File Size (MB)</Label>
                  <Input
                    type="number"
                    value={maxSizeMB}
                    onChange={(e) => setMaxSizeMB(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max Number of Files</Label>
                  <Input
                    type="number"
                    value={maxFiles}
                    onChange={(e) => setMaxFiles(Number(e.target.value))}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="pt-6 border-t">
          <Button type="submit">Save Document Type</Button>
        </div>
      </form>
    </div>
  )
}
