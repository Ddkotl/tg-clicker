"use client";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { useTranslation } from "@/features/translations/use_translation";
import { Skeleton } from "../ui/skeleton";

export function PaginationControl({
  basePath,
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  className,
  isFetching,
}: {
  basePath: string;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  className?: string;
  isFetching?: boolean;
}) {
  const { t } = useTranslation();
  const router = useRouter();

  // Функция для перехода на другую страницу
  const handlePageChange = (page: number) => {
    router.push(`${basePath}?page=${page}`);
  };

  // Функция для генерации диапазона страниц
  const generatePageRange = () => {
    const range: (number | "...")[] = [];
    const maxVisiblePages = 1; // Сколько страниц отображать по бокам от текущей

    if (currentPage > 2) range.push(1);
    if (currentPage > 3) range.push("...");

    for (
      let i = Math.max(1, currentPage - maxVisiblePages);
      i <= Math.min(totalPages, currentPage + maxVisiblePages);
      i++
    ) {
      range.push(i);
    }

    if (currentPage < totalPages - 2) range.push("...");
    if (currentPage < totalPages - 1) range.push(totalPages);

    return range;
  };

  if (totalPages <= 1) return null; // Не отображаем пагинацию, если всего одна страница

  // Вычисляем диапазон отображаемых элементов
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(startItem + pageSize - 1, totalItems);

  return (
    <div
      className={`flex flex-col md:flex-row justify-center items-center gap-4 ${className} ${isFetching ? "opacity-70 pointer-events-none" : ""}`}
    >
      <div className="text-xs text-muted-foreground w-full text-center md:text-start">
        {t("pagination.shows")} {startItem}–{endItem} {t("pagination.of")} {totalItems}
      </div>

      {/* Пагинация */}
      <Pagination className="md:justify-end">
        <PaginationContent className="flex flex-wrap justify-center ">
          {/* Кнопка "Предыдущая" */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) handlePageChange(currentPage - 1);
              }}
              aria-disabled={currentPage === 1}
            />
          </PaginationItem>

          {/* Страницы */}
          {generatePageRange().map((page, index) => (
            <PaginationItem key={index}>
              {page === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page as number);
                  }}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* Кнопка "Следующая" */}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) handlePageChange(currentPage + 1);
              }}
              aria-disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export function PaginationControlSkeleton({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col md:flex-row justify-center items-center gap-4 ${className}`}>
      {/* Текст вида "Показано X–Y из Z" */}
      <div className="w-full md:w-48">
        <Skeleton className="h-4 w-32 bg-white/10 rounded-md mx-auto md:mx-0" />
      </div>

      {/* Пагинация */}
      <div className="flex flex-wrap justify-center gap-2">
        {/* Prev */}
        <Skeleton className="h-8 w-20 rounded-md bg-white/10" />

        {/* Страницы (5 placeholders) */}
        <Skeleton className="h-8 w-8 rounded-md bg-white/10" />
        <Skeleton className="h-8 w-8 rounded-md bg-white/10" />
        <Skeleton className="h-8 w-8 rounded-md bg-white/10" />
        <Skeleton className="h-8 w-8 rounded-md bg-white/10" />
        <Skeleton className="h-8 w-8 rounded-md bg-white/10" />

        {/* Next */}
        <Skeleton className="h-8 w-20 rounded-md bg-white/10" />
      </div>
    </div>
  );
}
