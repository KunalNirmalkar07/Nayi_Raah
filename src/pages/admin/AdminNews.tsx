import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
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

interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  is_published: boolean;
  created_at: string;
}

const emptyForm = { title: "", content: "", category: "general", is_published: false };

export default function AdminNews() {
  const { user } = useAuth();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    const { data } = await supabase.from("news_announcements").select("*").order("created_at", { ascending: false });
    setNews((data as NewsItem[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async () => {
    const payload = { ...form, created_by: user?.id };

    if (editingId) {
      const { error } = await supabase.from("news_announcements").update(form).eq("id", editingId);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "News updated" });
    } else {
      const { error } = await supabase.from("news_announcements").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "News published" });
    }

    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    fetchData();
  };

  const handleEdit = (n: NewsItem) => {
    setEditingId(n.id);
    setForm({ title: n.title, content: n.content, category: n.category, is_published: n.is_published });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("news_announcements").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "News deleted" });
    fetchData();
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from("news_announcements").update({ is_published: !currentStatus }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: `News marked as ${!currentStatus ? 'Published' : 'Draft'}` });
    fetchData();
  };

  const openNew = () => { setEditingId(null); setForm(emptyForm); setDialogOpen(true); };

  const filteredNews = news.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">News & Announcements</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage platform updates</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search news..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 bg-card border-none shadow-sm rounded-xl focus-visible:ring-primary/20"
              />
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openNew} className="rounded-xl shadow-sm hover:shadow-md transition-shadow shrink-0"><Plus className="w-4 h-4 mr-2" />Add Post</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{editingId ? "Edit" : "Create"} Post</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="general, scholarship, exam, admission" />
                  </div>
                  <div className="space-y-2">
                    <Label>Content</Label>
                    <Textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={5} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={form.is_published} onCheckedChange={v => setForm({ ...form, is_published: v })} />
                    <Label>Published</Label>
                  </div>
                  <Button onClick={handleSubmit} className="w-full">{editingId ? "Update" : "Publish"}</Button>
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
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
                ) : filteredNews.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No posts found</TableCell></TableRow>
                ) : filteredNews.map((n) => (
                  <TableRow key={n.id}>
                    <TableCell className="font-medium">{n.title}</TableCell>
                    <TableCell><Badge variant="outline">{n.category}</Badge></TableCell>
                    <TableCell>
                      <button onClick={() => handleToggleStatus(n.id, n.is_published)} className="hover:opacity-80 transition-opacity focus:outline-none">
                        <Badge variant={n.is_published ? "default" : "secondary"} className="cursor-pointer">
                          {n.is_published ? "Published" : "Draft"}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell>{new Date(n.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(n)}><Pencil className="w-4 h-4" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the post "{n.title}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(n.id)} className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
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
