"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import VentCard, { Vent, Mood } from "@/components/vent/VentCard";
import VentForm from "@/components/vent/VentForm";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

import API from "@/lib/axios"; // centralized axios instance

const allowedMoods: Mood[] = ["happy", "sad", "angry", "anxious", "neutral"];

export default function VentPage() {
  const [vents, setVents] = useState<Vent[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingVent, setEditingVent] = useState<Vent | null>(null);
  const [filterMood, setFilterMood] = useState<string>("");
  const [showMyVents, setShowMyVents] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedVentId, setSelectedVentId] = useState<string | null>(null);

  const currentUserId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  // Fetch vents from backend
  const fetchVents = async () => {
    setLoading(true);
    try {
      let url = "/vents";
      if (showMyVents && currentUserId) url = `/vents/user/${currentUserId}`;

      const params: any = {};
      if (filterMood) params.mood = filterMood;

      const res = await API.get(url, { params, withCredentials: true });
      setVents(res.data?.message?.vents || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to fetch vents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVents();
  }, [filterMood, showMyVents]);

  // Edit vent
  const handleEdit = (vent: Vent) => {
    setEditingVent(vent);
    setShowForm(true);
  };

  // Create/Update vent success
  const handleFormSuccess = (newVent?: Vent) => {
    setShowForm(false);
    setEditingVent(null);

    if (newVent) {
      setVents((prev) => {
        const exists = prev.find((v) => v._id === newVent._id);
        if (exists) return prev.map((v) => (v._id === newVent._id ? newVent : v));
        return [newVent, ...prev];
      });
    } else {
      fetchVents();
    }
  };

  // Delete vent
  const confirmDelete = (id: string) => {
    setSelectedVentId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedVentId) return;
    try {
      await API.delete(`/vents/delete/${selectedVentId}`, { withCredentials: true });
      toast.success("Vent deleted");
      setVents((prev) => prev.filter((v) => v._id !== selectedVentId));
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to delete vent");
    } finally {
      setConfirmOpen(false);
      setSelectedVentId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-6 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">Vents</h1>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add Vent
          </Button>
          <Button variant={!showMyVents ? "default" : "outline"} onClick={() => setShowMyVents(false)}>
            All Vents
          </Button>
          <Button variant={showMyVents ? "default" : "outline"} onClick={() => setShowMyVents(true)}>
            My Vents
          </Button>
        </div>
      </div>

      {/* Mood Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <Select value={filterMood || "all"} onValueChange={(val) => setFilterMood(val === "all" ? "" : val)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by Mood" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Moods</SelectItem>
            {allowedMoods.map((m) => (
              <SelectItem key={m} value={m}>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {filterMood && <Button variant="outline" onClick={() => setFilterMood("")}>Clear Mood</Button>}
      </div>

      {/* Vent Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            key="vent-form"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <VentForm
              ventId={editingVent?._id}
              defaultValues={editingVent ? {
                message: editingVent.message,
                mood: editingVent.mood as Mood,
                visibility: editingVent.visibility,
              } : undefined}
              onSuccess={handleFormSuccess}
              onCancel={() => { setShowForm(false); setEditingVent(null); }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vent List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading vents...</p>
      ) : vents.length === 0 ? (
        <p className="text-center text-gray-500">No vents found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {vents.map((v, i) => (
              <motion.div
                key={v._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: i * 0.05 }}
              >
                <VentCard
                  vent={v}
                  currentUserId={currentUserId ?? undefined}
                  onEdit={handleEdit}
                  onDelete={() => confirmDelete(v._id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Vent?"
        description="Are you sure you want to delete this vent? This action cannot be undone."
      />
    </div>
  );
}
