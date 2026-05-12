import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  education_level: string | null;
  district: string | null;
  interests: string[] | null;
  created_at: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      setUsers((data as UserProfile[]) ?? []);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const filtered = users.filter(u =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground text-sm mt-1">View and monitor registered users</p>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-card border-none shadow-sm rounded-xl focus-visible:ring-primary/20" />
        </div>

        <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-card">
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Education</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Interests</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No users found</TableCell></TableRow>
                ) : filtered.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.full_name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.education_level || <span className="text-muted-foreground">—</span>}</TableCell>
                    <TableCell>{u.district || <span className="text-muted-foreground">—</span>}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {u.interests?.slice(0, 3).map(i => <Badge key={i} variant="outline" className="text-xs">{i}</Badge>) || <span className="text-muted-foreground">—</span>}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(u.created_at).toLocaleDateString()}</TableCell>
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
