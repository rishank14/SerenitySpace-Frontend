"use client";

import { useEffect, useState } from "react";
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
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  // Fetch vaults from backend
  const fetchVaults = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [upcomingRes, deliveredRes] = await Promise.all([
        API.get(`/message-vault/upcoming/${userId}`),
        API.get(`/message-vault/delivered/${userId}`)
      ]);
      setUpcoming(upcomingRes.data?.message?.messages || []);
      setDelivered(deliveredRes.data?.message?.messages || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to fetch vaults");
    } finally {
      setLoading(false);
    }
  };

  // Helper: move vaults to delivered with highlight + toast
  const deliverVaults = (vaults: Vault[]) => {
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
        description: `Delivered at ${formatDateTime(v.deliverAt).replace(/am|pm/i, (m) => m.toUpperCase())}`,
        duration: 6000,
      })
    );
  };

  // Socket + auto-delivery
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

    // Auto-check every minute for vaults that are due
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
  }, [baseUrl, userId]);

  // Delete handlers
  const confirmDelete = (id: string) => {
    setSelectedVaultId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedVaultId) return;
    try {
      await API.delete(`/message-vault/delete/${selectedVaultId}`);
      setUpcoming((prev) => prev.filter((v) => v._id !== selectedVaultId));
      setDelivered((prev) => prev.filter((v) => v._id !== selectedVaultId));
      setHighlighted((prev) => prev.filter((id) => id !== selectedVaultId));
      toast.success("Vault deleted");
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to delete vault");
    } finally {
      setConfirmOpen(false);
      setSelectedVaultId(null);
    }
  };

  // Edit vault
  const handleEdit = (vault: Vault) => {
    setEditingVault(vault);
    setShowForm(true);
  };

  // VaultForm success
  const handleFormSuccess = (newVault?: Vault) => {
    setShowForm(false);
    setEditingVault(null);
    if (!newVault) return;

    const now = new Date();
    const isDelivered = new Date(newVault.deliverAt) <= now;

    if (isDelivered) deliverVaults([newVault]);
    else {
      setUpcoming((prev) => {
        const exists = prev.find((v) => v._id === newVault._id);
        if (exists) return prev.map((v) => (v._id === newVault._id ? newVault : v));
        return [newVault, ...prev];
      });
      setDelivered((prev) => prev.filter((v) => v._id !== newVault._id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Message Vault</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1" /> Add Vault
        </Button>
      </div>

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
              defaultValues={editingVault ? {
                message: editingVault.message,
                deliverAt: editingVault.deliverAt
              } : undefined}
              onSuccess={handleFormSuccess}
              onCancel={() => { setShowForm(false); setEditingVault(null); }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upcoming Vaults */}
      <div>
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <Clock size={20} /> Upcoming Vaults
        </h2>
        {loading ? (
          <p>Loading vaults...</p>
        ) : upcoming.length === 0 ? (
          <p>No upcoming vault messages</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {upcoming.map((v) => (
                <VaultCard
                  key={v._id}
                  vault={v}
                  onEdit={handleEdit}
                  onDelete={() => confirmDelete(v._id)}
                  highlight={highlighted.includes(v._id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Delivered Vaults */}
      <div>
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <Clock size={20} /> Delivered Vaults
        </h2>
        {loading ? (
          <p>Loading vaults...</p>
        ) : delivered.length === 0 ? (
          <p>No delivered vault messages</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {delivered.map((v) => (
                <VaultCard
                  key={v._id}
                  vault={v}
                  onDelete={() => confirmDelete(v._id)}
                  highlight={highlighted.includes(v._id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

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
