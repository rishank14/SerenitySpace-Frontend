"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Plus, Clock } from "lucide-react";

import VaultCard, { Vault } from "@/components/vault/VaultCard";
import VaultForm from "@/components/vault/VaultForm";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { io, Socket } from "socket.io-client";
import { formatDateTime } from "@/lib/formatDateTime";
import API from "@/lib/axios";

export default function VaultPage() {
   const [upcoming, setUpcoming] = useState<Vault[]>([]);
   const [delivered, setDelivered] = useState<Vault[]>([]);
   const [highlighted, setHighlighted] = useState<string[]>([]);
   const [loading, setLoading] = useState(false);
   const [showForm, setShowForm] = useState(false);
   const [editingVault, setEditingVault] = useState<Vault | null>(null);
   const [confirmOpen, setConfirmOpen] = useState(false);
   const [selectedVaultId, setSelectedVaultId] = useState<string | null>(null);

   const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
   const userId =
      typeof window !== "undefined" ? localStorage.getItem("userId") : null;

   const fetchVaults = useCallback(async () => {
      if (!userId) return;
      setLoading(true);
      try {
         const [upcomingRes, deliveredRes] = await Promise.all([
            API.get(`/message-vault/upcoming/${userId}`),
            API.get(`/message-vault/delivered/${userId}`),
         ]);
         setUpcoming(upcomingRes.data?.message?.messages || []);
         setDelivered(deliveredRes.data?.message?.messages || []);
      } catch (err: any) {
         toast.error(
            err.response?.data?.message ||
               err.message ||
               "Failed to fetch vaults"
         );
      } finally {
         setLoading(false);
      }
   }, [userId]);

   const deliverVaults = useCallback((vaults: Vault[]) => {
      if (!vaults.length) return;

      setDelivered((prev) => [...vaults, ...prev]);
      setHighlighted((prev) => [...prev, ...vaults.map((v) => v._id)]);

      setTimeout(() => {
         setHighlighted((prev) =>
            prev.filter((id) => !vaults.map((v) => v._id).includes(id))
         );
      }, 3000);

      vaults.forEach((v) =>
         toast.success(`Delivered: "${v.message}"`, {
            description: `Delivered at ${formatDateTime(v.deliverAt).replace(
               /am|pm/i,
               (m) => m.toUpperCase()
            )}`,
            duration: 6000,
         })
      );
   }, []);

   useEffect(() => {
      if (!userId) return;

      const socket: Socket = io((baseUrl || "").replace("/api/v1", ""));
      socket.emit("register", userId);

      const onVaultDelivered = (vault: Vault) => {
         setUpcoming((prev) => prev.filter((v) => v._id !== vault._id));
         deliverVaults([vault]);
      };

      socket.on("vaultDelivered", onVaultDelivered);
      void fetchVaults();

      const interval = setInterval(() => {
         setUpcoming((prev) => {
            const now = new Date();
            now.setSeconds(0, 0);

            const readyToDeliver: Vault[] = [];
            const stillUpcoming: Vault[] = [];

            prev.forEach((v) => {
               if (new Date(v.deliverAt) <= now) readyToDeliver.push(v);
               else stillUpcoming.push(v);
            });

            deliverVaults(readyToDeliver);
            return stillUpcoming;
         });
      }, 60000);

      return () => {
         socket.off("vaultDelivered", onVaultDelivered);
         socket.disconnect();
         clearInterval(interval);
      };
   }, [baseUrl, userId, deliverVaults, fetchVaults]);

   const confirmDelete = useCallback((id: string) => {
      setSelectedVaultId(id);
      setConfirmOpen(true);
   }, []);

   const handleDelete = useCallback(async () => {
      if (!selectedVaultId) return;
      try {
         await API.delete(`/message-vault/delete/${selectedVaultId}`);
         setUpcoming((prev) => prev.filter((v) => v._id !== selectedVaultId));
         setDelivered((prev) => prev.filter((v) => v._id !== selectedVaultId));
         setHighlighted((prev) => prev.filter((id) => id !== selectedVaultId));
         toast.success("Vault deleted");
      } catch (err: any) {
         toast.error(
            err.response?.data?.message ||
               err.message ||
               "Failed to delete vault"
         );
      } finally {
         setConfirmOpen(false);
         setSelectedVaultId(null);
      }
   }, [selectedVaultId]);

   const handleEdit = useCallback((vault: Vault) => {
      setEditingVault(vault);
      setShowForm(true);
   }, []);

   const handleFormSuccess = useCallback(
      (newVault?: Vault) => {
         setShowForm(false);
         setEditingVault(null);
         if (!newVault) return;

         const now = new Date();
         const deliverAt = new Date(newVault.deliverAt);

         // Always add/update in upcoming
         setUpcoming((prev) => {
            const exists = prev.find((v) => v._id === newVault._id);
            if (exists)
               return prev.map((v) => (v._id === newVault._id ? newVault : v));
            return [newVault, ...prev];
         });

         // Remove from delivered just in case
         setDelivered((prev) => prev.filter((v) => v._id !== newVault._id));

         // If it's already due, deliver
         if (deliverAt <= now) {
            deliverVaults([newVault]);
            setUpcoming((prev) => prev.filter((v) => v._id !== newVault._id));
         }
      },
      [deliverVaults]
   );

   return (
      <div className="max-w-6xl mx-auto py-8 space-y-6 px-4">
         {/* Header */}
         <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
         >
            <div className="flex flex-col">
               <h2 className="text-4xl md:text-5xl font-extrabold text-purple-600 dark:text-purple-400 tracking-tight">
                  Message Vault
               </h2>
               <div className="mt-1 flex flex-col">
                  <span className="block h-[2px] w-24 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"></span>
                  <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
                     A little message to your future self 🌱
                  </p>
               </div>
            </div>
            <Button onClick={() => setShowForm(true)}>
               <Plus className="w-4 h-4 mr-1" /> Add Vault
            </Button>
         </motion.div>

         {/* Vault Form */}
         <AnimatePresence>
            {showForm && (
               <motion.div
                  key="vault-form"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
               >
                  <VaultForm
                     vaultId={editingVault?._id}
                     defaultValues={
                        editingVault
                           ? {
                                message: editingVault.message,
                                deliverAt: editingVault.deliverAt,
                             }
                           : undefined
                     }
                     onSuccess={handleFormSuccess}
                     onCancel={() => {
                        setShowForm(false);
                        setEditingVault(null);
                     }}
                  />
               </motion.div>
            )}
         </AnimatePresence>

         {/* Upcoming Vaults */}
         <VaultSection
            title="Upcoming Vaults"
            color="purple"
            vaults={upcoming}
            loading={loading}
            highlighted={highlighted}
            onEdit={handleEdit}
            onDelete={confirmDelete}
            emptyText="No upcoming vaults"
            emptySubText="Add a new vault message using the button above."
         />

         {/* Delivered Vaults */}
         <VaultSection
            title="Delivered Vaults"
            color="green"
            vaults={delivered}
            loading={loading}
            highlighted={highlighted}
            onDelete={confirmDelete}
            emptyText="No delivered vaults yet"
            emptySubText="Delivered vault messages will appear here."
         />

         {/* Confirm Delete */}
         <ConfirmDialog
            open={confirmOpen}
            onCancel={() => setConfirmOpen(false)}
            onConfirm={handleDelete}
            title="Delete Vault?"
            description="Are you sure you want to delete this vault message? This action cannot be undone."
         />
      </div>
   );
}

