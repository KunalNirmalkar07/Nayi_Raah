import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface ManagedScholarship {
  id: string;
  name: string;
  provider: string;
  amount: string;
  deadline: string;
  category: string;
  eligibility: string[];
  states: string[];
  education_levels: string[];
  description: string;
  url: string;
  is_active: boolean;
}

const emptyForm = {
  name: "", provider: "", amount: "", deadline: "", category: "Merit-Based",
  eligibility: "", states: "", education_levels: "", description: "", url: "", is_active: true,
};

export default function AdminScholarships() {
  const [scholarships, setScholarships] = useState<ManagedScholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    const { data } = await supabase.from("managed_scholarships").select("*").order("created_at", { ascending: false });
    setScholarships((data as ManagedScholarship[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async () => {
    const payload = {
      name: form.name,
      provider: form.provider,
      amount: form.amount,
      deadline: form.deadline,
      category: form.category,
      eligibility: form.eligibility.split(",").map(s => s.trim()).filter(Boolean),
      states: form.states.split(",").map(s => s.trim()).filter(Boolean),
      education_levels: form.education_levels.split(",").map(s => s.trim()).filter(Boolean),
      description: form.description,
      url: form.url,
      is_active: form.is_active,
    };

    if (editingId) {
      const { error } = await supabase.from("managed_scholarships").update(payload).eq("id", editingId);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Scholarship updated" });
    } else {
      const { error } = await supabase.from("managed_scholarships").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Scholarship added" });
    }

    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    fetchData();
  };

  const handleEdit = (s: ManagedScholarship) => {
    setEditingId(s.id);
    setForm({
      name: s.name, provider: s.provider, amount: s.amount, deadline: s.deadline,
      category: s.category, eligibility: s.eligibility.join(", "), states: s.states.join(", "),
      education_levels: s.education_levels.join(", "), description: s.description, url: s.url,
      is_active: s.is_active,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("managed_scholarships").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Scholarship deleted" });
    fetchData();
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from("managed_scholarships").update({ is_active: !currentStatus }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: `Scholarship marked as ${!currentStatus ? 'Active' : 'Inactive'}` });
    fetchData();
  };

  const openNew = () => { setEditingId(null); setForm(emptyForm); setDialogOpen(true); };

  const filteredScholarships = scholarships.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Scholarships</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage scholarship listings</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search scholarships..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 bg-card border-none shadow-sm rounded-xl focus-visible:ring-primary/20"
              />
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openNew} className="rounded-xl shadow-sm hover:shadow-md transition-shadow shrink-0"><Plus className="w-4 h-4 mr-2" />Add Scholarship</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingId ? "Edit" : "Add"} Scholarship</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Provider</Label>
                      <Input value={form.provider} onChange={e => setForm({ ...form, provider: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="₹50,000" />
                    </div>
                    <div className="space-y-2">
                      <Label>Deadline</Label>
                      <Input value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} placeholder="2025-12-31" />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Merit-Based" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Eligibility (comma separated)</Label>
                    <Input value={form.eligibility} onChange={e => setForm({ ...form, eligibility: e.target.value })} placeholder="Class 12 pass, Min 60%" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>States (comma separated)</Label>
                      <Input value={form.states} onChange={e => setForm({ ...form, states: e.target.value })} placeholder="All India, Maharashtra" />
                    </div>
                    <div className="space-y-2">
                      <Label>Education Levels (comma separated)</Label>
                      <Input value={form.education_levels} onChange={e => setForm({ ...form, education_levels: e.target.value })} placeholder="Undergraduate, Postgraduate" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>URL</Label>
                    <Input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-card">
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
                ) : filteredScholarships.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No scholarships found</TableCell></TableRow>
                ) : filteredScholarships.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>{s.provider}</TableCell>
                    <TableCell>{s.amount}</TableCell>
                    <TableCell>{s.deadline}</TableCell>
                    <TableCell>
                      <button onClick={() => handleToggleStatus(s.id, s.is_active)} className="hover:opacity-80 transition-opacity focus:outline-none">
                        <Badge variant={s.is_active ? "default" : "secondary"} className="cursor-pointer">
                          {s.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(s)}><Pencil className="w-4 h-4" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the scholarship "{s.name}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(s.id)} className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
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
