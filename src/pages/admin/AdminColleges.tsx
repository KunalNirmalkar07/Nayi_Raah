import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ManagedCollege {
  id: string;
  name: string;
  type: string;
  state: string;
  city: string;
  streams: string[];
  exams: string[];
  is_active: boolean;
}

const emptyForm = { name: "", type: "", state: "", city: "", streams: "", exams: "", is_active: true };

export default function AdminColleges() {
  const [colleges, setColleges] = useState<ManagedCollege[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    const { data } = await supabase.from("managed_colleges").select("*").order("created_at", { ascending: false });
    setColleges((data as ManagedCollege[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async () => {
    const payload = {
      name: form.name, type: form.type, state: form.state, city: form.city,
      streams: form.streams.split(",").map(s => s.trim()).filter(Boolean),
      exams: form.exams.split(",").map(s => s.trim()).filter(Boolean),
      is_active: form.is_active,
    };

    if (editingId) {
      const { error } = await supabase.from("managed_colleges").update(payload).eq("id", editingId);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "College updated" });
    } else {
      const { error } = await supabase.from("managed_colleges").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "College added" });
    }

    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    fetchData();
  };

  const handleEdit = (c: ManagedCollege) => {
    setEditingId(c.id);
    setForm({
      name: c.name, type: c.type, state: c.state, city: c.city,
      streams: c.streams.join(", "), exams: c.exams.join(", "),
      is_active: c.is_active,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("managed_colleges").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "College deleted" });
    fetchData();
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from("managed_colleges").update({ is_active: !currentStatus }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: `College marked as ${!currentStatus ? 'Active' : 'Inactive'}` });
    fetchData();
  };

  const openNew = () => { setEditingId(null); setForm(emptyForm); setDialogOpen(true); };

  const filteredColleges = colleges.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Colleges</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage college listings</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search colleges..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 bg-card border-none shadow-sm rounded-xl focus-visible:ring-primary/20"
              />
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNew} className="rounded-xl shadow-sm hover:shadow-md transition-shadow shrink-0"><Plus className="w-4 h-4 mr-2" />Add College</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit" : "Add"} College</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Input value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} placeholder="IIT, NIT, IIIT..." />
                  </div>
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Streams (comma separated)</Label>
                  <Input value={form.streams} onChange={e => setForm({ ...form, streams: e.target.value })} placeholder="Engineering, Science" />
                </div>
                <div className="space-y-2">
                  <Label>Entrance Exams (comma separated)</Label>
                  <Input value={form.exams} onChange={e => setForm({ ...form, exams: e.target.value })} placeholder="JEE Main, JEE Advanced" />
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.is_active} onCheckedChange={v => setForm({ ...form, is_active: v })} />
                  <Label>Active</Label>
                </div>
                <Button onClick={handleSubmit} className="w-full">{editingId ? "Update" : "Add"} College</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-card">
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
                ) : filteredColleges.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No colleges found</TableCell></TableRow>
                ) : filteredColleges.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell><Badge variant="outline">{c.type}</Badge></TableCell>
                    <TableCell>{c.city}, {c.state}</TableCell>
                    <TableCell>
                      <button onClick={() => handleToggleStatus(c.id, c.is_active)} className="hover:opacity-80 transition-opacity focus:outline-none">
                        <Badge variant={c.is_active ? "default" : "secondary"} className="cursor-pointer">
                          {c.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(c)}><Pencil className="w-4 h-4" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the college "{c.name}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(c.id)} className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
