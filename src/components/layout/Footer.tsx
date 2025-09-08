"use client";

import * as React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

export const Footer: React.FC = () => {
   return (
      <footer className="border-t border-border px-5 bg-muted/30">
         <div className="container py-12">
            <div className="flex flex-col md:flex-row justify-between gap-8">
               {/* Logo & About */}
               <div>
                  <div className="flex items-center space-x-2 mb-4">
                     <Image
                        src="/logo.png"
                        alt="SerenitySpace Logo"
                        width={32}
                        height={32}
                        className="h-8 w-8"
                     />
                     <span className="text-xl font-bold text-primary dark:text-purple-300">
                        SerenitySpace
                     </span>
                  </div>
                  <p className="text-muted-foreground max-w-md text-pretty">
                     Your safe space to vent, reflect, and grow. A calming
                     digital sanctuary for mental wellbeing.
                  </p>
               </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center">
               <p className="text-sm text-muted-foreground">
                  © 2025 SerenitySpace. All rights reserved.
               </p>
               <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                  <Badge variant="secondary" className="text-xs">
   <Users className="mr-1 h-3 w-3" />
   Built for calm minds
</Badge>
               </div>
            </div>
         </div>
      </footer>
   );
};
