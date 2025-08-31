"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import ReflectionCard, { Reflection } from "@/components/reflections/ReflectionCard";
import ReflectionForm from "@/components/reflections/ReflectionForm";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const allowedEmotions = ["happy", "sad", "angry", "neutral", "excited"] as const;

export default function ReflectionsPage() {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingReflection, setEditingReflection] = useState<Reflection | null>(null);
  const [filterEmotion, setFilterEmotion] = useState<string>(""); // "" means all
  const [filterTag, setFilterTag] = useState<string>("");

  // Confirm dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedReflectionId, setSelectedReflectionId] = useState<string | null>(null);

  const fetchReflections = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      if (!userId || !token) throw new Error("User not authenticated");

      const params: any = {};
      if (filterEmotion) params.emotion = filterEmotion; // empty string means no filter
      if (filterTag) params.tag = filterTag;

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/reflections/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` }, params }
      );

      setReflections(res.data?.message?.reflections || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to fetch reflections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReflections();
  }, [filterEmotion, filterTag]);

  const confirmDelete = (id: string) => {
    setSelectedReflectionId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedReflectionId) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/reflections/delete/${selectedReflectionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Reflection deleted");
      setReflections((prev) => prev.filter((r) => r._id !== selectedReflectionId));
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to delete reflection");
    } finally {
      setConfirmOpen(false);
      setSelectedReflectionId(null);
    }
  };

  const handleEdit = (reflection: Reflection) => {
    setEditingReflection(reflection);
    setShowForm(true);
  };

  const handleFormSuccess = (newReflection?: Reflection) => {
    setShowForm(false);
    setEditingReflection(null);

    if (newReflection) {
      setReflections((prev) => {
        const exists = prev.find((r) => r._id === newReflection._id);
        if (exists) return prev.map((r) => (r._id === newReflection._id ? newReflection : r));
        else return [newReflection, ...prev];
      });
    } else {
      fetchReflections();
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Reflections</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1" /> Add Reflection
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <Select
          value={filterEmotion || "all"}
          onValueChange={(val) => setFilterEmotion(val === "all" ? "" : val)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by Emotion" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Emotions</SelectItem>
            {allowedEmotions.map((e) => (
              <SelectItem key={e} value={e}>
                {e.charAt(0).toUpperCase() + e.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Filter by Tag"
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
        />

        {(filterEmotion || filterTag) && (
          <Button variant="outline" onClick={() => { setFilterEmotion(""); setFilterTag(""); }}>
            Clear Filters
          </Button>
        )}
      </div>

      {/* Reflection Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            key="reflection-form"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ReflectionForm
              reflectionId={editingReflection?._id}
              defaultValues={
                editingReflection
                  ? {
                      title: editingReflection.title,
                      content: editingReflection.content,
                      emotion: allowedEmotions.includes(editingReflection.emotion as any)
                        ? (editingReflection.emotion as (typeof allowedEmotions)[number])
                        : undefined,
                      tags: editingReflection.tags?.join(", "),
                    }
                  : undefined
              }
              onSuccess={handleFormSuccess}
              onCancel={() => {
                setShowForm(false);
                setEditingReflection(null);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reflections List */}
      {loading ? (
        <p>Loading reflections...</p>
      ) : reflections.length === 0 ? (
        <p>No reflections yet. Click "Add Reflection" to create one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {reflections.map((r, index) => (
              <motion.div
                key={r._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <ReflectionCard
                  reflection={r}
                  onEdit={handleEdit}
                  onDelete={() => confirmDelete(r._id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Reflection?"
        description="Are you sure you want to delete this reflection? This action cannot be undone."
      />
    </div>
  );
}
