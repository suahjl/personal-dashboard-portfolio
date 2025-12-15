import Link from 'next/link';
import { Paper } from '@/lib/types';

interface PaperCardProps {
  paper: Paper;
}

export default function PaperCard({ paper }: PaperCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors p-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {paper.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {paper.authors.join(', ')}
            {paper.year && ` (${paper.year})`}
          </p>
          {paper.publication && (
            <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-1">{paper.publication}</p>
          )}
        </div>
        {paper.link && (
          <div className="flex-shrink-0">
            <a
              href={paper.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium whitespace-nowrap"
            >
              View Paper
              <svg
                className="ml-1 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

