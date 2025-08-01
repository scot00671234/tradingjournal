import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Edit, Trash2, FileText, X, Save, Maximize2, Minimize2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@/hooks/use-toast";
import type { Note, InsertNote, UpdateNote } from "@shared/schema";

interface NotesWidgetProps {
  expanded?: boolean;
  onToggleExpand?: () => void;
}

export function NotesWidget({ expanded = false, onToggleExpand }: NotesWidgetProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState<InsertNote>({ title: "", content: "" });
  const [editNote, setEditNote] = useState<UpdateNote>({ title: "", content: "" });

  const { data: notes = [], isLoading } = useQuery<Note[]>({
    queryKey: ["/api/notes"],
  });

  const createMutation = useMutation({
    mutationFn: (note: InsertNote) => 
      apiRequest("POST", "/api/notes", note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      setNewNote({ title: "", content: "" });
      setShowCreateDialog(false);
      toast({ description: "Note created successfully" });
    },
    onError: (error: any) => {
      toast({ description: error.message || "Failed to create note", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: UpdateNote & { id: number }) =>
      apiRequest("PUT", `/api/notes/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      setEditingNote(null);
      toast({ description: "Note updated successfully" });
    },
    onError: (error: any) => {
      toast({ description: error.message || "Failed to update note", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest("DELETE", `/api/notes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({ description: "Note deleted successfully" });
    },
    onError: (error: any) => {
      toast({ description: error.message || "Failed to delete note", variant: "destructive" });
    },
  });

  const handleCreateNote = () => {
    if (!newNote.title.trim()) {
      toast({ description: "Please enter a title", variant: "destructive" });
      return;
    }
    createMutation.mutate(newNote);
  };

  const handleUpdateNote = () => {
    if (!editingNote || !editNote.title?.trim()) {
      toast({ description: "Please enter a title", variant: "destructive" });
      return;
    }
    updateMutation.mutate({ id: editingNote.id, ...editNote });
  };

  const handleDeleteNote = (id: number) => {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteMutation.mutate(id);
    }
  };

  const startEditing = (note: Note) => {
    setEditingNote(note);
    setEditNote({ title: note.title, content: note.content });
  };

  const cancelEditing = () => {
    setEditingNote(null);
    setEditNote({ title: "", content: "" });
  };

  if (expanded) {
    return (
      <Dialog open={expanded} onOpenChange={() => onToggleExpand?.()}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0 z-[8888]" style={{ zIndex: 8888 }}>
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Trading Notes
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  size="sm"
                  className="btn-golden"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  New Note
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleExpand}
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="p-6 pt-4">
            <ScrollArea className="h-[70vh]">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                </div>
              ) : notes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No notes yet. Create your first trading note!</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {notes.map((note) => (
                    <Card key={note.id} className="h-fit">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base line-clamp-2">{note.title}</CardTitle>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEditing(note)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteNote(note.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-4">
                          {note.content || "No content"}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            Notes
          </CardTitle>
          <div className="flex gap-1">
            <Button
              onClick={() => setShowCreateDialog(true)}
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              onClick={onToggleExpand}
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notes yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.slice(0, 3).map((note) => (
                <div key={note.id} className="group">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{note.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {note.content || "No content"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing(note)}
                        className="h-6 w-6 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNote(note.id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  {note !== notes[notes.length - 1] && <Separator className="mt-3" />}
                </div>
              ))}
              {notes.length > 3 && (
                <div className="text-center pt-2">
                  <Button
                    onClick={onToggleExpand}
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                  >
                    View all {notes.length} notes
                  </Button>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>

      {/* Create Note Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="z-[9999]" style={{ zIndex: 9999 }}>
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                placeholder="Enter note title..."
                maxLength={200}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                placeholder="Write your note here..."
                rows={6}
                maxLength={10000}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateNote}
                disabled={createMutation.isPending}
                className="btn-golden"
              >
                {createMutation.isPending ? "Creating..." : "Create Note"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Note Dialog */}
      <Dialog open={!!editingNote} onOpenChange={() => cancelEditing()}>
        <DialogContent className="z-[9999]" style={{ zIndex: 9999 }}>
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={editNote.title}
                onChange={(e) => setEditNote({ ...editNote, title: e.target.value })}
                placeholder="Enter note title..."
                maxLength={200}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={editNote.content}
                onChange={(e) => setEditNote({ ...editNote, content: e.target.value })}
                placeholder="Write your note here..."
                rows={6}
                maxLength={10000}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={cancelEditing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateNote}
                disabled={updateMutation.isPending}
                className="btn-golden"
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}