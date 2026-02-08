"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Wizard } from "./wizard/Wizard";
import { useWizardStore } from "./wizard/wizard-store";

export const CreateAnalysis = () => {
  const { resetAll } = useWizardStore();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-5 ">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold">Crear análisis</h1>
          <p className="text-muted-foreground">
            Por favor, complete el formulario a continuación para crear un nuevo análisis.
          </p>
        </div>
        <Button variant="destructive" size="icon" onClick={() => setIsModalOpen(true)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <Wizard />
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogDescription>
              Esta acción reseteará todo el progreso del análisis y te llevará de vuelta a la lista de análisis.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                resetAll();
                router.push("/dashboard/marketing-mix-modeling");
              }}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
