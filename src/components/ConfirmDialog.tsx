"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface ConfirmDialogProps {
   open: boolean;
   title?: string;
   description?: string;
   onConfirm: () => void;
   onCancel: () => void;
   loading?: boolean;
   confirmText?: string;
   cancelText?: string;
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({
   open,
   title = "Are you sure?",
   description = "This action cannot be undone.",
   onConfirm,
   onCancel,
   loading = false,
   confirmText = "Delete",
   cancelText = "Cancel",
}) => {
   return (
      <Dialog
         open={open}
         onOpenChange={(val) => {
            if (!loading && !val) onCancel();
         }}
      >
         <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
               <DialogTitle>{title}</DialogTitle>
            </DialogHeader>

            <p className="mt-2 text-sm text-muted-foreground">{description}</p>

            <DialogFooter className="flex justify-end gap-2 pt-4">
               <Button variant="outline" onClick={onCancel} disabled={loading}>
                  {cancelText}
               </Button>
               <Button
                  variant="destructive"
                  onClick={onConfirm}
                  disabled={loading}
               >
                  {loading ? (
                     <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Processing...
                     </>
                  ) : (
                     confirmText
                  )}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

export default ConfirmDialog;