interface VaultSectionProps {
   title: string;
   color: "purple" | "green";
   vaults: Vault[];
   loading: boolean;
   highlighted: string[];
   onEdit?: (vault: Vault) => void;
   onDelete: (id: string) => void;
   emptyText: string;
   emptySubText: string;
}

const VaultSection = ({
   title,
   color,
   vaults,
   loading,
   highlighted,
   onEdit,
   onDelete,
   emptyText,
   emptySubText,
}: VaultSectionProps) => {
   const iconColor = color === "purple" ? "text-purple-500" : "text-green-500";
   const pulseColor = color === "purple" ? "text-purple-400" : "text-green-400";

   return (
      <div>
         <h2
            className={`text-2xl font-semibold mb-3 flex items-center gap-2 text-gray-700 dark:text-gray-300`}
         >
            <Clock className={`w-5 h-5 ${iconColor}`} /> {title}
         </h2>

         {loading ? (
            <p className="text-center text-gray-500">Loading vaults...</p>
         ) : vaults.length === 0 ? (
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex flex-col items-center justify-center text-center py-8 text-gray-400 dark:text-gray-500 space-y-2"
            >
               <Clock className={`w-10 h-10 animate-pulse ${pulseColor}`} />
               <p className="text-lg font-medium">{emptyText}</p>
               <p className="text-sm">{emptySubText}</p>
            </motion.div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <AnimatePresence>
                  {vaults.map((v) => (
                     <VaultCard
                        key={v._id}
                        vault={v}
                        onEdit={onEdit}
                        onDelete={() => onDelete(v._id)}
                        highlight={highlighted.includes(v._id)}
                     />
                  ))}
               </AnimatePresence>
            </div>
         )}
      </div>
   );
};
