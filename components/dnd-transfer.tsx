"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  type DropAnimation,
  defaultDropAnimationSideEffects,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface TransferItem {
  id: string;
  label: string;
  disabled?: boolean;
}

interface DndTransferProps {
  availableItems: TransferItem[];
  selectedItems: TransferItem[];
  onTransfer: (available: TransferItem[], selected: TransferItem[]) => void;
  availableTitle?: string;
  selectedTitle?: string;
  className?: string;
}

interface SortableItemProps {
  item: TransferItem;
  onRemove?: (id: string) => void;
  isDragging?: boolean;
}

function SortableItem({ item, onRemove, isDragging }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSorting,
  } = useSortable({
    id: item.id,
    disabled: item.disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSorting ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 rounded-md border bg-background p-3 transition-colors hover:bg-accent",
        item.disabled && "cursor-not-allowed opacity-50",
        isDragging && "opacity-0",
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className={cn("cursor-grab active:cursor-grabbing", item.disabled && "cursor-not-allowed")}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <span className="flex-1 text-sm">{item.label}</span>
      {onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => onRemove(item.id)}
          disabled={item.disabled}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}

function EmptyDropZone({ id }: { id: string }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex h-32 items-center justify-center rounded-md border-2 border-dashed text-sm text-muted-foreground transition-colors",
        isOver && "border-primary bg-accent",
      )}
    >
      Arrastra elementos aquí
    </div>
  );
}

function DroppableList({
  items,
  title,
  onRemove,
  activeId,
  droppableId,
}: {
  items: TransferItem[];
  title: string;
  onRemove?: (id: string) => void;
  activeId: string | null;
  droppableId: string;
}) {
  return (
    <Card className="flex flex-1 flex-col p-4">
      <h3 className="mb-4 font-semibold">{title}</h3>
      <div className="flex-1 space-y-2 overflow-auto">
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.length === 0 ? (
            <EmptyDropZone id={droppableId} />
          ) : (
            items.map((item) => (
              <SortableItem key={item.id} item={item} onRemove={onRemove} isDragging={activeId === item.id} />
            ))
          )}
        </SortableContext>
      </div>
    </Card>
  );
}

export function DndTransfer({
  availableItems,
  selectedItems,
  onTransfer,
  availableTitle = "Disponibles",
  selectedTitle = "Seleccionados",
  className,
}: DndTransferProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [available, setAvailable] = useState(availableItems);
  const [selected, setSelected] = useState(selectedItems);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 6,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if item is in available list
    const isInAvailable = available.some((item) => item.id === activeId);
    const isOverInSelected = selected.some((item) => item.id === overId);

    // Handle drop on empty selected zone
    if (isInAvailable && overId === "selected-empty") {
      const item = available.find((item) => item.id === activeId);
      if (item && !item.disabled) {
        const newAvailable = available.filter((item) => item.id !== activeId);
        const newSelected = [...selected, item];

        setAvailable(newAvailable);
        setSelected(newSelected);
        onTransfer(newAvailable, newSelected);
      }
    }
    // Handle drop on empty available zone
    else if (!isInAvailable && overId === "available-empty") {
      const item = selected.find((item) => item.id === activeId);
      if (item && !item.disabled) {
        const newSelected = selected.filter((item) => item.id !== activeId);
        const newAvailable = [...available, item];

        setAvailable(newAvailable);
        setSelected(newSelected);
        onTransfer(newAvailable, newSelected);
      }
    }
    // Transfer from available to selected
    else if (isInAvailable && isOverInSelected) {
      const item = available.find((item) => item.id === activeId);
      if (item && !item.disabled) {
        const newAvailable = available.filter((item) => item.id !== activeId);
        const newSelected = [...selected];
        const overIndex = selected.findIndex((item) => item.id === overId);
        newSelected.splice(overIndex, 0, item);

        setAvailable(newAvailable);
        setSelected(newSelected);
        onTransfer(newAvailable, newSelected);
      }
    }
    // Transfer from selected to available
    else if (!isInAvailable && !isOverInSelected) {
      const item = selected.find((item) => item.id === activeId);
      if (item && !item.disabled) {
        const newSelected = selected.filter((item) => item.id !== activeId);
        const newAvailable = [...available];
        const overIndex = available.findIndex((item) => item.id === overId);
        newAvailable.splice(overIndex, 0, item);

        setAvailable(newAvailable);
        setSelected(newSelected);
        onTransfer(newAvailable, newSelected);
      }
    }
    // Reorder within selected list
    else if (!isInAvailable && isOverInSelected && activeId !== overId) {
      const oldIndex = selected.findIndex((item) => item.id === activeId);
      const newIndex = selected.findIndex((item) => item.id === overId);
      const newSelected = arrayMove(selected, oldIndex, newIndex);

      setSelected(newSelected);
      onTransfer(available, newSelected);
    }
    // Reorder within available list
    else if (isInAvailable && !isOverInSelected && activeId !== overId) {
      const oldIndex = available.findIndex((item) => item.id === activeId);
      const newIndex = available.findIndex((item) => item.id === overId);
      const newAvailable = arrayMove(available, oldIndex, newIndex);

      setAvailable(newAvailable);
      onTransfer(newAvailable, selected);
    }

    setActiveId(null);
  };

  const handleRemove = (id: string) => {
    const item = selected.find((item) => item.id === id);
    if (item) {
      const newSelected = selected.filter((item) => item.id !== id);
      const newAvailable = [...available, item];
      setSelected(newSelected);
      setAvailable(newAvailable);
      onTransfer(newAvailable, newSelected);
    }
  };

  const activeItem = [...available, ...selected].find((item) => item.id === activeId);

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={cn("flex gap-4", className)}>
        <DroppableList items={available} title={availableTitle} activeId={activeId} droppableId="available-empty" />
        <DroppableList
          items={selected}
          title={selectedTitle}
          onRemove={handleRemove}
          activeId={activeId}
          droppableId="selected-empty"
        />
      </div>
      {typeof document !== "undefined" &&
        createPortal(
          <DragOverlay dropAnimation={dropAnimation}>
            {activeItem ? (
              <div className="flex items-center gap-2 rounded-md border bg-background p-3 shadow-lg cursor-grabbing">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{activeItem.label}</span>
              </div>
            ) : null}
          </DragOverlay>,
          document.body,
        )}
    </DndContext>
  );
}
