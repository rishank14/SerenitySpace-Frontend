"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Plus, Clock } from "lucide-react";

import ReflectionCard, {
   Reflection,
} from "@/components/reflections/ReflectionCard";
import ReflectionForm from "@/components/reflections/ReflectionForm";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
   Select,
   SelectTrigger,
   SelectContent,
   SelectItem,
   SelectValue,
} from "@/components/ui/select";
import API from "@/lib/axios";

const allowedEmotions = [
   "happy",
   "sad",
   "angry",
   "neutral",
   "excited",
] as const;
type Emotion = (typeof allowedEmotions)[number];

export default function ReflectionsPage() {
   const [reflections, setReflections] = useState<Reflection[]>([]);
   const [loading, setLoading] = useState(false);
   const [showForm, setShowForm] = useState(false);
   const [editingReflection, setEditingReflection] =
      useState<Reflection | null>(null);
   const [filterEmotion, setFilterEmotion] = useState<string>("");
   const [filterTag, setFilterTag] = useState<string>("");
   const [confirmOpen, setConfirmOpen] = useState(false);
   const [selectedReflectionId, setSelectedReflectionId] = useState<
      string | null
   >(null);

   const currentUserId =
      typeof window !== "undefined" ? localStorage.getItem("userId") : null;

   // Fetch reflections
   const fetchReflections = useCallback(async () => {
      if (!currentUserId) return;
      setLoading(true);
      try {
         const params: Record<string, string> = {};
         if (filterEmotion) params.emotion = filterEmotion;
         if (filterTag) params.tag = filterTag;

         const res = await API.get<{ message: { reflections: Reflection[] } }>(
            `/reflections/user/${currentUserId}`,
            { params }
         );
         setReflections(res.data.message.reflections || []);
      } catch (err: unknown) {
         const msg =
            err instanceof Error ? err.message : "Failed to fetch reflections";
         toast.error(msg);
      } finally {
         setLoading(false);
      }
   }, [currentUserId, filterEmotion, filterTag]);

   useEffect(() => {
      fetchReflections();
   }, [fetchReflections]);

   // Delete reflection
   const confirmDelete = (id: string) => {
      setSelectedReflectionId(id);
      setConfirmOpen(true);
   };

   const handleDelete = async () => {
      if (!selectedReflectionId) return;
      try {
         await API.delete(`/reflections/delete/${selectedReflectionId}`);
         toast.success("Reflection deleted");
         setReflections((prev) =>
            prev.filter((r) => r._id !== selectedReflectionId)
         );
      } catch (err: unknown) {
         const msg =
            err instanceof Error ? err.message : "Failed to delete reflection";
         toast.error(msg);
      } finally {
         setConfirmOpen(false);
         setSelectedReflectionId(null);
      }
   };

   // Edit reflection
   const handleEdit = (reflection: Reflection) => {
      setEditingReflection(reflection);
      setShowForm(true);
   };

   // Form success handler
   const handleFormSuccess = (newReflection?: Reflection) => {
      setShowForm(false);
      setEditingReflection(null);

      if (newReflection) {
         setReflections((prev) => {
            const exists = prev.find((r) => r._id === newReflection._id);
            if (exists) {
               return prev.map((r) =>
                  r._id === newReflection._id ? newReflection : r
               );
            }
            return [newReflection, ...prev];
         });
      } else {
         fetchReflections();
      }
   };

   return (
      <div className="max-w-6xl mx-auto py-8 space-y-6 px-4">
         {/* Header */}
         <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
         >
            <div className="flex flex-col">
               <h2 className="text-4xl md:text-5xl font-extrabold text-purple-600 dark:text-purple-400 tracking-tight">
                  Your Reflections
               </h2>
               <div className="mt-1 flex flex-col">
                  <span className="block h-[2px] w-24 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"></span>
                  <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
                     Reflect on your thoughts and emotions 🌱
                  </p>
               </div>
            </div>
            <Button onClick={() => setShowForm(true)}>
               <Plus className="w-4 h-4 mr-1" /> Add Reflection
            </Button>
         </motion.div>

         {/* Filters */}
         <div className="flex flex-col md:flex-row gap-4 items-center">
            <Select
               value={filterEmotion || "all"}
               onValueChange={(val) =>
                  setFilterEmotion(val === "all" ? "" : val)
               }
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
               <Button
                  variant="outline"
                  onClick={() => {
                     setFilterEmotion("");
                     setFilterTag("");
                  }}
               >
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
                     defaultValues={{
                        title: editingReflection?.title || "",
                        content: editingReflection?.content || "",
                        emotion: allowedEmotions.includes(
                           editingReflection?.emotion as Emotion
                        )
                           ? (editingReflection?.emotion as Emotion)
                           : undefined,
                        tags: editingReflection?.tags?.join(",") || "",
                     }}
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
            <p className="text-center text-gray-500">Loading reflections...</p>
         ) : reflections.length === 0 ? (
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex flex-col items-center justify-center text-center py-12 text-gray-400 dark:text-gray-500 space-y-2"
            >
               <Clock className="w-10 h-10 animate-pulse text-purple-400" />
               <p className="text-lg font-medium">No reflections yet</p>
               <p className="text-sm">
                  Click &quot;Add Reflection&quot; to create your first one.
               </p>
            </motion.div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
               <AnimatePresence>
                  {reflections.map((r, i) => (
                     <motion.div
                        key={r._id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: i * 0.05 }}
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

         {/* Confirm Delete Dialog */}
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
