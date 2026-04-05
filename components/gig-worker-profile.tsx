'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useWorkflow } from '@/lib/workflow-context'
import { User, Edit2, Save, X, Lock, LogOut, Camera } from 'lucide-react'
import { toast } from 'sonner' // sonner toast is imported in app, package.json check showed sonner

const LANGUAGES_LIST = ['English', 'Hindi', 'Kannada', 'Tamil', 'Telugu', 'Malayalam', 'Marathi']

export function GigWorkerProfile() {
  const { workerData, setCurrentStep } = useWorkflow()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [profile, setProfile] = useState<any>({})
  
  // Editable fields state
  const [editForm, setEditForm] = useState({
    profilePic: '',
    password: '',
    secondarySkills: [] as string[],
    hasVehicle: '',
    languages: [] as string[],
    expectedDailyIncome: '',
    secondarySkillInput: ''
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
        }
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setEditForm(prev => ({ ...prev, profilePic: dataUrl }));
      };
      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const fetchProfile = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/getGigData?phone=${workerData.phone}`)
      const json = await res.json()
      if (json.success && json.data) {
        setProfile(json.data)
        setEditForm({
          profilePic: json.data.profilePic || '',
          password: '', // We don't populate the password field directly for security reasons
          secondarySkills: json.data.secondarySkills || [],
          hasVehicle: json.data.hasVehicle || '',
          languages: json.data.languages || [],
          expectedDailyIncome: json.data.expectedDailyIncome || '',
          secondarySkillInput: ''
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (workerData.phone) {
      fetchProfile()
    }
  }, [workerData.phone])

  const handleSave = async () => {
    setSaving(true)
    const updates: any = {
      profilePic: editForm.profilePic,
      secondarySkills: editForm.secondarySkills,
      hasVehicle: editForm.hasVehicle,
      languages: editForm.languages,
      expectedDailyIncome: editForm.expectedDailyIncome,
    }

    if (editForm.password.trim() !== '') {
      updates.password = editForm.password
    }

    try {
      const res = await fetch('/api/updateGigProfile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: workerData.phone, updates })
      })
      const json = await res.json()
      if (json.success) {
        toast.success('Profile updated successfully')
        setProfile(json.data)
        setIsEditing(false)
        setEditForm(prev => ({ ...prev, password: '' }))
      } else {
        toast.error('Failed to update profile: ' + json.error)
      }
    } catch (err: any) {
      toast.error('An error occurred')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header Profile Summary */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0 relative group">
                {(isEditing ? editForm.profilePic : profile.profilePic) ? (
                  <img src={isEditing ? editForm.profilePic : profile.profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-primary">{profile.name?.charAt(0).toUpperCase()}</span>
                )}
                {isEditing && (
                  <label className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition-all">
                    <Camera className="w-6 h-6 text-white" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
                <p className="text-sm text-muted-foreground">{profile.phone}</p>
                <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                  {profile.primarySkill}
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setIsEditing(!isEditing)}
              className={isEditing ? 'bg-muted' : ''}
            >
              {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Profile Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Work details - Non Editable */}
          <div className="grid grid-cols-2 gap-4 text-sm mt-2">
            <div>
              <p className="text-muted-foreground text-xs">Work Type</p>
              <p className="font-medium text-foreground">{profile.workType || 'Standard'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Availability</p>
              <p className="font-medium text-foreground">{profile.availability || 'Full-time'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Tool Availability</p>
              <p className="font-medium text-foreground">{profile.toolsAvailability || 'Yes'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Material Handling</p>
              <p className="font-medium text-foreground">{profile.materialHandling || 'Yes'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Job Preference</p>
              <p className="font-medium text-foreground">{Array.isArray(profile.jobPreference) ? profile.jobPreference.join(', ') : profile.jobPreference || 'Any'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Travel Willingness</p>
              <p className="font-medium text-foreground">{profile.travelWillingness || 'Local'}</p>
            </div>
          </div>

          {!isEditing && (
            <div className="space-y-4 pt-4 border-t border-border mt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Secondary Skills</p>
                  <p className="font-medium text-foreground">
                    {profile.secondarySkills?.length > 0 ? profile.secondarySkills.join(', ') : 'None'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Has Vehicle</p>
                  <p className="font-medium text-foreground">{profile.hasVehicle}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Languages</p>
                  <p className="font-medium text-foreground">
                    {profile.languages?.length > 0 ? profile.languages.join(', ') : 'None'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Expected Income</p>
                  <p className="font-medium text-foreground">{profile.expectedDailyIncome}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground text-xs">Password</p>
                  <p className="font-medium text-foreground flex items-center gap-2">
                    <Lock className="w-3 h-3"/> ••••••••
                  </p>
                </div>
              </div>
            </div>
          )}

          {isEditing && (
            <div className="space-y-4 pt-4 border-t border-border mt-4">
              
              <div className="space-y-2">
                <Label>Secondary Skills (comma-separated)</Label>
                <Input 
                  value={editForm.secondarySkills.join(', ')} 
                  onChange={(e) => setEditForm({...editForm, secondarySkills: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                  placeholder="e.g. Painting, Plumbing"
                />
              </div>

              <div className="space-y-2">
                <Label>Vehicle Availability</Label>
                <Select
                  value={editForm.hasVehicle}
                  onValueChange={(val) => setEditForm({...editForm, hasVehicle: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Do you have a vehicle?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes, 2-wheeler">Yes, 2-wheeler</SelectItem>
                    <SelectItem value="Yes, 4-wheeler">Yes, 4-wheeler</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Languages Known</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {LANGUAGES_LIST.map((lang) => (
                    <div key={lang} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`edit-lang-${lang}`}
                        checked={editForm.languages.includes(lang)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setEditForm(prev => ({...prev, languages: [...prev.languages, lang]}))
                          } else {
                            setEditForm(prev => ({...prev, languages: prev.languages.filter(l => l !== lang)}))
                          }
                        }}
                      />
                      <label htmlFor={`edit-lang-${lang}`} className="text-sm cursor-pointer">{lang}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Expected Daily Income</Label>
                <Input 
                  value={editForm.expectedDailyIncome} 
                  onChange={(e) => setEditForm({...editForm, expectedDailyIncome: e.target.value})}
                  placeholder="e.g. ₹500 - ₹1000"
                />
              </div>

              <div className="space-y-2">
                <Label>Change Password</Label>
                <Input 
                  type="password"
                  value={editForm.password} 
                  onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                  placeholder="Leave blank to keep unchanged"
                />
              </div>

              <Button onClick={handleSave} disabled={saving} className="w-full mt-2">
                {saving ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="w-4 h-4"/> Save Changes
                  </span>
                )}
              </Button>
            </div>
          )}

          {!isEditing && (
            <div className="pt-4 mt-6 border-t border-border">
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => setCurrentStep('sign-in')}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}

        </CardContent>
      </Card>
      
    </div>
  )
}
