import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getStoredTeam, saveStoredTeam, TeamMember } from "@/data/teamStorage";
import { Users, Mail, Phone, Plus } from "lucide-react";
import { Modal } from "@/components/ui/modal";

export default function Team() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', project: '', status: 'Active' });

  useEffect(() => {
    const storedTeam = getStoredTeam();
    setTeam(storedTeam);
  }, []);

  const updateTeam = (newTeam: TeamMember[]) => {
    setTeam(newTeam);
    saveStoredTeam(newTeam);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const newMember: TeamMember = {
      id: `EMP-${Math.floor(Math.random() * 1000) + 100}`,
      name: formData.name,
      role: formData.role,
      project: formData.project,
      status: formData.status as 'Active' | 'On Leave'
    };
    updateTeam([newMember, ...team]);
    setIsModalOpen(false);
    setFormData({ name: '', role: '', project: '', status: 'Active' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Team Collaboration</h2>
          <p className="text-muted-foreground">Manage your workforce and resource allocation.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Member
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" /> Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Current Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {team.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>{member.project}</TableCell>
                  <TableCell>
                    <Badge variant={member.status === 'Active' ? 'success' : 'secondary'}>
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary" />
                      <Phone className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Team Member">
        <form onSubmit={handleAddMember} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. John Doe" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <Input required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="e.g. Project Manager" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Project</label>
            <Input required value={formData.project} onChange={e => setFormData({...formData, project: e.target.value})} placeholder="e.g. Skyline Tower" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select 
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={formData.status} 
              onChange={e => setFormData({...formData, status: e.target.value})}
            >
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Add Member</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
