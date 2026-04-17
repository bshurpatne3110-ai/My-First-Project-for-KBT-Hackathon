import { useEffect, useState, type FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { getStoredProjects, saveStoredProjects, type Project } from "@/data/projectStorage";
import { HardHat, Calendar, DollarSign, Activity, Plus } from "lucide-react";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(() => getStoredProjects());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', budget: '', status: 'Planning' });

  useEffect(() => {
    saveStoredProjects(projects);
  }, [projects]);

  const handleAddProject = (e: FormEvent) => {
    e.preventDefault();
    const newProject = {
      id: `PRJ-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      name: formData.name,
      status: formData.status,
      budget: Number(formData.budget),
      spent: 0,
      progress: 0
    };
    setProjects((currentProjects) => [newProject, ...currentProjects]);
    setIsModalOpen(false);
    setFormData({ name: '', budget: '', status: 'Planning' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">Track ongoing and upcoming construction projects.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map(project => (
          <Card key={project.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{project.name}</CardTitle>
                <Badge variant={project.status === 'Completed' ? 'success' : project.status === 'In Progress' ? 'default' : 'secondary'}>
                  {project.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{project.id}</p>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Budget: ${project.budget.toLocaleString()}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Activity className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Spent: ${project.spent.toLocaleString()}</span>
                </div>
                
                <div className="space-y-1 pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500" 
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Project">
        <form onSubmit={handleAddProject} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Name</label>
            <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Grand Plaza" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Budget ($)</label>
            <Input required type="number" min="0" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} placeholder="1000000" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Initial Status</label>
            <select 
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={formData.status} 
              onChange={e => setFormData({...formData, status: e.target.value})}
            >
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Project</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
