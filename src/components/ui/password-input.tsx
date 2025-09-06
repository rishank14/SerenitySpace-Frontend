"use client";

import { useState, forwardRef } from "react";
import { Input } from "./input";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordInputProps
   extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
   ({ className, ...props }, ref) => {
      const [show, setShow] = useState(false);

      return (
         <div className="relative">
            <Input
               {...props}
               ref={ref}
               type={show ? "text" : "password"}
               className={cn("pr-10", className)}
            />
            <button
               type="button"
               onClick={() => setShow((prev) => !prev)}
               className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
               tabIndex={-1}
            >
               {show ? (
                  <EyeOff className="w-4 h-4 transition duration-200" />
               ) : (
                  <Eye className="w-4 h-4 transition duration-200" />
               )}
            </button>
         </div>
      );
   }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
