"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import VentCard, { Vent, Mood } from "@/components/vent/VentCard";
import VentForm from "@/components/vent/VentForm";
import ConfirmDialog from "@/components/ConfirmDialog";
import {
   Select,
   SelectTrigger,
   SelectContent,
   SelectItem,
   SelectValue,
} from "@/components/ui/select";
import API from "@/lib/axios";
import { AxiosError } from "axios";

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

   const formRef = useRef<HTMLDivElement>(null);

   const currentUserId =
      typeof window !== "undefined"
         ? localStorage.getItem("userId") ?? undefined
         : undefined;

   // Helper: Axios error handling
   const handleApiError = (err: unknown, fallbackMessage: string) => {
      if (err instanceof AxiosError) {
         toast.error(err.response?.data?.message || err.message);
      } else if (err instanceof Error) {
         toast.error(err.message);
      } else {
         toast.error(fallbackMessage);
      }
   };

   // Fetch vents
   useEffect(() => {
      const fetchVents = async () => {
         setLoading(true);
         try {
            const url =
               showMyVents && currentUserId
                  ? `/vents/user/${currentUserId}`
                  : "/vents";

            const params: Record<string, string> = {};
            if (filterMood) params.mood = filterMood;

            const res = await API.get<{ message: { vents: Vent[] } }>(url, {
               params,
            });

            setVents(res.data?.message?.vents || []);
         } catch (err: unknown) {
            handleApiError(err, "Failed to fetch vents");
         } finally {
            setLoading(false);
         }
      };

      fetchVents();
   }, [filterMood, showMyVents, currentUserId]);

   const handleEdit = (vent: Vent) => {
      setEditingVent(vent);
      setShowForm(true);
      setTimeout(() => {
         formRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
         });
      }, 400);
   };

   const handleFormSuccess = (newVent?: Vent) => {
      setShowForm(false);
      setEditingVent(null);
      if (newVent) {
         setVents((prev) => {
            const exists = prev.find((v) => v._id === newVent._id);
            if (exists)
               return prev.map((v) => (v._id === newVent._id ? newVent : v));
            return [newVent, ...prev];
         });
      } else {
         // refetch if no vent provided
         const fetchVents = async () => {
            setLoading(true);
            try {
               const url =
                  showMyVents && currentUserId
                     ? `/vents/user/${currentUserId}`
                     : "/vents";

               const params: Record<string, string> = {};
               if (filterMood) params.mood = filterMood;

               const res = await API.get<{ message: { vents: Vent[] } }>(url, {
                  params,
               });

               setVents(res.data?.message?.vents || []);
            } catch (err: unknown) {
               handleApiError(err, "Failed to fetch vents");
            } finally {
               setLoading(false);
            }
         };
         fetchVents();
      }
   };

   const confirmDelete = (id: string) => {
      setSelectedVentId(id);
      setConfirmOpen(true);
   };

   const handleDelete = async () => {
      if (!selectedVentId) return;
      try {
         await API.delete(`/vents/delete/${selectedVentId}`);
         toast.success("Vent deleted");
         setVents((prev) => prev.filter((v) => v._id !== selectedVentId));
      } catch (err: unknown) {
         handleApiError(err, "Failed to delete vent");
      } finally {
         setConfirmOpen(false);
         setSelectedVentId(null);
      }
   };

   return (
      <div className="max-w-6xl mx-auto py-8 space-y-6 px-4">
         {/* Heading */}
         <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col"
         >
            <h2 className="text-4xl md:text-5xl font-extrabold text-purple-600 dark:text-purple-400 tracking-tight">
               Vent Room
            </h2>
            <span className="block mt-1 h-[2px] w-20 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"></span>
            <p className="text-muted-foreground text-sm mt-2">
               Let it out. No filters. No judgment.
            </p>
         </motion.div>

         {/* Buttons */}
         <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
               <Button
                  variant={!showMyVents ? "default" : "outline"}
                  onClick={() => setShowMyVents(false)}
               >
                  All Vents
               </Button>
               <Button
                  variant={showMyVents ? "default" : "outline"}
                  onClick={() => setShowMyVents(true)}
               >
                  My Vents
               </Button>
            </div>
            <Button onClick={() => setShowForm(true)}>
               <Plus className="w-4 h-4 mr-1" /> Add Vent
            </Button>
         </div>

         {/* Filter */}
         <div className="flex flex-col md:flex-row gap-4 items-center">
            <Select
               value={filterMood || "all"}
               onValueChange={(val) => setFilterMood(val === "all" ? "" : val)}
            >
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
            {filterMood && (
               <Button
                  variant="outline"
                  onClick={() => setFilterMood("")}
                  aria-label="Clear mood filter"
               >
                  Clear Mood
               </Button>
            )}
         </div>

         {/* Form */}
         <div ref={formRef} className="scroll-mt-24">
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
                        defaultValues={
                           editingVent
                              ? {
                                   message: editingVent.message,
                                   mood: editingVent.mood as Mood,
                                   visibility: editingVent.visibility,
                                }
                              : undefined
                        }
                        onSuccess={handleFormSuccess}
                        onCancel={() => {
                           setShowForm(false);
                           setEditingVent(null);
                        }}
                     />
                  </motion.div>
               )}
            </AnimatePresence>
         </div>

         {/* Vents */}
         {loading ? (
            <p className="text-center text-gray-500">Loading vents...</p>
         ) : vents.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12 text-gray-400 dark:text-gray-500 space-y-2">
               <p className="text-lg font-medium">No vents found</p>
               <p className="text-sm">
                  Start by adding a vent message using the button above.
               </p>
            </div>
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
                           currentUserId={currentUserId}
                           onEdit={handleEdit}
                           onDelete={() => confirmDelete(v._id)}
                        />
                     </motion.div>
                  ))}
               </AnimatePresence>
            </div>
         )}

         {/* Confirm delete */}
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
