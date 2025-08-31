"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import VaultCard, { Vault } from "@/components/vault/VaultCard";
import VaultForm from "@/components/vault/VaultForm";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Plus, Clock } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { formatDateTime } from "@/lib/formatDateTime";

export default function VaultPage() {
  const [upcoming, setUpcoming] = useState<Vault[]>([]);
  const [delivered, setDelivered] = useState<Vault[]>([]);
  const [highlighted, setHighlighted] = useState<string[]>([]); // track newly delivered
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingVault, setEditingVault] = useState<Vault | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedVaultId, setSelectedVaultId] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchVaults = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!token || !userId) throw new Error("User not authenticated");

      const [upcomingRes, deliveredRes] = await Promise.all([
        axios.get(`${baseUrl}/message-vault/upcoming/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${baseUrl}/message-vault/delivered/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setUpcoming(upcomingRes.data.message.messages || []);
      setDelivered(deliveredRes.data.message.messages || []);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to fetch vaults"
      );
    } finally {
      setLoading(false);
    }
  };

  // Socket.IO & real-time highlight
  useEffect(() => {
    const socket: Socket = io((baseUrl || "").replace("/api/v1", ""));
    const userId = localStorage.getItem("userId");
    if (userId) socket.emit("register", userId);

    socket.on("vaultDelivered", (vault: Vault) => {
      setUpcoming((prev) => prev.filter((v) => v._id !== vault._id));
      setDelivered((prev) => [vault, ...prev]);
      setHighlighted((prev) => [...prev, vault._id]);

      // Remove highlight after 3 seconds
      setTimeout(() => {
        setHighlighted((prev) => prev.filter((id) => id !== vault._id));
      }, 3000);

      toast.success(`Delivered: "${vault.message}"`, {
        description: `Delivered at ${formatDateTime(vault.deliverAt).replace(
          /am|pm/i,
          (m) => m.toUpperCase()
        )}`,
        duration: 6000,
      });
    });

    fetchVaults();

    return () => {
      socket.disconnect();
    };
  }, [baseUrl]);

  const confirmDelete = (id: string) => {
    setSelectedVaultId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedVaultId) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      await axios.delete(`${baseUrl}/message-vault/delete/${selectedVaultId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUpcoming((prev) => prev.filter((v) => v._id !== selectedVaultId));
      setDelivered((prev) => prev.filter((v) => v._id !== selectedVaultId));
      setHighlighted((prev) => prev.filter((id) => id !== selectedVaultId));

      toast.success("Vault deleted");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to delete vault"
      );
    } finally {
      setConfirmOpen(false);
      setSelectedVaultId(null);
    }
  };

  const handleEdit = (vault: Vault) => {
    setEditingVault(vault);
    setShowForm(true);
  };

  const handleFormSuccess = (newVault?: Vault) => {
    setShowForm(false);
    setEditingVault(null);
    if (!newVault) return;

    const now = new Date();
    const isDelivered = new Date(newVault.deliverAt) <= now;

    if (isDelivered) {
      setDelivered((prev) => [newVault, ...prev]);
      setUpcoming((prev) => prev.filter((v) => v._id !== newVault._id));

      // Highlight newly delivered
      setHighlighted((prev) => [...prev, newVault._id]);
      setTimeout(() => {
        setHighlighted((prev) => prev.filter((id) => id !== newVault._id));
      }, 3000);
    } else {
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Message Vault</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1" /> Add Vault
        </Button>
      </div>

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
                  ? { message: editingVault.message, deliverAt: editingVault.deliverAt }
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
                  onDelete={confirmDelete}
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
                  onDelete={confirmDelete}
                  highlight={highlighted.includes(v._id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
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
