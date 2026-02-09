import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Analysis } from "../types/analysis.type";
import { AnalysisCard } from "./analysis-card";

type AnalysisCollectionProps = {
  analysis: Analysis[];
};

const ITEMS_PER_PAGE = 5;

export const AnalysisCollection = ({ analysis }: AnalysisCollectionProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const sortedAnalysis = [...analysis].sort((a, b) => {
    const dateA = a.finished_at ? new Date(a.finished_at) : new Date(a.created_at);
    const dateB = b.finished_at ? new Date(b.finished_at) : new Date(b.created_at);
    return dateB.getTime() - dateA.getTime();
  });

  const totalPages = Math.ceil(sortedAnalysis.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = sortedAnalysis.slice(startIndex, endIndex);

  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="flex flex-col gap-4">
      {currentItems.map((item: Analysis) => (
        <AnalysisCard key={item.id} analysis={item} />
      ))}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button onClick={goToPrevPage} disabled={currentPage === 1} variant="outline">
            Anterior
          </Button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <Button onClick={goToNextPage} disabled={currentPage === totalPages} variant="outline">
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
};
