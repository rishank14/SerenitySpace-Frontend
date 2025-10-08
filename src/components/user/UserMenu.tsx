"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User as UserIcon, Key, Trash2 } from "lucide-react";
import UpdateProfileModal from "./UpdateProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";
import ConfirmDialog from "../ConfirmDialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import API from "@/lib/axios";
import { motion } from "framer-motion";
import { AxiosError } from "axios";

export default function UserMenu() {
   const { user, logout } = useAuth(); // removed refreshUser
   const [openUpdate, setOpenUpdate] = useState(false);
   const [openPassword, setOpenPassword] = useState(false);
   const [openDelete, setOpenDelete] = useState(false);
   const [openLogout, setOpenLogout] = useState(false);
   const router = useRouter();

   if (!user) return null;

   const handleLogout = async () => {
      try {
         await logout();
         router.push("/");
      } catch {
         toast.error("Logout failed");
      } finally {
         setOpenLogout(false);
      }
   };

   const handleDeleteAccount = async () => {
      try {
         await API.delete("/users/delete-account");
         toast.success("Account deleted successfully");
         await logout();
         router.push("/sign-in");
      } catch (err: unknown) {
         if (err instanceof AxiosError) {
            toast.error(
               err.response?.data?.message || "Failed to delete account"
            );
         } else if (err instanceof Error) {
            toast.error(err.message);
         } else {
            toast.error("Failed to delete account");
         }
      } finally {
         setOpenDelete(false);
      }
   };

   return (
      <>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <motion.button
                  whileHover={{ boxShadow: "0 0 12px #A78BFA" }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 dark:bg-purple-400 text-white transition-colors duration-300"
                  aria-label="User menu"
               >
                  <UserIcon size={20} />
               </motion.button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 p-2">
               <DropdownMenuItem
                  onClick={() => setOpenUpdate(true)}
                  className="flex items-center space-x-2"
               >
                  <UserIcon size={18} /> <span>Update Profile</span>
               </DropdownMenuItem>

               <DropdownMenuItem
                  onClick={() => setOpenPassword(true)}
                  className="flex items-center space-x-2"
               >
                  <Key size={18} /> <span>Change Password</span>
               </DropdownMenuItem>

               <DropdownMenuItem
                  onClick={() => setOpenDelete(true)}
                  className="flex items-center space-x-2 text-red-500"
               >
                  <Trash2 size={18} /> <span>Delete Account</span>
               </DropdownMenuItem>

               <DropdownMenuItem
                  onClick={() => setOpenLogout(true)}
                  className="flex items-center space-x-2 text-red-500"
               >
                  <LogOut size={18} /> <span>Logout</span>
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>

         {/* Modals */}
         {openUpdate && (
            <UpdateProfileModal open={openUpdate} setOpen={setOpenUpdate} />
         )}
         {openPassword && (
            <ChangePasswordModal
               open={openPassword}
               setOpen={setOpenPassword}
            />
         )}

         {/* Confirm dialogs */}
         {openDelete && (
            <ConfirmDialog
               open={openDelete}
               title="Delete Account"
               description="Are you sure you want to delete your account? This action cannot be undone."
               onConfirm={handleDeleteAccount}
               onCancel={() => setOpenDelete(false)}
            />
         )}

         {openLogout && (
            <ConfirmDialog
               open={openLogout}
               title="Logout"
               description="Are you sure you want to logout?"
               onConfirm={handleLogout}
               confirmText="Yes"
               onCancel={() => setOpenLogout(false)}
            />
         )}
      </>
   );
}
